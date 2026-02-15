import { useEffect, useState } from "react";
import { SignOutButton, useAuth, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  User,
  ShieldCheck,
  Database,
  Cloud,
  Network,
  Lock,
  LogOut,
  Building2,
} from "lucide-react";

import AuthorityLayout from "../../components/authority/AuthorityLayout";

const AuthSettings = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(
          "http://localhost:5000/api/authority/settings",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setProfile(res.data.data);
      } catch (err) {
        console.error("Settings load error", err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [getToken]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, duration: 0.5 },
    },
  };

  if (loading) {
    return (
      <AuthorityLayout>
        <div className="flex items-center justify-center h-screen bg-[#0B0F1A] text-blue-400">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="font-bold tracking-widest uppercase text-xs">
              Syncing Authority Profile...
            </p>
          </div>
        </div>
      </AuthorityLayout>
    );
  }

  return (
    <AuthorityLayout>
      <main className="flex justify-center py-8 sm:py-10 px-4 sm:px-6 lg:px-8 bg-[#0B0F1A] text-slate-200 min-h-screen">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl w-full flex flex-col gap-8"
        >
          {/* PAGE HEADER */}
          <div className="px-2 sm:px-4 border-l-4 border-blue-600 pl-4 sm:pl-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight uppercase">
              System <span className="text-blue-500">Settings</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Authority node:{" "}
              <span className="text-blue-400 font-mono">
                {profile?.clerkUserId?.slice(-8)}
              </span>{" "}
              | Jurisdiction Management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* PROFILE INFO */}
            <SettingsCard title="Identity Profile" icon={<User size={20} />}>
              <div className="space-y-4">
                <ReadonlyField label="Official Name" value={profile?.name} />
                <ReadonlyField
                  label="Authority ID"
                  value={profile?.clerkUserId}
                  isMono
                />
              </div>
            </SettingsCard>

            {/* JURISDICTION */}
            <SettingsCard
              title="Jurisdiction Control"
              icon={<ShieldCheck size={20} />}
            >
              <div className="space-y-4">
                <ReadonlyField
                  label="Department"
                  value={profile?.department}
                  color="text-blue-400"
                />
                <ReadonlyField
                  label="Assigned District"
                  value={profile?.assignedArea}
                  color="text-emerald-400"
                />
              </div>
            </SettingsCard>
          </div>

          {/* PLATFORM CONNECTIVITY */}
          <section className="bg-[#0F172A]/50 border border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-500/10 rounded-2xl">
                <Network className="text-blue-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Platform Connectivity
                </h3>
                <p className="text-sm text-slate-500 font-medium italic">
                  System integration integrity & real-time sync status
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatusBox
                icon={<Database size={18} />}
                title="Database"
                status="CONNECTED"
                type="success"
              />
              <StatusBox
                icon={<Building2 size={18} />}
                title="Gov Gateway"
                status="MAINTENANCE"
                type="warning"
              />
              <StatusBox
                icon={<Cloud size={18} />}
                title="Media Sync"
                status="STABLE"
                type="success"
              />
            </div>
          </section>

          {/* LOGOUT */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-0 px-2 sm:px-4 py-8 border-t border-white/5 mt-4 text-center sm:text-left">
            <p className="text-[10px] text-slate-600 font-bold tracking-[0.2em]">
              JanSamadhan Protocol v2.4.0
            </p>
            <SignOutButton redirectUrl="/">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(239, 68, 68, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                className="
flex items-center gap-2 sm:gap-3
bg-red-500/10 border border-red-500/20 text-red-500
px-4 sm:px-8
py-2.5 sm:py-4
rounded-xl sm:rounded-2xl
font-black uppercase
text-[10px] sm:text-xs
tracking-widest
hover:bg-red-500 hover:text-white
transition-all duration-300
cursor-pointer
"
              >
                <LogOut size={16} />
                Deactivate Session
              </motion.button>
            </SignOutButton>
          </div>

          {/* FOOTER */}
          <footer className="mt-auto pt-12 pb-8 border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
              {/* BRANDING */}
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-[11px] font-black text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform">
                  J
                </div>
                <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">
                  Jan<span className="text-blue-500">Samadhan</span>
                </span>
              </div>

              {/* COPYRIGHT */}
              <p className="text-[10px] font-bold tracking-[0.15em] text-slate-600 ">
                © {new Date().getFullYear()} JanSamadhan Platform • Secure
                Authority Node
              </p>

              {/* LINKS */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 sm:gap-8">
                <button className="text-[10px] text-slate-500 hover:text-blue-400 transition-all uppercase font-black tracking-widest">
                  Privacy Protocol
                </button>
                <button className="text-[10px] text-slate-500 hover:text-blue-400 transition-all uppercase font-black tracking-widest">
                  System Support
                </button>
              </div>
            </div>
          </footer>
        </motion.div>
      </main>
    </AuthorityLayout>
  );
};

/* ---------- SUB-COMPONENTS ---------- */

const SettingsCard = ({ title, icon, children }) => (
  <motion.section
    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
    className="bg-[#0F172A]/50 border border-white/5 rounded-3xl p-6 backdrop-blur-md shadow-lg"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-slate-800 rounded-lg text-blue-400">{icon}</div>
      <h2 className="text-lg font-bold text-white uppercase tracking-tighter">
        {title}
      </h2>
    </div>
    {children}
  </motion.section>
);

const ReadonlyField = ({ label, value, isMono, color = "text-white" }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
      {label}
    </label>
    <div className="flex items-center bg-slate-900/80 border border-white/5 rounded-2xl h-14 px-5 group hover:border-blue-500/30 transition-all">
      <span
        className={`text-sm font-bold ${color} ${isMono ? "font-mono" : ""}`}
      >
        {value || "—"}
      </span>
      <Lock
        size={14}
        className="text-slate-700 ml-auto group-hover:text-blue-500/50 transition-colors"
      />
    </div>
  </div>
);

const StatusBox = ({ icon, title, status, type }) => {
  const styles = {
    success: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    warning: "text-amber-400 border-amber-500/20 bg-amber-500/5",
  };

  return (
    <div
      className={`p-5 rounded-2xl border ${styles[type]} flex flex-col gap-3 group hover:scale-[1.02] transition-transform`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[11px] font-black uppercase tracking-wider">
          {title}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`w-1.5 h-1.5 rounded-full animate-pulse ${type === "success" ? "bg-emerald-400" : "bg-amber-400"}`}
        />
        <span className="text-xs font-bold">{status}</span>
      </div>
    </div>
  );
};

export default AuthSettings;
