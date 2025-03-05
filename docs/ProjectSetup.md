# Project Setup Guide

This document provides detailed information about setting up and configuring the application for development and production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Development Workflow](#development-workflow)
- [Code Structure](#code-structure)
- [Styling](#styling)
- [Testing](#testing)
- [Linting and Formatting](#linting-and-formatting)
- [Git Hooks](#git-hooks)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn v1.22.0 or higher)
- **MySQL**: v8.0 or higher
- **Git**: v2.30.0 or higher

## Installation

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

3. Set up environment variables (see [Environment Configuration](#environment-configuration))

4. Set up the database (see [Database Setup](#database-setup))

5. Start the development server:

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Configuration

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

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DB_HOST | Database host | localhost |
| DB_USER | Database username | root |
| DB_PASSWORD | Database password | |
| DB_NAME | Database name | project_management |
| DB_PORT | Database port | 3306 |
| JWT_SECRET | Secret key for JWT token generation | |
| FILESTACK_API_KEY | API key for Filestack file uploads | |

## Database Setup

1. Create a MySQL database:

```sql
CREATE DATABASE project_management;
```

2. The application uses Sequelize ORM, which will automatically create the tables when the application starts.

3. If you want to manually run migrations:

```bash
npx sequelize-cli db:migrate
```

## Development Workflow

### Starting the Development Server

```bash
npm run dev
# or
yarn dev
```

This will start the Next.js development server on [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
npm run build
# or
yarn build
```

### Starting the Production Server

```bash
npm run start
# or
yarn start
```

### Running Tests

```bash
# Run all tests
npm test
# or
yarn test

# Run backend tests
npm run test:backend
# or
yarn test:backend

# Run frontend tests
npm run test:frontend
# or
yarn test:frontend
```

## Code Structure

The application follows a modular structure:

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
```

### Key Directories and Files

- **app/**: Contains the Next.js App Router pages
- **components/**: Contains reusable React components
- **context/**: Contains React Context providers
- **db/**: Contains database configuration and models
- **services/**: Contains service layer for API calls
- **utils/**: Contains utility functions
- **types/**: Contains TypeScript type definitions
- **public/**: Contains static assets

## Styling

The application uses Tailwind CSS for styling:

### Tailwind CSS Configuration

The Tailwind CSS configuration is in `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors
      },
      fontFamily: {
        // Custom fonts
      },
      // Other theme extensions
    },
  },
  plugins: [],
};

export default config;
```

### Global Styles

Global styles are defined in `app/globals.css`.

## Testing

The application uses Jest and React Testing Library for testing:

### Jest Configuration

The Jest configuration is in `jest.config.ts`:

```typescript
import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest',
  // Other Jest configuration
};

export default createJestConfig(config);
```

### Backend Tests

Backend tests are configured in `jest.config.backend.ts`:

```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.backend.ts'],
  testMatch: ['**/__tests__/backend/**/*.test.ts'],
  // Other Jest configuration for backend tests
};

export default config;
```

### Frontend Tests

Frontend tests are configured in `jest.config.frontend.ts`:

```typescript
import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.frontend.ts'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/__tests__/frontend/**/*.test.{ts,tsx}'],
  // Other Jest configuration for frontend tests
};

export default createJestConfig(config);
```

### Running Tests

```bash
# Run all tests
npm test

# Run backend tests
npm run test:backend

# Run frontend tests
npm run test:frontend
```

## Linting and Formatting

The application uses ESLint for linting:

### ESLint Configuration

The ESLint configuration is in `eslint.config.mjs`:

```javascript
import { defineConfig } from '@eslint/eslintrc';
import hub from '@mindfiredigital/eslint-plugin-hub';

export default defineConfig({
  extends: [
    'next/core-web-vitals',
    'plugin:@mindfiredigital/hub/recommended'
  ],
  plugins: ['@mindfiredigital/hub'],
  rules: {
    // Custom ESLint rules
  }
});
```

### Running Linting

```bash
npm run lint
# or
yarn lint
```

## Git Hooks

The application uses Husky for Git hooks:

### Husky Configuration

The Husky configuration is in `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
```

## Troubleshooting

### Common Issues

#### Database Connection Issues

If you encounter database connection issues:

1. Check that MySQL is running:
   ```bash
   sudo service mysql status
   ```

2. Verify your database credentials in the `.env` file.

3. Ensure the database exists:
   ```bash
   mysql -u root -p -e "SHOW DATABASES;"
   ```

#### Next.js Build Errors

If you encounter build errors:

1. Clear the Next.js cache:
   ```bash
   rm -rf .next
   ```

2. Reinstall dependencies:
   ```bash
   rm -rf node_modules
   npm install
   ```

#### JWT Authentication Issues

If you encounter JWT authentication issues:

1. Check that the `JWT_SECRET` is set in your `.env` file.

2. Verify that the JWT token is being sent correctly in the Authorization header.

3. Check that the JWT token hasn't expired.

### Getting Help

If you encounter issues not covered in this guide, please:

1. Check the existing issues in the repository.
2. Create a new issue with a detailed description of the problem.
3. Include relevant error messages and steps to reproduce the issue.
