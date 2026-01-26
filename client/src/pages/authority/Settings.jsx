import { useState } from "react";
import AuthorityLayout from "../../components/authority/AuthorityLayout";
import { SignOutButton } from "@clerk/clerk-react";

const AuthSettings = () => {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  return (
    <AuthorityLayout>
      <main className="flex justify-center py-10 px-6 bg-background-light min-h-screen">
        <div className="max-w-200 w-full flex flex-col gap-8">

          {/* PAGE HEADER */}
          <div className="px-4">
            <h1 className="text-4xl font-black">Authority Settings</h1>
            <p className="text-gray-500 mt-1">
              Manage your profile, jurisdiction, and notification preferences.
            </p>
          </div>

          {/* PROFILE INFO */}
          <section className="bg-white rounded-xl border shadow-sm">
            <h2 className="text-xl font-bold px-6 pt-6 pb-2">
              Profile Info
            </h2>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReadonlyField label="Authority Name" value="Jane Doe" />
              <ReadonlyField label="Authority ID" value="AUTH-9928-XY" />
            </div>
          </section>

          {/* JURISDICTION */}
          <section className="bg-white rounded-xl border shadow-sm">
            <h2 className="text-xl font-bold px-6 pt-6 pb-2">
              Area of Jurisdiction
            </h2>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReadonlyField
                label="Department"
                value="Public Works & Sanitation"
              />
              <ReadonlyField
                label="Assigned District"
                value="North Metro District 04"
              />
            </div>
          </section>

          {/* NOTIFICATIONS */}
          <section className="bg-white rounded-xl border shadow-sm">
            <h2 className="text-xl font-bold px-6 pt-6 pb-2">
              Notification Preferences
            </h2>

            <div className="p-6 flex flex-col gap-4">
              <ToggleRow
                icon="mail"
                title="Email Notifications"
                desc="Receive detailed daily summaries of new issues"
                enabled={emailNotif}
                onToggle={() => setEmailNotif(!emailNotif)}
              />

              <ToggleRow
                icon="notifications_active"
                title="Push Notifications"
                desc="Real-time alerts for status updates on active issues"
                enabled={pushNotif}
                onToggle={() => setPushNotif(!pushNotif)}
              />

              <ToggleRow
                icon="sms"
                title="SMS Alerts"
                desc="Emergency alerts for high-priority civic hazards"
                enabled={smsNotif}
                onToggle={() => setSmsNotif(!smsNotif)}
              />
            </div>
          </section>

          {/* LOGOUT */}
          <div className="px-4 pt-6">
            <hr className="mb-6" />
            <SignOutButton redirectUrl="/">
              <button className="flex items-center gap-2 border border-red-300 text-red-600 px-6 py-4 rounded-xl font-bold hover:bg-red-50 ml-auto">
                <span className="material-symbols-outlined">logout</span>
                Sign Out of Portal
              </button>
            </SignOutButton>
          </div>

        </div>
      </main>
    </AuthorityLayout>
  );
};

export default AuthSettings;

/* ---------- SMALL COMPONENTS ---------- */

const ReadonlyField = ({ label, value }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold">{label}</label>
    <div className="flex items-center bg-gray-100 rounded-lg h-14 px-4">
      <span className="text-base">{value}</span>
      <span className="material-symbols-outlined text-gray-500 text-sm ml-auto">
        lock
      </span>
    </div>
  </div>
);

const ToggleRow = ({ icon, title, desc, enabled, onToggle }) => (
  <div className="flex items-center justify-between py-3 border-b last:border-0">
    <div className="flex items-center gap-4">
      <div className="bg-primary/10 text-primary p-2 rounded-lg">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </div>

    <label className="relative inline-flex cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={enabled}
        onChange={onToggle}
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
    </label>
  </div>
);
