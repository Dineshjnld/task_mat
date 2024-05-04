// src/routes/userRoutes.ts
import express from 'express';
import UserController from '../controllers/UserController';

const router = express.Router();
const userController = new UserController();

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);

export default router;
