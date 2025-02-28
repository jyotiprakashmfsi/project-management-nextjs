import dotenv from "dotenv";
import { Sequelize, DataTypes } from "sequelize";
import config from "../config/config";
import mysql2 from 'mysql2'; 

dotenv.config();

const dbHost = process.env.DB_HOST || config.development.host;
const dbUser = process.env.DB_USER || config.development.username;
const dbPassword = process.env.DB_PASSWORD || config.development.password;
const dbName = process.env.DB_NAME || config.development.database;
const dbPort = process.env.DB_PORT || config.development.port;

console.log(`Connecting to MySQL at ${dbHost}:${dbPort} as ${dbUser}`);

// Create the Sequelize instance
export const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    host: dbHost,
    port: parseInt(dbPort as string, 10) || 3306,
    dialect: 'mysql',
    dialectModule: mysql2,
    benchmark: true,
    dialectOptions: {
      host: dbHost
    },
    logging: console.log
  }
);

export const User = sequelize.define(
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
    },
    updatedAt: {
      type: DataTypes.DATE,
    }
  },
  {
    tableName: 'users',
    timestamps: true
  }
);

export const Projects = sequelize.define(
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
    },
    updatedAt: {
      type: DataTypes.DATE,
    }
  },
  {
    tableName: 'projects',
    timestamps: true
  }
);

export const ProjectUsers = sequelize.define(
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
    },
    updatedAt: {
      type: DataTypes.DATE,
    }
  },
  {
    tableName: 'project_users',
    timestamps: true
  }
);

export const Tasks = sequelize.define(
  'tasks',
  {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
      defaultValue: 'todo',
    },
    priority: {
      type: DataTypes.STRING,
      defaultValue: 'medium',
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id'
      }
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
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
    },
    updatedAt: {
      type: DataTypes.DATE,
    }
  },
  {
    tableName: 'tasks',
    timestamps: true
  }
);

async function initializeDatabase() {
  try {
    const tempSequelize = new Sequelize('mysql', dbUser, dbPassword, {
      host: dbHost,
      port: parseInt(dbPort as string, 10) || 3306,
      dialect: 'mysql',
      dialectModule: mysql2,
      logging: console.log
    });

    try {
      await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
      console.log(`Database ${dbName} created or already exists`);
    } finally {
      await tempSequelize.close();
    }

    // Sync all models
    await sequelize.sync({ alter: true });
    
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Initialize the database
initializeDatabase().catch(error => {
  console.error('Failed to initialize database:', error);
});

export default sequelize;