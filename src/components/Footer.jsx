import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold text-white">Rocky IT Services</h3>
          <p className="mt-2 text-sm text-gray-400">IT support & managed services</p>
          <div className="mt-4 text-sm text-gray-300 space-y-1">
            <div>212, Mahankali Nagar, Kukatpally</div>
            <div>Hyderabad, Telangana - 500072, India</div>
            <div className="mt-2">Phone: <a href="tel:+918309931417" className="hover:text-white">+91 83099 31417</a></div>
            <div>Email: <a href="mailto:support@rockyitservices.com" className="hover:text-white">support@rockyitservices.com</a></div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white">Services</h4>
          <ul className="mt-4 grid grid-cols-1 gap-2 text-gray-300">
            <li><Link to="/services?service=AWS%20Cloud%20Services" className="hover:text-white">AWS Cloud Services</Link></li>
            <li><Link to="/services?service=Networking%20Solutions" className="hover:text-white">website design</Link></li>
            <li><Link to="/services?service=Laptop%20Repair" className="hover:text-white">Laptop Repair</Link></li>
            <li><Link to="/services?service=Desktop%20Repair" className="hover:text-white">Desktop Repair and more services</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-gray-300">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="/services" className="hover:text-white">Services</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white">Contact</h4>
          <div className="mt-4 text-gray-300 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-white/6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A11.94 11.94 0 0012 0C5.37 0 .01 5.37.01 12a11.94 11.94 0 003.48 8.52L0 24l3.48-3.48A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.24-6.14-3.48-8.52zM12 21.5c-5.25 0-9.5-4.25-9.5-9.5S6.75 2.5 12 2.5 21.5 6.75 21.5 12 17.25 21.5 12 21.5z"/></svg>
              </div>
              <a href="https://wa.me/918309931417?text=Hello%20Rocky%20IT%20Services" className="hover:text-white" target="_blank" rel="noopener noreferrer">WhatsApp: +91 83099 31417</a>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-white/6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12.713l11.985-7.6A.998.998 0 0023.99 4H.01a1 1 0 00-.995 1.113L11.999 12.713zM12 14.5L.01 7.199V19a1 1 0 001 1h21.98a1 1 0 001-1V7.199L12 14.5z"/></svg>
              </div>
              <a href="mailto:support@rockyitservices.com" className="hover:text-white">support@rockyitservices.com</a>
            </div>

            <div className="mt-3">
              <a href="https://wa.me/918309931417?text=Hello%20Rocky%20IT%20Services" className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A11.94 11.94 0 0012 0C5.37 0 .01 5.37.01 12a11.94 11.94 0 003.48 8.52L0 24l3.48-3.48A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.24-6.14-3.48-8.52zM16.3 14.1l-1.2.6c-.3.15-.65.05-.85-.2l-.95-1.15c-.2-.25-.55-.35-.85-.2l-1.35.6c-.25.12-.6.05-.8-.15L7.4 11.5c-.6-.55-.6-1.5 0-2.05l4.6-4c.6-.5 1.5-.5 2.1 0l2.7 2.25c.55.45.55 1.2 0 1.65l-1.45 1.15c-.2.15-.25.4-.15.6l.6 1.6c.1.25 0 .55-.25.7z"/></svg>
                Message on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-10 pt-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Rocky IT Services. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
