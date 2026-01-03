import express from 'express';
import { 
        createProjectController, 
        getAllProjectsController, 
        addUsersToProjectController ,
        getProjectByIdController
} from '../controllers/project.controller.js';
import { body } from 'express-validator';
import { authUser } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create',
        body('name').notEmpty().withMessage('Project name is required'),
        authUser,
        createProjectController
);

router.get('/all',
        authUser,
        getAllProjectsController
);

router.put('/add-user',
        authUser,
        body('projectId').notEmpty().withMessage('projectId is required'),
        body('users').isArray({ min: 1 }).withMessage('users must be an array of strings').bail()
                .custom((users) => users.every(user => typeof user === 'string'))
                .withMessage('Each userId must be a string'),
        addUsersToProjectController
);

router.get('/get-projects/:projectId', 
        authUser,
        getProjectByIdController
);

export default router;