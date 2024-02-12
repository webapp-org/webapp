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

function createDatabaseIfNotExists() {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await mysql.createPool({
        host: process.env.HOST,
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
      });
      await connection.query(
        `CREATE DATABASE IF NOT EXISTS \`${process.env.DATABASE}\`;`
      );
      await connection.end();
      resolve();
    } catch (error) {
      console.error("Error creating database:", error);
      reject(error);
    }
  });
}

function authenticateDatabase() {
  return new Promise(async (resolve, reject) => {
    try {
      await db.sequelize.authenticate();
      console.log("Connection to the database successful.");
      resolve(true);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      reject(new Error("Error in authenticate database"));
    }
  });
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

export { initializeDatabase };
