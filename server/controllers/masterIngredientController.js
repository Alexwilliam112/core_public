'use strict'
const { MasterIngredient } = require('../models')
const ResMsg = require('../lib/resMsg')

class MasterIngredientController {

    static async read(req, res, next) {
        try {
            const { id } = req.params
            let data = {}

            if (!id) {
                data = await MasterIngredient.findAll({})
            } else {
                data = await MasterIngredient.findByPk(id)
            }

            if (!data) throw { name: 'NotFound', id }

            res.status(200).json({
                message: ResMsg.readAll('Master Ingredients'),
                data
            })

        } catch (err) {
            next(err)
        }
    }

    static async create(req, res, next) {
        try {
            const { ingredientName, unit } = req.body
            const updatedBy = req.loginInfo.employeeName

            const newData = await MasterIngredient.create({
                ingredientName,
                unit,
                updatedBy
            })

            res.status(201).json({
                message: ResMsg.create(newData.ingredientName),
                newData
            })

        } catch (err) {
            next(err)
        }
    }

    static async edit(req, res, next) {
        try {
            const { id } = req.params
            const { ingredientName, unit } = req.body
            const updatedBy = req.loginInfo.employeeName

            const data = await MasterIngredient.findByPk(id)
            if(!data) throw {name: 'NotFound', id}

            await MasterIngredient.update({
                ingredientName,
                unit,
                updatedBy
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

            const data = await MasterIngredient.findByPk(id)
            if(!data) throw {name: 'NotFound', id}

            await MasterIngredient.destroy({
                where: {
                    id
                }
            })

            res.status(200).json({
                message: ResMsg.delete(data.ingredientName)
            })
            
        } catch (err) {
            next(err)
        }
    }
}
module.exports = MasterIngredientController