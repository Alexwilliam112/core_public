'use strict'
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const cors = require('cors')
const app = express()
const router = require('./routers/index')

//config
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//routing
app.use(router)
module.exports = app