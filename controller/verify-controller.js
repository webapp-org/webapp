import User from "../models/User.js";
import logger from "../logger/logger.js";

export const verifyUser = async (req, res) => {
  // const { token } = req.params;
  const token = req.query.token;

  if (!token) {
    logger.error({
      message: "Verification attempt failed: No token provided.",
      action: "Verify User",
      status: "failed",
      httpRequest: createHttpRequestLog(req, 400),
    });
    return res.status(400).json({ error: "Verification token is missing." });
  }

  try {
    const user = await User.findOne({
      where: {
        verificationToken: token,
      },
    });

    if (!user) {
      logger.error({
        message: "Verification failed: Invalid Token.",
        action: "Verify User",
        status: "failed",
        httpRequest: createHttpRequestLog(req, 404),
      });
      console.error("User not found");
      return res.status(401).json({ error: "Invalid Token." });
    }

    if (user && user.isVerified) {
      logger.debug({
        message: `User is already verified: ${user.username}`,
        action: "Verify User",
        status: "success",
        httpRequest: createHttpRequestLog(req, 200),
      });
      return res.status(200).json({ message: "Verification successful." });
    }

    if (new Date() > new Date(user.verificationTokenExpires)) {
      logger.error({
        message: "Verification failed: Token has expired.",
        action: "Verify User",
        status: "failed",
        httpRequest: createHttpRequestLog(req, 404),
      });
      console.error("Token has expired");
      return res.status(401).json({ error: "Verification link has expired." });
    }

    user.isVerified = true;
    await user.save();

    logger.debug({
      message: `User verification successful: ${user.username}`,
      action: "Verify User",
      status: "success",
      httpRequest: createHttpRequestLog(req, 200),
    });
    return res.status(200).json({ message: "Verification successful." });
  } catch (error) {
    logger.error({
      message: "Failed to verify user.",
      error: error.message,
      action: "Verify User",
      status: "error",
      httpRequest: createHttpRequestLog(req, 500),
    });
    console.error(error);
    return res.status(500).json({ error: "Failed to verify user." });
  }
};

function createHttpRequestLog(req, statusCode) {
  return {
    requestMethod: req.method,
    path: req.originalUrl,
    status: statusCode,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  };
}
