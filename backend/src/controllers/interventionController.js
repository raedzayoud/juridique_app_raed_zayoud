import { validationResult } from 'express-validator';
import { Intervention, PieceJointe, Commune, Theme, User } from '../models/index.js';

export const list = async (req, res) => {
  const items = await Intervention.findAll({
    include: [Commune, Theme, { model: User, as: 'utilisateur' }, PieceJointe]
  });
  res.json(items);
};

export const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const item = await Intervention.create({
    CommuneId: req.body.communeId,
    ThemeId: req.body.themeId,
    utilisateurId: req.body.utilisateurId || req.user.id,
    nomUsager: req.body.nomUsager,
    prenomUsager: req.body.prenomUsager,
    question: req.body.question,
    reponse: req.body.reponse,
    statut: req.body.statut,
    dateCreation: req.body.dateCreation,
    dateReponse: req.body.dateReponse,
    satisfaction: req.body.satisfaction
  });
  res.status(201).json(item);
};

export const update = async (req, res) => {
  const { id } = req.params;
  const item = await Intervention.findByPk(id);
  if (!item) return res.status(404).json({ message: 'Introuvable' });
  const updates = { ...req.body };
  if (req.body.communeId !== undefined) updates.CommuneId = req.body.communeId;
  if (req.body.themeId !== undefined) updates.ThemeId = req.body.themeId;
  delete updates.communeId;
  delete updates.themeId;
  await item.update(updates);
  res.json(item);
};

export const respond = async (req, res) => {
  const { id } = req.params;
  const { reponse, statut } = req.body;
  const item = await Intervention.findByPk(id);
  if (!item) return res.status(404).json({ message: 'Introuvable' });
  item.reponse = reponse;
  if (statut) item.statut = statut;
  item.dateReponse = new Date();
  await item.save();
  res.json(item);
};

export const changeStatus = async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;
  const item = await Intervention.findByPk(id);
  if (!item) return res.status(404).json({ message: 'Introuvable' });
  item.statut = statut;
  await item.save();
  res.json(item);
};
