import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize } from '../middlewares/auth.js';
import { list, create, update, remove } from '../controllers/communeController.js';

const router = Router();

router.use(authenticate);
router.get('/', list);
router.post('/', authorize(['admin']), [body('nom').notEmpty(), body('codePostal').notEmpty()], create);
router.put('/:id', authorize(['admin']), update);
router.delete('/:id', authorize(['admin']), remove);

export default router;
