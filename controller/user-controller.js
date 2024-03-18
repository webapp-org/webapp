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
      ...unwantedFields
    } = req.body;

    // if unwanted fields are passed
    if (Object.keys(unwantedFields).length > 0) {
      return res.status(400).send();
    }

    // if empty fields are passed
    if (!first_name || !last_name || !username || !password) {
      return res.status(400).json();
    }
    // if invalid email is passed
    if (!isValidEmail(username)) {
      logger.error({
        message: "Invalid email address",
        userEmail: username,
        action: "User registration attempt",
        status: "failed",
      });
      return res.status(400).json();
    }
    // if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      logger.error({
        message: "User account already exists",
        userEmail: username,
        action: "User registration attempt",
        status: "failed",
      });
      return res.status(400).json();
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = await User.create({
      first_name,
      last_name,
      username,
      password: hashedPassword,
    });
    const { password: pass, ...user } = newUser.dataValues;

    logger.info({
      message: "User created successfully",
      userEmail: username,
      action: "User registration",
      status: "success",
    });

    res.status(201).json(user);
  } catch (error) {
    logger.error({
      message: "Internal server error",
      action: "User creation",
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json();
  }
};

export const updateUser = async (req, res) => {
  try {
    const username = req.user.username;
    const { first_name, last_name, password, ...unwantedFields } = req.body;
    if (Object.keys(unwantedFields).length > 0) {
      return res.status(400).send();
    }
    const user = await User.findOne({ where: { username } });
    if (!user) {
      logger.error({
        message: "User not found",
        userEmail: username,
        action: "User update attempt",
        status: "failed",
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

    logger.info({
      message: "User updated successfully",
      userEmail: username,
      action: "User update",
      status: "success",
    });

    res.status(204).json();
  } catch (error) {
    logger.error({
      message: "Internal server error",
      action: "User update",
      error: error.message,
      stack: error.stack,
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
