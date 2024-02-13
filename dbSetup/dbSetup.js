import mysql from "mysql2/promise";
import db from "../dbConfig/index.js";
import User from "../models/User.js";

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
    console.error("Error initializing database:", error);
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
    console.error("Error creating database:", error);
  }
}

async function authenticateDatabase() {
  try {
    await db.sequelize.authenticate();
    console.log("Connection to the database successful.");
    return true;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw new Error("Error in authenticate database");
  }
}

async function syncModels(models = []) {
  try {
    for (const model of models) {
      await model.sync({ alter: true });
    }
  } catch (error) {
    console.error("Error synchronizing models:", error);
    throw error;
  }
}

export default initializeDatabase;
