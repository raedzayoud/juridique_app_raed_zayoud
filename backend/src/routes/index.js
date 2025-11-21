import { Router } from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import communeRoutes from './communes.js';
import themeRoutes from './themes.js';
import interventionRoutes from './interventions.js';
import pieceJointeRoutes from './piecesJointes.js';
import dashboardRoutes from './dashboard.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/communes', communeRoutes);
router.use('/themes', themeRoutes);
router.use('/interventions', interventionRoutes);
router.use('/pieces', pieceJointeRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
