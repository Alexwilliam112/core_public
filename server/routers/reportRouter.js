'use strict'
const router = require('express').Router()
const ReportsController = require('../controllers/reportsController')
const { isAdmin } = require('../middlewares/authorization')

router.get('/general', isAdmin, ReportsController.generalreport)

module.exports = router