import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../lib/axios";

import IssueComments from "../../components/issue/IssueComments";
import IssueEvidence from "../../components/issue/IssueEvidence";
import IssueHeader from "../../components/issue/IssueHeader";
import IssueSidebar from "../../components/issue/IssueSidebar";
import IssueTimeline from "../../components/issue/IssueTimeline";

const CitizenIssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ make this reusable
  const fetchIssue = async () => {
    try {
      const res = await axios.get(`/api/issues/${id}`);
      setIssue(res.data.issue);
    } catch (err) {
      console.error("Failed to fetch issue", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [id]);

  if (loading) {
    return <div className="p-10">Loading issue details...</div>;
  }

  if (!issue) {
    return <div className="p-10">Issue not found</div>;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 text-sm text-gray-500">
        <button
          onClick={() => navigate("/citizen/my-issues")}
          className="cursor-pointer"
        >
          ← Back to My Issues
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <IssueHeader issue={issue} />
          <IssueEvidence images={issue.images} />
          <IssueTimeline status={issue.status} />
          <IssueComments issue={issue} onCommentAdded={fetchIssue} />
        </div>
        
        {/* RIGHT */}
        <div className="lg:col-span-1 self-start">
          <IssueSidebar issue={issue} />
        </div>
      </div>
    </main>
  );
};

export default CitizenIssueDetail;
