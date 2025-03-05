import dotenv from "dotenv";
import { Sequelize, DataTypes } from "sequelize";
import config from "../config/config";
import mysql2 from 'mysql2'; 
// const { Sequelize, DataTypes } = require('sequelize');
// const {mysql2} = require('mysql2')


dotenv.config();

const isTestEnv = process.env.NODE_ENV === 'test';

const dbHost = process.env.DB_HOST || config.development.host;
const dbUser = process.env.DB_USER || config.development.username;
const dbPassword = process.env.DB_PASSWORD || config.development.password;
const dbName = process.env.DB_NAME || config.development.database;
const dbPort = process.env.DB_PORT || config.development.port;

if (!isTestEnv) {
  console.log(`Connecting to MySQL at ${dbHost}:${dbPort} as ${dbUser}`);
}

const sequelize = new Sequelize(
  dbName as string,
  dbUser as string,
  dbPassword as string,
  {
    host: dbHost,
    port: parseInt(dbPort as string, 10) || 3306,
    dialect: 'mysql',
    dialectModule: require("mysql2"),
    benchmark: true,
    dialectOptions: {
      host: dbHost,
      charset: 'utf8mb4',
      supportBigNumbers: true,
      decimalNumbers: true
    },
    logging: console.log
  }
);

const User = sequelize.define(
  'users',
  {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },  
    fname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING,
    },
    dob: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      default: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      default: DataTypes.NOW
    }
  },
)

const ProjectUsers = sequelize.define(
  'project_users',
  {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id'
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      default: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      default: DataTypes.NOW
    }
  },
)

const Projects = sequelize.define(
  'projects',
  {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      default: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      default: DataTypes.NOW
    }
  },
)

const Tasks = sequelize.define(
  'tasks',
  {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    task_json: {
      type: DataTypes.JSON,
      allowNull: true,  
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'low',
    },
    createdAt: {
      type: DataTypes.DATE,
      default: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      default: DataTypes.NOW
    }
  },
)


export async function initializeDatabase() {
  // Skip database initialization in test environment
  if (isTestEnv) {
    console.log('Test environment detected, skipping database initialization');
    return;
  }
  
  try {
    console.log('Starting database initialization...');
    
    // // First, try to connect to MySQL server and create the database if it doesn't exist
    // const tempSequelize = new Sequelize('mysql', dbUser, dbPassword, {
    //   host: dbHost,
    //   port: parseInt(dbPort as string, 10) || 3306,
    //   dialect: 'mysql',
    //   dialectModule: mysql,
    //   logging: console.log,
    //   retry: {
    //     max: 5, // Maximum retry 5 times
    //     timeout: 30000 // 30 seconds timeout between retries
    //   }
    // });

    // try {
    //   await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    //   console.log(`Database ${dbName} created or already exists`);
    // } finally {
    //   await tempSequelize.close();
    // }

    // Now connect to our database and sync models
    try {
      // Sync all models with a more cautious approach
      // await sequelize.sync({ alter: true });
      
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
      console.log('All models were synchronized successfully.');
    } catch (dbError) {
      console.error('Error syncing models:', dbError);
      throw dbError;
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Initialize the database
initializeDatabase().catch(error => {
  console.error('Failed to initialize database:', error);
});

export { sequelize };