import React from "react";
import { useNavigate } from "react-router-dom";

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
            <div className="flex gap-3 flex-wrap">
              <button className="flex items-center gap-2 h-10 px-4 rounded-lg bg-gray-100 border hover:border-primary">
                <span className="material-symbols-outlined text-gray-500">
                  category
                </span>
                <span className="text-sm font-medium">Category: All</span>
                <span className="material-symbols-outlined text-gray-400">
                  expand_more
                </span>
              </button>

              <button className="flex items-center gap-2 h-10 px-4 rounded-lg bg-gray-100 border hover:border-primary">
                <span className="material-symbols-outlined text-gray-500">
                  info
                </span>
                <span className="text-sm font-medium">Status: All</span>
                <span className="material-symbols-outlined text-gray-400">
                  expand_more
                </span>
              </button>

              <button className="flex items-center gap-2 h-10 px-4 rounded-lg bg-gray-100 border hover:border-primary">
                <span className="material-symbols-outlined text-gray-500">
                  calendar_today
                </span>
                <span className="text-sm font-medium">Last 30 Days</span>
                <span className="material-symbols-outlined text-gray-400">
                  expand_more
                </span>
              </button>

              <button className="flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-white font-bold">
                <span className="material-symbols-outlined">filter_list</span>
                Filter Results
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-8 flex flex-col gap-8">
          {/* STATS */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Open Issues"
              value="124"
              icon="error"
              color="red"
              footer="+12% from last week"
            />
            <StatCard
              title="In Progress"
              value="45"
              icon="pending"
              color="amber"
              footer="8 tickets added today"
            />
            <StatCard
              title="Resolved"
              value="892"
              icon="check_circle"
              color="emerald"
              footer="98% success rate"
            />
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
              <p className="text-3xl font-black mt-2">12</p>
              <p className="text-xs mt-1">3 high priority tasks</p>
            </div>
          </section>

          {/* RECENT ISSUES TABLE */}
          <section className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Recent Issues</h3>
              <button className="text-primary text-sm font-bold">
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
                  <RecentRow
                    title="Main Water Pipe Burst"
                    id="JS-9201"
                    category="Water Supply"
                    status="In Progress"
                    statusColor="amber"
                    date="Oct 24, 2023"
                    location="Sector 12, Main Road"
                  />
                  <RecentRow
                    title="Street Light Malfunction"
                    id="JS-8842"
                    category="Electricity"
                    status="Assigned"
                    statusColor="blue"
                    date="Oct 23, 2023"
                    location="Park View Apartments"
                  />
                  <RecentRow
                    title="Pothole Repair Needed"
                    id="JS-9128"
                    category="Road Maintenance"
                    status="Resolved"
                    statusColor="emerald"
                    date="Oct 22, 2023"
                    location="Near Gandhi Square"
                  />
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
}) => (
  <tr className="hover:bg-gray-50 transition">
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
        chevron_right
      </span>
    </td>
  </tr>
);
