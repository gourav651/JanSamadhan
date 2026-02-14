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
  Menu,
  X,
} from "lucide-react";
import socket from "@/lib/socket";

const AdminLayout = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [showLogout, setShowLogout] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  return (
    <div className="h-screen flex bg-slate-50 font-sans overflow-hidden">
      {/* ================= MOBILE TOP BAR ================= */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-40">
        <button onClick={() => setIsSidebarOpen(true)}>
          <Menu size={26} />
        </button>

        <div className="flex items-center gap-2">
          <ShieldCheck className="text-indigo-600" />
          <span className="font-bold text-slate-900">
            Civic<span className="text-indigo-600">Admin</span>
          </span>
        </div>
      </div>

      {/* ================= OVERLAY (Mobile) ================= */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed lg:relative top-0 left-0 h-full lg:h-screen w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-lg z-50 transform transition-transform duration-300 ease-in-out
  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
  lg:translate-x-0`}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4">
          <button onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

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
                closeSidebar={() => setIsSidebarOpen(false)}
              />

              <SidebarLink
                to="/admin/issues"
                icon={<AlertCircle size={20} />}
                label="Issues"
                closeSidebar={() => setIsSidebarOpen(false)}
              />
              <SidebarLink
                to="/admin/authorities"
                icon={<ShieldCheck size={20} />}
                label="Authorities"
                closeSidebar={() => setIsSidebarOpen(false)}
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
                closeSidebar={() => setIsSidebarOpen(false)}
              />
              <SidebarLink
                to="/admin/analytics"
                icon={<BarChart3 size={20} />}
                label="Analytics & Insights"
                closeSidebar={() => setIsSidebarOpen(false)}
              />
              <SidebarLink
                to="/admin/settings"
                icon={<Settings size={20} />}
                label="Settings"
                closeSidebar={() => setIsSidebarOpen(false)}
              />
            </nav>
          </div>
        </div>

        {/* User Profile Section */}
        <div
          className="mt-auto p-4 border-t border-slate-100 relative"
          ref={profileRef}
        >
          {showLogout && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
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
            className="w-full flex items-center cursor-pointer gap-3 p-3 rounded-xl hover:bg-slate-50"
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
            <ChevronDown size={16} className="text-slate-400" />
          </button>
        </div>
      </aside>

      {/* ================= PAGE CONTENT ================= */}
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
        <Outlet />
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

export default AdminLayout;
