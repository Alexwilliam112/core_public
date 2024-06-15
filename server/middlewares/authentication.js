'use strict'

const { verifyToken } = require("../helpers/jwt")
const { User, Employment } = require('../models')
module.exports = {
    authentication: async (req, res, next) => {
        try {
            const { authorization } = req.headers
            if (!authorization) throw { name: "NotLoggedIn" }

            const access_token = authorization.split(' ')[1]
            const payload = verifyToken(access_token)

            const user = await User.findOne({
                where: {
                    username: payload.username
                },
                include: [
                    {
                        model: Employment
                    }
                ]
            })

            if (!user) throw { name: "NotLoggedIn" }

            req.loginInfo = {
                id: user.id,
                employeeName: user.Employment.employeeName,
                username: user.username,
                role: user.role
            }

            next()

        } catch (err) {
            next(err)
        }
    }
}