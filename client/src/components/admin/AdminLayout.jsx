import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="h-screen flex bg-[#f5f7f8] overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        {/* Logo */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-lg size-10 flex items-center justify-center">
              <span className="material-symbols-outlined">
                icon
              </span>
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
            to="/admin/analytics"
            icon="bar_chart"
            label="Analytics & Insights"
          />
          <SidebarLink
            to="/admin/settings"
            icon="settings"
            label="Settings"
          />
        </nav>

        {/* Admin Profile */}
        <div className="mt-auto p-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
              AP
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">
                Alexander Pierce
              </span>
              <span className="text-xs text-slate-500">Super Admin</span>
            </div>
          </div>
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
