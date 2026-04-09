import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

// Icons
const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 7L8 2l6 5v7H10v-4H6v4H2V7z" />
  </svg>
);

const FeaturesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="5" height="5" rx="1" />
    <rect x="9" y="2" width="5" height="5" rx="1" />
    <rect x="2" y="9" width="5" height="5" rx="1" />
    <rect x="9" y="9" width="5" height="5" rx="1" />
  </svg>
);

const PricingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="6" />
    <path d="M8 5v1.5M8 9.5V11M6.5 6.5a1.5 1.5 0 013 0c0 1-1.5 1.5-1.5 2.5" />
  </svg>
);

const DashboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="5" height="8" rx="1" />
    <rect x="9" y="6" width="5" height="4" rx="1" />
    <rect x="9" y="2" width="5" height="2" rx="1" />
    <rect x="2" y="12" width="12" height="2" rx="1" />
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 4h12M2 8h12M2 12h12" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 3l10 10M13 3L3 13" />
  </svg>
);

const navLinks = [
  { label: "Home", path: "/", icon: <HomeIcon /> },
  { label: "Features", path: "/features", icon: <FeaturesIcon />, badge: "New" },
  { label: "Pricing", path: "/pricing", icon: <PricingIcon /> },
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon />, auth: true },
];

const Sidebar = () => {
  // ✅ FIX: Start collapsed=true so sidebar is always minimized on refresh
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;
  const links = navLinks.filter((l) => !l.auth || user);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-zinc-900 border border-white/10 
        rounded-lg flex items-center justify-center text-gray-400 hover:text-white"
      >
        <MenuIcon />
      </button>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 h-full bg-zinc-900 flex flex-col z-10">
            {/* Header */}
            <div className="flex items-center px-4 py-4 border-b border-white/10">
              <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
              <span className="ml-2 text-sm font-medium text-white">
                NEROXA <span className="text-violet-400">AI</span>
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="ml-auto text-gray-400 hover:text-white p-1.5 rounded-md hover:bg-white/5"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              <p className="text-xs text-gray-500 px-2 py-1">Menu</p>
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm
                  ${
                    isActive(link.path)
                      ? "bg-violet-600/20 text-violet-400"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-auto text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Footer */}
            <div className="border-t border-white/10 p-3">
              {user ? (
                <div className="flex items-center gap-3 px-3 py-3 hover:bg-white/5 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs">
                    {user.name?.charAt(0) ?? "U"}
                  </div>
                  <div>
                    <p className="text-sm text-white">{user.name}</p>
                    <p className="text-xs text-gray-500">Pro plan</p>
                  </div>
                  <button onClick={logout} className="ml-auto text-red-400">⎋</button>
                </div>
              ) : (
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
                >
                  <FontAwesomeIcon icon={faUser} />
                  Sign Up
                </Link>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col h-screen bg-zinc-900 border-r border-white/10 transition-all duration-300
        ${collapsed ? "w-[70px]" : "w-[240px]"}`}
      >
        {/* Header */}
        <div
          className={`border-b border-white/10 flex
          ${collapsed ? "flex-col items-center py-5 gap-3" : "items-center px-4 py-4"}`}
        >
          <img src={logo} alt="Logo" className="w-14 h-14 object-contain" />
          {!collapsed && (
            <span className="ml-3 text-base text-white font-semibold whitespace-nowrap">
              NEROXA <span className="text-violet-400">AI</span>
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`text-gray-400 hover:text-white transition ${collapsed ? "" : "ml-auto"}`}
          >
            <MenuIcon />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-1">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm
              ${
                isActive(link.path)
                  ? "bg-violet-600/20 text-violet-400"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.icon}
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;