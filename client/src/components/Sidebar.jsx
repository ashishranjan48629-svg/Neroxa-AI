import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faMessage,
  faHouse,
  faStar,
  faQuestionCircle,
  faBars,
  faChevronDown,
  faChevronUp,
  faGear,
  faCircleQuestion,
  faRightFromBracket,
  faUser,
  faWandMagicSparkles,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getChats } from "../services/api";
import logo from "../assets/logo.png";

const navLinks = [
  { label: "Home", path: "/", icon: <FontAwesomeIcon icon={faHouse} /> },
  {
    label: "Features",
    path: "/features",
    icon: <FontAwesomeIcon icon={faStar} />,
    badge: "New",
  },
  {
    label: "Pricing",
    path: "/pricing",
    icon: <FontAwesomeIcon icon={faQuestionCircle} />,
  },
];

const Avatar = ({ user, size = "sm", onClick }) => (
  <button
    onClick={onClick}
    className={`${size === "lg" ? "w-10 h-10 text-base" : "w-8 h-8 text-xs"}
      rounded-full bg-violet-600 flex items-center justify-center text-white font-semibold shrink-0
      hover:ring-2 hover:ring-violet-400 hover:ring-offset-1 hover:ring-offset-zinc-900 transition-all`}
  >
    {user?.name?.charAt(0).toUpperCase() ?? "U"}
  </button>
);

const ProfileDropdown = ({
  user,
  onClose,
  anchorRef,
  onLogout,
  onNavigate,
}) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ bottom: 0, left: 0, width: 280 });

  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        bottom: window.innerHeight - rect.top + 8,
        left: rect.left,
        width: Math.max(rect.width, 280),
      });
    }
  }, [anchorRef]);

  useEffect(() => {
    const handler = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target)
      )
        onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, anchorRef]);

  const go = (path) => {
    onClose();
    setTimeout(() => onNavigate(path), 50);
  };

  return createPortal(
    <div
      ref={ref}
      style={{
        position: "fixed",
        bottom: pos.bottom,
        left: pos.left,
        width: pos.width,
        zIndex: 9999,
      }}
      className="bg-[#1f1f1f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
        <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-semibold">
          {user?.name?.charAt(0).toUpperCase() ?? "U"}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-white font-medium truncate">
            {user?.name ?? "User"}
          </p>
          <p className="text-xs text-gray-400">Free</p>
        </div>
      </div>
      <div className="py-1 border-b border-white/10">
        <button
          onClick={() => go("/pricing")}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors text-left"
        >
          <FontAwesomeIcon
            icon={faWandMagicSparkles}
            className="text-gray-400 w-4"
          />
          <span>Upgrade plan</span>
        </button>
        <button
          onClick={() => go("/profile")}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors text-left"
        >
          <FontAwesomeIcon icon={faUser} className="text-gray-400 w-4" />
          <span>Profile</span>
        </button>
        <button
          onClick={() => go("/settings")}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors text-left"
        >
          <FontAwesomeIcon icon={faGear} className="text-gray-400 w-4" />
          <span>Settings</span>
        </button>
      </div>
      <div className="py-1 border-b border-white/10">
        <button
          onClick={() => go("/help")}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors text-left"
        >
          <FontAwesomeIcon
            icon={faCircleQuestion}
            className="text-gray-400 w-4"
          />
          <span className="flex-1">Help</span>
          <FontAwesomeIcon
            icon={faChevronRight}
            className="text-gray-500 text-xs"
          />
        </button>
      </div>
      <div className="py-1">
        <button
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors text-left"
        >
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className="text-gray-400 w-4"
          />
          <span>Log out</span>
        </button>
      </div>
    </div>,
    document.body,
  );
};

