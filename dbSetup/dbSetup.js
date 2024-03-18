import mysql from "mysql2/promise";
import db from "../dbConfig/index.js";
import User from "../models/User.js";
import logger from "../logger/logger.js";

async function initializeDatabase() {
  try {
    await createDatabaseIfNotExists();
    const databaseAuthenticated = await authenticateDatabase();
    if (databaseAuthenticated) {
      const models = [User];
      await syncModels(models);
      return true;
    } else {
      throw new Error("Database authentication failed.");
    }
  } catch (error) {
    logger.error({
      message: "Error initializing database",
      action: "Database Initialization",
      status: "failed",
      error: error.message,
    });
    throw error;
  }
}

async function createDatabaseIfNotExists() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
    });
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DATABASE}\`;`
    );
    await connection.end();
  } catch (error) {
    logger.error({
      message: "Error creating database",
      action: "Database Creation",
      status: "failed",
      error: error.message,
    });
  }
}

async function authenticateDatabase() {
  try {
    await db.sequelize.authenticate();
    return true;
  } catch (error) {
    logger.error({
      message: "Unable to connect to the database",
      action: "Database Connection",
      status: "failed",
      error: error.message,
    });
    throw new Error("Error in authenticate database");
  }
}

async function syncModels(models = []) {
  try {
    for (const model of models) {
      await model.sync({ alter: true });
    }
  } catch (error) {
    logger.error({
      message: "Error synchronizing models",
      action: "Model Synchronization",
      status: "failed",
      error: error.message,
    });
    throw error;
  }
}

export default initializeDatabase;
