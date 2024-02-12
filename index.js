import express from "express";
import registerRouter from "./routes/index.js";
import morgan from "morgan";
import db from "./dbConfig/index.js";
import User from "./models/User.js";
import { initializeDatabase } from "./dbSetup/dbSetup.js";

const app = express();

// allow json as input for the server
app.use(express.json());
app.use(morgan("dev"));

//Initialize routes
registerRouter(app);

initializeDatabase()
  .then((result) => {
    if (result) {
      const port = process.env.PORT || 4000;
      app.listen(port, () => {
        console.log(`Server running successfully on port ${port}`);
      });
    }
  })
  .catch((error) => {
    console.error("Error initializing server:", error);
  });

export default app;
