'use strict'
const { Sale, SalesDetail, sequelize } = require('../models')
const { Sequelize, Op } = require('sequelize');
const ResMsg = require('../lib/resMsg')
const midtransClient = require('midtrans-client')
const { nanoid } = require('nanoid')
const axios = require('axios')

class PosController {

    static async read(req, res, next) {
        try {
            const { id } = req.params

            const queryOptions = {
                attributes: {
                    include: [
                        [sequelize.fn('to_char', sequelize.col('createdAt'), 'YYYY-MM-dd'), 'createdAt'],
                        [sequelize.fn('to_char', sequelize.col('updatedAt'), 'YYYY-MM-dd'), 'updatedAt'],
                    ],
                    exclude: [
                        'createdAt',
                        'updatedAt'
                    ]
                },
                order: [
                    ['createdAt', 'DESC']
                ]
            }

            let data = {}
            if (!id) {
                data = await Sale.findAll(queryOptions)

            } else {
                queryOptions.include = [
                    {
                        model: SalesDetail,
                        attributes: {
                            include: [
                                [Sequelize.literal(`false`), 'toDelete']
                            ]
                        }
                    }
                ]

                data = await Sale.findByPk(id, queryOptions)
            }

            if (!data) throw { name: 'NotFound', id }

            res.status(200).json({
                message: ResMsg.readAll('Sales'),
                data
            })

        } catch (err) {
            next(err)
        }
    }

    static async create(req, res, next) {
        try {
            const { table, amount, orders } = req.body
            // orders: ARR[] of Obj {}
            // from body: { menuName: STR, price: INT, quantity: INT }

            if (orders.length === 0) throw { name: 'EmptyArr', msg: 'Please input minimum 1 order' }

            await sequelize.transaction(async (t) => {

                const trx = await Sale.create({
                    table,
                    amount,
                    cashier: req.loginInfo.employeeName
                }, { transaction: t })

                orders.map((detail) => {
                    detail.SalesId = trx.id
                    return detail
                })

                await SalesDetail.bulkCreate(orders, { transaction: t })
            })

            res.status(201).json({
                message: ResMsg.create(`TABLE ORDER: ${table}`)
            })

        } catch (err) {
            next(err)
        }
    }

    static async edit(req, res, next) {
        try {
            const { id } = req.params
            const { table, amount, orders } = req.body
            // orders: ARR[] of Obj {}
            // from body: { id: INT, menuName: STR, price: INT, quantity: INT, SalesId: FK }

            const data = await Sale.findByPk(id)
            if (!data) throw { name: 'NotFound', id }
            if (data.docStatus === 'Posted') throw { name: 'PostedDocument' }

            await sequelize.transaction(async (t) => {

                if (orders.length === 0) throw { name: 'EmptyArr', msg: 'Please input minimum 1 order' }

                //manual validation for DETAILS
                const detailsToEdit = orders.filter(det => !det.toDelete)
                detailsToEdit.forEach(det => {
                    if (!det.quantity) throw { name: 'ManualValidationError', val: 'Quantity' }
                });

                //DELETE details marked toDelete
                const toDelete = orders.filter(det => det.toDelete)
                const detailsToDelete = toDelete.map((det) => det.id)

                await SalesDetail.destroy({
                    where: {
                        id: {
                            [Op.in]: detailsToDelete
                        }
                    },

                }, { transaction: t })

                await Sale.update({
                    table,
                    amount,
                }, {
                    where: {
                        id
                    },
                    transaction: t
                })

                await SalesDetail.bulkCreate(detailsToEdit, {
                    updateOnDuplicate: ['menuName', 'price', 'quantity', 'SalesId'],
                    transaction: t
                })

            })

            res.status(200).json({
                message: ResMsg.edit()
            })

        } catch (err) {
            next(err)
        }
    }

