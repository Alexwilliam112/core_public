'use strict'
const { User, Employment, Jobtitle, AuthModule, sequelize } = require('../models')
const ResMsg = require('../lib/resMsg')

class AdminController {

    static async readUser(req, res, next) {
        try {
            const { id } = req.params
            const queryOptions = {
                attributes: {
                    include: [
                        [sequelize.fn('to_char', sequelize.col('createdAt'), 'YYYY-MM-dd'), 'createdAt'],
                        [sequelize.fn('to_char', sequelize.col('updatedAt'), 'YYYY-MM-dd'), 'updatedAt']
                    ],
                    exclude: [
                        'createdAt',
                        'updatedAt',
                        'password',
                        'newUser'
                    ]
                },
                include: [
                    {
                        model: Employment,
                        attributes: {
                            include: [
                                [sequelize.fn('to_char', sequelize.col('joinDate'), 'YYYY-MM-dd'), 'joinDate'],
                            ],
                            exclude: [
                                'joinDate',
                                'UserId',
                                'JobtitleId'
                            ]
                        },
                        include: [
                            {
                                model: Jobtitle
                            }
                        ]
                    }
                ]
            }

            let data = {}
            if (!id) {
                data = await User.findAll(queryOptions)
            } else {
                data = await User.findByPk(id, queryOptions)
            }

            if (!data) throw { name: 'NotFound', id }

            res.status(200).json({
                message: ResMsg.readAll('Users'),
                data
            })

        } catch (err) {
            next(err)
        }
    }

    static async edit(req, res, next) {
        try {
            const { id } = req.params
            const { employeeName, employmentType, joinDate,
                salary, bank, accountNumber, JobtitleId } = req.body

            const data = await User.findByPk(id)
            if (!data) throw { name: 'NotFound', id }

            await Employment.update({
                employeeName,
                employmentType,
                joinDate,
                salary,
                bank,
                accountNumber,
                JobtitleId
            }, {
                where: {
                    UserId: id
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

            const data = await User.findByPk(id)
            if (!data) throw { name: 'NotFound', id }
            if (data.docStatus === 'Active') throw { name: 'ActiveDocument' }

            await sequelize.transaction(async (t) => {

                await AuthModule.destroy({
                    where: {
                        UserId: id
                    }
                }, { transaction: t })

                await Employment.destroy({
                    where: {
                        UserId: id
                    }
                }, { transaction: t })

                await User.destroy({
                    where: {
                        id
                    }
                }, { transaction: t })

            })

            res.status(200).json({
                message: ResMsg.delete('USER DOCUMENT')
            })

        } catch (err) {
            next(err)
        }
    }

    static async updateStatus(req, res, next) {
        try {
            const { id } = req.params
            const { updateTo } = req.body

            const data = await Employment.findOne({
                where: {
                    UserId: id
                }
            })
            if (!data) throw { name: 'NotFound', id }

            const queryOptions = {
                docStatus: updateTo
            }

            let actionMsg = ''
            switch (updateTo) {
                case 'Active': {
                    actionMsg = 'REACTIVATED'
                    break;
                }

                case 'Terminated': {
                    actionMsg = 'TERMINATED'
                    break;
                }
            }

            await Employment.update(queryOptions, {
                where: {
                    UserId: id
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
module.exports = AdminController