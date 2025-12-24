import express from 'express';
import { createUser, login, getUserProfile, logout } from '../controllers/user.controller.js';
import { authUser } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/registerUser', createUser);
router.post('/loginUser', login);
router.get('/profile', authUser, getUserProfile);
router.post('/logout', authUser, logout);

export default router;

