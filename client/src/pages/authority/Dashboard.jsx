import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "@/lib/axios";
import { useRef } from "react";
import socket from "@/lib/socket";

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
  const { user } = useUser();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentIssues, setRecentIssues] = useState([]);

  const [recentPage, setRecentPage] = useState(1);
  const [recentTotalPages, setRecentTotalPages] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

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

    return () => {
      socket.off("notification");
    };
  }, [user]);

  return (
    <AuthorityLayout>
      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* HEADER */}
        <header className="bg-white border-b px-8 py-6">
          <div className="flex items-center justify-between w-full">
            {/* LEFT */}
            <div>
              <h2 className="text-3xl font-black tracking-tight">
                Authority Dashboard
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Welcome back. Here is what's happening in your district today.
              </p>
            </div>

            {/* RIGHT – NOTIFICATIONS */}
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
                className="relative p-2 rounded-full hover:bg-gray-100"
              >
                <span className="material-symbols-outlined text-gray-700">
                  notifications
                </span>

                {unreadCount > 0 && (
                  <span
                    className="
          absolute -top-1 -right-1
          min-w-4 h-4 px-1
          bg-red-500 text-white text-[10px] font-bold
          rounded-full flex items-center justify-center
        "
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                {showNotifications && (
                  <div
                    className="
      absolute right-0 mt-3 w-80
      bg-white border rounded-xl shadow-lg
      z-50 overflow-hidden
    "
                  >
                    <div className="px-4 py-3 border-b font-bold text-sm">
                      Notifications
                    </div>

                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-sm text-gray-500 text-center">
                        No notifications
                      </div>
                    ) : (
                      <ul className="max-h-80 overflow-y-auto divide-y">
                        {notifications.map((n) => (
                          <li
                            key={n._id}
                            onClick={() => {
                              navigate(n.link);
                              setShowNotifications(false);
                            }}
                            className={`
              px-4 py-3 text-sm cursor-pointer
              hover:bg-gray-50
              ${!n.isRead ? "bg-blue-50" : ""}
            `}
                          >
                            <p className="font-semibold">{n.title}</p>
                            <p className="text-gray-500 text-xs mt-1">
                              {n.message}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </button>
            </div>
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
