import React, { useEffect, useState } from "react";
import axios from "../../lib/axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState([]);
  const [deptStatus, setDeptStatus] = useState([]);
  const [authorityStats, setAuthorityStats] = useState([]);

  const ITEMS_PER_PAGE = 5;

  const [currentPage, setCurrentPage] = useState(1);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/admin/analytics/insights");

      setAnalyticsData(res.data.data);
      setDeptStatus(res.data.data.issueStatusByDepartment || []);
      setAuthorityStats(res.data.data.authorityPerformance || []);

      const formattedTrend = res.data.data.trend.map((t) => ({
        date: t._id.date,
        Reported: t.reported,
        Resolved: t.resolved,
      }));

      setTrendData(formattedTrend);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const res = await axios.get("/api/admin/analytics/export", {
        responseType: "blob", // 👈 VERY IMPORTANT
      });

      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "text/csv" }),
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "analytics-report.csv");

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const totalPages = Math.ceil(authorityStats.length / ITEMS_PER_PAGE);

  const paginatedAuthorities = authorityStats.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
  setCurrentPage(1);
}, [authorityStats]);


  return (
    <div className="dark bg-background-dark text-slate-100 h-full flex overflow-hidden font-display">
      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark">
        {/* ================= HEADER ================= */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0 bg-background-dark/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-black">
              Analytics &amp; Insights
            </h2>
            <div className="h-4 w-px bg-slate-800" />
            <span className="text-xs font-medium text-slate-600 uppercase tracking-widest">
              Executive Performance Tracking
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-black rounded-lg text-sm font-semibold border border-primary/20"
            >
              <span className="material-symbols-outlined">download</span>
              Download Analytics Report
            </button>
          </div>
        </header>

        {/* ================= CONTENT ================= */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* KPI Cards */}

          {loading || !analyticsData?.kpis ? (
            <div className="text-slate-500">Loading KPIs...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Avg Resolution Time",
                  value: `${analyticsData.kpis.avgResolutionDays} Days`,
                  icon: "schedule",
                  color: "blue",
                  width: "50%",
                },
                {
                  title: "% Issues Resolved",
                  value: `${analyticsData.kpis.resolutionRate}%`,
                  icon: "check_circle",
                  color: "emerald",
                  width: `${analyticsData.kpis.resolutionRate}%`,
                },
                {
                  title: "Critical Issue Backlog",
                  value: analyticsData.kpis.criticalBacklog,
                  icon: "emergency",
                  color: "red",
                  width: "100%",
                },
                {
                  title: "Authority Utilization Rate",
                  value: `${analyticsData.kpis.authorityUtilization}%`,
                  icon: "groups",
                  color: "purple",
                  width: `${analyticsData.kpis.authorityUtilization}%`,
                },
              ].map(({ title, value, icon, color, width }) => (
                <div
                  key={title}
                  className="bg-gray-700 border border-slate-800 p-6 rounded-xl relative overflow-hidden"
                >
                  <div
                    className={`bg-${color}-500/10 p-2 rounded-lg w-fit mb-4`}
                  >
                    <span
                      className={`material-symbols-outlined text-${color}-500`}
                    >
                      {icon}
                    </span>
                  </div>

                  <h4 className="text-slate-700 text-sm">{title}</h4>
                  <p className="text-2xl font-bold text-white mt-1">{value}</p>

                  <div
                    className={`absolute bottom-0 left-0 w-full h-1 bg-${color}-500/20`}
                  >
                    <div
                      className={`h-full bg-${color}-500`}
                      style={{ width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 chart-container h-100">
              <h3 className="font-bold text-white mb-4">
                Issue Volume Trend Over Time
              </h3>
              <div className="h-80">
                {trendData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-500">
                    No trend data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="date" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Legend />

                      <Line
                        type="monotone"
                        dataKey="Reported"
                        stroke="#38bdf8"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Resolved"
                        stroke="#38bdf8"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 chart-container h-100">
              <h3 className="font-bold text-white mb-4">
                Issue Status by Department
              </h3>
              <div className="space-y-4">
                {deptStatus.map((d) => (
                  <div key={d.department}>
                    <div className="flex justify-between text-xs mb-1 text-slate-300">
                      <span>{d.department}</span>
                      <span>{d.total} total</span>
                    </div>

                    <div className="flex h-2 rounded-full overflow-hidden bg-slate-800">
                      {/* Resolved */}
                      <div
                        className="bg-emerald-500"
                        style={{ width: `${(d.resolved / d.total) * 100}%` }}
                      />

                      {/* In Progress */}
                      <div
                        className="bg-orange-500"
                        style={{ width: `${(d.inProgress / d.total) * 100}%` }}
                      />

                      {/* Open */}
                      <div
                        className="bg-red-500"
                        style={{ width: `${(d.open / d.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}

                {/* Legend */}
                <div className="flex gap-4 text-[10px] text-slate-400 mt-4">
                  <span className="flex items-center gap-1">
                    <span className="size-2 bg-emerald-500 rounded-full" />{" "}
                    Resolved
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2 bg-orange-500 rounded-full" /> In
                    Progress
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2 bg-red-500 rounded-full" /> Open
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Authority Performance Table */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white">
                Authority Performance Overview
              </h3>
            </div>

            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900/70">
                <tr>
                  {[
                    "Authority Name",
                    "Department",
                    "Assigned Issues",
                    "Resolved %",
                    "Avg Res. Time",
                    "Performance",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {paginatedAuthorities.map((a) => {
                  const performance =
                    a.resolvedPercent >= 85
                      ? "GOOD"
                      : a.resolvedPercent >= 65
                        ? "AVERAGE"
                        : "POOR";

                  return (
                    <tr key={a.authorityName} className="hover:bg-slate-800/30">
                      <td className="px-6 py-4 font-semibold">
                        {a.authorityName}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {a.department}
                      </td>
                      <td className="px-6 py-4 text-slate-300">{a.assigned}</td>
                      <td className="px-6 py-4 text-slate-300">
                        {a.resolvedPercent}%
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {a.avgResolutionDays} Days
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase border">
                          {performance}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-xs font-semibold rounded-md border border-slate-700 text-slate-300 disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 text-xs rounded-md border ${
                          currentPage === i + 1
                            ? "bg-primary text-black border-primary"
                            : "border-slate-700 text-slate-400"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-xs font-semibold rounded-md border border-slate-700 text-slate-300 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
