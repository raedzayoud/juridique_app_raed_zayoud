import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { User } from "../models/index.js";

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const user = await User.scope("withPassword").findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: "Identifiants invalides" });
  const ok = await user.validatePassword(password);
  if (!ok) return res.status(401).json({ message: "Identifiants invalides" });

  const secret = process.env.JWT_SECRET || "devsecret";
  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
    },
  });
};
