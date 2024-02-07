import express from "express";
import registerRouter from "./routes/index.js";
import morgan from "morgan";
import db from "./dbConfig/index.js";
import User from "./models/User.js";

const app = express();

// allow json as input for the server
app.use(express.json());
app.use(morgan("dev"));

//Initialize routes
registerRouter(app);

db.createDatabaseIfNotExists();

try {
  const databaseAuthenticated = await db.authenticateDatabase();
  if (databaseAuthenticated) {
    const models = [User];
    // sync db
    const modelsSynced = await db.syncModels(models);
    if (modelsSynced) {
      // start the server
      const port = process.env.PORT || 4000;
      app.listen(port, () => {
        console.log(`Server running successfully on port ${port}`);
      });
    } else {
      console.error("Model synchronization failed.");
    }
  } else {
    console.error("Database authentication failed.");
  }
} catch (error) {
  console.log(error);
}
