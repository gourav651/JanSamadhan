import { useEffect, useState } from "react";
import AuthorityLayout from "../../components/authority/AuthorityLayout";
import { SignOutButton, useAuth } from "@clerk/clerk-react";
import axios from "axios";

const AuthSettings = () => {
  const { getToken } = useAuth();

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

        const data = res.data.data;

        setProfile(data);
      } catch (err) {
        console.error("Settings load error", err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [getToken]);

  if (loading) {
    return (
      <AuthorityLayout>
        <div className="flex items-center justify-center h-screen text-gray-400">
          Loading settings…
        </div>
      </AuthorityLayout>
    );
  }

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
            <h2 className="text-xl font-bold px-6 pt-6 pb-2">Profile Info</h2>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReadonlyField
                label="Authority Name"
                value={profile?.name || "—"}
              />
              <ReadonlyField
                label="Authority ID"
                value={profile?.clerkUserId || "—"}
              />
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
                value={profile?.department || "—"}
              />
              <ReadonlyField
                label="Assigned District"
                value={profile?.assignedArea || "—"}
              />
            </div>
          </section>

          {/* PLATFORM CONNECTIVITY & API STATUS */}
          <section className="settings-card bg-white p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  Platform Connectivity & API Status
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Real-time status of critical system integrations and data
                  pipelines.
                </p>
              </div>

              <span className="material-symbols-outlined text-slate-400">
                hub
              </span>
            </div>

            <div className="divide-y">
              {/* DATABASE */}
              <StatusRow
                icon="storage"
                title="Database Connectivity"
                desc="Real-time synchronization with primary citizen database"
                status="CONNECTED"
                statusType="success"
              />

              {/* EXTERNAL API */}
              <StatusRow
                icon="api"
                title="External API Integrations"
                desc="Gateway connection to department service endpoints"
                status="MAINTENANCE"
                statusType="warning"
              />

              {/* CLOUD STORAGE */}
              <StatusRow
                icon="cloud"
                title="Cloud Storage Sync"
                desc="Attachment and document storage redundancy"
                status="CONNECTED"
                statusType="success"
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

const StatusRow = ({ icon, title, desc, status, statusType }) => {
  const statusStyles = {
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700",
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <div className="bg-slate-100 text-slate-700 p-2 rounded-lg">
          <span className="material-symbols-outlined">{icon}</span>
        </div>

        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-slate-500">{desc}</p>
        </div>
      </div>

      <span
        className={`text-xs font-semibold px-3 py-1 rounded-full ${
          statusStyles[statusType]
        }`}
      >
        {status}
      </span>
    </div>
  );
};
