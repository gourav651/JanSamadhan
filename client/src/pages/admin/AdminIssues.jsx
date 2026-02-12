import React, { useEffect, useState } from "react";
import {
  fetchAllIssues,
  assignIssue,
  fetchAuthorities,
} from "../../services/adminApi";

import { useAuth } from "@clerk/clerk-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { fetchIssueById } from "../../services/adminApi";
import { X } from "lucide-react";
import { ShieldCheck, ChevronDown, UserPlus } from "lucide-react";
import { Search } from "lucide-react";
import { Info } from "lucide-react";

const TIMELINE_STEPS = ["REPORTED", "ASSIGNED", "IN_PROGRESS", "RESOLVED"];

const AdminIssues = () => {
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const { isLoaded } = useAuth();
  const [authorities, setAuthorities] = useState([]);
  const [selectedAuthority, setSelectedAuthority] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [category, setCategory] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [dateRange, setDateRange] = useState(undefined);

  const [activeIssue, setActiveIssue] = useState(null);
  const [loadingIssue, setLoadingIssue] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    const loadData = async () => {
      const filters = {
        ...(search && { search }),
        ...(status !== "ALL" && { status }),
        ...(category !== "ALL" && { category }),
        ...(priority !== "ALL" && { priority }),
        ...(dateRange?.from && { startDate: dateRange.from.toISOString() }),
        ...(dateRange?.to && { endDate: dateRange.to.toISOString() }),
      };

      const issuesRes = await fetchAllIssues({
        page,
        limit: 15,
        ...filters,
      });

      setIssues(issuesRes.data.data || []);
      setTotalPages(issuesRes.data.pagination.totalPages);

      const authRes = await fetchAuthorities();
      const authoritiesArray =
        authRes.data.authorities || authRes.data.data || [];
      setAuthorities(authoritiesArray);
    };

    loadData();
  }, [isLoaded, page, search, status, category, priority, dateRange]);

  useEffect(() => {
    setPage(1);
  }, [dateRange]);

  const handleAssign = async () => {
    if (!selectedIssue || !selectedAuthority) return;

    try {
      await assignIssue(selectedIssue._id, selectedAuthority);

      const filters = {
        ...(search && { search }),
        ...(status !== "ALL" && { status }),
        ...(category !== "ALL" && { category }),
        ...(priority !== "ALL" && { priority }),
        ...(dateRange?.from && { startDate: dateRange.from.toISOString() }),
        ...(dateRange?.to && { endDate: dateRange.to.toISOString() }),
      };

      const res = await fetchAllIssues({
        page,
        limit: 15,
        ...filters,
      });

      setIssues(res.data.data || []);
      setSelectedIssue(null);
      setSelectedAuthority("");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Cannot assign this issue. Please try again.";

      alert(message); // ✅ popup for RESOLVED issue case
    }
  };

  const getTimelineData = (issue) => {
    if (!issue?.statusHistory) return [];

    const historyMap = {};

    issue.statusHistory.forEach((h) => {
      if (!historyMap[h.status]) {
        historyMap[h.status] = h;
      }
    });

    return TIMELINE_STEPS.map((status) => ({
      status,
      data: historyMap[status] || null,
    }));
  };

  return (
    <div className="dark bg-[#030712] text-slate-200 h-full flex overflow-hidden font-display">
      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header Update */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800/50 bg-[#030712]/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-white text-xl font-bold tracking-tight">
              Issues Management
            </h2>
            <div className="h-4 w-px bg-slate-800" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              Global Oversight
            </span>
          </div>
        </header>

        {/* ================= BODY ================= */}
        <div className="flex-1 overflow-hidden flex">
          {/* ================= TABLE SECTION ================= */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Filters */}
            <div className="p-4 border-b border-slate-800 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-75 relative">
                <Search
                  size={18}
                  strokeWidth={2}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-200"
                />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-slate-900 border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-primary focus:border-primary"
                  placeholder="Search by Issue ID, Title, or Reporter..."
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                  className="bg-slate-900 border-slate-700 rounded-lg py-2 pl-3 pr-8 text-sm text-slate-300"
                >
                  <option value="ALL">Status: All</option>
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>

                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="bg-slate-900 border-slate-700 rounded-lg py-2 pl-3 pr-8 text-sm text-slate-300"
                >
                  <option value="ALL">Category: All</option>
                  <option value="POTHOLE">POTHOLE</option>
                  <option value="GARBAGE">GARBAGE</option>
                  <option value="WATER">WATER</option>
                  <option value="ROAD">ROAD</option>
                  <option value="OTHER">OTHERS</option>
                </select>

                <select
                  value={priority}
                  onChange={(e) => {
                    setPriority(e.target.value);
                    setPage(1);
                  }}
                  className="bg-slate-900 border-slate-700 rounded-lg py-2 pl-3 pr-8 text-sm text-slate-300"
                >
                  <option value="ALL">Priority: All</option>
                  <option value="LOW">LOW</option>
                  <option value="NORMAL">NORMAL</option>
                  <option value="HIGH">HIGH</option>
                </select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-slate-900 border-slate-700 text-slate-300 gap-2"
                    >
                      <CalendarIcon className="h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd MMM yyyy")} –{" "}
                            {format(dateRange.to, "dd MMM yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "dd MMM yyyy")
                        )
                      ) : (
                        "Date Range"
                      )}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0 bg-slate-900 border border-slate-700">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => {
                        setDateRange(range ?? undefined);
                      }}
                      numberOfMonths={2}
                      captionLayout="dropdown"
                      className="rounded-md"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full min-w-250 text-left border-collapse">
                {/* Table Header */}
                {/* Table Header */}
                <thead className="sticky top-0 bg-[#030712] border-b border-slate-800 z-10">
                  <tr>
                    {[
                      "Issue ID",
                      "Type",
                      "Category",
                      "Location",
                      "Assigned To",
                      "Priority",
                      "Status",
                      "Date",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {issues.map((issue) => (
                    <tr
                      key={issue._id}
                      onClick={async () => {
                        try {
                          setSelectedIssue(issue);
                          setLoadingIssue(true);
                          setActiveIssue(null);

                          const res = await fetchIssueById(issue._id);
                          setActiveIssue(res.data.data);
                        } catch (err) {
                          console.error("Failed to load issue details", err);
                        } finally {
                          setLoadingIssue(false);
                        }
                      }}
                      className="group border-b border-slate-800/40 hover:bg-blue-600/4 transition-all cursor-pointer"
                    >
                      <td className="px-4 py-4 text-sm font-mono font-bold text-blue-400">
                        {issue._id?.slice(-6)}
                      </td>

                      <td className="px-4 py-4">
                        <div className="p-2 rounded-lg bg-slate-800/40 w-fit">
                          <span className="material-symbols-outlined text-blue-400 text-lg">
                            warning
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-300 font-medium">
                        {issue.category || "General"}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-400 max-w-50 truncate">
                        {issue.location?.address || "N/A"}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {issue.assignedTo
                          ? issue.assignedTo.name || issue.assignedTo.email
                          : "Unassigned"}
                      </td>

                      <td className="px-4 py-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase">
                          {issue.priority || "NORMAL"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20 uppercase">
                          {issue.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-500">
                        {issue.createdAt
                          ? new Date(issue.createdAt).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination (UI only for now) */}
            <div className="px-6 py-4 border-t border-slate-800 bg-[#0f172a] flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Showing 1–15 of {issues.length} issues
              </span>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1 rounded text-xs font-bold ${
                        p === page
                          ? "bg-primary"
                          : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* ================= RIGHT DETAILS PANEL ================= */}
          <div className="w-105 border-l border-slate-800/60 flex flex-col bg-[#0b1120] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-30">
            {activeIssue ? (
              <>
                {/* Panel Header */}
                <div className="p-6 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/20">
                  <div>
                    <h3 className="text-white font-bold text-lg tracking-tight">
                      Issue Details
                    </h3>
                    <p className="text-[10px] text-blue-400 font-mono uppercase tracking-widest mt-0.5">
                      ID: #{activeIssue._id?.slice(-8)}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveIssue(null)}
                    className="group relative h-9 w-9 rounded-xl flex items-center justify-center 
             bg-slate-900/50 border border-slate-800/60 
             hover:bg-red-500/10 hover:border-red-500/40 
             transition-all duration-300 shadow-xl"
                    aria-label="Close"
                  >
                    {/* Hover Glow Effect */}
                    <div
                      className="absolute inset-0 rounded-xl bg-red-500/20 blur-lg 
                  opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    />

                    {/* Lucide X Icon */}
                    <X
                      size={18}
                      strokeWidth={2.5}
                      className="text-slate-400 group-hover:text-red-400 group-hover:rotate-90 
               transition-all duration-300 z-10"
                    />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                  {/* Visual Assets Section */}
                  <section>
                    <div className="grid grid-cols-2 gap-3">
                      {activeIssue.images?.map((img, i) => (
                        <div
                          key={i}
                          className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 h-32"
                        >
                          <img
                            src={img}
                            className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                            <span className="text-[10px] text-white font-medium">
                              View Fullscreen
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Description Card */}
                  <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">
                      Citizen Description
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed italic">
                      "{activeIssue.description}"
                    </p>
                  </section>

                  {/* ================= PROGRESS TIMELINE (THE STAR ELEMENT) ================= */}
                  <section>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">
                      Resolution Progress
                    </h4>
                    <div className="space-y-0">
                      {getTimelineData(activeIssue).map((step, index) => {
                        const currentIndex = TIMELINE_STEPS.indexOf(
                          activeIssue.status,
                        );
                        const stepIndex = TIMELINE_STEPS.indexOf(step.status);
                        const completed = stepIndex <= currentIndex;
                        const isCurrent = stepIndex === currentIndex;

                        return (
                          <div key={step.status} className="flex gap-4 group">
                            <div className="flex flex-col items-center">
                              <div
                                className={`relative h-4 w-4 rounded-full border-2 transition-all duration-500 z-10 
                      ${completed ? "bg-blue-500 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]" : "border-slate-700 bg-slate-900"}
                      ${isCurrent ? "ring-4 ring-blue-500/20" : ""}`}
                              />
                              {index !== 3 && (
                                <div
                                  className={`w-0.5 h-12 transition-colors duration-500 ${completed ? "bg-blue-500/50" : "bg-slate-800"}`}
                                />
                              )}
                            </div>
                            <div className="pb-8">
                              <p
                                className={`text-sm font-bold tracking-tight transition-colors ${completed ? "text-slate-100" : "text-slate-500"}`}
                              >
                                {step.status.replace("_", " ")}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                                {step.data
                                  ? new Date(
                                      step.data.changedAt,
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : completed
                                    ? "Verified"
                                    : "Waiting for action..."}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>

                {/* ================= ACTION FOOTER ================= */}
                <div className="p-6 bg-slate-900/40 border-t border-slate-800/60 backdrop-blur-xl space-y-4">
                  {/* Header with Icon */}
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck size={14} className="text-blue-400" />
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] block">
                      Administrative Assignment
                    </label>
                  </div>

                  <div className="flex flex-col gap-3">
                    {/* Custom Dropdown Container */}
                    <div className="relative group">
                      <select
                        value={selectedAuthority}
                        onChange={(e) => setSelectedAuthority(e.target.value)}
                        className="w-full bg-[#030712] border border-slate-700/80 rounded-xl py-3.5 pl-4 pr-10 text-sm text-slate-200 appearance-none 
                   focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all cursor-pointer
                   hover:border-slate-600"
                      >
                        <option value="" className="bg-[#030712]">
                          Select Department...
                        </option>
                        {authorities.map((auth) => (
                          <option
                            key={auth._id}
                            value={auth._id}
                            className="bg-[#030712]"
                          >
                            {auth.name || auth.email}
                          </option>
                        ))}
                      </select>

                      {/* Lucide replacement for unfold_more */}
                      <ChevronDown
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-slate-300 transition-colors"
                      />
                    </div>

                    {/* Assign Button with Lucide Icon */}
                    <button
                      onClick={handleAssign}
                      disabled={!selectedAuthority}
                      className="w-full group relative overflow-hidden bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl text-sm font-bold transition-all 
                 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]
                 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed"
                    >
                      <div className="relative z-10 flex items-center justify-center gap-2 cursor-pointer">
                        <UserPlus size={18} strokeWidth={2.5} />
                        <span>Assign Authority</span>
                      </div>

                      {/* Premium Shimmer Effect */}
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="relative h-20 w-20 rounded-2xl bg-[#030712] border border-slate-800 flex items-center justify-center shadow-2xl">
                  <Info
                    size={40}
                    strokeWidth={1.5}
                    className="text-slate-600 animate-pulse"
                  />
                </div>
                <h3 className="text-slate-400 font-medium">
                  No Issue Selected
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  Pick an item from the list to view its timeline and management
                  options.
                </p>
              </div>
            )}
          </div>
        </div>
        <footer className="text-xs text-center text-[#9ca8ba] p-4">
          © {new Date().getFullYear()} JanSamadhan Platform. All rights
          reserved.
        </footer>
      </div>
    </div>
  );
};

export default AdminIssues;
