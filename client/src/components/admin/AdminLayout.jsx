import { NavLink, Outlet } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  AlertCircle,
  ShieldCheck,
  Ticket,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react"; // Using Lucide-react for cleaner icons
import socket from "@/lib/socket";

const AdminLayout = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [showLogout, setShowLogout] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowLogout(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden font-sans ">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-sm">
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 rounded-xl size-10 flex items-center justify-center shadow-indigo-200 shadow-lg">
              <ShieldCheck className="text-white size-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Civic<span className="text-indigo-600">Admin</span>
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 py-6 px-4 space-y-8 overflow-y-auto">
          <div>
            <p className="px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Main Menu
            </p>
            <nav className="space-y-1.5">
              <SidebarLink
                to="/admin/dashboard"
                icon={<LayoutDashboard size={20} />}
                label="Dashboard"
              />
              <SidebarLink
                to="/admin/issues"
                icon={<AlertCircle size={20} />}
                label="Issues"
              />
              <SidebarLink
                to="/admin/authorities"
                icon={<ShieldCheck size={20} />}
                label="Authorities"
              />
            </nav>
          </div>

          <div>
            <p className="px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Management
            </p>
            <nav className="space-y-1.5">
              <SidebarLink
                to="/admin/support"
                icon={<Ticket size={20} />}
                label="Support Tickets"
              />
              <SidebarLink
                to="/admin/analytics"
                icon={<BarChart3 size={20} />}
                label="Analytics & Insights"
              />
              <SidebarLink
                to="/admin/settings"
                icon={<Settings size={20} />}
                label="Settings"
              />
            </nav>
          </div>
        </div>

        {/* User Profile Section */}
        <div
          className="p-4 border-t border-slate-100 relative"
          ref={profileRef}
        >
          {showLogout && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut size={16} />
                Logout Session
              </button>
            </div>
          )}

          <button
            onClick={() => setShowLogout((prev) => !prev)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              showLogout
                ? "bg-slate-100"
                : "hover:bg-slate-50 border border-transparent hover:border-slate-200"
            }`}
          >
            <img
              src={user?.imageUrl}
              alt="Admin"
              className="size-10 rounded-lg object-cover ring-2 ring-slate-100"
            />
            <div className="flex flex-col text-left flex-1 min-w-0">
              <span className="text-sm font-bold text-slate-900 truncate">
                {user?.fullName || "Admin User"}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Super Admin
              </span>
            </div>
            <ChevronDown
              size={16}
              className={`text-slate-400 cursor-pointer transition-transform ${showLogout ? "" : "rotate-180"}`}
            />
          </button>
        </div>
      </aside>

      {/* ================= PAGE CONTENT ================= */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

/* ================= SIDEBAR LINK COMPONENT ================= */
const SidebarLink = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
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

export default AdminLayout;
