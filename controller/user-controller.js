import User from "../models/User.js";
import bcrypt from "bcrypt";

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
    console.log("here");

    // if unwanted fields are passed
    if (Object.keys(unwantedFields).length > 0) {
      return res.status(400).send();
    }

    // if empty fields are passed
    if (!first_name || !last_name || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // if invalid email is passed
    if (!isValidEmail(username)) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    // if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "User account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      first_name,
      last_name,
      username,
      password: hashedPassword,
    });
    console.log("newUser", newUser);
    const { password: pass, ...user } = newUser.dataValues;
    res.status(201).json(user);
  } catch (error) {
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
      return res.status(404).json({ message: "User not found" });
    }
    if (first_name) {
      user.first_name = first_name;
    }
    if (last_name) {
      user.last_name = last_name;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    await user.save();
    res.status(204).json({ message: "User account updated successfully" });
  } catch (error) {
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
