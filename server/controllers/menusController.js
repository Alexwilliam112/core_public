'use strict'
const { Menu, MasterIngredient, MenuIngredient, sequelize } = require('../models')
const { Sequelize, Op } = require('sequelize')
const ResMsg = require('../lib/resMsg')
const cloudinary = require('../utils/cloudinary')
const streamifier = require('streamifier')

class MenusController {

    static async read(req, res, next) {
        try {
            const { id } = req.params
            let data = {}

            const queryOptions = {
                attributes: {
                    exclude: [
                        'createdAt',
                        'updatedAt',
                        'updatedBy'
                    ]
                },
                include: [
                    {
                        model: MenuIngredient,
                        attributes: {
                            include: [
                                [Sequelize.literal(`false`), 'toDelete']
                            ],
                            exclude: [
                                'MenuId',
                                'IngredientId'
                            ]
                        },
                        include: [
                            {
                                model: MasterIngredient,
                                as: 'Ingredients',
                                attributes: {
                                    exclude: [
                                        'createdAt',
                                        'updatedAt',
                                        'updatedBy'
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }

            const queryOptionsAll = {
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
            }

            if (!id) {
                data = await Menu.findAll(queryOptionsAll)

            } else {
                data = await Menu.findByPk(id, queryOptions)
            }

            if (!data) throw { name: 'NotFound', id }

            res.status(200).json({
                message: ResMsg.readAll('Menus'),
                data
            })

        } catch (err) {
            next(err)
        }
    }

    static async create(req, res, next) {
        try {
            let { name, price, ingredients } = req.body
            // ingredients: ARR[] of Obj {}
            // from body: { quantity: INT, IngredientId: INT FK }

            if(typeof(ingredients) !== 'object') ingredients = []

            //image uploads
            let imgUrl = ''
            if (req.file) {
                const fileType = req.file.mimetype.split('/')
                if (!fileType.includes('image')) throw { name: 'InvalidDataType' }

                const uploadStream = (buffer) => {
                    return new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream((error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result.secure_url);
                            }
                        });
                        streamifier.createReadStream(buffer).pipe(stream);
                    });
                };
    
                imgUrl = await uploadStream(req.file.buffer);
            }

            if (ingredients.length > 0) {
                await sequelize.transaction(async (t) => {

                    const menu = await Menu.create({
                        name,
                        price,
                        imgUrl,
                        updatedBy: req.loginInfo.employeeName
                    }, { transaction: t })

                    ingredients.map((ing) => {
                        ing.MenuId = menu.id
                    })

                    await MenuIngredient.bulkCreate(ingredients, { transaction: t })

                })

            } else {
                await Menu.create({
                    name,
                    price,
                    imgUrl,
                    updatedBy: req.loginInfo.employeeName
                })
            }

            const newData = await Menu.findOne({
                where: {
                    name
                }
            })

            res.status(201).json({
                message: ResMsg.create(name),
                newData
            })

        } catch (err) {
            next(err)
        }
    }

    static async edit(req, res, next) {
        try {
            const { id } = req.params
            const { name, price, ingredients } = req.body
            // ingredients: ARR[] of Obj {}
            // from body: { id: INT, quantity: INT, IngredientId: FK, MenuId: FK }

            const data = await Menu.findByPk(id)
            if (!data) throw { name: 'NotFound', id }

            await sequelize.transaction(async (t) => {

                //manual validation for DETAILS
                const detailsToEdit = ingredients.filter(det => !det.toDelete)
                detailsToEdit.forEach(det => {
                    if (!det.quantity) throw { name: 'ManualValidationError', val: 'Quantity' }
                });

                //DELETE details marked toDelete
                const toDelete = ingredients.filter(det => det.toDelete)
                const detailsToDelete = toDelete.map((det) => det.id)

                await MenuIngredient.destroy({
                    where: {
                        id: {
                            [Op.in]: detailsToDelete
                        }
                    },

                }, { transaction: t })

                await Menu.update({
                    name,
                    price,
                    updatedBy: req.loginInfo.employeeName
                }, {
                    where: {
                        id
                    },
                    transaction: t
                })

                await MenuIngredient.bulkCreate(detailsToEdit, {
                    updateOnDuplicate: ['quantity', 'IngredientId'],
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

            const data = await Menu.findByPk(id)
            if (!data) throw { name: 'NotFound', id }

            await sequelize.transaction(async (t) => {

                await MenuIngredient.destroy({
                    where: {
                        MenuId: id
                    }
                })

                await Menu.destroy({
                    where: {
                        id
                    }
                })
            })

            res.status(200).json({
                message: ResMsg.delete(data.name)
            })

        } catch (err) {
            next(err)
        }
    }
}
module.exports = MenusController