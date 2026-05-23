# Image Slider Configuration Guide

## Overview

The Image Slider component automatically rotates through images from the `/public/Images` folder with smooth fade transitions. It's fully responsive and works on desktop and mobile devices.

## Features

✅ **Auto-Rotating Carousel** - Images change every 3.5 seconds  
✅ **Smooth Fade Transitions** - Modern CSS animations  
✅ **Mobile Responsive** - Full image visibility on all devices  
✅ **Navigation Controls** - Previous/Next buttons and dot indicators  
✅ **Image Counter** - Shows current position (e.g., "1 / 3")  
✅ **Accessibility** - ARIA labels and keyboard support  
✅ **Performance Optimized** - Lazy loading and efficient rendering  

## Adding New Images

### Step 1: Add Image File
1. Place your image in `/public/Images/` folder
2. Supported formats: PNG, JPG, JPEG, GIF, WEBP
3. Recommended size: 600x400px or larger for best quality

### Step 2: Update Configuration
Edit `src/config/imageConfig.js` and add your image:

```javascript
export const sliderImages = [
  {
    src: '/Images/RIS logo.png',
    alt: 'Rocky IT Services Logo',
  },
  {
    src: '/Images/services.jpeg',
    alt: 'Services Image',
  },
  {
    src: '/Images/your-image.jpg',  // Add your image here
    alt: 'Your Image Description',   // Update the alt text
  },
];
```

### Image Guidelines

- **Dimensions**: Use consistent aspect ratios (16:9, 1:1, or 4:3)
- **Format**: JPG for photographs, PNG for graphics with transparency
- **Size**: Keep under 500KB per image for fast loading
- **Alt Text**: Provide descriptive text for accessibility

## Customization

### Change Rotation Speed
Edit `src/components/ImageSlider.jsx`:
```javascript
// Change 3500 to your desired milliseconds (currently 3.5 seconds)
const interval = setInterval(() => {
  setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
}, 3500); // ← Adjust this value
```

### Adjust Transition Animation
Edit `src/components/ImageSlider.css`:
```css
.image-slide {
  transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1); /* ← Change 0.7s for faster/slower transitions */
}
```

### Style Customization
All styling is in `src/components/ImageSlider.css`. Modify colors, spacing, and sizes as needed.

## Layout

The slider is positioned on the **right side** of the hero section (top of the homepage):
- Desktop: Large display with proper spacing
- Mobile: Full responsive width with no image cropping
- Uses `object-fit: contain` to preserve aspect ratio

## Responsive Breakpoints

- **Mobile (< 640px)**: 300px height, compact navigation
- **Tablet (640px - 1024px)**: 400-450px height
- **Desktop (> 1024px)**: 500px+ height

## Troubleshooting

**Images not showing?**
- Check that image files exist in `/public/Images/`
- Verify file names match exactly in `imageConfig.js`
- Check browser console for 404 errors

**Slider not rotating?**
- Ensure `isAutoplay` is `true` in component state
- Check that autoplay doesn't restart (5-second pause after manual control)

**Images appear cropped?**
- Verify CSS has `object-fit: contain` (default)
- Check image file isn't corrupted

## Performance Tips

1. **Optimize Images**: Use tools like TinyPNG or ImageOptim
2. **Lazy Loading**: Images load only when needed
3. **Caching**: Browsers cache images for faster subsequent loads
4. **Format Choice**: Use WebP for modern browsers, PNG/JPG as fallback

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ⚠️ Limited support (no modern CSS animations)

---

For more details, check the component code in `src/components/ImageSlider.jsx`
