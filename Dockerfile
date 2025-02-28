FROM node:18-alpine AS base

# Create app directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Development image, copy all the files and run in dev mode
FROM base AS development
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Expose the port
EXPOSE 3000

# Set the hostname for the container
ENV HOSTNAME="0.0.0.0"

# Start the application in dev mode
CMD ["npm", "run", "dev"]

# Build the application for production
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose the port
EXPOSE 3000

# Set the hostname for the container
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]