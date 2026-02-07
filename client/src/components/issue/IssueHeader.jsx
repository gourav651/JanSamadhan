import React, { useState } from "react";
import { Copy, Check, Clock, Info, ShieldAlert } from "lucide-react";

const IssueHeader = ({ issue }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(issue._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds > 86400) return `${Math.floor(seconds / 86400)}d ago`;
    if (seconds > 3600) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds > 60) return `${Math.floor(seconds / 60)}m ago`;
    return "just now";
  };

  const getSeverity = (issue) => {
    const hoursOld =
      (Date.now() - new Date(issue.createdAt)) / (1000 * 60 * 60);
    if (issue.upvotes >= 30 || hoursOld >= 72) return "HIGH";
    if (issue.upvotes >= 10 || hoursOld >= 24) return "MEDIUM";
    return "LOW";
  };

  const STATUS_CONFIG = {
    OPEN: "bg-rose-50 text-rose-600 border-rose-100",
    IN_PROGRESS: "bg-amber-50 text-amber-600 border-amber-100",
    RESOLVED: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  const SEVERITY_STYLES = {
    HIGH: "bg-red-500 text-white shadow-sm shadow-red-200",
    MEDIUM: "bg-orange-100 text-orange-700 border-orange-200",
    LOW: "bg-slate-100 text-slate-600 border-slate-200",
  };

  const severity = getSeverity(issue);

  return (
    <div className="bg-emerald-50 rounded-2xl p-6 md:p-8 transition-all duration-300">
      {/* Top Row: Category & Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
          {issue.category}
        </span>

        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_CONFIG[issue.status] || STATUS_CONFIG.OPEN}`}
        >
          {issue.status.replace("_", " ")}
        </span>

        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border ${SEVERITY_STYLES[severity]}`}
        >
          <ShieldAlert size={12} />
          {severity} PRIORITY
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
        {issue.title}
      </h1>

      {/* Meta Info Bar */}
      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">
        <div
          className="flex items-center gap-1.5"
          title={new Date(issue.createdAt).toLocaleString()}
        >
          <Clock size={16} className="text-slate-400" />
          <span>Reported {timeAgo(issue.createdAt)}</span>
        </div>

        <div
          className="flex items-center gap-2 group cursor-pointer"
          onClick={handleCopyId}
        >
          <div className="bg-slate-50 px-2 py-1 rounded border border-slate-100 flex items-center gap-2 transition-all group-hover:border-indigo-200 group-hover:bg-indigo-50">
            <span className="font-mono text-xs text-slate-400 group-hover:text-indigo-500">
              ID: {issue._id.slice(0, 8)}...{issue._id.slice(-4)}
            </span>
            {copied ? (
              <Check size={14} className="text-emerald-500" />
            ) : (
              <Copy
                size={14}
                className="text-slate-400 group-hover:text-indigo-500 transition-colors"
              />
            )}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-full opacity-20" />
        <p className="pl-6 text-slate-600 leading-relaxed text-lg italic">
          "{issue.description}"
        </p>
      </div>
    </div>
  );
};

export default IssueHeader;
