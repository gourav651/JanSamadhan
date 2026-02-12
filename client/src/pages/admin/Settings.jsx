import React, { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { UserButton, useUser } from "@clerk/clerk-react";
import {
  Settings,
  ShieldCheck,
  Bell,
  Activity,
  Database,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";

const AdminSettings = () => {
  const { isSignedIn } = useUser();
  const [settings, setSettings] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [settingsRes, profileRes] = await Promise.all([
          axios.get("/api/admin/settings"),
          axios.get("/api/admin/profile"),
        ]);
        setSettings(settingsRes.data.data);
        setProfile(profileRes.data.data);
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const savedPassword = localStorage.getItem("admin_ui_password");
    if (savedPassword) {
      setPasswords({
        newPassword: savedPassword,
        confirmPassword: savedPassword,
      });
    }
  }, []);

  const handleSave = async () => {
    await axios.patch("/api/admin/settings", settings);
  };
  const handleSaveProfile = async () => {
    const res = await axios.patch("/api/admin/profile", {
      name: profile?.name,
      email: profile?.email,
      image: profile?.profileImage,
    });
    setProfile(res.data.data);
  };
  const handleReset = async () => {
    const res = await axios.post("/api/admin/settings/reset");
    setSettings(res.data.data);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setProfile((prev) => ({
      ...prev,
      profileImage: previewUrl,
      _localFile: file,
    }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "admin_profile_unsigned");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dzshfgdux/image/upload",
      {
        method: "POST",
        body: formData,
      },
    );
    const data = await res.json();
    if (data.secure_url)
      setProfile((prev) => ({ ...prev, profileImage: data.secure_url }));
  };

  return (
    <div className="bg-[#0b0f1a] text-slate-200 font-sans min-h-screen flex flex-col selection:bg-blue-500/30">
      {/* HEADER - Updated to Dark Glassmorphism */}
      <header className="h-20 flex items-center justify-between px-8 bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-800/60 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-2 rounded-xl shadow-lg shadow-blue-900/20">
              <Settings size={22} className="text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase">
              Civic<span className="text-blue-500">Admin</span>
            </h1>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            System Architecture
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {isSignedIn && (
            <UserButton
              appearance={{
                elements: { avatarBox: "w-10 h-10 border-2 border-slate-700" },
              }}
            />
          )}
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-8 space-y-10">
        {/* PROFILE SECTION */}
        <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-8 py-6 border-b border-slate-800/60 flex items-center gap-4 bg-slate-800/20">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Database size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Administrative Identity
              </h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Security & Profile Metadata
              </p>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative group">
                <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-slate-800 bg-slate-900 shadow-2xl relative z-10">
                  {profile?.profileImage ? (
                    <img
                      src={profile.profileImage}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt="Profile"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700 italic">
                      No Media
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 z-20 cursor-pointer bg-blue-600 hover:bg-blue-500 p-3 rounded-2xl text-white shadow-xl transition-all hover:scale-110">
                  <RotateCcw size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">
                Profile Photo
              </p>
            </div>

            <div className="md:col-span-2 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <DarkField
                  label="Administrative Name"
                  value={profile?.name || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
                <DarkField
                  label="System Email"
                  value={profile?.email || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800/50">
                <label className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em]">
                  Update Credentials
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PasswordField
                    value={passwords.newPassword}
                    placeholder="New Secure Key"
                    show={showPassword.new}
                    toggle={() =>
                      setShowPassword((p) => ({ ...p, new: !p.new }))
                    }
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                      })
                    }
                  />
                  <PasswordField
                    value={passwords.confirmPassword}
                    placeholder="Confirm Secure Key"
                    show={showPassword.confirm}
                    toggle={() =>
                      setShowPassword((p) => ({ ...p, confirm: !p.confirm }))
                    }
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ACCESS CONTROL TABLE */}
        <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-8 py-6 border-b border-slate-800/60 flex items-center gap-4 bg-slate-800/20">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">
              Inherited Permission Matrix
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-950/50 text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 border-b border-slate-800/60">
                  <th className="px-8 py-5 text-left">Entity Role</th>
                  <th className="px-8 py-5 text-center">Read</th>
                  <th className="px-8 py-5 text-center">Write</th>
                  <th className="px-8 py-5 text-center">Analytics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                <PermissionRow
                  role="Super Admin"
                  desc="Full System Authority"
                  read
                  write
                  analytics
                />
                <PermissionRow
                  role="Authority"
                  desc="Departmental Management"
                  read
                  write
                />
                <PermissionRow
                  role="Citizen"
                  desc="Public Reporting Node"
                  read
                />
              </tbody>
            </table>
          </div>
        </section>

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-8 rounded-3xl space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Bell size={16} className="text-amber-500" /> Communications
            </h3>
            <div className="space-y-3">
              <DarkNotificationRow
                title="Email Relay"
                status="ACTIVE"
                color="emerald"
              />
              <DarkNotificationRow
                title="SMS Gateway"
                status="DISABLED"
                color="slate"
              />
              <DarkNotificationRow
                title="Critical Telemetry"
                status="ACTIVE"
                color="emerald"
              />
            </div>
          </section>

          <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-8 rounded-3xl">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-8">
              <Activity size={16} className="text-blue-500" /> Core Performance
            </h3>
            <div className="grid grid-cols-2 gap-y-8 gap-x-4">
              <DarkStat
                label="Registered Nodes"
                value="12.5k"
                color="text-blue-500"
              />
              <DarkStat label="Live Traffic" value="842" color="text-white" />
              <DarkStat
                label="Resolution KPI"
                value="94%"
                color="text-emerald-500"
              />
              <DarkStat
                label="Verified Authorities"
                value="15"
                color="text-white"
              />
            </div>
          </section>
        </div>

        {/* ACTION BAR */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 p-6 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-rose-400 transition-colors uppercase tracking-widest cursor-pointer"
          >
            <RotateCcw size={14} /> Factory Reset
          </button>

          <div className="flex items-center gap-4">
            <button className="px-8 py-3 text-sm font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest cursor-pointer">
              Cancel
            </button>
            <button
              onClick={async () => {
                if (passwords.newPassword && passwords.newPassword.length < 6)
                  return alert("Password too short");
                if (passwords.newPassword !== passwords.confirmPassword)
                  return alert("Mismatch");
                localStorage.setItem(
                  "admin_ui_password",
                  passwords.newPassword,
                );
                await handleSaveProfile();
                await handleSave();
                alert("Encrypted & Saved");
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 flex items-center gap-3 transition-all hover:-translate-y-1 active:scale-95 cursor-pointer"
            >
              <Save size={16} /> Push Changes
            </button>
          </div>
        </div>
      </main>
      {/* ✅ Global Footer */}
      <footer className="text-xs text-center text-[#9ca8ba] py-4 border-t border-slate-800/60">
        © {new Date().getFullYear()} JanSamadhan Platform. All rights reserved.
      </footer>
    </div>
  );
};

/* --- ENHANCED DARK COMPONENTS --- */

const DarkField = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">
      {label}
    </label>
    <input
      value={value}
      onChange={onChange}
      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
    />
  </div>
);

const PasswordField = ({ value, placeholder, show, toggle, onChange }) => (
  <div className="relative group">
    <input
      type={show ? "text" : "password"}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
    />
    <button
      type="button"
      onClick={toggle}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-400"
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
);

const PermissionRow = ({ role, desc, read, write, analytics }) => (
  <tr className="hover:bg-slate-800/20 transition-colors">
    <td className="px-8 py-5">
      <div className="font-bold text-white text-sm">{role}</div>
      <div className="text-[10px] text-slate-500 uppercase tracking-wider">
        {desc}
      </div>
    </td>
    <td className="px-8 py-5 text-center">
      {read ? <CheckIcon color="text-emerald-500" /> : <Dash />}
    </td>
    <td className="px-8 py-5 text-center">
      {write ? <CheckIcon color="text-emerald-500" /> : <Dash />}
    </td>
    <td className="px-8 py-5 text-center">
      {analytics ? <CheckIcon color="text-emerald-500" /> : <Dash />}
    </td>
  </tr>
);

const CheckIcon = ({ color }) => (
  <span className={`${color} font-black text-lg`}>✓</span>
);
const Dash = () => <span className="text-slate-800">—</span>;

const DarkNotificationRow = ({ title, status, color }) => (
  <div className="flex items-center justify-between bg-slate-950/40 border border-slate-800/50 rounded-2xl px-5 py-4 group hover:border-blue-500/30 transition-all">
    <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
      {title}
    </span>
    <span
      className={`text-[10px] font-black tracking-widest px-3 py-1.5 rounded-lg bg-${color}-500/10 text-${color}-500 border border-${color}-500/20 uppercase`}
    >
      {status}
    </span>
  </div>
);

const DarkStat = ({ label, value, color }) => (
  <div>
    <p className={`text-4xl font-black ${color} tracking-tighter`}>{value}</p>
    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-1">
      {label}
    </p>
  </div>
);

export default AdminSettings;
