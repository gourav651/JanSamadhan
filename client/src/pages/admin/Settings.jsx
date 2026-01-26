import React from "react";
import ToggleSwitch from "../../components/ui/ToggleSwitch";
import ToggleRow from "../../components/ui/ToggleRow";

const AdminSettings = () => {
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
          <span className="material-symbols-outlined text-slate-400">
            help_outline
          </span>
          <div className="size-8 rounded-full bg-slate-200" />
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
              <div className="size-36 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8kasR-fpMPcnWOI59V2-J7eyCi4-2rA_PINO3nzAOFU-DfIhhF-QZKVzYlQ_KC5tC3DYef5WEQ5b4A7xEYU3DbAX5_T_9UZ-q7R3zEPgVeNys2aziLVI_LRbsJ15dwW5pJakP30Oas4RKiE0EpQaouGcJOp23coWuYiBF047quWgnTkyjhm49qMOg4zAemOtYn9zx8OTCZICLWnhYdN8_jre0siOreLoFKsYxBp6LfR-6pc-z4_2rW44rkmggv4duxRrduuk-mS0"
                  alt=""
                />
              </div>
              <button className="text-sm font-semibold text-primary">
                Change Photo
              </button>
            </div>

            <div className="md:col-span-2 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Full Name" value="Alexander Pierce" />
                <Field
                  label="Email Address"
                  value="alex.pierce@cityhall.gov"
                />
              </div>
              <Field label="Current Password" type="password" placeholder="••••••••" />
              <Field
                label="New Password"
                type="password"
                placeholder="Leave blank to keep current"
              />
            </div>
          </div>
        </section>

        {/* ROLE & ACCESS */}
        <section className="settings-card bg-white">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold">Role & Access Control</h3>
            <p className="text-sm text-slate-500">
              Define what different user levels can see and do
            </p>
          </div>

          <table className="w-full">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-center">Read</th>
                <th className="px-6 py-3 text-center">Write</th>
                <th className="px-6 py-3 text-center">Analytics</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <RoleRow role="Admin" desc="Full system access" perms={[false, false, false]} />
              <RoleRow role="Authority" desc="Department issue management" perms={[false, false, false]} />
              <RoleRow role="Citizen" desc="Public reporting only" perms={[false, false, false]} />
            </tbody>
          </table>
        </section>

        {/* NOTIFICATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="settings-card bg-white p-6 space-y-6">
            <h3 className="font-semibold">Notification Settings</h3>

            <ToggleRow
              title="Email Notifications"
              description="Receive daily summaries and critical alerts"
              checked={false}
            />
            <ToggleRow
              title="SMS Alerts"
              description="Urgent mobile notifications"
              checked={false}
            />
            <ToggleRow
              title="Critical System Alerts"
              description="Override quiet hours for security issues"
              checked={false}
            />
          </section>

          <section className="settings-card bg-white p-6 space-y-4">
            <h3 className="font-semibold">System Preferences</h3>
            <Field label="Default SLA Threshold (Hours)" value="48" />
            <select className="w-full border rounded-lg px-3 py-2">
              <option>Escalate after 24h of inactivity</option>
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked />
              Enable detailed audit logging
            </label>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t bg-white py-6 px-8">
        <div className="max-w-5xl mx-auto flex justify-between">
          <button className="text-sm text-slate-500">Reset to Defaults</button>
          <span>
          <button className="text-sm text-slate-600">Cancel</button>
          <button className="px-6 py-2 ml-5 bg-blue-700 text-white rounded-lg font-semibold">
            Save Changes
          </button>
          </span>
        </div>
      </footer>
    </div>
  );
};

/* SMALL COMPONENTS */

const Field = ({ label, value, type = "text", placeholder }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold uppercase text-slate-600">
      {label}
    </label>
    <input
      type={type}
      defaultValue={value}
      placeholder={placeholder}
      className="w-full border rounded-lg px-3 py-2 text-sm"
    />
  </div>
);

const RoleRow = ({ role, desc, perms }) => (
  <tr>
    <td className="px-6 py-4">
      <p className="font-medium">{role}</p>
      <p className="text-sm text-slate-500">{desc}</p>
    </td>
    {perms.map((p, i) => (
      <td key={i} className="px-6 py-4 text-center">
        <ToggleSwitch checked={p} />
      </td>
    ))}
  </tr>
);

export default AdminSettings;
