import React, { useEffect, useState, useRef } from "react";
import axios from "../../lib/axios";
import { UserButton, useUser } from "@clerk/clerk-react";

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
    <div className="dark bg-background-dark font-display h-full flex flex-col overflow-hidden">
      {/* ================= HEADER (STAYS FIXED) ================= */}
      <header
        className="
        sticky top-0 z-50
        flex items-center justify-between
        border-b border-[#282f39]
        px-6 py-3
        bg-background-dark
      "
      >
        <h2 className="text-xl font-bold tracking-tight">
          Analytics Dashboard
        </h2>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="hidden sm:flex bg-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 transition"
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
              className="relative p-2 rounded-full hover:bg-blue-400"
            >
              <span className="material-symbols-outlined">notifications</span>

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
              <div className="absolute right-0 top-12 w-88 bg-amber-200 border border-[#282f39] rounded-xl shadow-lg z-50">
                <div className="px-4 py-3 flex items-center justify-between border-b border-[#282f39]">
                  <span className="font-semibold text-sm">Notifications</span>

                  {unreadCount > 0 && (
                    <button
                      onClick={async () => {
                        await axios.patch("/api/notifications/read-all");

                        setNotifications((prev) =>
                          prev.map((n) => ({ ...n, isRead: true })),
                        );
                      }}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="p-4 text-sm text-[#9ca8ba]">
                    No notifications
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n._id}
                      onClick={async () => {
                        // 1️⃣ mark as read in DB
                        await axios.patch(`/api/notifications/${n._id}/read`);

                        // 2️⃣ update local state
                        setNotifications((prev) =>
                          prev.map((x) =>
                            x._id === n._id ? { ...x, isRead: true } : x,
                          ),
                        );

                        // 3️⃣ optional: close dropdown
                        setShowNotifications(false);

                        // 4️⃣ optional (later): navigate
                        // if (n.link) navigate(n.link);
                      }}
                      className={`px-4 py-3 text-sm cursor-pointer hover:bg-[#2a303b]
      ${!n.isRead ? "bg-[#243044]" : ""}`}
                    >
                      <p className="font-medium">{n.title}</p>
                      <p className="text-xs text-[#9ca8ba] mt-1">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

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

      {/* ================= SCROLLABLE CONTENT ================= */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 space-y-6 max-w-400 mx-auto">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold">Platform Overview</h1>
            <p className="text-[#9ca8ba] text-sm mt-1">
              Monitor real-time civic issues and resolution performance.
            </p>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map(([title, value, icon, delta]) => (
              <div
                key={title}
                className="p-5 rounded-xl border border-[#282f39] bg-surface-dark"
              >
                <p className="text-sm text-[#9ca8ba]">{title}</p>

                <div className="flex items-center gap-2 mt-2">
                  <h3 className="text-3xl font-bold">{value}</h3>

                  <span
                    className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded
            ${
              icon === "trending_up"
                ? "text-green-400 bg-green-400/10"
                : "text-red-400 bg-red-400/10"
            }`}
                  >
                    <span className="material-symbols-outlined text-xs">
                      {icon}
                    </span>
                    {delta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* CHARTS */}
          {/* left graph */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl bg-surface-dark border border-[#282f39] flex flex-col">
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
                    <Tooltip />
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
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* TABLE */}
          <div className="rounded-xl border border-[#282f39] bg-surface-dark overflow-hidden">
            <div className="p-4 font-bold text-lg">Recent Reports</div>

            <table className="w-full text-sm">
              <thead className="bg-[#1e232d] text-[#9ca8ba]">
                <tr>
                  {["ID", "Issue", "Location", "Date", "Status", ""].map(
                    (h) => (
                      <th key={h} className="p-3 text-left font-medium">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
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
                    className="border-t border-[#282f39] hover:bg-[#2a303b] transition"
                  >
                    <td className="p-3 font-medium">
                      #{issue._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="p-3">{issue.title}</td>
                    <td className="p-3 text-[#9ca8ba]">
                      {issue.location?.address || "—"}
                    </td>
                    <td className="p-3 text-[#9ca8ba]">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span className="text-red-400 bg-red-400/10 px-2 py-0.5 rounded text-xs">
                        {issue.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="text-xs text-center text-[#9ca8ba] pt-4">
            © {new Date().getFullYear()} CivicAdmin Platform . All rights
            reserved.
          </footer>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
