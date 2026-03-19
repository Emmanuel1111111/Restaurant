import express from 'express';
import { body } from 'express-validator';
import {getMenu,getMenuItem,searchMenu, createCategory,updateCategory,deleteCategory,toggleAvailability,updateMenuItem, deleteMenuItem, createMenuItem} from '../controllers/menuController.js';
import {auth }from '../middleware/auth.js';
import {isStaff} from '../middleware/auth.js';
import {validateRequest} from '../middleware/validateRequest.js';

const router = express.Router();



// Public routes
router.get('/getMenu', getMenu);
router.get('/item/:id', getMenuItem);
router.get('/search', searchMenu);

// Staff routes
router.post(
  '/category',
  auth,
  isStaff,
  [
    body('name').trim().notEmpty().withMessage('Category name is required'),
  ],
  validateRequest,
 createCategory
);

router.put('/category/:id', auth, isStaff, updateCategory);
router.delete('/category/:id', auth, isStaff, deleteCategory);

router.post(
  '/createItem',
  auth,

  [
    body('categoryId').notEmpty().withMessage('Category is required'),
    body('name').trim().notEmpty().withMessage('Item name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  ],
  validateRequest,
  createMenuItem
);

router.put('/item/:id', auth, isStaff, updateMenuItem);
router.delete('/item/:id', auth, isStaff, deleteMenuItem);
router.patch('/item/:id/toggle', auth, isStaff,  toggleAvailability);


export default router;