import { NavLink } from "react-router-dom";

const AuthorityLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4">
        <h2 className="text-xl font-bold mb-6">JanSamadhan</h2>

        <nav className="flex flex-col gap-2">
          <NavLink
            to="/authority/assigned-issues"
            className={({ isActive }) =>
              isActive ? "font-semibold text-primary" : "text-gray-500"
            }
          >
            Assigned Issues
          </NavLink>

          <NavLink
            to="/authority/dashboard"
            className={({ isActive }) =>
              isActive ? "font-semibold text-primary" : "text-gray-500"
            }
          >
           Dashboard
          </NavLink>

          <NavLink
            to="/authority/map"
            className={({ isActive }) =>
              isActive ? "font-semibold text-primary" : "text-gray-500"
            }
          >
           Map View
          </NavLink>

          <NavLink
            to="/authority/settings"
            className={({ isActive }) =>
              isActive ? "font-semibold text-primary" : "text-gray-500"
            }
          >
           Settings
          </NavLink>

          <NavLink
            to="/authority/support"
            className={({ isActive }) =>
              isActive ? "font-semibold text-primary" : "text-gray-500"
            }
          >
           Support
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default AuthorityLayout;
