import User from "../models/User.js";
import logger from "../logger/logger.js";

export const verifyUser = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    logger.error({
      message: "Verification attempt failed: No token provided.",
      action: "Verify User",
      status: "failed",
      httpRequest: createHttpRequestLog(req, 400),
    });
    return res.status(400).send("Verification token is missing.");
  }

  try {
    const user = await User.findOne({
      where: {
        verificationToken: token,
      },
    });

    if (user.isVerified) {
      logger.debug({
        message: `User is already verified: ${user.username}`,
        action: "Verify User",
        status: "success",
        httpRequest: createHttpRequestLog(req, 200),
      });
      return res.status(200).send("Verification successfull");
    }

    if (new Date() > new Date(user.verificationTokenExpires)) {
      logger.error({
        message: "Verification failed: Token has expired.",
        action: "Verify User",
        status: "failed",
        httpRequest: createHttpRequestLog(req, 404),
      });
      console.error("Token has expired");
      return res.status(401).send("Verification link has expired.");
    }

    if (!user) {
      logger.error({
        message: "Verification failed: User not found.",
        action: "Verify User",
        status: "failed",
        httpRequest: createHttpRequestLog(req, 404),
      });
      console.error("User not found");
      return res.status(404).send();
    }

    user.isVerified = true;
    await user.save();

    logger.debug({
      message: `User verification successful: ${user.username}`,
      action: "Verify User",
      status: "success",
      httpRequest: createHttpRequestLog(req, 200),
    });
    return res.status(200).send("Verification successfull");
  } catch (error) {
    logger.error({
      message: "Failed to verify user.",
      error: error.message,
      action: "Verify User",
      status: "error",
      httpRequest: createHttpRequestLog(req, 500),
    });
    console.error(error);
    return res.status(500).send("Failed to verify user.");
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
