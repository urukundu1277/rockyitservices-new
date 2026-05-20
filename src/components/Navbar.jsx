import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/contact", label: "Contact Us" },
    { to: "/admin", label: "Admin" },
  ];

  const active = "text-green-400 font-semibold";
  const inactive = "text-white/90 hover:text-green-300 transition";

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div>
          <NavLink to="/" className="flex flex-col" onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="Go to home">
            <span className="text-2xl md:text-3xl font-extrabold tracking-tight">Rocky IT Services</span>
            <span className="text-sm text-gray-400 -mt-1">IT support & managed services</span>
          </NavLink>
        </div>

        <div className="hidden md:flex items-center gap-8 text-lg">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={({ isActive }) => (isActive ? active : inactive)}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="p-2 rounded-md bg-white/6 text-white hover:bg-white/10 transition"
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div className={`md:hidden bg-gradient-to-b from-gray-900 to-black/80 transition-max-height duration-300 overflow-hidden ${open ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-6 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? active : inactive}`}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}