import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, AlertCircle, Activity, LogIn, Menu, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import axios from "@/lib/axios";
import socket from "@/lib/socket";
import { Bell } from "lucide-react";

const CitizenNavbar = () => {
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Helper to check active route for styling
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.off("notification");
  }, []);

  useEffect(() => {
    if (!isSignedIn) return;

    axios.get("/api/notifications/my").then((res) => {
      setNotifications(res.data.notifications || []);
    });
  }, [isSignedIn]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-1100 w-full px-4 sm:px-6 py-3">
      {/* Main Nav Container - Glassmorphism Effect */}
      <div className="mx-auto flex flex-wrap items-center justify-between rounded-2xl border border-white/20 bg-white/70 px-4 sm:px-6 md:px-8 py-3 backdrop-blur-xl shadow-sm transition-all duration-300 hover:shadow-md">
        {/* LEFT: Logo with Hover Animation */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/")}
          className="flex cursor-pointer items-center gap-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-200">
            J
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800">
            Jan<span className="text-emerald-600">Samadhan</span>
          </h2>
        </motion.div>

        {/* Mobile Hamburger - Only When Signed In */}
        {isSignedIn && (
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        )}

        {/* RIGHT SECTION */}
        {!isSignedIn ? (
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openSignIn()}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 cursor-pointer"
            >
              <LogIn size={16} />
              Login
            </motion.button>
          </div>
        ) : (
          <nav className="hidden md:flex flex-wrap items-center justify-end gap-2">
            {!isSignedIn ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openSignIn()}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 cursor-pointer"
              >
                <LogIn size={16} />
                Login
              </motion.button>
            ) : (
              <div className="flex flex-wrap items-center gap-1 md:gap-4">
                {/* Navigation Links */}
                {[
                  { name: "Home", path: "/", icon: <Home size={16} /> },
                  {
                    name: "Report Issue",
                    path: "/citizen/report",
                    icon: <AlertCircle size={16} />,
                  },
                  {
                    name: "My Activity",
                    path: "/citizen/my-issues",
                    icon: <Activity size={16} />,
                  },
                ].map((link) => (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={`group relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
                      isActive(link.path)
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`${isActive(link.path) ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500"}`}
                    >
                      {link.icon}
                    </span>
                    <span className="hidden md:inline">{link.name}</span>

                    {/* Active Indicator Underline */}
                    {isActive(link.path) && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-500 rounded-full"
                      />
                    )}
                  </button>
                ))}

                {/* Separator */}
                <div className="hidden sm:block mx-2 h-6 w-px bg-slate-200" />
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={async () => {
                      const willOpen = !showDropdown;
                      setShowDropdown(willOpen);

                      // ✅ MARK ALL AS READ WHEN OPENING
                      if (willOpen && unreadCount > 0) {
                        await axios.patch("/api/notifications/read-all");

                        setNotifications((prev) =>
                          prev.map((n) => ({ ...n, isRead: true })),
                        );
                      }
                    }}
                    className="relative p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                  >
                    <Bell
                      size={24}
                      className="group-hover:rotate-15 transition-transform duration-300"
                    />

                    {unreadCount > 0 && (
                      <span
                        className="absolute -top-1 -right-1 min-w-4 h-4 px-1
        bg-red-500 text-white text-[10px] font-bold rounded-full
        flex items-center justify-center"
                      >
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* User Avatar*/}
                <div className="rounded-full border-2 border-emerald-100 bg-transparent p-0.5 transition-transform hover:scale-110 flex items-center justify-center">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-8 h-8 rounded-full", // Targets the actual container
                        userButtonTrigger:
                          "focus:shadow-none focus:outline-none bg-transparent",
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </nav>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && isSignedIn && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-100 p-4 space-y-3"
          >
            {[
              { name: "Home", path: "/", icon: <Home size={18} /> },
              {
                name: "Report Issue",
                path: "/citizen/report",
                icon: <AlertCircle size={18} />,
              },
              {
                name: "My Activity",
                path: "/citizen/my-issues",
                icon: <Activity size={18} />,
              },
            ].map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.path)
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {link.icon}
                {link.name}
              </button>
            ))}

            {/* Notification + Avatar row */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="relative p-2 rounded-full hover:bg-slate-100"
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8 rounded-full",
                  },
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Notification Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 right-4 w-[92vw] max-w-sm sm:w-96 bg-white rounded-2xl border border-slate-100 shadow-2xl z-1200 overflow-hidden"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full">
                    {unreadCount} New
                  </span>
                )}
              </h3>
              <button
                onClick={() =>
                  setNotifications((prev) =>
                    prev.map((n) => ({ ...n, isRead: true })),
                  )
                }
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
              >
                Clear all
              </button>
            </div>

            {/* LIST */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                  <Bell size={22} className="text-slate-300 mb-2" />
                  <p className="text-sm text-slate-500">All caught up!</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <li
                      key={n._id}
                      onClick={async () => {
                        await axios.patch(`/api/notifications/${n._id}/read`);
                        setNotifications((prev) =>
                          prev.map((x) =>
                            x._id === n._id ? { ...x, isRead: true } : x,
                          ),
                        );
                        if (n.link) navigate(n.link);
                        setShowDropdown(false);
                      }}
                      className={`px-5 py-4 cursor-pointer hover:bg-slate-50 transition ${
                        !n.isRead ? "bg-emerald-50/40" : ""
                      }`}
                    >
                      <p className="text-sm font-medium text-slate-800">
                        {n.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {n.message}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default CitizenNavbar;
