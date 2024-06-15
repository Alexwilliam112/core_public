'use strict'
const { BuyingDetail, Buying, sequelize } = require('../models')
const { Sequelize, Op } = require('sequelize');
const ResMsg = require('../lib/resMsg')

class BuyingController {

    static async read(req, res, next) {
        try {
            const { id } = req.params
            let data = {}

            const queryOptions = {
                attributes: {
                    include: [
                        [sequelize.fn('to_char', sequelize.col('date'), 'YYYY-MM-dd'), 'date'],
                        [sequelize.fn('to_char', sequelize.col('createdAt'), 'YYYY-MM-dd'), 'createdAt'],
                        [sequelize.fn('to_char', sequelize.col('updatedAt'), 'YYYY-MM-dd'), 'updatedAt'],
                    ],
                    exclude: [
                        'date',
                        'updatedAt',
                        'createdAt'
                    ]
                },
                include: [
                    {
                        model: BuyingDetail,
                        attributes: {
                            include: []
                        }
                    }
                ]
            }

            if (!id) {
                data = await Buying.findAll(queryOptions)
            } else {
                queryOptions.include[0].attributes.include.push([Sequelize.literal(`false`), 'toDelete'])
                data = await Buying.findByPk(id, queryOptions)
            }

            if (!data) throw { name: 'NotFound', id }

            res.status(200).json({
                message: ResMsg.readAll('Buying Expenses'),
                data
            })

        } catch (err) {
            next(err)
        }
    }

    static async create(req, res, next) {
        try {
            const { date, amount, description, details } = req.body
            // details: ARR[] of Obj {}
            // from body: { quantity: INT, price: INT, ingredientName: STR, unit: STR }

            let docId = 0

            if (details.length > 0) {
                await sequelize.transaction(async (t) => {

                    let adjustedAmt = 0
                    details.forEach(det => {
                        adjustedAmt += Number(det.price)
                    });

                    const buyingDoc = await Buying.create({
                        date,
                        amount: adjustedAmt,
                        description,
                        createdBy: req.loginInfo.employeeName
                    }, { transaction: t })

                    details.map((det) => {
                        det.ExpenseId = buyingDoc.id
                    })

                    await BuyingDetail.bulkCreate(details, { transaction: t })
                    docId = buyingDoc.id
                })

            } else {
                await Buying.create({
                    date,
                    amount,
                    description,
                    createdBy: req.loginInfo.employeeName
                })
            }

            const newData = await Buying.findByPk(docId)

            res.status(201).json({
                message: ResMsg.create('Buying Document'),
                newData
            })

        } catch (err) {
            next(err)
        }
    }

    static async edit(req, res, next) {
        try {
            const { id } = req.params
            const { date, amount, description, details } = req.body
            // details: ARR[] of Obj {}
            // from body: { id: INT, quantity: INT, price: INT, ingredientName: STR, unit: STR, ExpenseId: FK }

            const data = await Buying.findByPk(id)
            if (!data) throw { name: 'NotFound', id }
            if (data.docStatus === 'Posted') throw { name: 'PostedDocument' }

            await sequelize.transaction(async (t) => {

                //manual validation for DETAILS
                const detailsToEdit = details.filter(det => !det.toDelete)
                detailsToEdit.forEach(det => {
                    if (!det.quantity) throw { name: 'ManualValidationError', val: 'Quantity' }
                    if (!det.price) throw { name: 'ManualValidationError', val: 'Price' }
                });

                //DELETE details marked toDelete
                const toDelete = details.filter(det => det.toDelete)
                const detailsToDelete = toDelete.map((det) => det.id)

                await BuyingDetail.destroy({
                    where: {
                        id: {
                            [Op.in]: detailsToDelete
                        }
                    },

                }, { transaction: t })

                let adjustedAmt = 0
                details.forEach(det => {
                    adjustedAmt += Number(det.price)
                });

                await Buying.update({
                    date,
                    amount: adjustedAmt,
                    description
                }, {
                    where: {
                        id
                    },
                    transaction: t
                })

                await BuyingDetail.bulkCreate(detailsToEdit, {
                    updateOnDuplicate: ['quantity', 'price', 'ingredientName', 'unit'],
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

            const data = await Buying.findByPk(id)
            if (!data) throw { name: 'NotFound', id }
            if (data.docStatus === 'Posted') throw { name: 'PostedDocument' }

            await sequelize.transaction(async (t) => {

                await BuyingDetail.destroy({
                    where: {
                        ExpenseId: id
                    }
                }, { transaction: t })

                await Buying.destroy({
                    where: {
                        id
                    }
                }, { transaction: t })
            })

            res.status(200).json({
                message: ResMsg.delete('Document')
            })

        } catch (err) {
            next(err)
        }
    }

    static async updateStatus(req, res, next) {
        try {
            const { id } = req.params
            const { updateTo } = req.body

            const data = await Buying.findByPk(id)
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

            await Buying.update(queryOptions, {
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
}
module.exports = BuyingController