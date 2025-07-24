/**
 * This script optimizes images in the public directory
 * It uses sharp to resize and compress images for better performance
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public');
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

// Create optimized directory if it doesn't exist
const optimizedDir = path.join(publicDir, 'optimized');
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

// Function to recursively find all images in a directory
function findImages(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'optimized') {
      // Recursively search directories
      results = results.concat(findImages(filePath));
    } else {
      // Check if file is an image
      const ext = path.extname(file).toLowerCase();
      if (imageExtensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Function to optimize an image
async function optimizeImage(imagePath) {
  const relativePath = path.relative(publicDir, imagePath);
  const outputPath = path.join(optimizedDir, relativePath);
  
  // Create directory structure if it doesn't exist
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  try {
    // Get image metadata
    const metadata = await sharp(imagePath).metadata();
    
    // Create optimized versions
    await sharp(imagePath)
      .resize({
        width: Math.min(metadata.width, 1200),
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(outputPath.replace(/\.[^.]+$/, '.webp'));
      
    await sharp(imagePath)
      .resize({
        width: Math.min(metadata.width, 1200),
        withoutEnlargement: true,
      })
      .avif({ quality: 65 })
      .toFile(outputPath.replace(/\.[^.]+$/, '.avif'));
      
    console.log(`✓ Optimized: ${relativePath}`);
  } catch (error) {
    console.error(`✗ Error optimizing ${relativePath}:`, error.message);
  }
}

// Main function
async function main() {
  console.log('Finding images to optimize...');
  const images = findImages(publicDir);
  
  if (images.length === 0) {
    console.log('No images found in the public directory.');
    return;
  }
  
  console.log(`Found ${images.length} images. Starting optimization...`);
  
  // Process images in batches to avoid memory issues
  const batchSize = 5;
  for (let i = 0; i < images.length; i += batchSize) {
    const batch = images.slice(i, i + batchSize);
    await Promise.all(batch.map(optimizeImage));
  }
  
  console.log('Image optimization complete!');
  console.log(`Optimized images are available in the 'public/optimized' directory.`);
}

main().catch(error => {
  console.error('Error during image optimization:', error);
  process.exit(1);
});