import express from 'express';
import { createProjectController } from '../controllers/project.controller.js';
import { body } from 'express-validator';
import { authUser } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create',
        body('name').notEmpty().withMessage('Project name is required'),
        authUser,
        createProjectController
);

export default router;