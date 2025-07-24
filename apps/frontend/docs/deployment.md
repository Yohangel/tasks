# Task Management Frontend Deployment Guide

This document provides instructions for deploying the Task Management Frontend application to various environments.

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Access to the deployment environment

## Environment Configuration

The application uses environment variables for configuration. These are defined in the following files:

- `.env.development` - Development environment
- `.env.production` - Production environment
- `.env.test` - Test environment

### Required Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | API endpoint URL | `http://localhost:3001/api` |
| `NEXT_PUBLIC_API_TIMEOUT` | API request timeout in ms | `10000` |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Enable analytics tracking | `false` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Default language | `es` |
| `NEXT_PUBLIC_SUPPORTED_LOCALES` | Comma-separated list of supported locales | `es,en` |
| `NEXT_PUBLIC_ENABLE_PREFETCHING` | Enable route prefetching | `true` |
| `NEXT_PUBLIC_DEPLOYMENT_STAGE` | Deployment stage (development, staging, production) | `development` |
| `NEXT_PUBLIC_STATIC_CACHE_MAX_AGE` | Cache max age for static assets in seconds | `31536000` |
| `NEXT_PUBLIC_ENABLE_CSP` | Enable Content Security Policy | `false` |
| `NEXT_PUBLIC_DEBUG` | Enable debug mode | `false` |

## Deployment Process

### 1. Create Deployment Package

Run the following command to create a deployment package:

```bash
npm run create-deployment
```

This will:
- Clean previous builds
- Generate build information
- Optimize images
- Run type checking
- Run linting
- Run tests
- Build the application
- Create a deployment archive in the `deployment` directory

### 2. Deploy to Environment

#### Option 1: Manual Deployment

1. Extract the deployment archive to your server
2. Install production dependencies:
   ```bash
   npm ci --production
   ```
3. Start the application:
   ```bash
   npm run start:prod
   ```

#### Option 2: Docker Deployment

A Dockerfile is provided for containerized deployment:

1. Build the Docker image:
   ```bash
   docker build -t task-management-frontend:latest .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 -e NODE_ENV=production task-management-frontend:latest
   ```

#### Option 3: Cloud Deployment

For cloud deployments (AWS, Azure, GCP), refer to the specific cloud provider documentation.

## Monitoring and Performance

The application includes built-in performance monitoring:

- Core Web Vitals (LCP, FID, CLS) are collected and reported
- Custom performance metrics are available for component-level monitoring
- Accessibility issues are automatically detected in development mode

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify the `NEXT_PUBLIC_API_URL` is correctly set
   - Check network connectivity between frontend and API

2. **Build Failures**
   - Run `npm run lint` and `npm run type-check` to identify issues
   - Check for failing tests with `npm test`

3. **Performance Issues**
   - Use `npm run analyze-bundle` to identify large dependencies
   - Optimize images with `npm run optimize-images`

### Support

For additional support, contact the development team or refer to the internal documentation.