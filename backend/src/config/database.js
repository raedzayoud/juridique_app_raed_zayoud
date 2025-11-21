import { Sequelize } from "sequelize";

let sequelize;
if (process.env.NODE_ENV === "test") {
  sequelize = new Sequelize("sqlite::memory:", {
    dialect: "sqlite",
    logging: false,
  });
} else {
  sequelize = new Sequelize("juridique_db", "root", "", {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    define: { underscored: false },
  });
}

export { sequelize };
