import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import socket from "@/lib/socket";

const AuthorityLayout = ({ children }) => {
  const { user,isSignedIn } = useUser();
  const { signOut } = useClerk();

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
  if (!isSignedIn || !user) return;

  socket.connect();
  socket.emit("join", { userId: user.id });

  return () => {
    socket.disconnect();
  };
}, [isSignedIn, user]);

useEffect(() => {
  socket.on("notification", (data) => {
    setNotifications((prev) => [data, ...prev]);
  });

  return () => socket.off("notification");
}, []);

  // 🔹 Close logout on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const name = user?.fullName || user?.firstName || "Authority User";
  const avatar = user?.imageUrl;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* 🔹 FIXED SIDEBAR */}
      <aside className="w-64 shrink-0 bg-white border-r flex flex-col">
        {/* LOGO */}
        <div className="p-4">
          <h2 className="text-xl font-bold">JanSamadhan</h2>
        </div>

        {/* NAV */}
        <nav className="flex flex-col gap-2 px-4">
          <SidebarLink
            to="/authority/assigned-issues"
            label="Assigned Issues"
          />
          <SidebarLink to="/authority/dashboard" label="Dashboard" />
          <SidebarLink to="/authority/map" label="Map View" />
          <SidebarLink to="/authority/settings" label="Settings" />
          <SidebarLink to="/authority/support" label="Support" />
        </nav>

        {/* 🔹 ACCOUNT SECTION (BOTTOM) */}
        <div ref={accountRef} className="mt-auto border-t px-4 py-4 relative cursor-pointer">
          {/* LOGOUT BUTTON */}
          {open && (
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="absolute cursor-pointer bottom-full mb-2 w-30 flex items-center gap-2 px-4 py-2 rounded-lg border bg-white text-red-600 hover:bg-red-50 text-sm font-semibold shadow"
            >
              Logout
            </button>
          )}

          {/* ACCOUNT INFO */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-full flex items-center gap-3 text-left"
          >
            {avatar ? (
              <img
                src={avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                {name.charAt(0)}
              </div>
            )}

            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">
                {name}
              </span>
              <span className="text-xs text-slate-500">Authority User</span>
            </div>
          </button>
        </div>
      </aside>

      {/* 🔹 PAGE CONTENT */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default AuthorityLayout;

/* 🔹 SIDEBAR LINK */
const SidebarLink = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-2 py-1.5 rounded text-sm ${
        isActive
          ? "font-semibold text-primary"
          : "text-gray-500 hover:text-gray-700"
      }`
    }
  >
    {label}
  </NavLink>
);
