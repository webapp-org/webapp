import db from "../dbConfig/index.js";
import logger from "../logger/logger.js";

export const healthCheck = async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json();
    // success log
    // logger.info({
    //   message: "Health check successful",
    //   action: "Health Check API",
    //   status: "success",
    //   httpRequest: {
    //     method: req.method,
    //     url: req.url,
    //     userAgent: req.headers["user-agent"],
    //     ip: req.ip,
    //     status: res.statusCode,
    //   },
    // });
  } catch (error) {
    // error log
    logger.error({
      message: "Database connection failed during health check",
      action: "Health Check API attempt",
      status: "failed",
      error: error.message,
      stack: error.stack,
      httpRequest: {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        status: 503,
      },
    });
    res.status(503).json();
  }
};
