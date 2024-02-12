import Sequelize from "sequelize";
import dotenv from "dotenv";

// dotenv package installed to store database variables
dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USERNAME,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: "mysql",
  }
);

export default {
  sequelize,
};
