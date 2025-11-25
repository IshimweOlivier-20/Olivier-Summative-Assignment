import express from 'express';
import { body } from 'express-validator';
import * as controller from '../controllers/users.controller.js';
import validateBody from '../middlewares/validateBody.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// -----------------------------
// Admin-only routes
// -----------------------------

// List all users (paginated)
router.get('/', authenticate, authorize(['admin']), controller.list);

// Get single user by ID
router.get('/:id', authenticate, authorize(['admin']), controller.get);

// Enable user
router.patch('/:id/enable', authenticate, authorize(['admin']), controller.enable);
router.put('/:id/enable', authenticate, authorize(['admin']), controller.enable);

// Disable user
router.patch('/:id/disable', authenticate, authorize(['admin']), controller.disable);
router.put('/:id/disable', authenticate, authorize(['admin']), controller.disable);

// Admin: update a user's role (accept PUT for frontend convenience)
router.put('/:id/role', authenticate, authorize(['admin']), controller.updateRole);


// -----------------------------
// User self-management
// -----------------------------

// Get own profile
router.get('/profile/me', authenticate, controller.getSelf);

// Update own profile (cannot update role)
router.patch(
    '/profile/me',
    authenticate,
    [
        body('full_name').optional().notEmpty().withMessage('Full name cannot be empty'),
        body('email').optional().isEmail().withMessage('Must be a valid email'),
        body('role').not().exists().withMessage('Cannot update role'),
        body('is_active').not().exists().withMessage('Cannot update status'),
    ],
    validateBody,
    controller.updateSelf
);

export default router;
