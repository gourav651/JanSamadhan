import React, { useEffect, useState } from "react";
import axios from "../../lib/axios";
import ToggleSwitch from "../../components/ui/ToggleSwitch";
import ToggleRow from "../../components/ui/ToggleRow";
import { UserButton, useUser } from "@clerk/clerk-react";

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

    // keep state synced with DB
    setProfile(res.data.data);
  };

  const handleReset = async () => {
    const res = await axios.post("/api/admin/settings/reset");
    setSettings(res.data.data);
  };
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 🔹 1. INSTANT LOCAL PREVIEW (this fixes your issue)
    const previewUrl = URL.createObjectURL(file);
    setProfile((prev) => ({
      ...prev,
      profileImage: previewUrl,
      _localFile: file, // keep original file for upload
    }));

    // 🔹 2. Upload to Cloudinary
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

    if (!data.secure_url) {
      console.error("Cloudinary upload failed:", data);
      return;
    }

    setProfile((prev) => ({
      ...prev,
      profileImage: data.secure_url,
    }));
  };

  return (
    <div className="bg-background-light text-slate-900 font-display min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-border-light sticky top-0 z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary size-8 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white">
                settings
              </span>
            </div>
            <h1 className="text-xl font-bold">CivicAdmin</h1>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <h2 className="text-lg font-semibold text-slate-700">
            System Settings
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {isSignedIn && (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          )}
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-8 space-y-8">
        {/* PROFILE SETTINGS */}
        <section className="settings-card bg-white">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold">Profile Settings</h3>
            <p className="text-sm text-slate-500">
              Manage your personal administrative information
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center gap-3">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-36 h-36 rounded-2xl overflow-hidden border bg-slate-100">
                  {profile?.profileImage ? (
                    <img
                      src={profile.profileImage}
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      No Image
                    </div>
                  )}
                </div>

                <label className="cursor-pointer text-sm font-semibold text-primary">
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>

              <p className="text-xs text-slate-500 text-center">
                Manage profile photo via account
              </p>
            </div>

            <div className="md:col-span-2 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field
                  label="Full Name"
                  value={profile?.name || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />

                <Field
                  label="Email Address"
                  value={profile?.email || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-5">
                <label className="text-xs font-bold uppercase text-slate-600">
                  Change Password
                </label>

                {/* NEW PASSWORD */}
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder="New password"
                    className="w-full border rounded-lg px-3 py-2 pr-10 text-sm"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({ ...prev, new: !prev.new }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    👁
                  </button>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm password"
                    className="w-full border rounded-lg px-3 py-2 pr-10 text-sm"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    👁
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROLE & ACCESS (READ ONLY) */}
        <section className="settings-card bg-white">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold">Role & Access Control</h3>
            <p className="text-sm text-slate-500">
              Summary of permissions across different user levels
            </p>
          </div>

          <table className="w-full">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-center">Read Access</th>
                <th className="px-6 py-3 text-center">Write Access</th>
                <th className="px-6 py-3 text-center">Analytics</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {/* ADMIN */}
              <tr>
                <td className="px-6 py-4">
                  <p className="font-medium">Admin</p>
                  <p className="text-sm text-slate-500">
                    Full system access and configurations
                  </p>
                </td>
                <PermissionCell allowed />
                <PermissionCell allowed />
                <PermissionCell allowed />
              </tr>

              {/* AUTHORITY */}
              <tr>
                <td className="px-6 py-4">
                  <p className="font-medium">Authority</p>
                  <p className="text-sm text-slate-500">
                    Department level issue management
                  </p>
                </td>
                <PermissionCell allowed />
                <PermissionCell allowed />
                <PermissionCell />
              </tr>

              {/* CITIZEN */}
              <tr>
                <td className="px-6 py-4">
                  <p className="font-medium">Citizen</p>
                  <p className="text-sm text-slate-500">
                    Public reporting and tracking only
                  </p>
                </td>
                <PermissionCell allowed />
                <PermissionCell />
                <PermissionCell />
              </tr>
            </tbody>
          </table>
        </section>

        {/* NOTIFICATION & SYSTEM OVERVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notification Summary */}
          <section className="settings-card bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notification Summary</h3>
            </div>

            <NotificationRow
              title="Email Notifications"
              desc="Daily summaries and alerts"
              status="ACTIVE"
            />

            <NotificationRow
              title="SMS Alerts"
              desc="Urgent mobile notifications"
              status="DISABLED"
            />

            <NotificationRow
              title="System Critical Alerts"
              desc="Infrastructure health monitoring"
              status="ACTIVE"
            />
          </section>

          {/* Platform Statistics */}
          <section className="settings-card bg-white p-6">
            <h3 className="font-semibold mb-6">Platform Statistics</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-3xl font-bold text-blue-600">12.5k</p>
                <p className="text-sm text-slate-500">Total Registered Users</p>
              </div>

              <div>
                <p className="text-3xl font-bold text-slate-900">842</p>
                <p className="text-sm text-slate-500">Active Reports Today</p>
              </div>

              <div>
                <p className="text-3xl font-bold text-slate-900">94%</p>
                <p className="text-sm text-slate-500">Resolution Rate</p>
              </div>

              <div>
                <p className="text-3xl font-bold text-slate-900">15</p>
                <p className="text-sm text-slate-500">Active Authorities</p>
              </div>
            </div>
          </section>

          {/* System Health */}
          <section className="settings-card bg-white p-6 space-y-4">
            <h3 className="font-semibold">System Health</h3>

            <div className="flex gap-6">
              <HealthBox label="Server Status" value="Optimal" good />
              <HealthBox label="API Latency" value="124ms" />
            </div>
          </section>

          {/* Configuration Defaults */}
          <section className="settings-card bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Configuration Defaults</h3>
            </div>

            <div>
              <p className="text-xs uppercase text-slate-500">
                Default SLA Threshold
              </p>
              <p className="font-semibold">48 Hours</p>
            </div>

            <div>
              <p className="text-xs uppercase text-slate-500">
                Escalation Protocol
              </p>
              <p className="text-sm text-slate-700">
                Escalate after 24h of inactivity
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-700">
              <span className="text-green-600">✓</span>
              Detailed audit logging enabled
            </div>
          </section>
        </div>
        {/* PAGE ACTION BAR */}
        <section className="border-t bg-white py-6 px-8 rounded-lg">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <button
              onClick={handleReset}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Reset to Defaults
            </button>

            <div className="flex items-center gap-4">
              <button className="text-sm text-slate-600">Cancel</button>

              <button
                onClick={async () => {
                  if (passwords.newPassword || passwords.confirmPassword) {
                    if (passwords.newPassword.length < 6) {
                      alert("Password must be at least 6 characters");
                      return;
                    }

                    if (passwords.newPassword !== passwords.confirmPassword) {
                      alert("Passwords do not match");
                      return;
                    }

                    localStorage.setItem(
                      "admin_ui_password",
                      passwords.newPassword,
                    );
                  }

                  await handleSaveProfile();
                  await handleSave();
                  alert("Changes saved successfully");
                }}
                className="px-6 py-2 bg-blue-700 text-white rounded-lg font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* GLOBAL FOOTER */}
      <footer className="border-t bg-white py-4 px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500 gap-2">
          <span>© 2024 JANSAMADHAN Platform. All rights reserved.</span>

          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-700">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-700">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-700">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* SMALL COMPONENTS */

const Field = ({ label, value, type = "text", placeholder, onChange }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold uppercase text-slate-600">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border rounded-lg px-3 py-2 text-sm"
    />
  </div>
);

const RoleRow = ({ role, desc, perms, onChange }) => (
  <tr>
    <td className="px-6 py-4">
      <p className="font-medium">{role}</p>
      <p className="text-sm text-slate-500">{desc}</p>
    </td>

    {["read", "write", "analytics"].map((key) => (
      <td key={key} className="px-6 py-4 text-center">
        <ToggleSwitch
          checked={perms?.[key] || false}
          onChange={(val) => onChange(key, val)}
        />
      </td>
    ))}
  </tr>
);

const PermissionCell = ({ allowed = false }) => (
  <td className="px-6 py-4 text-center">
    {allowed ? (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
        ✓
      </span>
    ) : (
      <span className="text-slate-400">—</span>
    )}
  </td>
);

const NotificationRow = ({ title, desc, status }) => (
  <div className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3">
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>

    <span
      className={`text-xs font-semibold px-3 py-1 rounded-full ${
        status === "ACTIVE"
          ? "bg-green-100 text-green-700"
          : "bg-slate-200 text-slate-600"
      }`}
    >
      {status}
    </span>
  </div>
);

const StatItem = ({ label, value }) => (
  <div>
    <p className="text-2xl font-bold text-blue-600">{value}</p>
    <p className="text-sm text-slate-500">{label}</p>
  </div>
);

const HealthBox = ({ label, value, good }) => (
  <div className="flex-1 border rounded-lg p-4">
    <p className="text-xs uppercase text-slate-500">{label}</p>
    <p
      className={`font-semibold ${good ? "text-green-600" : "text-slate-800"}`}
    >
      {value}
    </p>
  </div>
);

export default AdminSettings;
