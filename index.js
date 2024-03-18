import express from "express";
import registerRouter from "./routes/index.js";
import morgan from "morgan";
import initializeDatabase from "./dbSetup/dbSetup.js";
import logger from "./logger/logger.js";

const app = express();

// allow json as input for the server
app.use(express.json());
app.use(morgan("dev"));

//Initialize routes
registerRouter(app);

const start = async () => {
  await initializeDatabase();
};
start();

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running successfully on port ${port}`);
  logger.info({
    message: `Server running successfully`,
    action: "Server Start",
    status: "success",
    port: port,
  });
});

export default app;
