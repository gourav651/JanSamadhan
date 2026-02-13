import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion"; // For smooth animations
import AuthorityLayout from "../../components/authority/AuthorityLayout";
import IssueCard from "../../components/authority/IssueCard";
import axios from "axios";

const AuthAssignedIssues = () => {
  const { getToken } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAssignedIssues = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await axios.get(
        "http://localhost:5000/api/authority/issues/assigned",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { status, category, priority, page, limit: 5 },
        },
      );
      setIssues(res.data.issues);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error("Failed to fetch assigned issues", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [status, category, priority]);
  useEffect(() => {
    fetchAssignedIssues();
  }, [status, category, priority, page]);

  return (
    <AuthorityLayout>
      <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col">
        <div className="max-w-5xl mx-auto px-6 py-12 flex-1 w-full">
          {/* HEADER & FILTERS */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-black tracking-tight text-white mb-3"
              >
                Assigned <span className="text-blue-500">Issues</span>
              </motion.h1>
              <p className="text-slate-400 text-lg flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                {issues.length} tasks require your attention
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {[
                {
                  label: "Category",
                  state: setCategory,
                  options: ["WATER", "ROAD", "GARBAGE", "STREET_LIGHT"],
                },
                {
                  label: "Priority",
                  state: setPriority,
                  options: ["LOW", "NORMAL", "HIGH"],
                },
                {
                  label: "Status",
                  state: setStatus,
                  options: [
                    { v: "ASSIGNED", l: "Open" },
                    { v: "IN_PROGRESS", l: "In Progress" },
                    { v: "RESOLVED", l: "Resolved" },
                  ],
                },
              ].map((filter, idx) => (
                <select
                  key={idx}
                  onChange={(e) => filter.state(e.target.value)}
                  className="h-11 px-4 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-300 text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 outline-none hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <option value="">{filter.label}</option>
                  {filter.options.map((opt) => (
                    <option key={opt.v || opt} value={opt.v || opt}>
                      {opt.l || opt}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          </div>

          {/* CONTENT SECTION */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-medium tracking-widest uppercase text-xs">
                Synchronizing Data
              </p>
            </div>
          ) : issues.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800"
            >
              <p className="text-slate-500 text-lg font-medium">
                Clear skies! No issues assigned to your queue.
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-5">
              <AnimatePresence mode="popLayout">
                {issues.map((issue, index) => (
                  <motion.div
                    key={issue._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="transform transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_rgba(8,112,184,0.1)]">
                      <IssueCard issue={issue} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-800/60">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-6 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-widest disabled:opacity-20 hover:bg-slate-700 transition-all border border-slate-700"
              >
                Previous
              </button>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Page
                </span>
                <span className="h-8 w-12 flex items-center justify-center bg-blue-600/10 text-blue-400 rounded-lg font-mono font-bold border border-blue-500/20">
                  {page}
                </span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  of {totalPages}
                </span>
              </div>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-6 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-widest disabled:opacity-20 hover:bg-slate-700 transition-all border border-slate-700"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* FOOTER - ADDED HERE */}
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

export default AuthAssignedIssues;
