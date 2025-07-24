# Docker Configuration Setup

This document outlines the Docker configuration created for the Task Management System.

## Files Created

1. **Dockerfile** - For development environment
   - Uses Node.js 18 Alpine image
   - Installs dependencies
   - Generates Prisma client
   - Builds the application
   - Configured for development use

2. **Dockerfile.prod** - For production environment
   - Multi-stage build process
   - Builder stage: installs dependencies, generates Prisma client, builds the application
   - Production stage: creates minimal image with only necessary files and dependencies
   - Optimized for production deployment

3. **docker-compose.yml** - For local development
   - Sets up API container with hot-reload
   - Configures PostgreSQL database container
   - Configures separate PostgreSQL test database container
   - Mounts volumes for code changes
   - Sets environment variables

4. **.dockerignore** - Excludes unnecessary files from Docker build context
   - Improves build performance
   - Prevents sensitive files from being included in the image

5. **.env.example** - Template for environment variables
   - Updated with Docker-specific configuration
   - Includes database connection strings for both main and test databases

## Environment Variables

The Docker configuration uses the following environment variables:

- **DATABASE_URL**: PostgreSQL connection string for the main database
- **TEST_DATABASE_URL**: PostgreSQL connection string for the test database
- **JWT_SECRET**: Secret key for JWT token generation
- **JWT_EXPIRES_IN**: JWT token expiration time
- **PORT**: Application port
- **NODE_ENV**: Environment (development, production)
- **CORS_ORIGIN**: Allowed CORS origins

## Usage Instructions

### Development Environment

```bash
# Start the development environment
docker-compose up -d

# Run database migrations
docker-compose exec api npm run db:migrate

# Seed the database
docker-compose exec api npm run db:seed

# View logs
docker-compose logs -f api

# Stop the environment
docker-compose down
```

### Production Environment

```bash
# Build the production image
docker build -t task-management-api:prod -f Dockerfile.prod .

# Run the production container
docker run -p 3000:3000 --env-file .env task-management-api:prod
```

## Testing with Docker

```bash
# Run unit tests
docker-compose exec api npm run test

# Run e2e tests
docker-compose exec api npm run test:e2e

# Run test coverage
docker-compose exec api npm run test:cov
```