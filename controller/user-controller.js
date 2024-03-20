import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import logger from "../logger/logger.js";

// Function to check valid email
function isValidEmail(username) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(username);
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
      logger.warn({
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
      return res.status(400).json();
    }

    // warning if account_created or account_updated are passed in the payload
    if (account_created || account_updated) {
      logger.warn({
        message: "Attempt to update read-only fields",
        action: "User registration/update attempt",
        status: "warning",
        fields: ["account_created", "account_updated"].filter(
          (field) => req.body[field] !== undefined
        ),
        userEmail: username,
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = await User.create({
      first_name,
      last_name,
      username,
      password: hashedPassword,
    });
    const { password: pass, ...user } = newUser.dataValues;

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
    res.status(500).json();
  }
};

export const updateUser = async (req, res) => {
  try {
    const username = req.user.username;
    const { first_name, last_name, password, ...invalidFields } = req.body;
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
