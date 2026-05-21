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

function ServiceIcon({ label, size = 96 }){
  const fontSize = Math.max(8, Math.floor(size / 10));
  return (
    <div aria-label={label} role="img" className="transition-transform duration-150 hover:scale-105 hover:shadow-xl cursor-pointer" style={{ width: size, height: size, borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(90deg,#06b6d4 0%,#7C3AED 100%)', padding: 8 }}>
      <span style={{ color: '#fff', fontSize: `${fontSize}px`, fontWeight: 700, textAlign: 'center', lineHeight: '1.05', wordBreak: 'break-word', padding: '0 6px' }}>{label}</span>
    </div>
  );
}

export default function Hero({ openBooking }){
  const count = services.length;
  const orbits = useMemo(() => [260], []);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 xl:grid-cols-2 gap-8 items-center">
          <div className="text-gray-900">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">Rocky IT Services</h1>
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

          <div className="relative flex items-center justify-center min-h-[360px] sm:min-h-[480px] lg:min-h-[550px] py-10 lg:py-0">
            <div className="relative z-20 flex items-center justify-center rounded-full bg-white/6 backdrop-blur-md border border-white/10 shadow-[0_10px_40px_rgba(124,58,237,0.12)] w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <img src={logo} alt="Rocky IT Services" className="w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain" />
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
                  const iconSz = 100; // circle size large enough for full name
                  const outerSz = iconSz; // container equals icon size (label sits inside)
                  return (
                    <div key={s}
                      className={`absolute flex items-center justify-center`} 
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
        /* All motion removed: icons fixed around the logo for clarity */
        .service-btn{ transition: transform 180ms ease, box-shadow 180ms ease; }
        .service-btn:hover{ transform: translateY(-4px) scale(1.04); box-shadow: 0 10px 22px rgba(2,6,23,0.55); }
        @media (max-width: 768px) {
          .orbit-container {
            transform: translate(-50%, -50%) scale(0.65) !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .orbit-container {
            transform: translate(-50%, -50%) scale(0.8) !important;
          }
        }
        @media (min-width: 1025px) and (max-width: 1280px) {
          .orbit-container {
            transform: translate(-50%, -50%) scale(0.9) !important;
          }
        }
        }
      `}</style>
    </section>
  );
}
