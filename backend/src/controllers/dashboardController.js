import { Intervention, Theme, Commune, sequelize } from "../models/index.js";

export const stats = async (req, res) => {
  const total = await Intervention.count();
  const enCours = await Intervention.count({ where: { statut: "en_cours" } });
  const traitees = await Intervention.count({ where: { statut: "traitee" } });
  const archivees = await Intervention.count({ where: { statut: "archivee" } });

  const topThemes = await Intervention.findAll({
    attributes: ["ThemeId", [sequelize.fn("COUNT", "*"), "count"]],
    include: [{ model: Theme, attributes: ["id", "nom"] }],
    group: ["ThemeId", "Theme.id"],
    order: [[sequelize.literal("count"), "DESC"]],
    limit: 5,
  });

  const topCommunes = await Intervention.findAll({
    attributes: ["CommuneId", [sequelize.fn("COUNT", "*"), "count"]],
    include: [{ model: Commune, attributes: ["id", "nom", "codePostal"] }],
    group: ["CommuneId", "Commune.id"],
    order: [[sequelize.literal("count"), "DESC"]],
    limit: 5,
  });

  res.json({ total, enCours, traitees, archivees, topThemes, topCommunes });
};
