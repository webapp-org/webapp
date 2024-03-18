import db from "../dbConfig/index.js";
import logger from "../logger/logger.js";

export const healthCheck = async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json();
    logger.info({
      message: "Health check successful",
      action: "Health Check API",
      status: "success",
    });
    logger.warn({
      message: "Sample warning log",
      action: "Health Check API",
      status: "success",
    });
    logger.debug({
      message: "Sample debug log",
      action: "Health Check API",
      status: "success",
    });
  } catch (error) {
    logger.error({
      message: "Database connection failed during health check",
      action: "Health Check API attempt",
      status: "failed",
      error: error,
    });
    res.status(503).json();
  }
};
