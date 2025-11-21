import path from "path";
import { PieceJointe, Intervention } from "../models/index.js";

export const add = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Fichier manquant" });
  const { interventionId } = req.body;
  const inter = await Intervention.findByPk(interventionId);
  if (!inter)
    return res.status(404).json({ message: "Intervention introuvable" });
  const base = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
  const url = `${base}/uploads/${req.file.filename}`;

  const pj = await PieceJointe.create({
    InterventionId: Number(interventionId),
    url,
    type: req.file.mimetype,
  });
  res.status(201).json(pj);
};
