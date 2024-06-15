'use strict'
const bcrypt = require('bcryptjs');

module.exports = {
    hash: (pass) => {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(pass, salt)
    },

    compare: (pass, hashedPass) => {
        return bcrypt.compareSync(pass, hashedPass)
    }
}