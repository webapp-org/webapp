import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import logger from "../logger/logger.js";
import { PubSub } from "@google-cloud/pubsub";
import { v4 as uuidv4 } from "uuid";

const pubSubClient = new PubSub();

// Function to check valid email
function isValidEmail(username) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(username);
}

async function publishVerificationMessage(email, verificationLink, req) {
  const messageData = JSON.stringify({ email, verificationLink });
  try {
    await pubSubClient
      .topic(process.env.PUBSUB_TOPIC_NAME)
      .publish(Buffer.from(messageData));
    // await pubSubClient.topic("my-topic").publish(Buffer.from(messageData));
    logger.debug({
      message: "Verification message successfully published to Pub/Sub.",
      action: "Publish verification message",
      status: "success",
      userEmail: email,
      httpRequest: {
        requestMethod: req.method,
        path: req.originalUrl,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });
  } catch (error) {
    console.error(error.message);
    logger.error({
      message: "Failed to publish verification message to Pub/Sub",
      error: error.message,
      action: "Publishing to Pub/Sub",
      status: "failed",
      userEmail: email,
      httpRequest: {
        requestMethod: req.method,
        path: req.originalUrl,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });
  }
}

export const saveUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      username,
      password,
      account_created,
      account_updated,
      ...invalidFields
    } = req.body;

    // if Invalid fields are passed
    if (Object.keys(invalidFields).length > 0) {
      logger.error({
        message: "Invalid fields in request payload",
        action: "User registration attempt",
        status: "failed",
        invalidFields: Object.keys(invalidFields),
        httpRequest: {
          requestMethod: req.method,
          path: req.originalUrl,
          status: 400,
          ip: req.ip,
          userAgent: req.headers["user-agent"],
        },
      });
      return res.status(400).send();
    }

    // if empty fields are passed
    if (!first_name || !last_name || !username || !password) {
      logger.error({
        message: "Missing required fields in request payload",
        action: "User registration attempt",
        status: "failed",
        missingFields: [
          !first_name ? "first_name" : null,
          !last_name ? "last_name" : null,
          !username ? "username" : null,
          !password ? "password" : null,
        ].filter(Boolean),
        httpRequest: {
          requestMethod: req.method,
          path: req.originalUrl,
          status: 400,
          ip: req.ip,
          userAgent: req.headers["user-agent"],
        },
      });
      return res.status(400).json();
    }
    // if invalid email is passed
    if (!isValidEmail(username)) {
      logger.error({
        message: "Invalid email address",
        action: "User registration attempt",
        status: "failed",
        userEmail: username,
        error: "Invalid email address",
        httpRequest: {
          requestMethod: req.method,
          path: req.originalUrl,
          status: 400,
          ip: req.ip,
          userAgent: req.headers["user-agent"],
        },
      });
      return res.status(400).json();
    }
    // if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      logger.error({
        message: "User account already exists",
        action: "User registration attempt",
        status: "failed",
        userEmail: username,
        error: "User account already exists",
        httpRequest: {
          requestMethod: req.method,
          path: req.originalUrl,
          status: 400,
          ip: req.ip,
          userAgent: req.headers["user-agent"],
        },
      });
      console.error("User account already exists");
      return res.status(400).json();
    }

    // warning if account_created or account_updated are passed in the payload
    if (account_created || account_updated) {
      logger.warn({
        message: "Attempt to update read-only fields",
        action: "User registration attempt",
        status: "warning",
        fields: ["account_created", "account_updated"].filter(
          (field) => req.body[field] !== undefined
        ),
        userEmail: username,
        httpRequest: {
          requestMethod: req.method,
          path: req.originalUrl,
          status: 200,
          ip: req.ip,
          userAgent: req.headers["user-agent"],
        },
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    // Generate a UUID for the verification token
    const verificationToken = uuidv4();
    // const verificationTokenExpires = new Date(Date.now() + 120000);

    const newUser = await User.create({
      first_name,
      last_name,
      username,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      // verificationTokenExpires,
    });

    const {
      password: pass,
      isVerified: isVerified,
      verificationToken: token,
      // verificationTokenExpires: tokenExpirationDate,
      ...user
    } = newUser.dataValues;

    logger.debug({
      message: "User created successfully",
      user: newUser,
      action: "User registration",
      status: "success",
      httpRequest: {
        requestMethod: req.method,
        path: req.originalUrl,
        status: 201,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });

    // Construct verification link with JWT
    const domainName = process.env.DOMAIN_NAME;
    const port = process.env.PORT;

    const verificationLink = `http://${domainName}:${port}/v1/user/verify/${verificationToken}`;
    // console.log(verificationLink);

    // publish verification message on prod
    if (process.env.ENV === "prod") {
      await publishVerificationMessage(username, verificationLink, req);
    }

    res.status(201).json(user);
  } catch (error) {
    logger.error({
      message: "Internal server error",
      action: "User creation",
      status: "failed",
      error: error.message,
      stack: error.stack,
      httpRequest: {
        requestMethod: req.method,
        path: req.originalUrl,
        status: 500,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });
    console.error(error.message);
    res.status(500).json();
  }
};

export const updateUser = async (req, res) => {
  try {
    const username = req.user.username;
    const {
      first_name,
      last_name,
      password,
      account_created,
      account_updated,
      ...invalidFields
    } = req.body;
    if (Object.keys(invalidFields).length > 0) {
      logger.error({
        message: "Invalid fields in request payload",
        action: "User update attempt",
        status: "failed",
        invalidFields: Object.keys(invalidFields),
        httpRequest: {
          requestMethod: req.method,
          path: req.originalUrl,
          status: 400,
          ip: req.ip,
          userAgent: req.headers["user-agent"],
        },
      });
      return res.status(400).send();
    }
    const user = await User.findOne({ where: { username } });
    if (!user) {
      logger.error({
        message: "User does not exist",
        action: "User update attempt",
        status: "failed",
        userEmail: username,
        error: "User does not exist",
        httpRequest: {
          requestMethod: req.method,
          path: req.originalUrl,
          status: 404,
          ip: req.ip,
          userAgent: req.headers["user-agent"],
        },
      });
      return res.status(404).json();
    }
    if (first_name) {
      user.first_name = first_name;
    }
    if (last_name) {
      user.last_name = last_name;
    }
    if (password) {
      const hashedPassword = await bcryptjs.hash(password, 10);
      user.password = hashedPassword;
    }

    // warning if account_created or account_updated are passed in the payload
    if (account_created || account_updated) {
      logger.warn({
        message: "Attempt to update read-only fields",
        action: "User registration attempt",
        status: "warning",
        fields: ["account_created", "account_updated"].filter(
          (field) => req.body[field] !== undefined
        ),
        userEmail: username,
        httpRequest: {
          requestMethod: req.method,
          path: req.originalUrl,
          status: 200,
          ip: req.ip,
          userAgent: req.headers["user-agent"],
        },
      });
    }
    await user.save();

    logger.debug({
      message: "User updated successfully",
      user: user,
      action: "User update",
      status: "success",
      httpRequest: {
        requestMethod: req.method,
        path: req.originalUrl,
        status: 204,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });

    res.status(204).json();
  } catch (error) {
    logger.error({
      message: "Internal server error",
      action: "User update",
      status: "failed",
      error: error.message,
      stack: error.stack,
      httpRequest: {
        requestMethod: req.method,
        path: req.originalUrl,
        status: 500,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });
    res.status(500).json();
  }
};

export const getUser = async (req, res) => {
  try {
    const {
      id,
      first_name,
      last_name,
      username,
      account_created,
      account_updated,
    } = req.user;

    const userResponse = {
      id,
      first_name,
      last_name,
      username,
      account_created,
      account_updated,
    };

    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json();
  }
};

export const deleteUser = async (req, res) => {
  console.log("in delete usser");
  try {
    const { username } = req.params; // Assuming username is passed as a URL parameter

    // Check if the user exists
    const user = await User.findOne({ where: { username } });
    if (!user) {
      logger.error({
        message: "User not found",
        action: "Delete user attempt",
        status: "failed",
        userEmail: username,
        httpRequest: {
          requestMethod: req.method,
          path: req.originalUrl,
          status: 404,
          ip: req.ip,
          userAgent: req.headers["user-agent"],
        },
      });
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the user
    await User.destroy({ where: { username } });

    logger.info({
      message: "User deleted successfully",
      action: "Delete user",
      userEmail: username,
      httpRequest: {
        requestMethod: req.method,
        path: req.originalUrl,
        status: 200,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error({
      message: "Internal server error",
      action: "Delete user",
      status: "failed",
      error: error.message,
      httpRequest: {
        requestMethod: req.method,
        path: req.originalUrl,
        status: 500,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });
    res.status(500).json({ error: "Internal server error" });
  }
};
