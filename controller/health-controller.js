import db from "../dbConfig/index.js";
import logger from "../logger/logger.js";

export const healthCheck = async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json();
    logger.info({
      message: "Database connection successful",
      action: "Database Connection",
      status: "success",
    });
  } catch (error) {
    logger.error({
      message: "Database connection failed",
      action: "Database connection attempt",
      status: "failed",
      error: error,
    });
    res.status(503).json();
  }
};
