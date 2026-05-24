// src/components/ImageSlider.jsx

import React, { useEffect, useState } from 'react';
import { sliderImages } from '../config/imageConfig';
import './ImageSlider.css';

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [isHovering, setIsHovering] = useState(false);

  // Auto Slide
  useEffect(() => {
    if (sliderImages.length <= 1 || isHovering) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        return (prev + 1) % sliderImages.length;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovering]);

  // Empty State
  if (!sliderImages || sliderImages.length === 0) {
    return (
      <div className="image-slider-wrapper">
        <div className="image-slider">
          <div className="slider-placeholder">
            <p>No Images Available</p>
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
        {sliderImages.map((image, index) => (
          <div
            key={image.id}
            className={`image-slide ${
              index === currentIndex ? 'active' : ''
            }`}
          >
            {!loadedImages[index] && (
              <div className="image-loader">
                <div className="spinner"></div>
              </div>
            )}

            <img
              src={image.src}
              alt={image.alt}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              draggable="false"
              className={loadedImages[index] ? 'loaded' : 'loading'}
              onLoad={() => {
                setLoadedImages((prev) => ({
                  ...prev,
                  [index]: true,
                }));
              }}
              onError={(e) => {
                e.target.src =
                  'https://via.placeholder.com/1200x700?text=Image+Not+Found';

                setLoadedImages((prev) => ({
                  ...prev,
                  [index]: true,
                }));
              }}
            />
          </div>
        ))}
      </div>

      {/* Slider Dots */}
      <div className="slider-dots">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            className={`dot ${
              index === currentIndex ? 'active-dot' : ''
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}