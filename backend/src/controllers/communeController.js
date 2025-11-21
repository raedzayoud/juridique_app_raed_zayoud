import { validationResult } from 'express-validator';
import { Commune, Intervention } from '../models/index.js';

export const list = async (req, res) => res.json(await Commune.findAll());

export const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const item = await Commune.create(req.body);
  res.status(201).json(item);
};

export const update = async (req, res) => {
  const { id } = req.params;
  const item = await Commune.findByPk(id);
  if (!item) return res.status(404).json({ message: 'Introuvable' });
  await item.update(req.body);
  res.json(item);
};

export const remove = async (req, res) => {
  const { id } = req.params;
  const item = await Commune.findByPk(id);
  if (!item) return res.status(404).json({ message: 'Introuvable' });
  // Prevent deleting a commune that is referenced by interventions
  const refs = await Intervention.count({ where: { CommuneId: id } });
  if (refs > 0) {
    return res.status(409).json({
      message: "Impossible de supprimer: la commune est utilisée par des interventions",
      references: refs,
    });
  }
  await item.destroy();
  res.status(204).send();
};
