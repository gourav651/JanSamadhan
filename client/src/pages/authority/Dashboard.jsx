import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ChevronRight,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
} from "lucide-react";
import axios from "@/lib/axios";
import socket from "@/lib/socket";

import AuthorityLayout from "../../components/authority/AuthorityLayout";

const AuthDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentIssues, setRecentIssues] = useState([]);
  const [recentPage] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, recentRes, notifRes] = await Promise.all([
          axios.get("/api/authority/dashboard/stats"),
          axios.get("/api/authority/issues/recent", {
            params: { page: recentPage, limit: 5 },
          }),
          axios.get("/api/notifications/my"),
        ]);

        setStats(statsRes.data.data);
        setRecentIssues(recentRes.data.issues);
        setNotifications(notifRes.data.notifications || []);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      }
    };
    fetchDashboardData();
  }, [recentPage]);

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

  useEffect(() => {
    if (!user?.id) return;
    socket.on("notification", (data) => {
      setNotifications((prev) => [
        {
          _id: crypto.randomUUID(),
          title: data.title,
          message: data.message,
          link: data.link,
          isRead: false,
        },
        ...prev,
      ]);
    });
    return () => socket.off("notification");
  }, [user]);

  return (
    <AuthorityLayout>
      <div className="flex-1 overflow-y-auto bg-[#0B0F1A] text-slate-200">
        {/* HEADER */}
        <header className="border-b border-slate-800 bg-[#0F172A]/50 backdrop-blur-md px-8 py-6 sticky top-0 z-30">
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Authority Dashboard
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                District overview for{" "}
                <span className="text-blue-400 font-medium">
                  {user?.fullName}
                </span>
              </p>
            </div>

            {/* NOTIFICATIONS */}
            <div ref={notificationRef} className="relative">
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  const willOpen = !showNotifications;
                  setShowNotifications(willOpen);
                  if (willOpen && unreadCount > 0) {
                    await axios.patch("/api/notifications/read-all");
                    setNotifications((prev) =>
                      prev.map((n) => ({ ...n, isRead: true })),
                    );
                  }
                }}
                className="relative p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 cursor-pointer"
              >
                <Bell size={20} className="text-slate-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0B0F1A]">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-slate-800 font-bold text-sm text-white bg-slate-800/50">
                      Notifications
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-sm text-slate-500 text-center">
                          No new updates
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n._id}
                            onClick={() => {
                              navigate(n.link);
                              setShowNotifications(false);
                            }}
                            className={`px-4 py-3 text-sm cursor-pointer hover:bg-slate-800 transition-colors ${!n.isRead ? "bg-blue-500/5 border-l-2 border-blue-500" : ""}`}
                          >
                            <p className="font-semibold text-slate-200">
                              {n.title}
                            </p>
                            <p className="text-slate-500 text-xs mt-1">
                              {n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-8 space-y-8">
          {/* STATS GRID */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Open Issues"
              value={stats?.open || 0}
              icon={<AlertCircle size={20} />}
              color="red"
              trend="Requires action"
            />
            <StatCard
              title="In Progress"
              value={stats?.inProgress || 0}
              icon={<Clock size={20} />}
              color="amber"
              trend="Currently active"
            />
            <StatCard
              title="Resolved"
              value={stats?.resolved || 0}
              icon={<CheckCircle size={20} />}
              color="emerald"
              trend="All time"
            />

            {/* Clickable Assigned Card */}
            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => navigate("/authority/assigned-issues")}
              className="bg-blue-600 rounded-2xl p-6 cursor-pointer shadow-lg shadow-blue-900/20 flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute right-[-10%] top-[-10%] opacity-10 group-hover:scale-110 transition-transform">
                <User size={120} />
              </div>
              <div className="flex justify-between items-start z-10">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-100">
                  Assigned to Me
                </p>
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                  <User size={20} className="text-white" />
                </div>
              </div>
              <div className="mt-4 z-10">
                <p className="text-4xl font-black text-white">
                  {stats?.totalAssigned ?? 0}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
                  <p className="text-xs text-blue-100 font-medium">
                    {stats?.inProgress ?? 0} in progress
                  </p>
                </div>
              </div>
            </motion.div>
          </section>

          {/* TABLE SECTION */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl shadow-sm overflow-hidden backdrop-blur-sm">
            <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Activity size={18} className="text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Recent District Activity
                </h3>
              </div>
              <button
                onClick={() => navigate("/authority/assigned-issues")}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/30">
                    <TableHead>Issue Details</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reported At</TableHead>
                    <TableHead>Location</TableHead>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {recentIssues.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-slate-500 italic"
                      >
                        No recent issues found in your jurisdiction.
                      </td>
                    </tr>
                  ) : (
                    recentIssues.map((issue) => (
                      <RecentRow
                        key={issue._id}
                        issue={issue}
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

        {/* FOOTER */}
        <footer className="mt-auto px-8 py-8 border-t border-slate-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                J
              </div>
              <span className="text-sm font-bold text-slate-300">
                Jan<span className="text-blue-500">Samadhan</span>
              </span>
            </div>

            <p className="text-[11px] font-medium tracking-wide text-slate-500 ">
              © {new Date().getFullYear()} JanSamadhan Platform • Secure
              Authority Portal
            </p>

            <div className="flex gap-6">
              <button className="text-[11px] text-slate-600 hover:text-blue-400 transition-colors uppercase font-bold tracking-tighter">
                Privacy Policy
              </button>
              <button className="text-[11px] text-slate-600 hover:text-blue-400 transition-colors uppercase font-bold tracking-tighter">
                Support
              </button>
            </div>
          </div>
        </footer>
      </div>
    </AuthorityLayout>
  );
};

/* ---------- SUB-COMPONENTS ---------- */

const StatCard = ({ title, value, icon, color, trend }) => {
  const colorMap = {
    red: "text-red-400 bg-red-400/10 border-red-400/20",
    amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm hover:border-slate-700 transition-colors">
      <div className="flex justify-between items-start text-slate-400">
        <p className="text-xs font-bold uppercase tracking-widest">{title}</p>
        <div className={`p-2 rounded-xl border ${colorMap[color]}`}>{icon}</div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-black text-white">{value}</p>
        <p className="text-[10px] text-slate-500 mt-1 font-medium uppercase tracking-tighter">
          {trend}
        </p>
      </div>
    </div>
  );
};

const TableHead = ({ children }) => (
  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">
    {children}
  </th>
);

const RecentRow = ({ issue, onClick }) => {
  const statusStyles = {
    RESOLVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    IN_PROGRESS: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    REPORTED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    ASSIGNED: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  };

  return (
    <tr
      onClick={onClick}
      className="hover:bg-slate-800/40 transition-all cursor-pointer group"
    >
      <td className="px-6 py-4">
        <p className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
          {issue.title}
        </p>
        <p className="text-[10px] font-mono text-slate-600 uppercase">
          ID: {issue._id.slice(-6)}
        </p>
      </td>
      <td className="px-6 py-4">
        <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">
          {issue.category}
        </span>
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-tighter ${statusStyles[issue.status] || statusStyles.REPORTED}`}
        >
          {issue.status.replace("_", " ")}
        </span>
      </td>
      <td className="px-6 py-4 text-xs text-slate-500">
        {new Date(issue.createdAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })}
      </td>
      <td className="px-6 py-4 text-xs text-slate-500 max-w-50 truncate">
        {issue.location?.address || "Location Hidden"}
      </td>
      <td className="px-6 py-4 text-right">
        <ChevronRight
          size={18}
          className="text-slate-700 group-hover:text-slate-400 group-hover:translate-x-1 transition-all"
        />
      </td>
    </tr>
  );
};

export default AuthDashboard;
