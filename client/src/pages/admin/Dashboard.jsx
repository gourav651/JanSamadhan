import React from "react";

const AdminDashboard = () => {
  return (
    <div className="dark bg-background-dark font-display h-full flex flex-col overflow-hidden">
      
      {/* ================= HEADER (STAYS FIXED) ================= */}
      <header className="
        sticky top-0 z-50
        flex items-center justify-between
        border-b border-[#282f39]
        px-6 py-3
        bg-background-dark
      ">
        <h2 className="text-xl font-bold tracking-tight">
          Analytics Dashboard
        </h2>

        <div className="flex items-center gap-3">
          <button className="hidden sm:flex bg-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 transition">
            Export Report
          </button>

          <button className="p-2 rounded-lg hover:bg-[#282f39]">
            <span className="material-symbols-outlined">notifications</span>
          </button>

          <button className="p-2 rounded-lg hover:bg-[#282f39]">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
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
            {[
              ["Total Issues Reported", "1,245", "trending_up", "5%"],
              ["Resolved Issues", "890", "trending_up", "12%"],
              ["Avg Resolution Time", "48h", "trending_down", "-2h"],
              ["Active Citizens", "340", "trending_up", "3%"],
            ].map(([title, value, icon, delta]) => (
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-80 rounded-xl bg-surface-dark border border-[#282f39] flex items-center justify-center text-[#9ca8ba]">
              Reports Submitted vs. Resolved (Chart)
            </div>

            <div className="h-80 rounded-xl bg-surface-dark border border-[#282f39] flex items-center justify-center text-[#9ca8ba]">
              Issue Breakdown (Donut)
            </div>
          </div>

          {/* TABLE */}
          <div className="rounded-xl border border-[#282f39] bg-surface-dark overflow-hidden">
            <div className="p-4 font-bold text-lg">
              Recent Critical Reports
            </div>

            <table className="w-full text-sm">
              <thead className="bg-[#1e232d] text-[#9ca8ba]">
                <tr>
                  {["ID", "Issue", "Location", "Date", "Status", ""].map((h) => (
                    <th key={h} className="p-3 text-left font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <tr className="border-t border-[#282f39] hover:bg-[#2a303b] transition">
                  <td className="p-3 font-medium">#REQ-2049</td>
                  <td className="p-3">Large Pothole</td>
                  <td className="p-3 text-[#9ca8ba]">Main St &amp; 5th Ave</td>
                  <td className="p-3 text-[#9ca8ba]">Oct 24, 2023</td>
                  <td className="p-3">
                    <span className="text-red-400 bg-red-400/10 px-2 py-0.5 rounded text-xs">
                      Open
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="material-symbols-outlined cursor-pointer">
                      more_vert
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <footer className="text-xs text-center text-[#9ca8ba] pt-4">
            © 2024 CivicAdmin Platform. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
