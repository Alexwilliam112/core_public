'use strict'
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY

module.exports = {
    signToken: (payload) => {
        return jwt.sign(payload, secretKey)
    },

    verifyToken: (token) => {
        return jwt.verify(token, secretKey)
    }
}