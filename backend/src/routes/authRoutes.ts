import express from 'express';
import { registerUser, loginUser, getMaze } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/maze/:username', getMaze);

export default router;
