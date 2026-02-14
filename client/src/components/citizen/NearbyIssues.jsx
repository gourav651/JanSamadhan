import { useNavigate } from "react-router-dom";
import { useIssue } from "../../context/IssueContext";
import { motion, AnimatePresence } from "framer-motion";
import { useClerk, useUser } from "@clerk/clerk-react";

import {
  MessageSquare,
  ThumbsUp,
  MapPin,
  Clock,
  ChevronRight,
} from "lucide-react";

const STATUS_STYLES = {
  CRITICAL: "bg-rose-500 text-white shadow-sm shadow-rose-200",
  OPEN: "bg-amber-500 text-white shadow-sm shadow-amber-200",
  IN_PROGRESS: "bg-blue-500 text-white shadow-sm shadow-blue-200",
  RESOLVED: "bg-emerald-600 text-white shadow-sm shadow-emerald-200",
};

const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds > 86400) return `${Math.floor(seconds / 86400)} days ago`;
  if (seconds > 3600) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds > 60) return `${Math.floor(seconds / 60)} minutes ago`;
  return "just now";
};

const getDisplayStatus = (issue) => {
  const hoursOld = (Date.now() - new Date(issue.createdAt)) / 36e5;
  if (issue.status === "OPEN" && (issue.upvotes >= 30 || hoursOld >= 48)) {
    return "CRITICAL";
  }
  return issue.status;
};

const NearbyIssues = () => {
  const navigate = useNavigate();
  const { nearbyIssues, loadingNearby } = useIssue();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  if (loadingNearby) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 p-8 flex flex-col items-center justify-center h-full space-y-4">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Scanning neighborhood...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 h-full flex flex-col shadow-xl shadow-slate-200/40 overflow-hidden">
      {/* HEADER */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-emerald-50 bg-emerald-50/30 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-base sm:text-lg tracking-tight">
            Nearby Issues
          </h3>
          <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">
            Active Reports
          </p>
        </div>
        <button
          onClick={() => {
            if (!isSignedIn) {
              openSignIn(); // 🔐 open login / register
              return;
            }
            navigate("/citizen/my-issues");
          }}
          className="group flex items-center gap-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
        >
          VIEW ALL
          <ChevronRight
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </div>

      {/* LIST with Greenish Cards */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4 ">
        <AnimatePresence>
          {nearbyIssues.map((issue, index) => {
            const status = getDisplayStatus(issue);

            return (
              <motion.div
                key={issue._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, x: 4 }}
                onClick={() => {
                  if (!isSignedIn) {
                    openSignIn(); // 🔐 open login / register
                    return;
                  }
                  navigate(`/citizen/issues/${issue._id}`);
                }}
                // THE GREENISH CARD STYLE
                className="group relative flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl transition-all cursor-pointer border border-emerald-100/50 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-200 hover:shadow-sm"
              >
                {/* Image Section */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-white rounded-xl overflow-hidden border border-emerald-100 shadow-sm">
                  <img
                    src={issue.images?.[0] || "https://via.placeholder.com/100"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={issue.title}
                  />
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate group-hover:text-emerald-800 transition-colors">
                      {issue.title}
                    </h4>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-black rounded-md uppercase shrink-0 ${STATUS_STYLES[status]}`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-emerald-700/70 font-bold mb-2 uppercase tracking-tight">
                    <span className="flex items-center gap-1 bg-white/60 px-1.5 py-0.5 rounded shadow-sm">
                      <MapPin size={10} />
                      {issue.category.replace("_", " ")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {timeAgo(issue.createdAt)}
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-[12px] text-slate-600 leading-snug line-clamp-2 mb-3">
                    {issue.description}
                  </p>

                  {/* Interaction Pods */}
                  {/* Interaction Stats Pods */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-emerald-100 text-[11px] font-bold text-emerald-800 shadow-sm">
                      <ThumbsUp size={12} className="text-blue-500" />
                      {issue.upvotes ?? 0}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-emerald-100 text-[11px] font-bold text-emerald-800 shadow-sm">
                      <MessageSquare size={12} className="text-emerald-500" />
                      {issue.comments?.length ?? 0}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NearbyIssues;
