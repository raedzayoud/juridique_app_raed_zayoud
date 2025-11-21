import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import { sequelize as sequelizeInstance } from "../config/database.js";

export const sequelize = sequelizeInstance;

export const Commune = sequelize.define("Commune", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nom: { type: DataTypes.STRING, allowNull: false },
  codePostal: { type: DataTypes.STRING(10), allowNull: false },
});

export const Theme = sequelize.define("Theme", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nom: { type: DataTypes.STRING, allowNull: false },
});

export const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    prenom: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: { type: DataTypes.VIRTUAL },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("admin", "agent"), allowNull: false },
  },
  {
    defaultScope: { attributes: { exclude: ["passwordHash"] } },
    scopes: { withPassword: { attributes: {} } },
  }
);

User.beforeValidate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(user.password, salt);
  }
});

User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(user.password, salt);
  }
});

User.beforeSave(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(user.password, salt);
  }
});

User.prototype.validatePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

export const Intervention = sequelize.define("Intervention", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nomUsager: { type: DataTypes.STRING, allowNull: false },
  prenomUsager: { type: DataTypes.STRING, allowNull: false },
  question: { type: DataTypes.TEXT, allowNull: false },
  reponse: { type: DataTypes.TEXT },
  statut: {
    type: DataTypes.ENUM("en_cours", "traitee", "archivee"),
    defaultValue: "en_cours",
  },
  dateCreation: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  dateReponse: { type: DataTypes.DATE },
  satisfaction: { type: DataTypes.INTEGER, allowNull: true },
});

export const PieceJointe = sequelize.define("PieceJointe", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  url: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
});

// Associations
Commune.hasMany(Intervention, {
  foreignKey: { allowNull: false },
  onDelete: "RESTRICT",
});
Intervention.belongsTo(Commune);

Theme.hasMany(Intervention, {
  foreignKey: { allowNull: false },
  onDelete: "RESTRICT",
});
Intervention.belongsTo(Theme);

User.hasMany(Intervention, {
  foreignKey: { name: "utilisateurId", allowNull: false },
  onDelete: "RESTRICT",
});
Intervention.belongsTo(User, {
  as: "utilisateur",
  foreignKey: "utilisateurId",
});

Intervention.hasMany(PieceJointe, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});
PieceJointe.belongsTo(Intervention);
