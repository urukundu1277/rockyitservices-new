import React, { useState, useEffect } from 'react';
import { sliderImages } from '../config/imageConfig';
import './ImageSlider.css';

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [images, setImages] = useState(sliderImages);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Images are loaded from config, so no loading needed
    setIsLoading(false);
    console.log('ImageSlider loaded with images:', sliderImages);
  }, []);

  // Auto-rotate carousel every 3.5 seconds
  useEffect(() => {
    if (!isAutoplay || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isAutoplay, images.length]);

  const goToPrevious = () => {
    setIsAutoplay(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    // Resume autoplay after 5 seconds of manual control
    setTimeout(() => setIsAutoplay(true), 5000);
  };

  const goToNext = () => {
    setIsAutoplay(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    // Resume autoplay after 5 seconds of manual control
    setTimeout(() => setIsAutoplay(true), 5000);
  };

  const handleDotClick = (index) => {
    setIsAutoplay(false);
    setCurrentIndex(index);
    // Resume autoplay after 5 seconds of manual control
    setTimeout(() => setIsAutoplay(true), 5000);
  };

  if (isLoading || images.length === 0) {
    return (
      <div className="image-slider">
        <div className="slider-loading">
          <div className="spinner"></div>
          <p className="spinner-text">Loading images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="image-slider">
      {/* Images Container */}
      <div className="image-slider-container">
        {images.map((image, index) => (
          <div
            key={image.src}
            className={`image-slide ${index === currentIndex ? 'active' : ''}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              onError={(e) => {
                console.error(`Failed to load image: ${image.src}`);
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22400%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2220%22 fill=%22%239ca3af%22%3EImage not found%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Hidden on very small screens */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            aria-label="Previous Image"
            className="slider-arrow prev"
            title="Previous image"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            aria-label="Next Image"
            className="slider-arrow next"
            title="Next image"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </>
      )}

      {/* Navigation Dots/Indicators */}
      {images.length > 1 && (
        <div className="slider-dots">
          {images.map((_, index) => (
            <button
              key={index}
              aria-label={`Go to image ${index + 1}`}
              onClick={() => handleDotClick(index)}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              title={`Image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      <div className="slider-counter">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}