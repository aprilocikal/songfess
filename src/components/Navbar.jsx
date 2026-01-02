import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX, FiMusic } from "react-icons/fi";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Browse", path: "/browse" },
    { name: "History", path: "/history" },
  ];

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* LOGO */}
          <NavLink to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md group-hover:shadow-lg">
              <FiMusic className="text-white text-lg sm:text-xl" />
            </div>
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              SongFess
            </span>
          </NavLink>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 lg:px-6 py-2.5 rounded-full text-sm lg:text-base font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-200"
                      : "text-gray-700 hover:bg-gray-100 hover:text-emerald-600"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            <NavLink
              to="/submit"
              className="ml-2 lg:ml-3 px-5 lg:px-7 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-full font-semibold text-sm lg:text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Create Message
            </NavLink>
          </div>

          {/* HAMBURGER BUTTON (MOBILE) */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-all duration-300"
            aria-label="Toggle menu"
          >
            {open ? (
              <FiX className="w-6 h-6 sm:w-7 sm:h-7" />
            ) : (
              <FiMenu className="w-6 h-6 sm:w-7 sm:h-7" />
            )}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-lg overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          {navItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3.5 rounded-2xl text-base font-semibold transition-all duration-300 transform ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md scale-[1.02]"
                    : "text-gray-700 hover:bg-gray-100 hover:text-emerald-600 hover:pl-6"
                }`
              }
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {item.name}
            </NavLink>
          ))}

          <NavLink
            to="/submit"
            onClick={() => setOpen(false)}
            className="block px-4 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-2xl font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-center mt-3"
          >
            Create Message
          </NavLink>
        </div>
      </div>
    </header>
  );
}
