import React, { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { Download, TrendingUp, BarChart3, Users, Activity } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
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
        responseType: "blob",
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
  useEffect(() => {
    setCurrentPage(1);
  }, [authorityStats]);

  const totalPages = Math.ceil(authorityStats.length / ITEMS_PER_PAGE);
  const paginatedAuthorities = authorityStats.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="min-h-screen w-full bg-[#0b1120] text-slate-200 flex flex-col p-6 font-sans">
      <div className="grow p-2 md:p-1">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* ================= HEADER ================= */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
                <Activity className="text-blue-500" size={32} />
                Analytics & Insights
              </h1>
              <p className="text-slate-400 mt-2 text-lg">
                Executive Performance Tracking & Civic Metrics
              </p>
            </div>
            <button
              onClick={handleDownloadReport}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
            >
              <Download size={18} />
              Export Data
            </button>
          </div>

          {/* ================= KPI CARDS ================= */}
          {loading || !analyticsData?.kpis ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-slate-900/50 rounded-2xl border border-slate-800"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Avg Resolution",
                  value: `${analyticsData.kpis.avgResolutionDays}d`,
                  icon: <TrendingUp />,
                  color: "text-blue-400",
                  bg: "bg-blue-500/10",
                },
                {
                  title: "Resolution Rate",
                  value: `${analyticsData.kpis.resolutionRate}%`,
                  icon: <BarChart3 />,
                  color: "text-emerald-400",
                  bg: "bg-emerald-500/10",
                },
                {
                  title: "Critical Backlog",
                  value: analyticsData.kpis.criticalBacklog,
                  icon: <Activity />,
                  color: "text-red-400",
                  bg: "bg-red-500/10",
                },
                {
                  title: "Authority Util.",
                  value: `${analyticsData.kpis.authorityUtilization}%`,
                  icon: <Users />,
                  color: "text-purple-400",
                  bg: "bg-purple-500/10",
                },
              ].map((kpi, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-6 rounded-2xl flex items-center gap-5 hover:border-slate-700 transition-colors"
                >
                  <div className={`${kpi.bg} ${kpi.color} p-4 rounded-xl`}>
                    {kpi.icon}
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
                      {kpi.title}
                    </p>
                    <p className="text-2xl font-bold text-white tracking-tight">
                      {kpi.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================= CHARTS ROW ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Issue Trends Chart */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-8 rounded-3xl shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-500" /> Issue
                  Trends
                </h3>
                {/* Visual Legend for the Line Chart */}
                <div className="flex gap-4 text-[10px] font-black tracking-widest uppercase">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-blue-500" />
                    <span className="text-blue-400">Reported</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-emerald-500" />
                    <span className="text-emerald-400">Resolved</span>
                  </div>
                </div>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient
                        id="colorReported"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1e293b"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      stroke="#475569"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#475569"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#1e293b",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="Reported"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorReported)"
                    />
                    <Area
                      type="monotone"
                      dataKey="Resolved"
                      stroke="#10b981"
                      strokeWidth={3}
                      fillOpacity={0}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Departmental Load Chart */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-8 rounded-3xl shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-white">
                  Departmental Load
                </h3>
                {/* Legend for Departmental Status colors */}
                <div className="flex gap-3 text-[9px] font-black tracking-widest uppercase">
                  <span className="flex items-center gap-1 text-emerald-500">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />{" "}
                    Resolved
                  </span>
                  <span className="flex items-center gap-1 text-amber-500">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />{" "}
                    Pending
                  </span>
                  <span className="flex items-center gap-1 text-rose-500">
                    <div className="w-2 h-2 rounded-full bg-rose-500" /> Open
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {deptStatus.map((d) => (
                  <div key={d.department} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300 uppercase tracking-wider">
                        {d.department}
                      </span>
                      <span className="text-slate-500">{d.total} cases</span>
                    </div>
                    <div className="flex h-3 rounded-full overflow-hidden bg-slate-800 shadow-inner">
                      <div
                        className="bg-emerald-500"
                        style={{ width: `${(d.resolved / d.total) * 100}%` }}
                      />
                      <div
                        className="bg-amber-500"
                        style={{ width: `${(d.inProgress / d.total) * 100}%` }}
                      />
                      <div
                        className="bg-rose-500"
                        style={{ width: `${(d.open / d.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= PERFORMANCE TABLE ================= */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-800/60 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                Authority Performance Leaderboard
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-800/30 text-slate-500">
                    {[
                      "Official",
                      "Department",
                      "Resolved %",
                      "Avg Time",
                      "Rating",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {paginatedAuthorities.map((a) => (
                    <tr
                      key={a.authorityName}
                      className="hover:bg-blue-500/5 transition-colors group"
                    >
                      <td className="px-8 py-5 font-bold text-white group-hover:text-blue-400">
                        {a.authorityName}
                      </td>
                      <td className="px-8 py-5 text-slate-400">
                        {a.department}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-mono">
                            {a.resolvedPercent}%
                          </span>
                          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="bg-blue-500 h-full"
                              style={{ width: `${a.resolvedPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-slate-400 font-mono">
                        {a.avgResolutionDays}d
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border ${
                            a.resolvedPercent >= 85
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : a.resolvedPercent >= 65
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                          }`}
                        >
                          {a.resolvedPercent >= 85
                            ? "ELITE"
                            : a.resolvedPercent >= 65
                              ? "STEADY"
                              : "CRITICAL"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-6 border-t border-slate-800/60 flex items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
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
                  className="p-2 text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="text-xs text-center text-[#9ca8ba] pt-9 border-t border-slate-800/60">
        © {new Date().getFullYear()} JanSamadhan Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default AdminAnalytics;
