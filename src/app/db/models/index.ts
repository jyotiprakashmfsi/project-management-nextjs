import dotenv from "dotenv";
import { Sequelize, DataTypes } from "sequelize";
import config from "../config/config";
import mysql2 from 'mysql2'; 


dotenv.config();

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: 'mysql',
    dialectModule: mysql2,
    benchmark: true
  }
);

await sequelize.sync({ alter: true });
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

export default sequelize;