    static async delete(req, res, next) {
        try {
            const { id } = req.params

            const data = await Sale.findByPk(id)
            if (!data) throw { name: 'NotFound', id }
            if (data.docStatus === 'Posted') throw { name: 'PostedDocument' }

            await sequelize.transaction(async (t) => {

                await SalesDetail.destroy({
                    where: {
                        SalesId: id
                    }
                }, { transaction: t })

                await Sale.destroy({
                    where: {
                        id
                    }
                }, { transaction: t })
            })

            res.status(200).json({
                message: ResMsg.delete('DRAFT TRANSACTION')
            })

        } catch (err) {
            next(err)
        }
    }

    static async updateStatus(req, res, next) {
        try {
            const { id } = req.params
            const { updateTo } = req.body

            const data = await Sale.findByPk(id)
            if (!data) throw { name: 'NotFound', id }
            if (data.docStatus === 'Posted') throw { name: 'PostedDocument' }

            const queryOptions = {
                docStatus: updateTo
            }

            let actionMsg = ''
            switch (updateTo) {
                case 'Draft': {
                    actionMsg = 'ABORTED'
                    break;
                }

                case 'On Process': {
                    actionMsg = 'PROCESSED'
                    break;
                }

                case 'Posted': {
                    queryOptions.postedBy = req.loginInfo.employeeName
                    actionMsg = 'POSTED'
                    break;
                }
            }

            await Sale.update(queryOptions, {
                where: {
                    id
                }
            })

            res.status(200).json({
                message: ResMsg.patch(actionMsg)
            })

        } catch (err) {
            next(err)
        }
    }

    static async getToken(req, res, next) {
        try {
            const { amount, SalesId } = req.query
            // const amount = 12000000
            // const SalesId = 1

            const document = await Sale.findByPk(SalesId)
            if (!document) throw { name: 'NotFound' }
            const docNumber = document.table + document.id

            let snap = new midtransClient.Snap({
                isProduction: false,
                serverKey: process.env.MIDTRANS_SERVER_KEY
            });

            const TrxId = `trx-sales-${nanoid()}`

            await Sale.update({
                TrxId
            }, {
                where: {
                    id: SalesId
                }
            })

            let parameter = {
                "transaction_details": {
                    "order_id": TrxId,
                    "gross_amount": amount
                },
                "credit_card": {
                    "secure": true
                },
                "customer_details": {
                    "username": docNumber,
                }
            };

            const { token } = await snap.createTransaction(parameter)
            res.status(200).json({
                transaction_token: token,
                orderId: TrxId
            })

        } catch (err) {
            next(err)
        }
    }

    static async updatePaymentStatus(req, res, next) {
        try {
            const TrxId = req.body.orderId

            const document = await Sale.findOne({
                where: {
                    TrxId
                }
            })

            if (!document) throw { name: "NotFound" }

            const base64Key = Buffer.from(process.env.MIDTRANS_SERVER_KEY).toString('base64')
            const { data } = await axios.get(`https://api.sandbox.midtrans.com/v2/${TrxId}/status`, {
                headers: {
                    Authorization: `Basic ${base64Key}`
                }
            })

            console.log(data);

            if (+data.status_code !== 200) {
                throw { name: "MidTrans" }
            }

            if (data.transaction_status !== 'settlement') {
                throw { name: "MidTrans" }
            }

            await document.update({
                docStatus: 'Posted'
            })

            res.status(200).json({
                message: 'Payment Complete!'
            })

        } catch (err) {
            next(err)
        }
    }

    static async midtransNotification(req, res, next) {
        try {
            const notification = req.body

            const coreApi = new midtransClient.CoreApi({
                isProduction: false,
                serverKey: process.env.MIDTRANS_SERVER_KEY,
                clientKey: process.env.MIDTRANS_CLIENT_KEY
            });

            const statusResponse = await coreApi.transaction.notification(notification);

            const transactionStatus = statusResponse.transaction_status;
            const orderId = statusResponse.order_id;

            if (transactionStatus === 'settlement' || transactionStatus === 'pending') {
                await Sale.update({
                    docStatus : 'Posted'
                }, {
                    where: {
                        TrxId : orderId
                    }
                })
            }

            res.status(200).json({
                message: `Current Status: ${transactionStatus}`
            })

            } catch (err) {
            next(err)
        }
    }
}
module.exports = PosController