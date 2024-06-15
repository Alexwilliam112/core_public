'use strict'
const router = require('express').Router()
const PosController = require('../controllers/posController')

router.get('/midtrans', PosController.getToken)
router.patch('/status', PosController.updatePaymentStatus)

module.exports = router