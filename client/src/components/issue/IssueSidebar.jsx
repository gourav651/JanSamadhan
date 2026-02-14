import { useState } from "react";
import axios from "../../lib/axios";
import {
  ThumbsUp,
  MapPin,
  Share2,
  Bell,
  ExternalLink,
  Check,
} from "lucide-react";
import LocationPreviewMap from "../../components/citizen/LocationPreviewMap";
import IssueLocationModal from "./IssueLocationModal";

const IssueSidebar = ({ issue }) => {
  const [upvotes, setUpvotes] = useState(issue.upvotes || 0);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [copied, setCopied] = useState(false);

  const lat = issue.location?.coordinates?.[1];
  const lng = issue.location?.coordinates?.[0];

  const handleUpvote = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await axios.post(`/api/issues/${issue._id}/upvote`);
      setUpvotes(res.data.upvotes);
    } catch (err) {
      console.error("Upvote failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/citizen/issues/${issue._id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="space-y-5 sm:space-y-6 lg:sticky lg:top-24">
        {/* 🗳️ UPVOTE CARD */}
        <div className="relative overflow-hidden bg-linear-to-br from-amber-400 to-orange-600 rounded-2xl p-4 sm:p-6 shadow-lg shadow-orange-100 group">
          <div className="relative z-10 flex justify-between items-center">
            <div className="text-white">
              <p className="text-3xl sm:text-4xl font-black leading-none">
                {upvotes}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">
                Total Upvotes
              </p>
            </div>

            <button
              onClick={handleUpvote}
              disabled={loading}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold transition-all transform active:scale-95 shadow-md cursor-pointer
                ${
                  loading
                    ? "bg-white/20 text-white/50 cursor-not-allowed"
                    : "bg-white text-orange-600 hover:bg-orange-50 hover:-translate-y-1"
                }`}
            >
              <ThumbsUp size={18} className={loading ? "" : "animate-bounce"} />
              {loading ? "..." : "Vote"}
            </button>
          </div>
          {/* Subtle Decorative Circle */}
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        </div>

        {/* 📍 LOCATION CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <MapPin size={18} className="text-indigo-500" />
              <span>Location</span>
            </div>
            {lat && lng && (
              <button
                onClick={() => setShowMap(true)}
                className="text-indigo-600 text-xs font-bold hover:text-indigo-700 flex items-center gap-1 group cursor-pointer"
              >
                Full Map
                <ExternalLink
                  size={12}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </button>
            )}
          </div>

          <div className=" overflow-hidden border border-slate-100 shadow-inner">
            {lat && lng ? (
              <div className="h-36 sm:h-44 w-full">
                <LocationPreviewMap lat={lat} lng={lng} />
              </div>
            ) : (
              <div className="h-44 flex flex-col items-center justify-center text-slate-400 bg-slate-50 italic text-sm">
                <MapPin size={24} className="mb-2 opacity-20" />
                Location unavailable
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-[11px] sm:text-xs leading-relaxed text-slate-600 font-medium">
              {issue.location?.address || "Exact address not provided"}
            </p>
          </div>
        </div>

        {/* 🛠️ ACTIONS CARD */}
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={handleShare}
            className={`flex items-center justify-center gap-2 w-full py-3 sm:py-3.5 rounded-xl text-sm font-bold transition-all border cursor-pointer
              ${
                copied
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
              }`}
          >
            {copied ? <Check size={18} /> : <Share2 size={18} />}
            {copied ? "Link Copied!" : "Share Issue"}
          </button>

          <button
            disabled
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-slate-100 rounded-xl text-sm font-bold text-slate-400 cursor-not-allowed opacity-60"
          >
            <Bell size={18} />
            Follow Updates
          </button>
        </div>
      </div>

      {/* FULL MAP MODAL */}
      {showMap && lat && lng && (
        <IssueLocationModal
          lat={lat}
          lng={lng}
          onClose={() => setShowMap(false)}
        />
      )}
    </>
  );
};

export default IssueSidebar;
