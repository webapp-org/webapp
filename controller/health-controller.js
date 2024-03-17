import db from "../dbConfig/index.js";
import logger from "../logger/logger.js";

export const healthCheck = async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json();

    logger.info("Database connection successful");
    logger.error("Sample Error");
    logger.warn("Sample Warning");
  } catch (error) {
    res.status(503).json();
  }
};
