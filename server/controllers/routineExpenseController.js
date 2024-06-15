'use strict'
const { ExpenseType, RoutineExpense, sequelize } = require('../models')
const ResMsg = require('../lib/resMsg')

class RoutineExpenseController {

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
                },
                include: [
                    {
                        model: ExpenseType,
                        attributes: {
                            exclude: [
                                'id',
                                'description',
                                'createdAt',
                                'updatedAt'
                            ]
                        }
                    }
                ]
            }

            if (!id) {
                data = await RoutineExpense.findAll(queryOptions)
            } else {
                data = await RoutineExpense.findByPk(id, queryOptions)
            }

            if (!data) throw { name: 'NotFound', id }

            res.status(200).json({
                message: ResMsg.readAll('Routine Expenses'),
                data
            })

        } catch (err) {
            next(err)
        }
    }

    static async create(req, res, next) {
        try {
            const { date, amount, description, TypeId } = req.body
            const createdBy = req.loginInfo.employeeName

            const newData = await RoutineExpense.create({
                date,
                amount,
                description,
                TypeId,
                createdBy
            })

            res.status(201).json({
                message: ResMsg.create('Routine Expense Document'),
                newData
            })

        } catch (err) {
            next(err)
        }
    }

    static async edit(req, res, next) {
        try {
            const { id } = req.params
            const { date, amount, description, TypeId } = req.body

            const data = await RoutineExpense.findByPk(id)
            if (!data) throw { name: 'NotFound', id }
            if(data.docStatus === 'Posted') throw {name: 'PostedDocument'}

            await RoutineExpense.update({
                date,
                amount,
                description,
                TypeId,
            }, {
                where: {
                    id
                }
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

            const data = await RoutineExpense.findByPk(id)
            if (!data) throw { name: 'NotFound', id }
            if(data.docStatus === 'Posted') throw {name: 'PostedDocument'}

            await RoutineExpense.destroy({
                where: {
                    id
                }
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

            const data = await RoutineExpense.findByPk(id)
            if (!data) throw { name: 'NotFound', id }
            if(data.docStatus === 'Posted') throw {name: 'PostedDocument'}

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

            await RoutineExpense.update(queryOptions, {
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
module.exports = RoutineExpenseController