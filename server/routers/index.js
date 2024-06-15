'use strict'

const router = require('express').Router()
const { errorHandler } = require('../middlewares/errorHandler')
const { authentication } = require('../middlewares/authentication')

const adminRouter = require('./adminRouter')
const operationsRouter = require('./operationsRouter')
const inventoryRouter = require('./inventoryRouter')
const expensesRouter = require('./expensesRouter')
const paymentRouter = require('./paymentRouter')
const reportRouter = require('./reportRouter')
const AuthController = require('../controllers/authController')
const PosController = require('../controllers/posController')

router.post('/login', AuthController.handleLogin)
router.post('/google-login', AuthController.googleLogin)
router.post('/midtrans-notification', PosController.midtransNotification)

router.use(authentication)
router.post('/changePass', AuthController.handleChangePass)

router.use('/payment', paymentRouter)
router.use('/admin', adminRouter)
router.use('/operations', operationsRouter)
router.use('/inventory', inventoryRouter)
router.use('/expenses', expensesRouter)
router.use('/reports', reportRouter)

router.use((req, res, next) => {
    const err = new Error(`Request Not Found. ( ${req.originalUrl} )`);
    err.status = 404;
    err.name = 'ReqNotFound'
    next(err);
});
router.use(errorHandler)

module.exports = router