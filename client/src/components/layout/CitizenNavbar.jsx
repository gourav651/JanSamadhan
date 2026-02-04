import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, AlertCircle, Activity, LogIn } from "lucide-react";

const CitizenNavbar = () => {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to check active route for styling
  const isActive = (path) => location.pathname === path;

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
