# Database Schema

This document provides detailed information about the database schema used in the application.

## Table of Contents

- [Overview](#overview)
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [Tables](#tables)
  - [Users](#users)
  - [Projects](#projects)
  - [Project Users](#project-users)
  - [Tasks](#tasks)
- [Relationships](#relationships)
- [Sequelize Models](#sequelize-models)
- [Database Configuration](#database-configuration)
- [Migrations](#migrations)

## Overview

The application uses a MySQL database with Sequelize ORM. The database schema consists of four main tables:

1. **Users**: Stores user information
2. **Projects**: Stores project information
3. **Project Users**: Stores the relationship between users and projects
4. **Tasks**: Stores task information

## Entity Relationship Diagram

```
+---------------+       +----------------+       +---------------+
|    Users      |       | Project Users  |       |   Projects    |
+---------------+       +----------------+       +---------------+
| id            |<----->| user_id        |       | id            |
| fname         |       | project_id     |<----->| name          |
| email         |       | role           |       | description   |
| password      |       | createdAt      |       | status        |
| contact       |       | updatedAt      |       | created_by    |
| dob           |       +----------------+       | createdAt     |
| createdAt     |                                | updatedAt     |
| updatedAt     |                                +---------------+
+---------------+                                        ^
                                                         |
                                                         |
                                                +----------------+
                                                |     Tasks      |
                                                +----------------+
                                                | id             |
                                                | project_id     |
                                                | title          |
                                                | description    |
                                                | status         |
                                                | end_time       |
                                                | assigned_to    |
                                                | task_json      |
                                                | createdAt      |
                                                | updatedAt      |
                                                +----------------+
```

## Tables

### Users

Stores information about users.

| Column    | Type         | Constraints                   | Description                 |
|-----------|--------------|-------------------------------|-----------------------------|
| id        | INTEGER      | PRIMARY KEY, AUTO_INCREMENT   | Unique identifier           |
| fname     | STRING       | NOT NULL                      | User's full name            |
| email     | STRING       | NOT NULL, UNIQUE              | User's email address        |
| password  | STRING       | NOT NULL                      | Hashed password             |
| contact   | STRING       | NULLABLE                      | User's contact number       |
| dob       | STRING       | NULLABLE                      | User's date of birth        |
| createdAt | DATE         | NOT NULL, DEFAULT NOW()       | Record creation timestamp   |
| updatedAt | DATE         | NOT NULL, DEFAULT NOW()       | Record update timestamp     |

### Projects

Stores information about projects.

| Column      | Type         | Constraints                   | Description                 |
|-------------|--------------|-------------------------------|-----------------------------|
| id          | INTEGER      | PRIMARY KEY, AUTO_INCREMENT   | Unique identifier           |
| name        | STRING       | NOT NULL                      | Project name                |
| description | STRING       | NULLABLE                      | Project description         |
| status      | STRING       | NOT NULL, DEFAULT 'active'    | Project status              |
| created_by  | INTEGER      | NOT NULL, FOREIGN KEY         | User ID who created project |
| createdAt   | DATE         | NOT NULL, DEFAULT NOW()       | Record creation timestamp   |
| updatedAt   | DATE         | NOT NULL, DEFAULT NOW()       | Record update timestamp     |

### Project Users

Stores the relationship between users and projects, including the user's role in the project.

| Column     | Type         | Constraints                   | Description                 |
|------------|--------------|-------------------------------|-----------------------------|
| id         | INTEGER      | PRIMARY KEY, AUTO_INCREMENT   | Unique identifier           |
| user_id    | INTEGER      | NOT NULL, FOREIGN KEY         | Reference to Users table    |
| project_id | INTEGER      | NOT NULL, FOREIGN KEY         | Reference to Projects table |
| role       | STRING       | NOT NULL                      | User's role in the project  |
| createdAt  | DATE         | NOT NULL, DEFAULT NOW()       | Record creation timestamp   |
| updatedAt  | DATE         | NOT NULL, DEFAULT NOW()       | Record update timestamp     |

### Tasks

Stores information about tasks within projects.

| Column      | Type         | Constraints                   | Description                 |
|-------------|--------------|-------------------------------|-----------------------------|
| id          | INTEGER      | PRIMARY KEY, AUTO_INCREMENT   | Unique identifier           |
| project_id  | INTEGER      | NOT NULL, FOREIGN KEY         | Reference to Projects table |
| title       | STRING       | NOT NULL                      | Task title                  |
| description | STRING       | NULLABLE                      | Task description            |
| status      | STRING       | NOT NULL, DEFAULT 'pending'   | Task status                 |
| end_time    | DATE         | NULLABLE                      | Task deadline               |
| assigned_to | INTEGER      | NOT NULL, FOREIGN KEY         | Reference to Users table    |
| task_json   | TEXT         | NULLABLE                      | Additional task data as JSON|
| createdAt   | DATE         | NOT NULL, DEFAULT NOW()       | Record creation timestamp   |
| updatedAt   | DATE         | NOT NULL, DEFAULT NOW()       | Record update timestamp     |

## Relationships

- **Users to Projects**: One-to-Many (One user can create many projects)
- **Users to Project Users**: One-to-Many (One user can be in many projects)
- **Projects to Project Users**: One-to-Many (One project can have many users)
- **Projects to Tasks**: One-to-Many (One project can have many tasks)
- **Users to Tasks**: One-to-Many (One user can be assigned many tasks)

## Sequelize Models

The database schema is defined using Sequelize models in the `db/models/index.ts` file.

### User Model

```typescript
const User = sequelize.define(
  'users',
  {
    id: {
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
);
```

### Project Model

```typescript
const Projects = sequelize.define(
  'projects',
  {
    id: {
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
);
```

### Project User Model

```typescript
const ProjectUsers = sequelize.define(
  'project_users',
  {
    id: {
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
);
```

### Task Model

```typescript
const Tasks = sequelize.define(
  'tasks',
  {
    id: {
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
      type: DataTypes.TEXT,
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
);
```

## Database Configuration

The database configuration is stored in `db/config/config.ts`:

```typescript
export default {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'project_management',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql'
  },
  test: {
    username: 'root',
    password: '',
    database: 'project_management_test',
    host: 'localhost',
    dialect: 'sqlite',
    storage: ':memory:'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql'
  }
};
```

## Migrations

Database migrations are managed using Sequelize CLI. The migrations are stored in the `db/migration` directory.

To run migrations:

```bash
npx sequelize-cli db:migrate
```

To create a new migration:

```bash
npx sequelize-cli migration:generate --name add-new-column
```

To undo the most recent migration:

```bash
npx sequelize-cli db:migrate:undo
```
