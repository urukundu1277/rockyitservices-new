import React from 'react';
import ImageSlider from './ImageSlider';

export default function Hero({ openBooking }){
  return (
    <section className="relative w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 lg:py-28">
        {/* Mobile-first responsive grid: stack vertically on mobile, side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Text Content - Always first on all screens */}
          <div className="text-gray-900 order-1">
            <div className="mb-2 leading-none">
  
  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900">
    ROCKY IT SERVICES
  </h1>

  <p className="text-base sm:text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-600 mt-0">
    IT Support &amp; Managed Services
  </p>

</div>

<div className="mt-6 space-y-3 text-base sm:text-lg text-gray-700">
              <p>
                Rocky IT Services, our goal is to support businesses and individuals with reliable and modern IT solutions. 
                We help clients improve productivity, business growth, and digital presence through smart technology services.
              </p>

              <p>
                Our focus is on providing smooth, secure, and efficient IT support for daily operations. 
                We deliver services like website development, cloud solutions, networking, and technical support.
              </p>

              <p>
                Our mission is to simplify technology and make it accessible for every business. 
                We are committed to building long-term partnerships through trusted and professional IT services.
              </p>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => openBooking({ title: 'Consultation' })} 
                className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-violet-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition"
              >
                Contact to Our Team
              </button>
              <a 
                href="/services" 
                className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-violet-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition text-center"
              >
                Our Services
              </a>
            </div>
          </div>

          {/* Right Column: Image Slider - Always second on all screens */}
          <div className="w-full order-2">
            <ImageSlider />
          </div>
        </div>
      </div>
    </section>
  );
}
