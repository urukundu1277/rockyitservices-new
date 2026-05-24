// src/config/imageConfig.js

/**
 * Automatically loads all images from:
 * src/assets/slider-images
 */

const imageModules = import.meta.glob(
  '/src/assets/slider-images/*.{png,jpg,jpeg,svg,webp,gif}',
  {
    eager: true,
    import: 'default',
  }
);

export const sliderImages = Object.entries(imageModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, src]) => {
    const fileName =
      path.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Image';

    return {
      id: path,
      src,
      alt: fileName
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase()),
    };
  });

export default sliderImages;