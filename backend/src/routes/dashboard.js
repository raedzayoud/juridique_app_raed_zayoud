import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { stats } from '../controllers/dashboardController.js';

const router = Router();
router.use(authenticate, authorize(['admin']));
router.get('/stats', stats);
export default router;
