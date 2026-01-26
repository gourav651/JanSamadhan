import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

import AuthorityLayout from "../../components/authority/AuthorityLayout";

const stats = [
  {
    label: "Total Open Issues",
    value: 124,
    sub: "+12% from last week",
    color: "red",
  },
  {
    label: "In Progress",
    value: 45,
    sub: "8 tickets added today",
    color: "amber",
  },
  {
    label: "Resolved",
    value: 892,
    sub: "98% success rate",
    color: "green",
  },
  {
    label: "Assigned to Me",
    value: 12,
    sub: "3 high priority tasks",
    color: "primary",
    clickable: true,
  },
];

const AuthDashboard = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentIssues, setRecentIssues] = useState([]);

  const [recentPage, setRecentPage] = useState(1);
  const [recentTotalPages, setRecentTotalPages] = useState(1);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = await getToken();

        const [statsRes, recentRes] = await Promise.all([
          axios.get("http://localhost:5000/api/authority/dashboard/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/authority/issues/recent", {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              page: recentPage,
              limit: 5,
            },
          }),
        ]);

        setStats(statsRes.data.data);
        setRecentIssues(recentRes.data.issues);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AuthorityLayout>
      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* HEADER */}
        <header className="bg-white border-b px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight">
                Authority Dashboard
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Welcome back. Here is what's happening in your district today.
              </p>
            </div>

            {/* FILTER BAR (UI only) */}
            
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-8 flex flex-col gap-8">
          {/* STATS */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Open Issues" value={stats?.open || 0} />
            <StatCard title="In Progress" value={stats?.inProgress || 0} />
            <StatCard title="Resolved" value={stats?.resolved || 0} />

            <div
              onClick={() => navigate("/authority/assigned-issues")}
              className="bg-primary rounded-xl p-6 cursor-pointer hover:opacity-95 transition"
            >
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold uppercase">
                  Assigned to Me
                </p>
                <span className="material-symbols-outlined bg-white/20 p-2 rounded-lg">
                  person
                </span>
              </div>

              {/* ✅ REAL DATA */}
              <p className="text-3xl font-black mt-2">
                {stats?.totalAssigned ?? 0}
              </p>

              <p className="text-xs mt-1">
                {stats?.inProgress ?? 0} in progress
              </p>
            </div>
          </section>

          {/* RECENT ISSUES TABLE */}
          <section className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Recent Issues</h3>
              <button
                onClick={() => navigate("/authority/assigned-issues")}
                className="text-primary text-sm font-bold"
              >
                View All Issues
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <TableHead>Issue Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reported Date</TableHead>
                    <TableHead>Location</TableHead>
                    <th />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentIssues.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-6 text-center text-gray-500"
                      >
                        No recent assigned issues
                      </td>
                    </tr>
                  ) : (
                    recentIssues.map((issue) => (
                      <RecentRow
                        key={issue._id}
                        title={issue.title}
                        id={issue._id.slice(-6)}
                        category={issue.category}
                        status={issue.status.replace("_", " ")}
                        statusColor={
                          issue.status === "RESOLVED"
                            ? "emerald"
                            : issue.status === "IN_PROGRESS"
                              ? "amber"
                              : "blue"
                        }
                        date={new Date(issue.createdAt).toLocaleDateString()}
                        location={issue.location?.address || "—"}
                        onClick={() =>
                          navigate(`/authority/issues/${issue._id}`)
                        }
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </AuthorityLayout>
  );
};

export default AuthDashboard;

/* ---------- SMALL COMPONENTS ---------- */

const StatCard = ({ title, value, icon, color, footer }) => (
  <div className="bg-white border rounded-xl p-6 shadow-sm">
    <div className="flex justify-between items-center">
      <p className="text-sm font-semibold uppercase text-gray-500">{title}</p>
      <span
        className={`material-symbols-outlined text-${color}-500 bg-${color}-50 p-2 rounded-lg`}
      >
        {icon}
      </span>
    </div>
    <p className="text-3xl font-black mt-2">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{footer}</p>
  </div>
);

const TableHead = ({ children }) => (
  <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">
    {children}
  </th>
);

const RecentRow = ({
  title,
  id,
  category,
  status,
  statusColor,
  date,
  location,
  onClick,
}) => (
  <tr onClick={onClick} className="hover:bg-gray-50 transition cursor-pointer">
    <td className="px-6 py-4">
      <p className="font-bold">{title}</p>
      <p className="text-xs text-gray-400">ID: #{id}</p>
    </td>
    <td className="px-6 py-4 text-sm">{category}</td>
    <td className="px-6 py-4">
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold bg-${statusColor}-100 text-${statusColor}-700`}
      >
        {status}
      </span>
    </td>
    <td className="px-6 py-4 text-sm text-gray-500">{date}</td>
    <td className="px-6 py-4 text-sm text-gray-500">{location}</td>
    <td className="px-6 py-4 text-right">
      <span className="material-symbols-outlined text-gray-400 cursor-pointer">
        chevron_right_arrow
      </span>
    </td>
  </tr>
);
