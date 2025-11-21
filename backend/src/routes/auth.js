import { Router } from 'express';
import { body } from 'express-validator';
import { login } from '../controllers/authController.js';

const router = Router();

router.post('/login', [
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 })
], login);

export default router;
