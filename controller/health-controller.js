import db from "../dbConfig/index.js";
import Logger from "node-json-logger";

export const healthCheck = async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json();
    const logger = new Logger();
    logger.info("Database connection successfull");
  } catch (error) {
    res.status(503).json();
  }
};
