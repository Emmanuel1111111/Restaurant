const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const menuController = require('../controllers/menuController');
const { auth, isStaff } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

// Public routes
router.get('/', menuController.getMenu);
router.get('/item/:id', menuController.getMenuItem);
router.get('/search', menuController.searchMenu);

// Staff routes
router.post(
  '/category',
  auth,
  isStaff,
  [
    body('name').trim().notEmpty().withMessage('Category name is required'),
  ],
  validateRequest,
  menuController.createCategory
);

router.put('/category/:id', auth, isStaff, menuController.updateCategory);
router.delete('/category/:id', auth, isStaff, menuController.deleteCategory);

router.post(
  '/item',
  auth,
  isStaff,
  [
    body('categoryId').notEmpty().withMessage('Category is required'),
    body('name').trim().notEmpty().withMessage('Item name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  ],
  validateRequest,
  menuController.createMenuItem
);

router.put('/item/:id', auth, isStaff, menuController.updateMenuItem);
router.delete('/item/:id', auth, isStaff, menuController.deleteMenuItem);
router.patch('/item/:id/toggle', auth, isStaff, menuController.toggleAvailability);

module.exports = router;
