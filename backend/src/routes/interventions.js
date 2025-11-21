import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middlewares/auth.js';
import { list, create, update, respond, changeStatus } from '../controllers/interventionController.js';

const router = Router();

router.use(authenticate);
router.get('/', list);
router.post('/', [
  body('communeId').isInt(),
  body('themeId').isInt(),
  body('nomUsager').notEmpty(),
  body('prenomUsager').notEmpty(),
  body('question').notEmpty()
], create);
router.put('/:id', update);
router.post('/:id/repondre', [body('reponse').notEmpty()], respond);
router.post('/:id/statut', [body('statut').isIn(['en_cours','traitee','archivee'])], changeStatus);

export default router;
