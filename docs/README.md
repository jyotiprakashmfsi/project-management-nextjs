# Project Management Application

A comprehensive project management application built with Next.js, React, and Sequelize ORM.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Docker Deployment](#docker-deployment)
- [Testing](#testing)
- [Error Handling](#error-handling)
- [Contributing](#contributing)

## Overview

This project management application allows teams to collaborate on projects, manage tasks, and track progress. Built with Next.js 15, it features a modern UI with Tailwind CSS, a MySQL database with Sequelize ORM, and comprehensive error handling.

## Features

- **User Authentication**: Secure login and signup functionality
- **Project Management**: Create, update, and manage projects
- **Task Management**: Create, assign, and track tasks with different statuses
- **Dashboard**: Overview of projects and tasks with statistics
- **Team Collaboration**: Invite team members to projects with different roles
- **Error Handling**: Centralized error management system

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd demo-nextjs
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=3306

# JWT Secret
JWT_SECRET=your_jwt_secret

# File Upload (Filestack)
FILESTACK_API_KEY=your_filestack_api_key
```

A sample `.env` file is provided as `sample.env`.

## Project Structure

```
demo-nextjs/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes
│   ├── login/              # Login Page
│   ├── signup/             # Signup Page
│   └── workspace/          # Workspace Pages
├── components/             # React Components
│   ├── auth/               # Authentication Components
│   ├── dashboard/          # Dashboard Components
│   ├── error/              # Error Handling Components
│   ├── project/            # Project Components
│   ├── tasks/              # Task Components
│   └── ui/                 # UI Components
├── context/                # React Context Providers
├── db/                     # Database Configuration
│   ├── config/             # Database Config
│   ├── models/             # Sequelize Models
│   └── migration/          # Database Migrations
├── docs/                   # Documentation
├── public/                 # Static Assets
├── repository/             # Data Access Layer
├── services/               # Service Layer
│   ├── api-services/       # Backend Services
│   └── client-services/    # Frontend Services
├── types/                  # TypeScript Type Definitions
├── utils/                  # Utility Functions
│   ├── error-constants.ts  # Error Constants
│   └── error-utils.ts      # Error Utilities
├── .env                    # Environment Variables
├── docker-compose.yml      # Docker Compose Configuration
├── Dockerfile              # Docker Configuration
├── next.config.ts          # Next.js Configuration
├── package.json            # Dependencies
├── tailwind.config.ts      # Tailwind CSS Configuration
└── tsconfig.json           # TypeScript Configuration
```

## Documentation

For detailed documentation, see the following guides:

- [API Documentation](./API.md)
- [Authentication Guide](./Authentication.md)
- [Components Guide](./Components.md)
- [Database Schema](./Database.md)
- [Error Handling](./ErrorHandling.md)
- [Project Setup](./ProjectSetup.md)
- [Deployment Guide](./Deployment.md)

## Docker Deployment

The application can be deployed using Docker:

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## Testing

Run tests using Jest:

```bash
# Run all tests
npm test

# Run backend tests
npm run test:backend

# Run frontend tests
npm run test:frontend
```

## Error Handling

The application uses a centralized error handling system. All error messages are defined in `utils/error-constants.ts` and can be used throughout the application.

For more details, see the [Error Handling Guide](./ErrorHandling.md).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
