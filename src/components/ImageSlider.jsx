import React, { useState, useEffect } from 'react';
import { sliderImages } from '../config/imageConfig';
import './ImageSlider.css';

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [images, setImages] = useState(sliderImages);

  useEffect(() => {
    console.log('ImageSlider loaded with images:', sliderImages);
  }, []);

  // Auto-rotate carousel every 3.5 seconds (unless hovering)
  useEffect(() => {
    if (images.length === 0 || isHovering) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovering, images.length]);

  if (images.length === 0) {
    return (
      <div className="image-slider-wrapper">
        <div className="image-slider">
          <div className="slider-placeholder">
            <p>No images available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="image-slider-wrapper"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="image-slider">
        {images.map((image, index) => (
          <div
            key={image.src}
            className={`image-slide ${index === currentIndex ? 'active' : ''}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              onLoad={() => console.log(`✓ Loaded: ${image.src}`)}
              onError={(e) => {
                console.error(`✗ Failed to load: ${image.src}`);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}