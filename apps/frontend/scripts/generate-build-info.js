/**
 * This script generates build information at build time
 * It creates a .env.local file with build ID and timestamp
 */
const fs = require('fs');
const path = require('path');

// Generate a unique build ID
const buildId = `build_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
const buildTime = new Date().toISOString();

// Create or update .env.local with build information
const envLocalPath = path.join(process.cwd(), '.env.local');
let envContent = '';

// Read existing .env.local if it exists
if (fs.existsSync(envLocalPath)) {
  envContent = fs.readFileSync(envLocalPath, 'utf8');

  // Remove any existing build variables
  envContent = envContent
    .split('\n')
    .filter(line => !line.startsWith('NEXT_PUBLIC_BUILD_ID=') && !line.startsWith('NEXT_PUBLIC_BUILD_TIME='))
    .join('\n');

  if (envContent && !envContent.endsWith('\n')) {
    envContent += '\n';
  }
}

// Add build variables
envContent += `NEXT_PUBLIC_BUILD_ID=${buildId}\n`;
envContent += `NEXT_PUBLIC_BUILD_TIME=${buildTime}\n`;

// Write to .env.local
fs.writeFileSync(envLocalPath, envContent);

console.log(`Build info generated: ID=${buildId}, Time=${buildTime}`);