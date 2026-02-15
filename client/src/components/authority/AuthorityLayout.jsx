import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import {
  LayoutDashboard,
  ClipboardList,
  Map as MapIcon,
  Settings,
  LifeBuoy,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import socket from "@/lib/socket";

const AuthorityLayout = ({ children }) => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const [notifications, setNotifications] = useState([]);
  const [showLogout, setShowLogout] = useState(false);
  const accountRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.off("notification");
  }, []);

  // Close logout on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setShowLogout(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const name = user?.fullName || user?.firstName || "Authority User";
  const avatar = user?.imageUrl;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* ================= MOBILE TOP BAR ================= */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-40">
        <button onClick={() => setIsSidebarOpen(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-slate-800"
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
        </button>

        <div className="flex items-center gap-2">
          <ShieldCheck className="text-indigo-600 size-5" />
          <span className="font-bold text-slate-900">
            Jan<span className="text-indigo-600">Samadhan</span>
          </span>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
    fixed lg:static top-0 left-0 h-full w-72 bg-white border-r border-slate-200
    flex flex-col shrink-0 shadow-lg z-50
    transform transition-transform duration-300 ease-in-out
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4">
          <button onClick={() => setIsSidebarOpen(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-slate-800"
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
          </button>
        </div>

        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 rounded-xl size-10 flex items-center justify-center shadow-indigo-200 shadow-lg">
              <ShieldCheck className="text-white size-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Jan<span className="text-indigo-600">Samadhan</span>
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 py-6 px-4 space-y-8 overflow-y-auto">
          <div>
            <p className="px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Work Management
            </p>
            <nav className="space-y-1.5">
              <SidebarLink
                to="/authority/assigned-issues"
                icon={<ClipboardList size={20} />}
                label="Assigned Issues"
                closeSidebar={() => setIsSidebarOpen(false)}
              />
              <SidebarLink
                to="/authority/dashboard"
                icon={<LayoutDashboard size={20} />}
                label="Dashboard"
                closeSidebar={() => setIsSidebarOpen(false)}
              />
              <SidebarLink
                to="/authority/map"
                icon={<MapIcon size={20} />}
                label="Map View"
                closeSidebar={() => setIsSidebarOpen(false)}
              />
            </nav>
          </div>

          <div>
            <p className="px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-4">
              System
            </p>
            <nav className="space-y-1.5">
              <SidebarLink
                to="/authority/settings"
                icon={<Settings size={20} />}
                label="Settings"
                closeSidebar={() => setIsSidebarOpen(false)}
              />
              <SidebarLink
                to="/authority/support"
                icon={<LifeBuoy size={20} />}
                label="Support"
                closeSidebar={() => setIsSidebarOpen(false)}
              />
            </nav>
          </div>
        </div>

        {/* User Profile Section */}
        <div
          className="p-4 border-t border-slate-100 relative"
          ref={accountRef}
        >
          {showLogout && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <button
                onClick={() => signOut({ redirectUrl: "/" })}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut size={16} />
                Logout Session
              </button>
            </div>
          )}

          <button
            onClick={() => setShowLogout((prev) => !prev)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
              showLogout
                ? "bg-slate-100"
                : "hover:bg-slate-50 border border-transparent hover:border-slate-200"
            }`}
          >
            {avatar ? (
              <img
                src={avatar}
                alt="avatar"
                className="size-10 rounded-lg object-cover ring-2 ring-slate-100"
              />
            ) : (
              <div className="size-10 rounded-lg bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                {name.charAt(0)}
              </div>
            )}

            <div className="flex flex-col text-left flex-1 min-w-0">
              <span className="text-sm font-bold text-slate-900 truncate">
                {name}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Authority Officer
              </span>
            </div>
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-200 ${
                showLogout ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </aside>

      {/* ================= PAGE CONTENT ================= */}
      <main className="flex-1 overflow-y-auto bg-slate-50 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
};

/* ================= SIDEBAR LINK COMPONENT ================= */
const SidebarLink = ({ to, icon, label, closeSidebar }) => {
  return (
    <NavLink
      to={to}
      onClick={() => closeSidebar?.()}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group
        ${
          isActive
            ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`
      }
    >
      <span className="transition-colors group-hover:scale-110 duration-200">
        {icon}
      </span>
      {label}
    </NavLink>
  );
};

export default AuthorityLayout;
