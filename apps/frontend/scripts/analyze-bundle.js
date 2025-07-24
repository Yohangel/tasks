/**
 * This script analyzes the production bundle size and generates a visualization
 * It helps identify large dependencies and optimize the bundle size
 */
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

// Get the Next.js webpack config
const nextConfigPath = path.resolve(process.cwd(), '.next/build-manifest.json');

if (!fs.existsSync(nextConfigPath)) {
  console.error('Error: Next.js build manifest not found. Run `npm run build` first.');
  process.exit(1);
}

// Create a directory for the bundle analysis
const statsDir = path.resolve(process.cwd(), '.bundle-stats');
if (!fs.existsSync(statsDir)) {
  fs.mkdirSync(statsDir);
}

console.log('Analyzing bundle size...');
console.log('This will generate a visualization of your bundle size in a browser window.');
console.log('You can use this information to identify large dependencies and optimize your bundle.');

// Set the environment variable to enable bundle analysis
process.env.ANALYZE = 'true';

// Run the Next.js build with bundle analysis
require('child_process').execSync('next build', {
  env: { ...process.env, ANALYZE: 'true' },
  stdio: 'inherit',
});