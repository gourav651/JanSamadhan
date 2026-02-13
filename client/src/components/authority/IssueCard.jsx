import { useNavigate } from "react-router-dom";

const IssueCard = ({ issue }) => {
  const navigate = useNavigate();

  // Dynamic styling based on status
  const statusConfig = {
    ASSIGNED: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    IN_PROGRESS: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    RESOLVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <div className="group relative flex flex-col md:flex-row bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden hover:border-blue-500/50 hover:bg-slate-800/60 transition-all duration-300 shadow-2xl">
      {/* IMAGE SECTION - Reduced height from h-52 to h-40 */}
      <div className="relative md:w-64 h-40 overflow-hidden shrink-0">
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{
            backgroundImage: `url(${issue.images?.[0] || "/placeholder.jpg"})`,
          }}
        />
        {/* Floating Category Tag - Made more compact */}
        <div className="absolute top-3 left-3">
          <span className="text-[9px] font-black uppercase tracking-widest bg-slate-950/80 text-blue-400 px-2.5 py-1 rounded-lg border border-white/5 backdrop-blur-md">
            {issue.category.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* CONTENT SECTION - Reduced vertical padding (py-4 instead of p-6) */}
      <div className="flex-1 py-4 px-5 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                Ref ID: #{issue._id.slice(-6)}
              </span>
              <h3 className="text-lg font-extrabold text-white group-hover:text-blue-400 transition-colors leading-tight">
                {issue.title}
              </h3>
            </div>

            <span
              className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest shadow-lg ${statusConfig[issue.status] || statusConfig.ASSIGNED}`}
            >
              {issue.status.replace("_", " ")}
            </span>
          </div>

          {/* Description - Reduced to 1 line clamp for maximum height reduction */}
          <p className="text-xs text-slate-400 line-clamp-1 font-medium leading-relaxed mb-2">
            {issue.description}
          </p>
        </div>

        {/* FOOTER AREA - Tightened padding and gap */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-auto pt-3 border-t border-white/5 gap-3">
          <div className="flex items-center gap-2.5 text-slate-400">
            <div className="p-1.5 rounded-full bg-slate-800/50 border border-white/5">
              <svg
                className="w-3.5 h-3.5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p className="text-[11px] font-semibold italic truncate max-w-60">
              {issue.location?.address || "Location not registered"}
            </p>
          </div>

          <button
            onClick={() => navigate(`/authority/issues/${issue._id}`)}
            className="w-full cursor-pointer sm:w-auto group/btn relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-bold text-white rounded-xl bg-blue-600 hover:bg-blue-500 transition-all duration-300 shadow-lg active:scale-95"
          >
            <span className="text-[10px] uppercase tracking-widest mr-2">
              Details
            </span>
            <span className="group-hover/btn:translate-x-1 transition-transform text-xs">
              →
            </span>
          </button>
        </div>
      </div>

      {/* Hover Accent Line */}
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-blue-600 to-indigo-400 transition-all duration-500 group-hover:w-full" />
    </div>
  );
};

export default IssueCard;
