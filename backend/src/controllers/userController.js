import { validationResult } from "express-validator";
import { User } from "../models/index.js";

export const list = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

export const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const { nom, prenom, email, motDePasse, role } = req.body;
  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(409).json({ message: "Email déjà utilisé" });
  const user = await User.create({
    nom,
    prenom,
    email,
    password: motDePasse,
    role,
  });
  res.status(201).json(user);
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, email, motDePasse, role } = req.body;
  const user = await User.scope("withPassword").findByPk(id);
  if (!user)
    return res.status(404).json({ message: "Utilisateur introuvable" });
  user.nom = nom ?? user.nom;
  user.prenom = prenom ?? user.prenom;
  user.email = email ?? user.email;
  if (motDePasse) user.password = motDePasse;
  user.role = role ?? user.role;
  await user.save();
  res.json(await User.findByPk(id));
};

export const remove = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (!user)
    return res.status(404).json({ message: "Utilisateur introuvable" });
  await user.destroy();
  res.status(204).send();
};
