import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../lib/axios";
import CitizenNavbar from "@/components/layout/CitizenNavbar";
import CitizenFooter from "@/components/layout/CitizenFooter";
import { motion } from "framer-motion";
import { MapPin, Calendar, ThumbsUp, ArrowRight, Tag } from "lucide-react";

const STATUS_STYLES = {
  OPEN: "bg-red-50 text-red-600 border-red-200 shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]",
  IN_PROGRESS:
    "bg-amber-50 text-amber-600 border-amber-200 shadow-[2px_2px_0px_0px_rgba(217,119,6,1)]",
  RESOLVED:
    "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-[2px_2px_0px_0px_rgba(16,185,129,1)]",
};

const BORDER_COLORS = {
  OPEN: "bg-red-500",
  IN_PROGRESS: "bg-yellow-500",
  RESOLVED: "bg-green-500",
};

const formatDate = (date) => new Date(date).toLocaleDateString();

const ITEMS_PER_PAGE = 5;

const CitizenMyIssues = () => {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchMyIssues = async () => {
      const res = await axios.get("/api/issues/my");
      setIssues(res.data.issues || []);
    };
    fetchMyIssues();
  }, []);

  const totalPages = Math.ceil(issues.length / ITEMS_PER_PAGE);

  const paginatedIssues = issues
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getPaginationRange = () => {
    const range = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, start + 2);

    for (let i = start; i <= end; i++) range.push(i);
    return range;
  };

  return (
    <>
      <CitizenNavbar />

      <div className="min-h-screen bg-white px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
              My Issues
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Track the status of the problems you've reported.
            </p>
          </div>

          {/* ISSUE LIST */}
          <div className="space-y-2">
            {paginatedIssues.map((issue) => (
              <motion.div
                key={issue._id}
                whileHover={{ y: -5, scale: 1.005 }} // Subtle lift
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => navigate(`/citizen/issues/${issue._id}`)}
                className="relative group bg-emerald-50 border-2 border-slate-300 rounded-3xl p-3 sm:p-4 md:p-5 hover:shadow-[4px_4px_0px_0px_rgba(16,185,129,1)] transition-all cursor-pointer overflow-hidden mb-4"
              >
                {/* Decorative Background Accent - Made Smaller */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />

                <div className="flex flex-col md:flex-row justify-between gap-4 relative z-10">
                  {/* LEFT CONTENT */}
                  <div className="flex-1 space-y-2">
                    {" "}
                    {/* Reduced space-y from 4 to 2 */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-0.5 rounded-lg border-2 font-black text-[9px] uppercase tracking-widest ${STATUS_STYLES[issue.status]}`}
                      >
                        {issue.status.replace("_", " ")}
                      </span>
                      <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px] uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        <Tag size={10} /> {issue.category}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">
                        {issue.title}
                      </h3>
                      <p className="text-slate-500 font-medium text-xs sm:text-sm line-clamp-1 leading-normal max-w-2xl">
                        {issue.description}
                      </p>
                    </div>
                    {/* METADATA FOOTER - Tightened spacing */}
                    <div className="flex flex-wrap gap-4 pt-1">
                      <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                        <Calendar size={14} className="text-emerald-400" />
                        {formatDate(issue.createdAt)}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                        <MapPin size={14} className="text-emerald-400" />
                        <span className="truncate max-w-30 sm:max-w-50">
                          {issue.location?.address || "Unknown Location"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT ACTION PANEL - Changed to Horizontal on Mobile, Slimmer on Desktop */}
                  <div className="flex flex-row sm:flex-row md:flex-col justify-between items-center md:items-end md:border-l-2 border-slate-100 md:pl-6 min-w-27.5 sm:min-w-35 gap-2 mt-2 md:mt-0">
                    <div className="flex items-center gap-1.5 bg-slate-50 border-2 border-slate-400 px-2.5 sm:px-3 py-1 rounded-lg group-hover:bg-white transition-colors">
                      <ThumbsUp size={14} className="text-emerald-500" />
                      <span className="font-black text-slate-900 text-sm">
                        {issue.upvotes ?? 0}
                      </span>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-400 rounded-xl font-black text-xs text-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] group-hover:shadow-none group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all">
                      Details
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-wrap justify-center items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm
 border rounded-lg disabled:opacity-40"
              >
                Previous
              </button>

              {currentPage > 2 && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm
 border rounded-lg"
                  >
                    1
                  </button>
                  <span className="px-2">...</span>
                </>
              )}

              {getPaginationRange().map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === page ? "bg-green-500 text-white" : "border"
                  }`}
                >
                  {page}
                </button>
              ))}

              {currentPage < totalPages - 1 && (
                <>
                  <span className="px-2">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm
 border rounded-lg"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm
 border rounded-lg disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <CitizenFooter />
    </>
  );
};

export default CitizenMyIssues;
