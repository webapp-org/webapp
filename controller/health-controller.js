import db from "../dbConfig/index.js";

export const healthCheck = async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json();
  } catch (error) {
    res.status(503).json();
  }
};
