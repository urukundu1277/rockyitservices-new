import React from 'react';
import ImageSlider from './ImageSlider';

export default function Hero({ openBooking }){
  return (
    <section className="relative w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 xl:grid-cols-2 gap-8 items-center">
          <div className="text-gray-900">
            <div className="mb-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">Rocky IT Services</h1>
              <p className="text-base sm:text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-600 mt-2">IT Support & Managed Services</p>
            </div>
            <div className="mt-6 space-y-3 text-base sm:text-lg text-gray-700">
              <p>
                At Rocky IT Services, our goal is to support businesses and individuals with reliable and modern IT solutions. 
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
              <button onClick={() => openBooking({ title: 'Consultation' })} className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-violet-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition">Contact to Our Team</button>
              <a href="/services" className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-violet-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition">Our Services</a>
            </div>
          </div>

          <div className="relative flex items-center justify-center min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[550px] py-8 lg:py-0 px-4">
            <ImageSlider />
          </div>
        </div>
      </div>
    </section>
  );
}
