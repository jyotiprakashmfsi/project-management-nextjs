# Deployment Guide

This document provides detailed information about deploying the application to various environments.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
  - [Docker Compose](#docker-compose)
  - [Docker Configuration](#docker-configuration)
- [Manual Deployment](#manual-deployment)
  - [Building the Application](#building-the-application)
  - [Starting the Production Server](#starting-the-production-server)
- [Cloud Deployment](#cloud-deployment)
  - [Vercel](#vercel)
  - [AWS](#aws)
  - [Google Cloud Platform](#google-cloud-platform)
- [Continuous Integration/Continuous Deployment (CI/CD)](#continuous-integrationcontinuous-deployment-cicd)
- [Database Migration in Production](#database-migration-in-production)
- [Monitoring and Logging](#monitoring-and-logging)
- [Scaling](#scaling)
- [Troubleshooting](#troubleshooting)

## Overview

The application can be deployed using Docker or manually to a server. This guide covers both approaches, as well as deployment to cloud platforms like Vercel, AWS, and Google Cloud Platform.

## Prerequisites

Before deploying the application, ensure you have the following:

- Node.js v18.0.0 or higher
- MySQL v8.0 or higher
- Docker and Docker Compose (for Docker deployment)
- Access to a cloud platform (for cloud deployment)

## Environment Variables

The application requires the following environment variables in production:

```
# Database Configuration
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=3306

# JWT Secret
JWT_SECRET=your_jwt_secret

# File Upload (Filestack)
FILESTACK_API_KEY=your_filestack_api_key

# Server Configuration
NODE_ENV=production
PORT=3000
```

## Docker Deployment

### Docker Compose

The application includes a `docker-compose.yml` file for easy deployment:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - DB_PORT=3306
      - JWT_SECRET=${JWT_SECRET}
      - FILESTACK_API_KEY=${FILESTACK_API_KEY}
    depends_on:
      - db
    restart: always

  db:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
      - MYSQL_DATABASE=${DB_NAME}
      - MYSQL_USER=${DB_USER}
      - MYSQL_PASSWORD=${DB_PASSWORD}
    volumes:
      - mysql-data:/var/lib/mysql
    restart: always

volumes:
  mysql-data:
```

To deploy using Docker Compose:

1. Create a `.env` file with the required environment variables.

2. Build and start the containers:

```bash
docker-compose up -d
```

3. Access the application at [http://localhost:3000](http://localhost:3000).

### Docker Configuration

The application includes a `Dockerfile` for building the Docker image:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Run the application
CMD ["npm", "start"]
```

To build and run the Docker image manually:

1. Build the Docker image:

```bash
docker build -t demo-nextjs .
```

2. Run the Docker container:

```bash
docker run -p 3000:3000 --env-file .env demo-nextjs
```

## Manual Deployment

### Building the Application

1. Install dependencies:

```bash
npm install
```

2. Build the application:

```bash
npm run build
```

3. Set up environment variables.

### Starting the Production Server

1. Start the production server:

```bash
npm start
```

2. The application will be available at [http://localhost:3000](http://localhost:3000).

## Cloud Deployment

### Vercel

Vercel is the recommended platform for deploying Next.js applications:

1. Install the Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy the application:

```bash
vercel
```

3. For production deployment:

```bash
vercel --prod
```

4. Configure environment variables in the Vercel dashboard.

### AWS

To deploy to AWS Elastic Beanstalk:

1. Install the AWS CLI and EB CLI:

```bash
pip install awscli
pip install awsebcli
```

2. Initialize EB CLI:

```bash
eb init
```

3. Create an environment:

```bash
eb create
```

4. Deploy the application:

```bash
eb deploy
```

5. Configure environment variables in the EB Console.

### Google Cloud Platform

To deploy to Google Cloud Run:

1. Install the Google Cloud SDK:

```bash
# Follow instructions at https://cloud.google.com/sdk/docs/install
```

2. Build and push the Docker image to Google Container Registry:

```bash
gcloud builds submit --tag gcr.io/your-project-id/demo-nextjs
```

3. Deploy to Cloud Run:

```bash
gcloud run deploy demo-nextjs --image gcr.io/your-project-id/demo-nextjs --platform managed
```

4. Configure environment variables in the Cloud Run Console.

## Continuous Integration/Continuous Deployment (CI/CD)

### GitHub Actions

You can set up CI/CD using GitHub Actions by creating a `.github/workflows/main.yml` file:

```yaml
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Database Migration in Production

To run database migrations in production:

1. SSH into the production server or connect to the production database.

2. Run the migration command:

```bash
npx sequelize-cli db:migrate
```

3. Verify that the migrations were applied successfully:

```bash
npx sequelize-cli db:migrate:status
```

## Monitoring and Logging

### Application Logging

The application logs errors to the console. In production, you should consider using a logging service like:

- **Winston**: A versatile logging library
- **Sentry**: For error tracking and monitoring
- **Datadog**: For comprehensive monitoring and logging

### Server Monitoring

For server monitoring, consider using:

- **PM2**: For process management and monitoring
- **New Relic**: For application performance monitoring
- **Prometheus and Grafana**: For metrics and visualization

## Scaling

### Horizontal Scaling

To scale the application horizontally:

1. Deploy multiple instances of the application behind a load balancer.
2. Use a shared database for all instances.
3. Use a Redis cache for session storage (if applicable).

### Vertical Scaling

To scale the application vertically:

1. Increase the resources (CPU, memory) of the server.
2. Optimize the database queries and indexes.
3. Implement caching for frequently accessed data.

## Troubleshooting

### Common Deployment Issues

#### Database Connection Issues

If the application cannot connect to the database:

1. Verify that the database is running and accessible from the application server.
2. Check the database connection string and credentials.
3. Ensure that the database user has the necessary permissions.

#### Environment Variables

If the application is not working correctly:

1. Verify that all required environment variables are set.
2. Check that the environment variables are accessible to the application.

#### Build Errors

If the build process fails:

1. Check the build logs for errors.
2. Verify that all dependencies are installed.
3. Ensure that the Node.js version is compatible with the application.
