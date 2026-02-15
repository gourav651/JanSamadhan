import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "../../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  ThumbsUp,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  UploadCloud,
  Maximize2,
  X,
  Info,
  ChevronDown,
} from "lucide-react";
import AuthorityLayout from "../../components/authority/AuthorityLayout";

const AuthIssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [showAllImages, setShowAllImages] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const isResolved = issue?.status === "RESOLVED";

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await axios.get(`/api/authority/issues/${id}`);

        setIssue(res.data.issue);
        setStatus(res.data.issue.status);
        setNotes(res.data.issue.resolutionNotes || "");
      } catch (err) {
        console.error("Failed to load issue", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id, getToken]);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  const handleUpdateStatus = async () => {
    if (isResolved) return;
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("status", status);
      formData.append("resolutionNotes", notes);
      files.forEach((f) => formData.append("resolutionImages", f));

      await axios.patch(`/api/authority/issues/${id}/status`, formData);

      setIssue((prev) => ({
        ...prev,
        status,
        resolutionNotes: notes,
      }));

      setFiles([]);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Failed to update issue");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AuthorityLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-medium tracking-wide">
            Retrieving Case Details...
          </p>
        </div>
      </AuthorityLayout>
    );
  }

  if (!issue) {
    return (
      <AuthorityLayout>
        <div className="text-center mt-20">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <p className="text-red-500 text-lg font-bold">
            Issue profile not found
          </p>
        </div>
      </AuthorityLayout>
    );
  }

  const isUnchanged =
    status === issue?.status &&
    notes === (issue?.resolutionNotes || "") &&
    files.length === 0;

  const statusColors = {
    OPEN: "bg-red-50 text-red-600 border-red-200",
    IN_PROGRESS: "bg-amber-50 text-amber-600 border-amber-200",
    RESOLVED: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };

  return (
    <AuthorityLayout>
      <div className="flex flex-col min-h-screen bg-[#fafafa]">
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Case Management
              </h1>
              <p className="text-slate-500 mt-1 flex items-center gap-2">
                <Info size={16} /> View and update civic reports in your
                jurisdiction
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-800 text-slate-300 font-bold hover:bg-slate-900 hover:text-white transition-all hover:shadow-md active:scale-95 cursor-pointer"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform text-primary"
              />
              Back to Overview
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* LEFT COLUMN */}
            <div className="xl:col-span-8 space-y-8">
              {issue.images?.[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative w-full h-64 sm:h-80 md:h-96 lg:h-112.5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
                >
                  <img
                    src={issue.images[0]}
                    alt="Issue"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-4 py-2 rounded-full border text-xs font-black shadow-lg backdrop-blur-md ${statusColors[issue.status]}`}
                    >
                      {issue.status}
                    </span>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold tracking-widest uppercase mb-4 inline-block">
                      Reference: {issue._id}
                    </span>
                    <h2 className="text-3xl font-black text-slate-800 leading-tight">
                      {issue.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl border border-blue-100 font-bold">
                    <ThumbsUp size={18} /> {issue.upvotes || 0}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm font-semibold py-2">
                  <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg border border-slate-100">
                    {issue.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Calendar size={16} /> Reported 2 days ago
                  </span>
                </div>

                <p className="text-slate-600 leading-relaxed text-lg pt-2">
                  {issue.description}
                </p>
              </motion.div>

              {issue.images?.length > 1 && (
                <div className="pt-4">
                  <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                    Citizen Evidence{" "}
                    <span className="text-slate-400 font-medium text-sm">
                      ({issue.images.length} images)
                    </span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                    {(showAllImages
                      ? issue.images
                      : issue.images.slice(1, 4)
                    ).map((img, i) => {
                      const isBlurred =
                        !showAllImages && i === 2 && issue.images.length > 4;
                      return (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          key={i}
                          className="relative aspect-4/3 rounded-2xl overflow-hidden cursor-pointer shadow-md border-2 border-white"
                          onClick={() => isBlurred && setShowAllImages(true)}
                        >
                          <img
                            src={img}
                            className={`w-full h-full object-cover ${isBlurred ? "blur-[2px] scale-110" : ""}`}
                            alt="Evidence"
                          />
                          {isBlurred && (
                            <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white">
                              <span className="font-black text-2xl">
                                +{issue.images.length - 3}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-tighter">
                                View All
                              </span>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="xl:col-span-4 space-y-8">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-50">
                  <h3 className="font-black text-slate-800 flex items-center gap-2">
                    <MapPin size={18} className="text-primary" /> Incident
                    Location
                  </h3>
                  <button
                    onClick={() => setShowMap(true)}
                    className="text-primary text-xs font-black uppercase tracking-wider hover:underline cursor-pointer"
                  >
                    Fullscreen
                  </button>
                </div>
                <div className="h-48 sm:h-56 relative group">
                  <iframe
                    title="map-preview"
                    className="w-full h-full grayscale-20 contrast-[1.1]"
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${issue.location.coordinates[1]},${issue.location.coordinates[0]}&z=14&output=embed`}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>
                <div className="p-6">
                  <p className="text-sm font-bold text-slate-700 leading-snug">
                    {issue.location.address}
                  </p>
                  <div className="mt-4 flex gap-4 text-[10px] font-black uppercase text-slate-400 tracking-widest border-t pt-4">
                    <div>Lat: {issue.location.coordinates[1]}</div>
                    <div>Lng: {issue.location.coordinates[0]}</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl sm:rounded-4xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="relative">
                  <h3 className="text-2xl font-black text-white mb-2">
                    Authority Actions
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Update current case status and attach resolution proof.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                    Case Status
                  </label>
                  <div className="relative">
                    <select
                      value={status}
                      disabled={isResolved}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full h-14 px-5 pr-12 rounded-2xl bg-white/10 border border-white/10 text-white font-bold focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-30 appearance-none cursor-pointer"
                    >
                      <option value="OPEN" className="bg-[#1e293b]">
                        🔴 OPEN
                      </option>
                      <option value="IN_PROGRESS" className="bg-[#1e293b]">
                        🟡 IN PROGRESS
                      </option>
                      <option value="RESOLVED" className="bg-[#1e293b]">
                        🟢 RESOLVED
                      </option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                    Resolution Notes
                  </label>
                  <textarea
                    rows={4}
                    disabled={isResolved}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe actions taken..."
                    className="w-full p-5 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                    Resolution Proof
                  </label>
                  <input
                    type="file"
                    multiple
                    id="file-upload"
                    className="hidden"
                    disabled={isResolved}
                    onChange={(e) => setFiles([...e.target.files])}
                  />
                  <label
                    htmlFor="file-upload"
                    className={`flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-2xl py-6 cursor-pointer hover:bg-white/5 transition-all ${isResolved ? "opacity-30 cursor-not-allowed" : ""}`}
                  >
                    <UploadCloud className="text-primary mb-2" size={32} />
                    <span className="text-white text-sm font-bold">
                      {files.length > 0
                        ? `${files.length} files selected`
                        : "Upload evidence photos"}
                    </span>
                  </label>
                </div>

                <button
                  onClick={handleUpdateStatus}
                  disabled={isResolved || saving || isUnchanged}
                  className="group relative w-full h-14 bg-primary text-white font-black text-lg rounded-2xl transition-all hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] active:scale-95 disabled:opacity-40"
                >
                  {saving
                    ? "Syncing..."
                    : isResolved
                      ? "Case Finalized"
                      : "Sync Case Update"}
                </button>

                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 p-4 rounded-xl border border-emerald-500/30"
                    >
                      <CheckCircle2 size={18} />{" "}
                      <span className="text-sm font-bold tracking-tight">
                        Status updated successfully
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>

        {/* LIGHT THEME FOOTER */}
        <footer className="mt-auto py-4 border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6 md:gap-8">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center text-[12px] font-black text-white shadow-lg group-hover:bg-primary transition-all">
                  J
                </div>
                <span className="text-lg font-bold text-slate-800 tracking-tight">
                  Jan<span className="text-primary">Samadhan</span>
                </span>
              </div>

              <div className="text-center md:text-left">
                <p className="text-[11px] font-black tracking-[0.2em] text-slate-400 ">
                  © {new Date().getFullYear()} JanSamadhan Portal
                </p>
              </div>

              <div className="flex gap-8">
                {["Privacy Policy", "Cloud Support", "Legal"].map((link) => (
                  <button
                    key={link}
                    className="text-[11px] font-black text-slate-500 hover:text-primary transition-colors uppercase tracking-widest"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* FULL MAP MODAL */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-100 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white w-full max-w-5xl rounded-2xl sm:rounded-[2.5rem] overflow-hidden relative shadow-2xl"
            >
              <button
                onClick={() => setShowMap(false)}
                className="absolute top-6 right-6 bg-slate-900 text-white rounded-full p-2 shadow-xl z-10 hover:scale-110 transition-all"
              >
                <X size={24} />
              </button>
              <div className="h-[65vh] sm:h-[75vh]">
                <iframe
                  title="map-full"
                  className="w-full h-full"
                  src={`https://maps.google.com/maps?q=${issue.location.coordinates[1]},${issue.location.coordinates[0]}&z=16&output=embed`}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthorityLayout>
  );
};

export default AuthIssueDetails;
