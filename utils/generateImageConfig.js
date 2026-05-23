/**
 * Image Config Generator Utility
 * 
 * This script helps generate the image configuration automatically.
 * Usage in Node.js:
 *   node utils/generateImageConfig.js
 * 
 * This will scan the public/Images folder and generate imageConfig.js
 */

const fs = require('fs');
const path = require('path');

const IMAGE_FOLDER = path.join(__dirname, '../public/Images');
const OUTPUT_FILE = path.join(__dirname, '../src/config/imageConfig.js');

const SUPPORTED_FORMATS = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

function formatImageName(filename) {
  // Convert file name to readable alt text
  // e.g., 'RIS logo.png' -> 'RIS logo'
  return filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
}

function generateImageConfig() {
  try {
    if (!fs.existsSync(IMAGE_FOLDER)) {
      console.error(`❌ Error: ${IMAGE_FOLDER} does not exist`);
      process.exit(1);
    }

    const files = fs.readdirSync(IMAGE_FOLDER);
    const images = files
      .filter(file => SUPPORTED_FORMATS.includes(path.extname(file).toLowerCase()))
      .sort()
      .map(file => ({
        src: `/Images/${file}`,
        alt: formatImageName(file),
      }));

    if (images.length === 0) {
      console.warn('⚠️  Warning: No image files found in Images folder');
    }

    // Generate the configuration file
    const configContent = `/**
 * Image Configuration File
 * Generated: ${new Date().toISOString()}
 * 
 * Auto-generated from files in /public/Images folder
 * To regenerate, run: node utils/generateImageConfig.js
 */

export const sliderImages = [
${images.map(img => `  {
    src: '${img.src}',
    alt: '${img.alt}',
  }`).join(',\n')}
];

export default sliderImages;
`;

    fs.writeFileSync(OUTPUT_FILE, configContent);
    console.log(`✅ Successfully generated ${OUTPUT_FILE}`);
    console.log(`📸 Found ${images.length} image(s):`);
    images.forEach(img => console.log(`   - ${img.src} (${img.alt})`));

  } catch (error) {
    console.error('❌ Error generating image config:', error.message);
    process.exit(1);
  }
}

// Run the generator
generateImageConfig();
