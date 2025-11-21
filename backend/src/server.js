import "dotenv/config";
import app, { initDbAndSeed } from "./app.js";

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await initDbAndSeed();
    app.listen(PORT, () =>
      console.log(`API running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("Startup error", err);
    process.exit(1);
  }
}

start();
