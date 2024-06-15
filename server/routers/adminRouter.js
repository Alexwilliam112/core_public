'use strict'
const router = require('express').Router()
const AuthController = require('../controllers/authController')
const AdminController = require('../controllers/adminController')
const JobtitleController = require('../controllers/jobtitleController')

router.get('/users', AdminController.readUser)
router.post('/users', AuthController.handleRegister)
router.get('/users/:id', AdminController.readUser)
router.patch('/users/:id', AdminController.updateStatus)
router.put('/users/:id', AdminController.edit)
router.delete('/users/:id', AdminController.delete)

router.get('/auth/:id', AuthController.readAuth)
router.put('/auth/:id', AuthController.editAuth)

router.get('/jobtitles', JobtitleController.read)
router.post('/jobtitles', JobtitleController.create)
router.get('/jobtitles/:id', JobtitleController.read)
router.put('/jobtitles/:id', JobtitleController.edit)
router.delete('/jobtitles/:id', JobtitleController.delete)

module.exports = router