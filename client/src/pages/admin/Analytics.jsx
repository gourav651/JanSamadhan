import React from "react";

const AdminAnalytics = () => {
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
            <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-black rounded-lg text-sm font-semibold border border-primary/20">
              <span className="material-symbols-outlined">
                icon
              </span>
              Download Analytics Report
            </button>

            <button className="relative p-2 text-slate-700 hover:text-white rounded-full hover:bg-slate-800">
              <span className="material-symbols-outlined">
                notifications
              </span>
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-[#0f172a]" />
            </button>
          </div>
        </header>

        {/* ================= CONTENT ================= */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Filters */}
          <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl flex flex-wrap items-center gap-4">
            {[
              ["Date Range", "Last 30 Days", "icon"],
              ["District", "All Districts"],
              ["Department", "All Departments"],
              ["Severity", "All Levels"],
            ].map(([label, value, icon]) => (
              <div key={label} className="min-w-45">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 block">
                  {label}
                </label>
                <div className="relative">
                  {icon && (
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      {icon}
                    </span>
                  )}
                  <select
                    className={`w-full bg-slate-900 border-slate-700 rounded-lg py-2 ${
                      icon ? "pl-10" : "pl-3"
                    } pr-8 text-sm text-slate-300`}
                  >
                    <option>{value}</option>
                  </select>
                </div>
              </div>
            ))}

            <button className="h-9.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold border border-slate-700">
              Apply Filters
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              ["Avg Resolution Time", "4.2 Days", "schedule", "blue", "65%"],
              ["% Issues Resolved", "92.8%", "check_circle", "emerald", "92%"],
              ["Critical Issue Backlog", "142", "emergency", "red", "45%"],
              ["Authority Utilization Rate", "78.5%", "groups", "purple", "78%"],
            ].map(([title, value, icon, color, width]) => (
              <div
                key={title}
                className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl relative overflow-hidden"
              >
                <div className={`bg-${color}-500/10 p-2 rounded-lg w-fit mb-4`}>
                  <span className={`material-symbols-outlined text-${color}-500`}>
                    {icon}
                  </span>
                </div>
                <h4 className="text-slate-700 text-sm">{title}</h4>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-${color}-500/20`}>
                  <div className={`h-full bg-${color}-500`} style={{ width }} />
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 chart-container h-90">
              <h3 className="font-bold text-white mb-4">
                Issue Volume Trend Over Time
              </h3>
              <div className="h-full flex items-center justify-center text-slate-700">
                (Chart Placeholder)
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 chart-container h-90">
              <h3 className="font-bold text-white mb-4">
                Issue Status by Department
              </h3>
              <div className="h-full flex items-center justify-center text-slate-700">
                (Status Bars Placeholder)
              </div>
            </div>
          </div>

          {/* Authority Performance Table */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white">
                Authority Performance Overview
              </h3>
              <button className="text-xs font-bold text-primary hover:underline">
                View All Authority Stats
              </button>
            </div>

            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900/50">
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
                {[
                  ["Public Works", "Public Works", "420", "88.5%", "5.2 Days", "Good"],
                  ["Sanitation Dept.", "Sanitation", "312", "94.2%", "2.8 Days", "Good"],
                  ["Electric Grid", "Energy", "198", "76.4%", "4.1 Days", "Average"],
                  ["Water Authority", "Water Mgmt", "156", "62.1%", "6.8 Days", "Poor"],
                ].map(([name, dept, issues, resolved, time, rating]) => (
                  <tr key={name} className="hover:bg-slate-800/30">
                    <td className="px-6 py-4 font-semibold">{name}</td>
                    <td className="px-6 py-4 text-slate-400">{dept}</td>
                    <td className="px-6 py-4 text-slate-300">{issues}</td>
                    <td className="px-6 py-4 text-slate-300">{resolved}</td>
                    <td className="px-6 py-4 text-slate-300">{time}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase border">
                        {rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
