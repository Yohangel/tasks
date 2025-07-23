# CI/CD Pipeline Setup Guide

This document provides instructions for setting up and configuring the CI/CD pipeline for the Task Management System.

## GitHub Actions Configuration

The CI/CD pipeline is implemented using GitHub Actions and consists of the following workflow files:

- `ci-cd.yml`: Main workflow for continuous integration and deployment
- `pull-request.yml`: Workflow for pull request checks
- `deployment.yml`: Configuration file for deployment settings

## Required Secrets

To use the CI/CD pipeline, you need to set up the following secrets in your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following repository secrets:

| Secret Name | Description |
|-------------|-------------|
| `DATABASE_URL` | PostgreSQL connection string for tests and deployment |
| `JWT_SECRET` | Secret key for JWT token generation |
| `JWT_EXPIRATION` | Expiration time for JWT tokens in seconds |
| `RAILWAY_TOKEN` | API token for Railway deployment |

## Environment Setup

For production deployments, you should set up a dedicated environment:

1. Go to your repository on GitHub
2. Navigate to Settings > Environments
3. Create a new environment named "production"
4. Add environment-specific secrets if needed
5. Configure environment protection rules (optional)

## Workflow Customization

### Changing Deployment Target

The default deployment target is Railway. To use a different deployment target:

1. Edit the `.github/workflows/ci-cd.yml` file
2. Modify the `deploy` job to use your preferred deployment method
3. Update the required secrets in the GitHub repository settings
4. Update the `.github/workflows/deployment.yml` file with the new configuration

### Adding Custom Checks

To add custom checks to the CI pipeline:

1. Edit the `.github/workflows/ci-cd.yml` file
2. Add new steps to the existing jobs or create new jobs as needed
3. Update the job dependencies using the `needs` parameter

## Troubleshooting

### Common Issues

1. **Tests failing in CI but passing locally**
   - Check environment variables in the workflow file
   - Ensure database configuration is correct for the test environment

2. **Deployment failing**
   - Verify that all required secrets are set correctly
   - Check the deployment logs for specific error messages

3. **Workflow not triggering**
   - Ensure the branch names in the workflow file match your repository branches
   - Check if the workflow file is in the correct location (`.github/workflows/`)

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Railway Deployment Documentation](https://docs.railway.app)
- [GitHub Environments Documentation](https://docs.github.com/en/actions/deployment/targeting-different-environments)