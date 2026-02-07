import { useState } from "react";
import axios from "../../lib/axios";
import { MessageSquare, Send, User, Clock } from "lucide-react";

/* 🕒 Relative time helper */
const timeAgo = (date) => {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

const IssueComments = ({ issue, onCommentAdded }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim() || loading) return;
    try {
      setLoading(true);
      await axios.post(`/api/issues/${issue._id}/comment`, { text });
      setText("");
      onCommentAdded();
    } catch (err) {
      console.error("Comment failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-emerald-50 rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <MessageSquare size={20} className="text-indigo-500" />
          Discussion
          <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full">
            {issue.comments.length}
          </span>
        </h3>
      </div>

      <div className="p-6">
        {/* Input Area */}
        <div className="relative group">
          <textarea
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all min-h-25"
            placeholder="Write a helpful comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex justify-between items-center mt-3">
            <p className="text-[11px] text-slate-700 italic">
              Press Enter to post, Shift+Enter for new line
            </p>
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || loading}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all transform active:scale-95
                ${
                  !text.trim() || loading
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 cursor-pointer"
                }`}
            >
              {loading ? "Posting..." : "Post"}
              <Send size={14} />
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="mt-8 space-y-6">
          {issue.comments.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-slate-700 text-sm italic">
                No comments yet. Be the first to chime in!
              </p>
            </div>
          ) : (
            issue.comments.map((c, i) => (
              <div key={i} className="flex gap-4 group">
                {/* Avatar */}
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-100 to-slate-200 flex items-center justify-center text-indigo-600 border border-white shadow-sm">
                    <User size={18} />
                  </div>
                </div>

                {/* Bubble */}
                <div className="grow">
                  <div className="bg-slate-50 group-hover:bg-slate-100/70 transition-colors rounded-2xl rounded-tl-none p-4 border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-slate-900 capitalize">
                        {c.author || "Citizen"}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                        <Clock size={10} />
                        {timeAgo(c.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line italic">
                      "{c.text}"
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueComments;
