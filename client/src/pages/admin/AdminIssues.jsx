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
        historyMap[h.status] = h; // keep first occurrence only
      }
    });

    return TIMELINE_STEPS.map((status) => ({
      status,
      data: historyMap[status] || null,
    }));
  };

  return (
    <div className="dark bg-background-dark text-slate-100 h-full flex overflow-hidden font-display">
      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-background-dark">
        {/* ================= HEADER ================= */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0 bg-background-dark/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-black font-bold">Issues Management</h2>
            <div className="h-4 w-px bg-slate-800" />
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
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
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  search
                </span>
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
                      mode="range" // 🔑 DIFFERENCE
                      selected={dateRange} // 🔑 DIFFERENCE
                      onSelect={(range) => {
                        setDateRange(range ?? undefined);
                      }}
                      numberOfMonths={2}
                      captionLayout="dropdown" // (month + year dropdown like your screenshot)
                      className="rounded-md"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full min-w-250 text-left border-collapse">
                <thead className="sticky top-0 bg-[#0f172a] border-b border-slate-800 z-10">
                  <tr>
                    {[
                      "Issue ID",
                      "Type",
                      "Category",
                      "Location",
                      "Assigned Authority",
                      "Priority",
                      "Status",
                      "Date",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"
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
                      className="issue-table-row cursor-pointer bg-white/5 hover:bg-slate-800/50 transition"
                    >
                      <td className="px-4 py-4 text-sm font-mono font-bold text-black">
                        {issue._id?.slice(-6)}
                      </td>

                      <td className="px-4 py-4">
                        <span className="material-symbols-outlined text-blue-900">
                          warning
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {issue.category || "General"}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
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
          <div className="w-100 border-l border-slate-800 flex flex-col bg-panel-dark shadow-2xl">
            <div className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex-1 flex flex-col justify-center">
                {loadingIssue ? (
                  <p className="text-slate-400">Loading issue...</p>
                ) : activeIssue ? (
                  <>
                    {/* Issue Images */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {activeIssue.images?.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          className="rounded-lg object-cover h-28 w-full"
                        />
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-300 mb-4">
                      {activeIssue.description}
                    </p>

                    {/* ================= PROGRESS TIMELINE ================= */}
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-slate-300 mb-4">
                        Progress Timeline
                      </h4>

                      <div className="space-y-4">
                        {getTimelineData(activeIssue).map((step, index) => {
                          const currentIndex = TIMELINE_STEPS.indexOf(
                            activeIssue.status,
                          );
                          const stepIndex = TIMELINE_STEPS.indexOf(step.status);

                          const completed = stepIndex <= currentIndex;
                          const hasHistory = Boolean(step.data);

                          return (
                            <div
                              key={step.status}
                              className="flex items-start gap-3"
                            >
                              {/* Dot */}
                              <div className="flex flex-col items-center">
                                <div
                                  className={`h-3 w-3 rounded-full ${
                                    completed ? "bg-primary" : "bg-slate-400"
                                  }`}
                                />

                                {index !== TIMELINE_STEPS.length - 1 && (
                                  <div className="h-8 w-px bg-slate-700 mt-1" />
                                )}
                              </div>

                              {/* Content */}
                              <div>
                                <p
                                  className={`text-sm font-medium ${
                                    completed
                                      ? "text-slate-800"
                                      : "text-slate-400"
                                  }`}
                                >
                                  {step.status.replace("_", " ")}
                                </p>

                                {hasHistory ? (
                                  <p className="text-xs text-slate-500 mt-0.5">
                                    {new Date(
                                      step.data.changedAt,
                                    ).toLocaleString()}
                                  </p>
                                ) : completed ? (
                                  <p className="text-xs text-slate-400 mt-0.5">
                                    —
                                  </p>
                                ) : (
                                  <p className="text-xs text-slate-400 mt-0.5">
                                    Not yet
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-500">
                    Select an issue to view details
                  </p>
                )}
              </div>

              <select
                value={selectedAuthority}
                onChange={(e) => setSelectedAuthority(e.target.value)}
                disabled={!selectedIssue}
                className="w-full mb-3 bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-sm text-slate-300"
              >
                <option value="">Select Authority</option>
                {authorities.map((auth) => (
                  <option key={auth._id} value={auth._id}>
                    {auth.name || auth.email}
                  </option>
                ))}
              </select>

              <button
                disabled={!selectedIssue}
                onClick={handleAssign}
                className="w-full text-black bg-primary hover:bg-primary/90 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                Assign Authority
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminIssues;
