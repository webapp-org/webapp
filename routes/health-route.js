import express from "express";
import * as healthController from "../controller/health-controller.js";

const router = express.Router();

// middleware to add response headers
router.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  next();
});

// middleware to check valid GET request
const checkGetRequest = (req, res, next) => {
  if (req.method !== "GET") {
    return res.status(405).send();
  }
  // content length of request to see if anything is passed in body
  const contentLength = req.headers["content-length"];

  // checking if the request has a payload
  if (
    Object.keys(req.query).length > 0 ||
    (req.body && Object.keys(req.body).length > 0) ||
    contentLength > 0
  ) {
    return res.status(400).send();
  }

  const authHeader = req.headers.authorization;
  if (authHeader) {
    return res.status(400).json();
  }

  next();
};

// GET end point for health
router.get("/healthz", checkGetRequest, healthController.healthCheck);

// any other request type for health end point
router.all("/healthz", (req, res) => {
  res.status(405).send();
});

// if any other end point
router.all("*", (req, res) => {
  res.status(404);
  res.send();
});

export default router;
