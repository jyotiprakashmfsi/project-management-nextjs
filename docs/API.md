# API Documentation

This document provides detailed information about the API endpoints available in the application.

## Table of Contents

- [Authentication](#authentication)
  - [Signup](#signup)
  - [Login](#login)
- [Projects](#projects)
  - [Create Project](#create-project)
  - [Get Projects](#get-projects)
  - [Get Project by ID](#get-project-by-id)
  - [Update Project](#update-project)
  - [Delete Project](#delete-project)
- [Tasks](#tasks)
  - [Create Task](#create-task)
  - [Get Tasks](#get-tasks)
  - [Get Task by ID](#get-task-by-id)
  - [Update Task](#update-task)
  - [Delete Task](#delete-task)
- [Project Users](#project-users)
  - [Add User to Project](#add-user-to-project)
  - [Get Project Users](#get-project-users)
  - [Update User Role](#update-user-role)
  - [Remove User from Project](#remove-user-from-project)
- [Users](#users)
  - [Get User Profile](#get-user-profile)
  - [Update User Profile](#update-user-profile)
- [Error Handling](#error-handling)

## Authentication

### Signup

Creates a new user account.

- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "fname": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "contact": "1234567890",
    "dob": "1990-01-01"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "message": "User created successfully"
  }
  ```
- **Error Response**: `400 Bad Request`, `409 Conflict`, `500 Internal Server Error`

### Login

Authenticates a user and returns a JWT token.

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "fname": "John Doe",
      "email": "john@example.com"
    }
  }
  ```
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

## Projects

### Create Project

Creates a new project.

- **URL**: `/api/projects`
- **Method**: `POST`
- **Authentication**: Required (JWT Token)
- **Request Body**:
  ```json
  {
    "name": "Project Name",
    "description": "Project Description",
    "status": "active"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "project": {
      "id": 1,
      "name": "Project Name",
      "description": "Project Description",
      "status": "active",
      "created_by": 1
    }
  }
  ```
- **Error Response**: `400 Bad Request`, `401 Unauthorized`, `500 Internal Server Error`

### Get Projects

Retrieves all projects for the authenticated user.

- **URL**: `/api/projects`
- **Method**: `GET`
- **Authentication**: Required (JWT Token)
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "projects": [
      {
        "id": 1,
        "name": "Project Name",
        "description": "Project Description",
        "status": "active",
        "created_by": 1
      }
    ],
    "total": 1
  }
  ```
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

### Get Project by ID

Retrieves a specific project by ID.

- **URL**: `/api/projects/{id}`
- **Method**: `GET`
- **Authentication**: Required (JWT Token)
- **URL Parameters**: `id=[integer]` (Project ID)
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "project": {
      "id": 1,
      "name": "Project Name",
      "description": "Project Description",
      "status": "active",
      "created_by": 1
    }
  }
  ```
- **Error Response**: `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`

### Update Project

Updates an existing project.

- **URL**: `/api/projects/{id}`
- **Method**: `PUT`
- **Authentication**: Required (JWT Token)
- **URL Parameters**: `id=[integer]` (Project ID)
- **Request Body**:
  ```json
  {
    "name": "Updated Project Name",
    "description": "Updated Project Description",
    "status": "completed"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "project": {
      "id": 1,
      "name": "Updated Project Name",
      "description": "Updated Project Description",
      "status": "completed",
      "created_by": 1
    }
  }
  ```
- **Error Response**: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

### Delete Project

Deletes a project.

- **URL**: `/api/projects/{id}`
- **Method**: `DELETE`
- **Authentication**: Required (JWT Token)
- **URL Parameters**: `id=[integer]` (Project ID)
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Project deleted successfully"
  }
  ```
- **Error Response**: `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

## Tasks

### Create Task

Creates a new task for a project.

- **URL**: `/api/tasks`
- **Method**: `POST`
- **Authentication**: Required (JWT Token)
- **Request Body**:
  ```json
  {
    "project_id": 1,
    "title": "Task Title",
    "description": "Task Description",
    "status": "pending",
    "end_time": "2025-04-01T00:00:00.000Z",
    "assigned_to": 2
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "task": {
      "id": 1,
      "project_id": 1,
      "title": "Task Title",
      "description": "Task Description",
      "status": "pending",
      "end_time": "2025-04-01T00:00:00.000Z",
      "assigned_to": 2
    }
  }
  ```
- **Error Response**: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `500 Internal Server Error`

### Get Tasks

Retrieves all tasks for a project.

- **URL**: `/api/tasks?project_id={project_id}`
- **Method**: `GET`
- **Authentication**: Required (JWT Token)
- **Query Parameters**: `project_id=[integer]` (Project ID)
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "tasks": [
      {
        "id": 1,
        "project_id": 1,
        "title": "Task Title",
        "description": "Task Description",
        "status": "pending",
        "end_time": "2025-04-01T00:00:00.000Z",
        "assigned_to": 2
      }
    ],
    "total": 1
  }
  ```
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

### Get Task by ID

Retrieves a specific task by ID.

- **URL**: `/api/tasks/{id}`
- **Method**: `GET`
- **Authentication**: Required (JWT Token)
- **URL Parameters**: `id=[integer]` (Task ID)
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "task": {
      "id": 1,
      "project_id": 1,
      "title": "Task Title",
      "description": "Task Description",
      "status": "pending",
      "end_time": "2025-04-01T00:00:00.000Z",
      "assigned_to": 2
    }
  }
  ```
- **Error Response**: `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`

### Update Task

Updates an existing task.

- **URL**: `/api/tasks/{id}`
- **Method**: `PUT`
- **Authentication**: Required (JWT Token)
- **URL Parameters**: `id=[integer]` (Task ID)
- **Request Body**:
  ```json
  {
    "title": "Updated Task Title",
    "description": "Updated Task Description",
    "status": "completed",
    "end_time": "2025-04-15T00:00:00.000Z",
    "assigned_to": 3
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "task": {
      "id": 1,
      "project_id": 1,
      "title": "Updated Task Title",
      "description": "Updated Task Description",
      "status": "completed",
      "end_time": "2025-04-15T00:00:00.000Z",
      "assigned_to": 3
    }
  }
  ```
- **Error Response**: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

### Delete Task

Deletes a task.

- **URL**: `/api/tasks/{id}`
- **Method**: `DELETE`
- **Authentication**: Required (JWT Token)
- **URL Parameters**: `id=[integer]` (Task ID)
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Task deleted successfully"
  }
  ```
- **Error Response**: `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

## Project Users

### Add User to Project

Adds a user to a project with a specific role.

- **URL**: `/api/project-users`
- **Method**: `POST`
- **Authentication**: Required (JWT Token)
- **Request Body**:
  ```json
  {
    "project_id": 1,
    "user_id": 2,
    "role": "member"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "projectUser": {
      "id": 1,
      "project_id": 1,
      "user_id": 2,
      "role": "member"
    }
  }
  ```
- **Error Response**: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `409 Conflict`, `500 Internal Server Error`

### Get Project Users

Retrieves all users for a project.

- **URL**: `/api/project-users?project_id={project_id}`
- **Method**: `GET`
- **Authentication**: Required (JWT Token)
- **Query Parameters**: `project_id=[integer]` (Project ID)
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "users": [
      {
        "id": 1,
        "user_id": 1,
        "project_id": 1,
        "role": "owner",
        "user": {
          "id": 1,
          "fname": "John Doe",
          "email": "john@example.com"
        }
      },
      {
        "id": 2,
        "user_id": 2,
        "project_id": 1,
        "role": "member",
        "user": {
          "id": 2,
          "fname": "Jane Smith",
          "email": "jane@example.com"
        }
      }
    ],
    "total": 2
  }
  ```
- **Error Response**: `401 Unauthorized`, `403 Forbidden`, `500 Internal Server Error`

### Update User Role

Updates a user's role in a project.

- **URL**: `/api/project-users/{id}`
- **Method**: `PUT`
- **Authentication**: Required (JWT Token)
- **URL Parameters**: `id=[integer]` (Project User ID)
- **Request Body**:
  ```json
  {
    "role": "admin"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "projectUser": {
      "id": 2,
      "project_id": 1,
      "user_id": 2,
      "role": "admin"
    }
  }
  ```
- **Error Response**: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

### Remove User from Project

Removes a user from a project.

- **URL**: `/api/project-users/{id}`
- **Method**: `DELETE`
- **Authentication**: Required (JWT Token)
- **URL Parameters**: `id=[integer]` (Project User ID)
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "User removed from project successfully"
  }
  ```
- **Error Response**: `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

## Users

### Get User Profile

Retrieves the profile of the authenticated user.

- **URL**: `/api/users/profile`
- **Method**: `GET`
- **Authentication**: Required (JWT Token)
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "fname": "John Doe",
      "email": "john@example.com",
      "contact": "1234567890",
      "dob": "1990-01-01"
    }
  }
  ```
- **Error Response**: `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`

### Update User Profile

Updates the profile of the authenticated user.

- **URL**: `/api/users/profile`
- **Method**: `PUT`
- **Authentication**: Required (JWT Token)
- **Request Body**:
  ```json
  {
    "fname": "John Smith",
    "contact": "9876543210",
    "dob": "1990-01-15"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "fname": "John Smith",
      "email": "john@example.com",
      "contact": "9876543210",
      "dob": "1990-01-15"
    }
  }
  ```
- **Error Response**: `400 Bad Request`, `401 Unauthorized`, `500 Internal Server Error`

## Error Handling

All API endpoints return standardized error responses using the error constants defined in `utils/error-constants.ts`.

Example error response:

```json
{
  "success": false,
  "message": "User not found"
}
```

For more details on error handling, see the [Error Handling Guide](./ErrorHandling.md).
