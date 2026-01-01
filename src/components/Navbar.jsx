import { NavLink } from "react-router-dom"
import { useState } from "react"
import { FiMenu, FiX } from "react-icons/fi"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Submit", path: "/submit" },
    { name: "Browse", path: "/browse" },
    { name: "History", path: "/history" },
  ]

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <h1 className="text-2xl font-bold text-emerald-600">
          Songfess
        </h1>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `
                  px-5 py-2 rounded-full text-sm font-semibold transition-all
                  ${
                    isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                  `
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* HAMBURGER BUTTON (MOBILE) */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-emerald-600"
        >
          {open ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <ul className="flex flex-col p-4 gap-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `
                    block px-4 py-3 rounded-xl text-sm font-semibold transition-all
                    ${
                      isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                    `
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
