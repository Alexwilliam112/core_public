'use strict'
const { Jobtitle } = require('../models')
const ResMsg = require('../lib/resMsg')

class JobtitleController {

    static async read(req, res, next) {
        try {
            const { id } = req.params

            let data = {}
            if (!id) {
                data = await Jobtitle.findAll({})
            } else {
                data = await Jobtitle.findByPk(id, {})
            }

            if (!data) throw { name: 'NotFound', id }

            res.status(200).json({
                message: ResMsg.readAll('Jobtitles'),
                data
            })

        } catch (err) {
            next(err)
        }
    }

    static async create(req, res, next) {
        try {
            const { jobtitleName } = req.body

            const newData = await Jobtitle.create({
                jobtitleName
            })

            res.status(201).json({
                message: ResMsg.create(newData.jobtitleName)
            })

        } catch (err) {
            next(err)
        }
    }

    static async edit(req, res, next) {
        try {
            const { id } = req.params
            const { jobtitleName } = req.body
            
            const data = await Jobtitle.findByPk(id)
            if (!data) throw { name: 'NotFound', id }

            await Jobtitle.update({
                jobtitleName
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

            const data = await Jobtitle.findByPk(id)
            if (!data) throw { name: 'NotFound', id }

            await Jobtitle.destroy({
                where: {
                    id
                }
            })

            res.status(200).json({
                message: ResMsg.delete(data.jobtitleName)
            })

        } catch (err) {
            next(err)
        }
    }
}
module.exports = JobtitleController