import express from 'express';
import { createUser, login } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/registerUser', createUser);
router.post('/loginUser', login);

export default router;

