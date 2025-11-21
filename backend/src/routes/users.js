import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize } from '../middlewares/auth.js';
import { list, create, update, remove } from '../controllers/userController.js';

const router = Router();

router.use(authenticate, authorize(['admin']));

router.get('/', list);
router.post('/', [
  body('nom').notEmpty(),
  body('prenom').notEmpty(),
  body('email').isEmail(),
  body('motDePasse').isLength({ min: 6 }),
  body('role').isIn(['admin', 'agent'])
], create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
