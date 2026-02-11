import { NavLink, Outlet } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useState, useRef, useEffect } from "react";
import socket from "@/lib/socket";

const AdminLayout = () => {
  const { signOut } = useClerk();
  const { user, isSignedIn } = useUser();

  const [showLogout, setShowLogout] = useState(false);
  const profileRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

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
    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.off("notification");
  }, []);

  return (
    <div className="h-screen flex bg-[#f5f7f8] overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        {/* Logo */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-lg size-10 flex items-center justify-center">
              <span className="material-symbols-outlined">icon</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">CivicAdmin</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-3">
          <SidebarLink
            to="/admin/dashboard"
            icon="dashboard"
            label="Dashboard"
          />
          <SidebarLink to="/admin/issues" icon="warning" label="Issues" />
          <SidebarLink
            to="/admin/authorities"
            icon="group"
            label="Authorities"
          />
          <SidebarLink
            to="/admin/support"
            icon="support_agent"
            label="Support Tickets"
          />
          <SidebarLink
            to="/admin/analytics"
            icon="bar_chart"
            label="Analytics & Insights"
          />
          <SidebarLink to="/admin/settings" icon="settings" label="Settings" />
        </nav>

        {/* Admin Profile + Logout */}
        <div
          ref={profileRef}
          className="mt-auto border-t border-slate-200 p-3 space-y-2"
        >
          {/* LOGOUT BUTTON */}
          {showLogout && (
            <button
              onClick={() => signOut()}
              className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
            >
              Logout
            </button>
          )}

          {/* PROFILE CLICK AREA */}
          <button
            onClick={() => setShowLogout((prev) => !prev)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
          >
            <img
              src={user?.imageUrl}
              alt="Admin"
              className="size-10 rounded-full object-cover border"
            />

            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-slate-900">
                {user?.fullName || "Admin"}
              </span>
              <span className="text-xs text-slate-500">Super Admin</span>
            </div>
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

export default AdminLayout;

/* ================= SIDEBAR LINK ================= */
const SidebarLink = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
        ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-slate-600 hover:bg-slate-100"
        }`
      }
    >
      <span className="material-symbols-outlined">{icon}</span>
      {label}
    </NavLink>
  );
};