const NO_SIDEBAR_ROUTES = ["/profile", "/login", "/register"];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [openRecent, setOpenRecent] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [chatsLoading, setChatsLoading] = useState(false);

  const mobileFooterRef = useRef(null);
  const desktopFooterRef = useRef(null);

  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;
  const links = navLinks.filter((l) => !l.auth || user);

  const loadChats = useCallback(() => {
    if (!user) return;
    setChatsLoading(true);
    getChats()
      .then((res) => {
        setChats(res.data);
      })
      .catch(() => {})
      .finally(() => setChatsLoading(false));
  }, [user]);

  useEffect(() => {
    loadChats();
  }, [loadChats, location.pathname]);

  useEffect(() => {
    setProfileOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    setProfileOpen(false);
  }, [collapsed]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
    setProfileOpen(false);
  };

  // New Chat: if already on "/", force a page reload-equivalent by pushing the
  // same route with a fresh state flag that Home.jsx can react to.
  // We use navigate with state so Home remounts its session cleanly.
  const handleNewChat = () => {
    setMobileOpen(false);
    if (location.pathname === "/") {
      // Already on home — trigger reset via navigate replace + unique key in state
      navigate("/", { replace: true, state: { newChat: Date.now() } });
    } else {
      navigate("/");
    }
  };

  const toggleProfile = (e) => {
    e.stopPropagation();
    setProfileOpen((p) => !p);
  };
  const activeAnchor = mobileOpen ? mobileFooterRef : desktopFooterRef;

  if (NO_SIDEBAR_ROUTES.includes(location.pathname)) return null;

  const RecentChats = () => (
    <div className="mt-3">
      <button
        onClick={() => setOpenRecent(!openRecent)}
        className="flex items-center justify-between w-full px-2 mb-2 text-xs text-gray-500 hover:text-white transition-colors"
      >
        <span>Recent</span>
        <FontAwesomeIcon icon={openRecent ? faChevronUp : faChevronDown} />
      </button>
      {openRecent && (
        <div className="space-y-1">
          {chatsLoading && (
            <p className="text-xs text-gray-600 px-3">Loading...</p>
          )}
          {!chatsLoading && chats.length === 0 && (
            <p className="text-xs text-gray-600 px-3">No chats yet</p>
          )}
          {chats.map((chat) => (
            <Link
              key={chat._id || chat.id}
              to={`/chat/${chat._id || chat.id}`}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg truncate"
            >
              {chat.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {profileOpen && user && (
        <ProfileDropdown
          user={user}
          onClose={() => setProfileOpen(false)}
          anchorRef={activeAnchor}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-zinc-900 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              if (profileOpen) setProfileOpen(false);
              else setMobileOpen(false);
            }}
          />
          <aside className="relative w-72 h-full bg-zinc-900 flex flex-col z-10">
            <div className="flex items-center px-4 py-4 border-b border-white/10">
              <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
              <span className="ml-2 text-sm font-medium text-white">
                NEROXA <span className="text-violet-400">AI</span>
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="ml-auto text-gray-400 hover:text-white p-1.5 rounded-md hover:bg-white/5"
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors
                    ${isActive(link.path) ? "bg-violet-600/20 text-violet-400" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
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
              {user && (
                <>
                  {/* New Chat button — uses handleNewChat to reset session */}
                  <button
                    onClick={handleNewChat}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition-colors"
                  >
                    <FontAwesomeIcon icon={faMessage} />
                    <span>New Chat</span>
                  </button>
                  <RecentChats />
                </>
              )}
            </nav>
            <div ref={mobileFooterRef} className="border-t border-white/10 p-3">
              {user ? (
                <div className="flex items-center gap-3 px-2 py-2">
                  <Avatar user={user} size="lg" onClick={toggleProfile} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-500">Free plan</p>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/pricing");
                      setMobileOpen(false);
                    }}
                    className="px-3 py-1 text-xs text-white border border-gray-600 rounded-full hover:bg-violet-600 hover:border-violet-600 transition-all shrink-0"
                  >
                    Upgrade
                  </button>
                </div>
              ) : (
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
                >
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    className="text-violet-400"
                  />
                  <span className="text-sm">Sign Up</span>
                </Link>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col h-screen bg-zinc-900 border-r border-white/10 transition-all duration-300 ${collapsed ? "w-[70px]" : "w-[240px]"}`}
      >
        <div
          className={`border-b border-white/10 flex ${collapsed ? "flex-col items-center py-5 gap-3" : "items-center px-4 py-4"}`}
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
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
               ${collapsed ? "justify-center" : ""}
               ${isActive(link.path) ? "bg-violet-600/20 text-violet-400" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              {link.icon}
              {!collapsed && <span>{link.label}</span>}
              {!collapsed && link.badge && (
                <span className="ml-auto text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          {user && (
            <>
              {/* New Chat button — uses handleNewChat to reset session */}
              <button
                onClick={handleNewChat}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 text-sm transition-colors ${collapsed ? "justify-center" : ""}`}
              >
                <FontAwesomeIcon icon={faMessage} />
                {!collapsed && <span>New Chat</span>}
              </button>
              {!collapsed && <RecentChats />}
            </>
          )}
        </nav>
        <div ref={desktopFooterRef} className="border-t border-white/10 p-2">
          {user ? (
            <div
              className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors ${collapsed ? "justify-center" : ""}`}
            >
              <Avatar user={user} size="sm" onClick={toggleProfile} />
              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-500">Free plan</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/pricing");
                    }}
                    className="px-3 py-1 text-xs text-white border border-gray-600 rounded-full hover:bg-violet-600 hover:border-violet-600 transition-all shrink-0"
                  >
                    Upgrade
                  </button>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/register"
              className={`flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors ${collapsed ? "justify-center" : ""}`}
            >
              <FontAwesomeIcon icon={faUserPlus} className="text-violet-400" />
              {!collapsed && <span className="text-sm">Sign Up</span>}
            </Link>
          )}
        </div>
      </aside>

      <style>{`@keyframes dropUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </>
  );
};

export default Sidebar;
