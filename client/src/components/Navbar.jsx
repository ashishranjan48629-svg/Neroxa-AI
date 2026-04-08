import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Features", path: "/#features" },
    { label: "Pricing", path: "/pricing" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-full border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            NEROXA <span className="text-violet-400">AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`text-sm transition-colors duration-200 ${
                  isActive(link.path)
                    ? "text-violet-400 font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/login"
                className="text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-lg transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`text-sm py-1 ${
                isActive(link.path) ? "text-violet-400" : "text-gray-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-white/10" />
          {user ? (
            <button onClick={logout} className="text-sm text-red-400">Logout</button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}
              className="text-sm bg-violet-600 text-white px-4 py-2 rounded-lg text-center">
              Get started
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;