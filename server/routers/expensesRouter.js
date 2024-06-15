'use strict'
const router = require('express').Router()
const ExpenseTypeController = require('../controllers/expenseTypeController')
const RoutineExpenseController = require('../controllers/routineExpenseController')
const BuyingController = require('../controllers/buyingController')
const PayrollController = require('../controllers/payrollController')

router.get('/buyings', BuyingController.read)
router.post('/buyings', BuyingController.create)
router.get('/buyings/:id', BuyingController.read)
router.put('/buyings/:id', BuyingController.edit)
router.delete('/buyings/:id', BuyingController.delete)
router.patch('/buyings/:id', BuyingController.updateStatus)

router.get('/routine', RoutineExpenseController.read)
router.post('/routine', RoutineExpenseController.create)
router.get('/routine/:id', RoutineExpenseController.read)
router.put('/routine/:id', RoutineExpenseController.edit)
router.delete('/routine/:id', RoutineExpenseController.delete)
router.patch('/routine/:id', RoutineExpenseController.updateStatus)

router.get('/payroll', PayrollController.read)
router.post('/payroll', PayrollController.create)
router.get('/payroll/:id', PayrollController.read)
router.put('/payroll/:id', PayrollController.edit)
router.delete('/payroll/:id', PayrollController.delete)
router.patch('/payroll/:id', PayrollController.updateStatus)

router.get('/expenseTypes', ExpenseTypeController.read)
router.post('/expenseTypes', ExpenseTypeController.create)
router.get('/expenseTypes/:id', ExpenseTypeController.read)
router.put('/expenseTypes/:id', ExpenseTypeController.edit)
router.delete('/expenseTypes/:id', ExpenseTypeController.delete)

module.exports = router