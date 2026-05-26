import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/contact", label: "Contact Us" },
  ];

  const active =
    "bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold px-5 py-2 rounded-full shadow-lg border border-white/30";

  const inactive =
    "text-gray-700 hover:text-black hover:bg-white/70 px-5 py-2 rounded-full transition-all duration-300";

  return (
    <nav className="relative overflow-hidden bg-gradient-to-r from-slate-100 via-white to-slate-200 text-gray-900 shadow-2xl border-b border-gray-300">

      {/* Floating Service Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="absolute top-3 left-20 text-cyan-500/50 text-2xl animate-pulse drop-shadow-lg">
          💻
        </div>

        <div className="absolute top-5 right-32 text-pink-500/50 text-xl animate-bounce drop-shadow-lg">
          🌐
        </div>

        <div className="absolute bottom-2 left-1/3 text-yellow-500/50 text-lg drop-shadow-lg">
          🔒
        </div>

        <div className="absolute top-2 right-10 text-green-500/50 text-2xl drop-shadow-lg">
          ☁️
        </div>

        <div className="absolute bottom-1 right-1/4 text-orange-500/50 text-lg drop-shadow-lg">
          🛠️
        </div>

        <div className="absolute top-1/2 left-10 text-purple-500/50 text-xl drop-shadow-lg">
          📡
        </div>

        <div className="absolute bottom-3 right-12 text-red-500/50 text-xl drop-shadow-lg">
          🖥️
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative z-10">

        {/* Logo Section */}
        <div>
          <NavLink
            to="/"
            className="flex flex-col leading-none"
            onClick={() => {
              setOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            aria-label="Go to home"
          >
            <span className="text-2xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-cyan-600 via-gray-900 to-violet-600 bg-clip-text text-transparent drop-shadow-lg">
              Rocky IT Services
            </span>

            <div className="flex items-center gap-2 mt-1">

              <div className="h-[2px] w-10 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600"></div>

              <span className="text-xs md:text-sm text-gray-700 tracking-[0.2em] uppercase">
                IT Support &amp; Managed Services
              </span>

            </div>
          </NavLink>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 text-base">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={({ isActive }) =>
                `relative transition-all duration-300 backdrop-blur-md ${
                  isActive ? active : inactive
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="p-2 rounded-xl bg-white/70 text-gray-900 hover:bg-white transition-all duration-300 border border-gray-300 shadow-md"
          >
            {open ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-gradient-to-b from-white to-slate-100 transition-all duration-300 ease-in-out overflow-hidden ${
          open
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-3 border-t border-gray-300">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-2xl text-lg transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg"
                    : "bg-white/70 text-gray-800 hover:bg-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}