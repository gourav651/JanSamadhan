import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, AlertCircle, Activity, LogIn } from "lucide-react";
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
    <header className="sticky top-0 z-1100 w-full px-6 py-3">
      {/* Main Nav Container - Glassmorphism Effect */}
      <div className="mx-auto flex items-center justify-between rounded-2xl border border-white/20 bg-white/70 px-8 py-3 backdrop-blur-xl shadow-sm transition-all duration-300 hover:shadow-md">
        {/* LEFT: Logo with Hover Animation */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/")}
          className="flex cursor-pointer items-center gap-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-200">
            J
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800">
            Jan<span className="text-emerald-600">Samadhan</span>
          </h2>
        </motion.div>

        {/* RIGHT SECTION */}
        <nav className="flex items-center gap-2">
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
            <div className="flex items-center gap-1 md:gap-4">
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
              <div className="mx-2 h-6 w-px bg-slate-200" />

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

                {/* 🔔 DROPDOWN */}
<AnimatePresence>
  {showDropdown && (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute right-0 mt-4 w-85 rounded-2xl border border-slate-100 bg-white/95 shadow-2xl backdrop-blur-xl overflow-hidden z-50 ring-1 ring-black/5"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50 bg-slate-50/50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          Notifications
          {unreadCount > 0 && (
            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full">
              {unreadCount} New
            </span>
          )}
        </h3>
        <button 
           onClick={() => setNotifications(prev => prev.map(n => ({...n, isRead: true})))}
           className="text-xs font-medium text-emerald-600 hover:text-emerald-700 cursor-pointer transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* List */}
      <div className="max-h-100 overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="bg-slate-50 p-3 rounded-full mb-3 text-slate-300">
              <Bell size={24} />
            </div>
            <p className="text-sm font-medium text-slate-500">All caught up!</p>
            <p className="text-xs text-slate-400 mt-1">No new activity to report.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-50">
            {notifications.map((n) => (
              <motion.li
                key={n._id}
                whileHover={{ backgroundColor: "rgba(248, 250, 252, 1)" }}
                onClick={async () => {
                  await axios.patch(`/api/notifications/${n._id}/read`);
                  setNotifications((prev) =>
                    prev.map((x) => (x._id === n._id ? { ...x, isRead: true } : x))
                  );
                  if (n.link) navigate(n.link);
                  setShowDropdown(false);
                }}
                className={`group relative px-5 py-4 cursor-pointer transition-all ${
                  !n.isRead ? "bg-emerald-50/40" : "bg-transparent"
                }`}
              >
                {/* Unread Indicator Dot */}
                {!n.isRead && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                )}
                
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <p className={`text-sm leading-tight ${!n.isRead ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}>
                      {n.title}
                    </p>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                      Just now
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 group-hover:text-slate-600 transition-colors">
                    {n.message}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-50 text-center">
        <button 
          onClick={() => { navigate("/citizen/my-issues"); setShowDropdown(false); }}
          className="text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-wider"
        >
          View All Activity
        </button>
      </div>
    </motion.div>
  )}
</AnimatePresence>
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
      </div>
    </header>
  );
};

export default CitizenNavbar;
