import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { sequelize, User } from "./models/index.js";
import router from "./routes/index.js";
import bcrypt from "bcryptjs";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(
  "/uploads",
  express.static(path.join(__dirname, process.env.UPLOAD_DIR || "uploads"))
);

app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/api", router);

export async function initDbAndSeed() {
  await sequelize.authenticate();
  await sequelize.sync({ force: process.env.NODE_ENV === "test" });
  const adminEmail = "admin@test.com";
  const admin = await User.findOne({ where: { email: adminEmail } });
  if (!admin) {
    const hashedPassword = await bcrypt.hash("Admin123!", 10); // hash password

    await User.create({
      nom: "Admin",
      prenom: "Super",
      email: adminEmail,
      passwordHash: hashedPassword,
      role: "admin",
    });
  }
}

export default app;
