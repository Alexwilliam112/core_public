'use strict'
const router = require('express').Router()
const PosController = require('../controllers/posController')

router.get('/sales', PosController.read)
router.post('/sales', PosController.create)
router.get('/sales/:id', PosController.read)
router.put('/sales/:id', PosController.edit)
router.patch('/sales/:id', PosController.updateStatus)
router.delete('/sales/:id', PosController.delete)

module.exports = router