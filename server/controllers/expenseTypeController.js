'use strict'
const { ExpenseType } = require('../models')
const ResMsg = require('../lib/resMsg')

class ExpenseTypeController {

    static async read(req, res, next) {
        try {
            const { id } = req.params
            let data = {}

            if (!id) {
                data = await ExpenseType.findAll({})
            } else {
                data = await ExpenseType.findByPk(id)
            }

            if (!data) throw { name: 'NotFound', id }

            res.status(200).json({
                message: ResMsg.readAll('Expense Types'),
                data
            })

        } catch (err) {
            next(err)
        }
    }

    static async create(req, res, next) {
        try {
            const { name, description } = req.body

            const newData = await ExpenseType.create({
                name,
                description,
            })

            res.status(201).json({
                message: ResMsg.create(newData.name),
                newData
            })

        } catch (err) {
            next(err)
        }
    }

    static async edit(req, res, next) {
        try {
            const { id } = req.params
            const { name, description } = req.body

            const data = await ExpenseType.findByPk(id)
            if (!data) throw { name: 'NotFound', id }

            await ExpenseType.update({
                name,
                description,
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

            const data = await ExpenseType.findByPk(id)
            if (!data) throw { name: 'NotFound', id }

            await ExpenseType.destroy({
                where: {
                    id
                }
            })

            res.status(200).json({
                message: ResMsg.delete(data.name)
            })

        } catch (err) {
            next(err)
        }
    }
}
module.exports = ExpenseTypeController