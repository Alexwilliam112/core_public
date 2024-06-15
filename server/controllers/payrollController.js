'use strict'
const { PayrollDetail, PayrollExpense, Employment, sequelize } = require('../models')
const { Sequelize, Op } = require('sequelize');
const ResMsg = require('../lib/resMsg')

class PayrollController {

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
                        'createdAt',
                        'updatedAt'
                    ]
                }
            }

            if (!id) {
                data = await PayrollExpense.findAll(queryOptions)

            } else {
                queryOptions.include = [
                    {
                        model: PayrollDetail,
                        attributes: {
                            include: [
                                [Sequelize.literal(`false`), 'toDelete']
                            ]
                        }
                    }
                ]

                data = await PayrollExpense.findByPk(id, queryOptions)
            }

            if (!data) throw { name: 'NotFound', id }

            res.status(200).json({
                message: ResMsg.readAll('Payroll Expenses'),
                data
            })

        } catch (err) {
            next(err)
        }
    }

    static async create(req, res, next) {
        try {
            const { date, description } = req.body

            let docId = 0
            await sequelize.transaction(async (t) => {

                const details = await Employment.findAll({
                    where: {
                        docStatus: 'Active'
                    },
                    raw: true
                }, { transaction: t })

                const amount = await Employment.sum('salary', {
                    where: {
                        docStatus: 'Active'
                    }
                }, { transaction: t });

                const PayrollExpenseDoc = await PayrollExpense.create({
                    date,
                    amount,
                    description,
                    createdBy: req.loginInfo.employeeName
                }, { transaction: t })

                const payrollDetails = details.map((det) => {
                    det.EmploymentId = det.id
                    det.salaryPaid = det.salary
                    det.PayId = PayrollExpenseDoc.id

                    delete det.id
                    delete det.docStatus
                    delete det.employmentType
                    delete det.joinDate
                    delete det.salary
                    delete det.UserId
                    delete det.JobtitleId

                    return det
                })

                await PayrollDetail.bulkCreate(payrollDetails, { transaction: t })
                docId = PayrollExpenseDoc.id
            })

            const newData = await PayrollExpense.findByPk(docId)

            res.status(201).json({
                message: ResMsg.create('PayrollExpense Document'),
                newData
            })

        } catch (err) {
            next(err)
        }
    }

    static async edit(req, res, next) {
        try {
            const { id } = req.params
            const { date, description, details } = req.body
            // details: ARR[] of Obj {}
            // from body: { salaryPaid: INT, EmploymentId: FK }

            const data = await PayrollExpense.findByPk(id)
            if (!data) throw { name: 'NotFound', id }
            if (data.docStatus === 'Posted') throw { name: 'PostedDocument' }
            
            await sequelize.transaction(async (t) => {

                //manual validation for DETAILS
                const detailsToEdit = details.filter(det => !det.toDelete)
                detailsToEdit.forEach(det => {
                    if (!det.employeeName) throw { name: 'ManualValidationError', val: 'Employee Name' }
                    if (!det.salaryPaid) throw { name: 'ManualValidationError', val: 'Salary Paid' }
                    if (!det.bank) throw { name: 'ManualValidationError', val: 'Bank Name' }
                    if (!det.accountNumber) throw { name: 'ManualValidationError', val: 'Account Number' }
                });

                //DELETE details marked toDelete
                const toDelete = details.filter(det => det.toDelete)
                
                if (toDelete.length > 0) {
                    const detailsToDelete = toDelete.map((det) => det.id)
                    
                    await PayrollDetail.destroy({
                        where: {
                            id: {
                                [Op.in]: detailsToDelete
                            }
                        }
                    }, { transaction: t })
                }

                let adjustedAmt = 0
                detailsToEdit.forEach(det => {
                    adjustedAmt += Number(det.salaryPaid)
                });

                await PayrollExpense.update({
                    date,
                    amount: adjustedAmt,
                    description
                }, {
                    where: {
                        id
                    },
                    transaction: t
                })

                await PayrollDetail.bulkCreate(detailsToEdit, {
                    updateOnDuplicate: ['salaryPaid', 'bank', 'accountNumber'],
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

            const data = await PayrollExpense.findByPk(id)
            if (!data) throw { name: 'NotFound', id }
            if (data.docStatus === 'Posted') throw { name: 'PostedDocument' }

            await sequelize.transaction(async (t) => {

                await PayrollDetail.destroy({
                    where: {
                        PayId: id
                    }
                }, { transaction: t })

                await PayrollExpense.destroy({
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

            const data = await PayrollExpense.findByPk(id)
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

            await PayrollExpense.update(queryOptions, {
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
module.exports = PayrollController