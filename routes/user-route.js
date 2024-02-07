import express from "express";
import * as userController from "../controller/user-controller.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import db from "../dbConfig/index.js";

const router = express.Router();

// middleware to add response headers
router.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  next();
});

// middleware to check db connection
const checkDBConnection = async (req, res, next) => {
  try {
    await db.sequelize.authenticate();
    next();
  } catch (error) {
    res.status(503).send();
  }
};

// v1/user path payload and request check middleware
const validatePostUserPayload = (req, res, next) => {
  // Check if request has query parameters
  if (Object.keys(req.query).length !== 0) {
    return res.status(400).json();
  }
  // Check if the request has a body
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json();
  }

  const authHeader = req.headers.authorization;
  if (authHeader) {
    return res.status(400).json();
  }
  next();
};

// v1/user/self path payload and request check middleware
const validateAuthenticatedUserPayload = (req, res, next) => {
  // Check if request has route parameters (query parameters)
  if (Object.keys(req.query).length !== 0) {
    return res.status(400).json({
      message: "Route parameters are not allowed for this endpoint",
    });
  }

  if (req.method === "PUT") {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Payload is required",
      });
    }
  }

  // For GET requests, ensure there's no body
  const contentLength = req.headers["content-length"];
  if (
    req.method === "GET" &&
    ((req.body && Object.keys(req.body).length > 0) || contentLength > 0)
  ) {
    return res
      .status(400)
      .json({ message: "GET request should not have a payload" });
  }
  next();
};

// middleware to authenticate user
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res
      .status(401)
      .json({ message: "Authorization header is missing or invalid" });
  }

  // extract the username and password
  const encodedCredentials = authHeader.split(" ")[1];
  const decodedCredentials = Buffer.from(encodedCredentials, "base64").toString(
    "utf-8"
  );
  const [username, password] = decodedCredentials.split(":");

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json();
  }
};

// Post endpoint for user
router.post(
  "/",
  validatePostUserPayload,
  checkDBConnection,
  userController.saveUser
);
// any other end point for post path
router.all("/", (req, res) => {
  return res.status(405).send();
});

// Authenticated end points

// Get user
router.get(
  "/self",
  validateAuthenticatedUserPayload,
  checkDBConnection,
  authenticateUser,
  userController.getUser
);

// Update user
router.put(
  "/self",
  validateAuthenticatedUserPayload,
  checkDBConnection,
  authenticateUser,
  userController.updateUser
);

// any other end point for get and put path
router.all("/self", (req, res) => {
  res.status(405).send();
});

// If any other end point
router.all("*", (req, res) => {
  res.status(404);
  res.send();
});

export default router;
