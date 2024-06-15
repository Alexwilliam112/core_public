'use strict'

module.exports = {
    isAdmin: async (req, res, next) => {
        try {
            const { role } = req.loginInfo
            if (role !== 'Administrator') throw { name: "NoAccess" }
            next()

        } catch (err) {
            next(err)
        }
    }
}