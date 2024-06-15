'use strict'
const { User, AuthModule, Employment, sequelize } = require('../models')
const Authorization = require('../lib/authorizations')
const { compare } = require('../helpers/bcrypt')
const { signToken } = require('../helpers/jwt')
const ResMsg = require('../lib/resMsg')
const { hash } = require('../helpers/bcrypt')
const { OAuth2Client } = require('google-auth-library')

class AuthController {

    static async googleLogin(req, res, next) {
        try {
            const { token } = req.headers
            const client = new OAuth2Client();

            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: "782469292979-6h8bbvujauk0utonftegpm71et20dpj2.apps.googleusercontent.com",
            });
            const payload = ticket.getPayload();

            let access_token
            await sequelize.transaction(async (t) => {
                const [user, created] = await User.findOrCreate({
                    where: {
                        username: payload.email
                    },
                    defaults: {
                        username: payload.email,
                        password: "password_google"
                    },
                    hooks: {
                        beforeCreate: false
                    },
                    transaction: t
                })

                await Employment.create({
                    employeeName: user.username,
                    employmentType: 'Probation',
                    joinDate: new Date(),
                    salary: 1,
                    bank: 'none',
                    accountNumber: 'none',
                    JobtitleId: 6,
                    UserId: user.id
                }, { transaction: t })

                const newUserAuth = Authorization.newUser.map((auth) => {
                    auth.UserId = user.id
                    return auth
                })

                await AuthModule.bulkCreate(newUserAuth, { transaction: t })

                access_token = signToken({
                    id: user.id,
                    username: user.username,
                    employeeName: user.username,
                    role: user.role
                })

            })

            res.status(200).json({ access_token })

        } catch (err) {
            next(err)
        }
    }

    static async handleChangePass(req, res, next) {
        try {
            const login = req.loginInfo
            const { newPassword, repeatPassword } = req.body

            if (newPassword !== repeatPassword) throw { name: 'PassNotSame' }

            const user = await User.findByPk(login.id)
            if (!user) throw { name: 'JsonWebTokenError' }

            const newPass = hash(newPassword)
            await User.update({
                password: newPass,
                newUser: false
            }, {
                where: {
                    id: login.id
                }
            })

            res.status(200).json({
                message: `Successfully Change Password`
            })

        } catch (err) {
            next(err)
        }
    }

    static async handleLogin(req, res, next) {
        try {
            const { username, password } = req.body
            if (!username || !password) throw { name: 'EmptyLogin' }

            const user = await User.findOne({
                where: {
                    username
                },
                include: [
                    {
                        model: Employment
                    }
                ]
            })

            if (!user) throw { name: 'InvalidLogin' }
            if (!compare(password, user.password)) throw { name: 'InvalidLogin' }

            const authModules = await AuthModule.findAll({
                where: {
                    UserId: user.id
                },
                attributes: {
                    exclude: [
                        'id',
                        'UserId'
                    ]
                }
            })

            const auth = {}
            authModules.forEach((el) => {
                auth[el.authorization] = el.value
            });

            const payload = {
                id: user.id,
                employeeName: user.Employment.employeeName,
                username: user.username,
                role: user.role,
            }

            const access_token = signToken(payload)
            res.status(200).json({
                newUser: user.newUser,
                auth,
                access_token,
            })

        } catch (err) {
            next(err)
        }
    }

    static async handleRegister(req, res, next) {
        try {
            const { username, password, employmentType, employeeName,
                joinDate, salary, bank, accountNumber, JobtitleId } = req.body

            await sequelize.transaction(async (t) => {

                const user = await User.create({
                    username,
                    password
                }, { transaction: t })

                await Employment.create({
                    employeeName,
                    employmentType,
                    joinDate,
                    salary,
                    bank,
                    accountNumber,
                    JobtitleId,
                    UserId: user.id
                }, { transaction: t })

                const newUserAuth = Authorization.newUser.map((auth) => {
                    auth.UserId = user.id
                    return auth
                })

                await AuthModule.bulkCreate(newUserAuth, { transaction: t })
            })

            res.status(201).json({
                message: ResMsg.create(username)
            })

        } catch (err) {
            next(err)
        }
    }

    static async readAuth(req, res, next) {
        try {
            const { id } = req.params

            const user = await User.findByPk(id)
            if (!user) throw { name: 'NotFound', id }

            const auth = await AuthModule.findAll({
                where: {
                    UserId: id
                },
            })

            res.status(200).json({
                User_Id: id,
                auth
            })

        } catch (err) {
            next(err)
        }
    }

    static async editAuth(req, res, next) {
        try {
            const { id } = req.params
            const { authData } = req.body
            //authData = ARR[] of Obj {}
            //authData = { id: INT, authorization: STR, value: BOOL, UserId: FK }

            const user = await User.findByPk(id)
            if (!user) throw { name: 'JsonWebTokenError' }

            await AuthModule.bulkCreate(authData, {
                updateOnDuplicate: ['authorization', 'value']
            })

            res.status(200).json({
                message: ResMsg.edit()
            })

        } catch (err) {
            next(err)
        }
    }
}
module.exports = AuthController