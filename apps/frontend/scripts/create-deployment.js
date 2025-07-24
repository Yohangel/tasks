/**
 * This script creates a production deployment package
 * It builds the application, optimizes assets, and creates a deployment archive
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const packageName = 'task-management-frontend';
const version = require('../package.json').version;
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const deploymentDir = path.join(process.cwd(), 'deployment');
const archiveName = `${packageName}-${version}-${timestamp}.zip`;

// Create deployment directory if it doesn't exist
if (!fs.existsSync(deploymentDir)) {
  fs.mkdirSync(deploymentDir, { recursive: true });
}

// Function to execute a command and log output
function runCommand(command, description) {
  console.log(`\n📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed successfully.`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

// Main deployment process
async function createDeployment() {
  console.log('🚀 Starting production deployment package creation...');
  
  // Clean previous builds
  runCommand('npm run clean', 'Cleaning previous builds');
  
  // Generate build info
  runCommand('node scripts/generate-build-info.js', 'Generating build information');
  
  // Optimize images
  runCommand('npm run optimize-images', 'Optimizing images');
  
  // Run type checking
  runCommand('npm run type-check', 'Running type checking');
  
  // Run linting
  runCommand('npm run lint', 'Running linting');
  
  // Run tests
  runCommand('npm run test:ci', 'Running tests');
  
  // Build the application
  const buildSuccess = runCommand('npm run build', 'Building application');
  
  if (!buildSuccess) {
    console.error('❌ Deployment package creation failed due to build errors.');
    process.exit(1);
  }
  
  // Create deployment archive
  console.log('\n📦 Creating deployment archive...');
  
  try {
    // Copy necessary files to a temporary directory
    const tempDir = path.join(deploymentDir, 'temp');
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Copy .next directory
    fs.cpSync(path.join(process.cwd(), '.next'), path.join(tempDir, '.next'), { recursive: true });
    
    // Copy public directory
    fs.cpSync(path.join(process.cwd(), 'public'), path.join(tempDir, 'public'), { recursive: true });
    
    // Copy package.json and package-lock.json
    fs.copyFileSync(path.join(process.cwd(), 'package.json'), path.join(tempDir, 'package.json'));
    fs.copyFileSync(path.join(process.cwd(), 'package-lock.json'), path.join(tempDir, 'package-lock.json'));
    
    // Copy environment files
    fs.copyFileSync(path.join(process.cwd(), '.env.production'), path.join(tempDir, '.env.production'));
    
    // Copy next.config.ts
    fs.copyFileSync(path.join(process.cwd(), 'next.config.ts'), path.join(tempDir, 'next.config.ts'));
    
    // Create deployment README
    const readmeContent = `# Task Management Frontend Deployment
Version: ${version}
Build Date: ${new Date().toISOString()}

## Deployment Instructions
1. Extract this archive to your deployment directory
2. Install production dependencies: \`npm ci --production\`
3. Start the application: \`npm run start:prod\`

## Environment Configuration
- Configure environment variables in \`.env.production\`
- Set NODE_ENV=production for production mode
`;
    
    fs.writeFileSync(path.join(tempDir, 'README.md'), readmeContent);
    
    // Create archive
    const archivePath = path.join(deploymentDir, archiveName);
    runCommand(`cd ${tempDir} && zip -r ${archivePath} .`, 'Creating deployment archive');
    
    // Clean up temporary directory
    fs.rmSync(tempDir, { recursive: true, force: true });
    
    console.log(`\n✅ Deployment package created successfully: ${archivePath}`);
  } catch (error) {
    console.error('❌ Error creating deployment archive:', error.message);
    process.exit(1);
  }
}

createDeployment().catch(error => {
  console.error('Unhandled error during deployment package creation:', error);
  process.exit(1);
});