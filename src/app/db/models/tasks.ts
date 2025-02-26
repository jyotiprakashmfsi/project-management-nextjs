import sequelize from ".";
const { Sequelize, DataTypes } = require("sequelize");

export const Tasks = sequelize.define(
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
      },
      updatedAt: {
        type: DataTypes.DATE,
      }
    },
  );