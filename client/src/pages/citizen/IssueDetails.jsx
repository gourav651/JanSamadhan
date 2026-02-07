import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../lib/axios";

import IssueComments from "../../components/issue/IssueComments";
import IssueEvidence from "../../components/issue/IssueEvidence";
import IssueHeader from "../../components/issue/IssueHeader";
import IssueSidebar from "../../components/issue/IssueSidebar";
import IssueTimeline from "../../components/issue/IssueTimeline";
import CitizenNavbar from "@/components/layout/CitizenNavbar";
import CitizenFooter from "@/components/layout/CitizenFooter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const CitizenIssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ make this reusable
  const fetchIssue = async () => {
    try {
      const res = await axios.get(`/api/issues/${id}`);
      setIssue(res.data.data);
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
    <div className="min-h-screen bg-[#F8FAFC]">
      {" "}
      {/* Subtle off-white background */}
      <CitizenNavbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumb with Hover Effect */}
        <div className="mb-10 flex items-center justify-between">
          <button
            onClick={() => navigate("/citizen/my-issues")}
            className="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-slate-100 text-slate-500 shadow-sm hover:shadow-md hover:border-indigo-100 hover:text-indigo-600 transition-all duration-300 active:scale-95"
          >
            <div className="p-1 rounded-full bg-slate-50 group-hover:bg-indigo-50 transition-colors duration-300">
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform duration-300 ease-out"
              />
            </div>
            <span className="text-sm font-bold tracking-tight pr-1 cursor-pointer">
              Back to My Issues
            </span>
          </button>

          {/* Optional: Add a "Status" indicator next to the breadcrumb for better balance */}
          <div className="hidden md:flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Issue View
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* LEFT COLUMN */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 hover:shadow-md transition-shadow duration-300">
              <IssueHeader issue={issue} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 hover:shadow-md transition-shadow duration-300">
              <IssueEvidence images={issue.images} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Activity Progress
              </h3>
              <IssueTimeline
                status={issue.status}
                createdAt={issue.createdAt}
              />
            </div>

            <IssueComments issue={issue} onCommentAdded={fetchIssue} />
          </motion.div>

          {/* RIGHT COLUMN (Sticky Sidebar) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <IssueSidebar issue={issue} />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <CitizenFooter />
    </div>
  );
};

export default CitizenIssueDetail;
