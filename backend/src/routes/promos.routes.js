import express from 'express';
import { authenticate, authorize, optionalAuthenticate } from '../middlewares/auth.middleware.js';
import { uploadPromoVideo } from '../middlewares/upload.middleware.js';
import { body } from 'express-validator';
import * as controller from '../controllers/promos.controller.js';
import validateBody from '../middlewares/validateBody.middleware.js';

const router = express.Router();

// Public read endpoints — published promos are visible to non-admins
// Use optionalAuthenticate so admin requests include req.user
router.get('/', optionalAuthenticate, controller.list);
router.get('/:id', optionalAuthenticate, controller.get);

// Admin-only routes
router.post(
    '/',
    authenticate,
    authorize(['admin']),
    uploadPromoVideo.single('video'),
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('caption_text').notEmpty().withMessage('Caption text is required')
    ],
    validateBody,
    controller.create
);

router.put(
    '/:id',
    authenticate,
    authorize(['admin']),
    uploadPromoVideo.single('video'),
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('caption_text').notEmpty().withMessage('Caption text is required')
    ],
    validateBody,
    controller.update
);

router.patch('/:id/publish', authenticate, authorize(['admin']), controller.publishPromo);
router.patch('/:id/unpublish', authenticate, authorize(['admin']), controller.unpublishPromo);
router.delete('/:id', authenticate, authorize(['admin']), controller.remove);

export default router;
