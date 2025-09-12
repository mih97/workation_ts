import app from "./app";
import { AppDataSource } from "./config/data-source";
import { env } from "./config/env";

(async (): Promise<void> => {
  await AppDataSource.initialize();
  // run pending migrations on boot in dev
  if (env.NODE_ENV !== "production") {
    await AppDataSource.runMigrations();
  }
  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
})();