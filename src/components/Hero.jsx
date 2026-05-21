import React, { useMemo } from 'react';
import logo from "../Images/RIS logo.png";

const services = [
  'AWS Cloud Services',
  'Website Design',
  'Website Hosting',
  'Remote IT Support',
  'Networking Solutions',
  'Custom PC Build',
  'Server Maintenance'
];

function ServiceIcon({ label, size = 80 }){
  const fontSize = Math.max(7, Math.floor(size / 11));
  return (
    <div aria-label={label} role="img" className="transition-all duration-200 hover:scale-110 hover:shadow-2xl cursor-pointer" style={{ width: size, height: size, borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#06b6d4 0%,#7C3AED 100%)', padding: 6, boxShadow: '0 4px 15px rgba(124,58,237,0.25)' }}>
      <span style={{ color: '#fff', fontSize: `${fontSize}px`, fontWeight: 700, textAlign: 'center', lineHeight: '1.1', wordBreak: 'break-word', padding: '0 4px' }}>{label}</span>
    </div>
  );
}

export default function Hero({ openBooking }){
  const count = services.length;
  const orbits = useMemo(() => [200], []);

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
            <div className="relative z-20 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_8px_32px_rgba(124,58,237,0.15)] w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80">
              <img src={logo} alt="Rocky IT Services" className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain" />
            </div>

            {orbits.map((r) => (
              <div key={r} className="absolute orbit-container" 
                style={{ width: r*2, height: r*2, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
              >
                <div className="absolute inset-0 rounded-full border border-white/6" style={{ boxShadow: 'inset 0 0 40px rgba(124,58,237,0.03)' }} />
                {services.map((s, i) => {
                  const angle = (360 / count) * i;
                  const radians = (angle * Math.PI) / 180;
                  const x = Math.cos(radians) * r;
                  const y = Math.sin(radians) * r;
                  const iconSz = 80;
                  const outerSz = iconSz;
                  return (
                    <div key={s}
                      className={`absolute flex items-center justify-center transition-transform duration-300`} 
                      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, width: outerSz, height: outerSz, transform: 'translate(-50%, -50%)' }}
                      title={s}
                    >
                      <ServiceIcon label={s} size={iconSz} />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .orbit-container {
          transition: transform 0.3s ease-out;
        }
        
        @media (max-width: 480px) {
          .orbit-container {
            transform: translate(-50%, -50%) scale(0.55) !important;
          }
        }
        
        @media (min-width: 481px) and (max-width: 640px) {
          .orbit-container {
            transform: translate(-50%, -50%) scale(0.65) !important;
          }
        }
        
        @media (min-width: 641px) and (max-width: 768px) {
          .orbit-container {
            transform: translate(-50%, -50%) scale(0.75) !important;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .orbit-container {
            transform: translate(-50%, -50%) scale(0.85) !important;
          }
        }
        
        @media (min-width: 1025px) {
          .orbit-container {
            transform: translate(-50%, -50%) scale(1) !important;
          }
        }
      `}</style>
    </section>
  );
}
