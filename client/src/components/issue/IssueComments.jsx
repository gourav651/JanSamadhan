import { useState } from "react";
import axios from "../../lib/axios";

/* 🕒 Relative time helper */
const timeAgo = (date) => {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hrs ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
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
      onCommentAdded(); // refetch issue
    } catch (err) {
      console.error("Comment failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ⌨️ Enter to submit */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        Comments ({issue.comments.length})
      </h3>

      {/* Input */}
      <textarea
        className="w-full border rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-primary/30 outline-none"
        placeholder="Add a comment… (Enter to post, Shift+Enter for new line)"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {/* Post Button */}
      <div className="flex justify-end mt-3">
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || loading}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition
            ${
              !text.trim() || loading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-primary text-black hover:opacity-90"
            }`}
        >
          {loading ? "Posting…" : "Post Comment"}
        </button>
      </div>

      {/* Comments List */}
      <div className="mt-6 space-y-4">
        {issue.comments.map((c, i) => (
          <div
            key={i}
            className="bg-gray-50 border rounded-lg p-3"
          >
            <div className="flex justify-between items-center mb-1">
              <p className="font-semibold text-sm">
                {c.author || "Anonymous"}
              </p>
              <span className="text-xs text-gray-400">
                {timeAgo(c.createdAt)}
              </span>
            </div>

            <p className="text-sm text-gray-700 whitespace-pre-line">
              {c.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IssueComments;
