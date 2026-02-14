import React, { useEffect, useState, useRef } from "react";
import axios from "../../lib/axios";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Bell } from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";

const AdminDashboard = () => {
  const { isSignedIn } = useUser();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const kpis = dashboardData
    ? [
        [
          "Total Issues Reported",
          dashboardData.cards.totalIssues,
          "trending_up",
          "",
        ],
        [
          "Resolved Issues",
          dashboardData.cards.resolvedIssues,
          "trending_up",
          "",
        ],
        [
          "Avg Resolution Time",
          `${dashboardData.cards.avgResolutionHours}h`,
          dashboardData.cards.avgResolutionTrend === "DOWN"
            ? "trending_down"
            : "trending_up",
          "",
        ],
        [
          "Active Citizens",
          dashboardData.cards.activeCitizens,
          "trending_up",
          "",
        ],
      ]
    : [];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("/api/admin/analytics/dashboard");
        setDashboardData(res.data.data);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleExport = async () => {
    try {
      const res = await axios.get("/api/admin/analytics/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "dashboard-report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed", err);
    }
  };
  useEffect(() => {
    axios.get("/api/notifications/my").then((res) => {
      setNotifications(res.data.notifications);
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans flex flex-col">
      {/* HEADER */}
      <header className="lg:sticky lg:top-0 z-30 flex items-center justify-between border-b border-slate-800/60 px-4 sm:px-6 lg:px-8 py-4 bg-[#0f172a]/80 backdrop-blur-md">
        <h2 className="text-xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Analytics Dashboard
        </h2>

        <div className="flex items-center gap-4">
          <button
            onClick={handleExport}
            className="hidden sm:flex bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-900/40 cursor-pointer"
          >
            Export Report
          </button>

          <div ref={notificationRef} className="relative">
            <button
              onClick={async () => {
                const willOpen = !showNotifications;
                setShowNotifications(willOpen);

                // ✅ MARK ALL AS READ WHEN OPENING
                if (willOpen && unreadCount > 0) {
                  await axios.patch("/api/notifications/read-all");

                  setNotifications((prev) =>
                    prev.map((n) => ({ ...n, isRead: true })),
                  );
                }
              }}
              className="relative p-2 rounded-full hover:bg-blue-400 "
            >
              <Bell
                size={24}
                className="group-hover:rotate-15 transition-transform duration-300 cursor-pointer slate-400"
              />

              {unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1
      bg-red-500 text-white text-[10px] font-bold rounded-full
      flex items-center justify-center"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                className="
absolute
right-0
top-12
w-[92vw] sm:w-80
max-w-sm
bg-[#111827]
border border-slate-800
rounded-2xl
shadow-2xl
z-50
overflow-hidden
ring-1 ring-white/5
"
              >
                {/* Header */}
                <div className="px-4 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/50">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100 tracking-tight">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="bg-blue-500 text-[10px] text-white px-1.5 py-0.5 rounded-full font-bold">
                        {unreadCount} New
                      </span>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={async () => {
                        await axios.patch("/api/notifications/read-all");
                        setNotifications((prev) =>
                          prev.map((n) => ({ ...n, isRead: true })),
                        );
                      }}
                      className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                    ></button>
                  )}
                </div>

                {/* Notification List */}
                <div className="max-h-100 overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <span className="material-symbols-outlined text-slate-600 text-3xl mb-2">
                        notifications_off
                      </span>
                      <p className="text-xs text-slate-500">All caught up!</p>
                    </div>
                  ) : (
                    notifications.slice(0, 8).map((n) => (
                      <div
                        key={n._id}
                        onClick={async () => {
                          await axios.patch(`/api/notifications/${n._id}/read`);
                          setNotifications((prev) =>
                            prev.map((x) =>
                              x._id === n._id ? { ...x, isRead: true } : x,
                            ),
                          );
                          setShowNotifications(false);
                        }}
                        className={`group px-4 py-4 border-b border-slate-800/50 cursor-pointer transition-all duration-200 
              ${!n.isRead ? "bg-blue-500/3 border-l-2 border-l-blue-500" : "hover:bg-slate-800/50 border-l-2 border-l-transparent"}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <p
                            className={`text-sm font-semibold transition-colors ${!n.isRead ? "text-white" : "text-slate-400"}`}
                          >
                            {n.title}
                          </p>
                          {!n.isRead && (
                            <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 group-hover:text-slate-400 transition-colors">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-slate-600 mt-2 font-mono uppercase tracking-tighter">
                          Just now
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {isSignedIn && (
            <UserButton
              appearance={{
                elements: { avatarBox: "w-9 h-9 border border-slate-700" },
              }}
            />
          )}
        </div>
      </header>

      {/* ================= SCROLLABLE CONTENT ================= */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-400 mx-auto w-full">
        {/* <div className="p-6 md:p-8 space-y-6 max-w-400 mx-auto"> */}
        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Platform Overview
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor real-time civic issues and resolution performance.
          </p>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map(([title, value, icon, delta]) => (
            <div
              key={title}
              className="p-6 rounded-2xl border border-slate-800 bg-[#1e293b]/40 hover:bg-[#1e293b]/60 transition-all group"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                {title}
              </p>
              <div className="flex items-end justify-between mt-4">
                <h3 className="text-3xl font-bold text-white">{value}</h3>
                <span
                  className={`px-2 py-1 rounded-md text-[10px] font-bold ${icon === "trending_up" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}
                >
                  {icon === "trending_up" ? "↑" : "↓"} 12%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        {/* left graph */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl bg-surface-dark border border-[#282f39] flex flex-col h-72 sm:h-80 lg:h-96">
            {/* HEADER */}
            <div className="items-center justify-between px-4 py-3">
              <h3 className="text-sm font-bold">
                Reports Submitted vs. Resolved (Last 7 Days)
              </h3>
            </div>
            {dashboardData && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.trend}>
                  <XAxis dataKey="_id.date" />
                  <YAxis />
                  <Tooltip cursor={{ fill: "#2d3748", opacity: 0.4 }} />
                  <Bar dataKey="reported" fill="#3b82f6" />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke="#22c55e"
                    strokeWidth={2}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* right donut */}
          <div className="h-80 rounded-xl bg-surface-dark border border-[#282f39] flex flex-col items-center justify-center">
            {/* HEADER */}
            <div className="px-4 py-3">
              <h3 className="text-sm font-bold">Issue Breakdown</h3>
            </div>
            {dashboardData && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData.categoryBreakdown}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {dashboardData.categoryBreakdown.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* RECENT REPORTS TABLE */}
        <div className="rounded-2xl border border-slate-800 bg-[#1e293b]/20 overflow-hidden shadow-2xl">
          <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
            <h3 className="font-bold text-lg text-white">Recent Reports</h3>
          </div>
          <table className="w-full">
            <thead className="text-slate-500 bg-slate-900/50 text-[11px] uppercase tracking-widest font-bold">
              <tr>
                {["ID", "Issue", "Location", "Date", "Status"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/50">
              {dashboardData?.recentIssues?.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-[#9ca8ba]">
                    No recent issues found
                  </td>
                </tr>
              )}

              {dashboardData?.recentIssues?.map((issue) => (
                <tr
                  key={issue._id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-blue-400 text-xs tracking-tighter">
                    #{issue._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-200">
                    {issue.title}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {issue.location?.address}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-bold border border-rose-500/20">
                      {issue.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="text-xs text-center text-[#9ca8ba] pt-4">
          © {new Date().getFullYear()} JanSamadhan Platform . All rights
          reserved.
        </footer>
      </div>
    </div>
  );
};
export default AdminDashboard;
