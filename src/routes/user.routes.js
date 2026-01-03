import express from 'express';
import { createUser, login, getUserProfile, logout, getAllUsers } from '../controllers/user.controller.js';
import { authUser } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/registerUser', createUser);
router.post('/loginUser', login);
router.get('/profile', authUser, getUserProfile);
router.get('/logout', authUser, logout);
router.get('/allUsers', authUser, getAllUsers);

export default router;

