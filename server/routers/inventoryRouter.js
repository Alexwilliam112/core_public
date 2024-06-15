'use strict'
const router = require('express').Router()
const MasterIngredientController = require('../controllers/masterIngredientController')
const MenusController = require('../controllers/menusController')
const upload = require('../utils/multer')
const uploadMiddleware = upload.single("image");

router.get('/ingredients', MasterIngredientController.read)
router.post('/ingredients', MasterIngredientController.create)
router.get('/ingredients/:id', MasterIngredientController.read)
router.put('/ingredients/:id', MasterIngredientController.edit)
router.delete('/ingredients/:id', MasterIngredientController.delete)

router.get('/menus', MenusController.read)
router.post('/menus', uploadMiddleware, MenusController.create)
router.get('/menus/:id', MenusController.read)
router.put('/menus/:id', uploadMiddleware, MenusController.edit)
router.delete('/menus/:id', MenusController.delete)

module.exports = router