# Task Management System

A comprehensive task management system backend built with NestJS and Fastify. The system provides user authentication, user management, and task management capabilities with advanced features like filtering, pagination, and search.

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

This project is a RESTful API built with [NestJS](https://github.com/nestjs/nest) framework, using Fastify as the HTTP adapter and Prisma ORM for database operations. It includes comprehensive authentication, task management, and API documentation features.

## Project setup

### Using Docker (Recommended)

The easiest way to set up and run the project is using Docker:

```bash
# Copy the example environment file
$ cp .env.example .env

# Start the application and database with Docker Compose
$ docker-compose up -d

# Run database migrations
$ docker-compose exec api npm run db:migrate

# Seed the database with initial data
$ docker-compose exec api npm run db:seed
```

The API will be available at http://localhost:3000 and the Swagger documentation at http://localhost:3000/api/docs

### Manual Setup

If you prefer to run the project without Docker:

```bash
# Install dependencies
$ npm install

# Set up environment variables
$ cp .env.example .env
# Edit .env file to use your local PostgreSQL instance

# Generate Prisma client
$ npm run db:generate

# Run database migrations
$ npm run db:migrate

# Seed the database with initial data
$ npm run db:seed
```

## Running the application

### Using Docker

```bash
# Start all services
$ docker-compose up -d

# View logs
$ docker-compose logs -f api

# Stop all services
$ docker-compose down
```

### Manual

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running tests

### Using Docker

```bash
# Run unit tests
$ docker-compose exec api npm run test

# Run e2e tests
$ docker-compose exec api npm run test:e2e

# Run test coverage
$ docker-compose exec api npm run test:cov
```

### Manual

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker Configuration

The project includes Docker configuration for both development and production environments:

### Development Environment

The `docker-compose.yml` file sets up:
- A NestJS API container running in development mode with hot-reload
- A PostgreSQL database container for the main application
- A separate PostgreSQL database container for testing

### Production Environment

The `Dockerfile` includes a multi-stage build process:
1. **Builder stage**: Installs dependencies, generates Prisma client, and builds the application
2. **Production stage**: Creates a minimal production image with only the necessary files and dependencies

### Environment Variables

Docker configuration uses environment variables defined in:
- `.env` file (for local development)
- Environment variables in `docker-compose.yml` (for containerized development)
- Environment variables passed to the container at runtime (for production)

## API Documentation

The API documentation is available through Swagger UI at `/api/docs` when the application is running. It provides:
- Detailed endpoint descriptions
- Request and response schemas
- Authentication information
- Interactive API testing capabilities

## Features

- User authentication with JWT
- User profile management
- Task creation, retrieval, updating, and deletion
- Advanced task filtering, pagination, and search
- Comprehensive API documentation
- Robust error handling and validation
- Database migrations and seeding
- Comprehensive test coverage
- Automated CI/CD pipeline with GitHub Actions

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

### Workflow Stages

1. **Lint**: Runs ESLint and Prettier checks to ensure code quality
2. **Test**: Runs unit tests, integration tests, and e2e tests with coverage reporting
3. **Build**: Builds the application and generates artifacts
4. **Deploy**: Deploys the application to the production environment (when merged to main/master)

### Environment Variables

The CI/CD pipeline uses GitHub Secrets for managing environment variables:

- `DATABASE_URL`: Connection string for the database
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRATION`: Expiration time for JWT tokens
- `RAILWAY_TOKEN`: API token for Railway deployment

### Deployment

The application is automatically deployed to Railway when changes are merged to the main/master branch.

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Fastify Documentation](https://www.fastify.io/docs/latest)
- [Docker Documentation](https://docs.docker.com)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Railway Documentation](https://docs.railway.app)

## License

This project is [MIT licensed](LICENSE).
