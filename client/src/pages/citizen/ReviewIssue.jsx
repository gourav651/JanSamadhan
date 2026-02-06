import { useIssue } from "../../context/IssueContext";
import { useNavigate } from "react-router-dom";
import axios from "../../lib/axios";
import LocationPreviewMap from "../../components/citizen/LocationPreviewMap";
import ReportStepper from "../../components/citizen/ReportStepper";
import { useAuth } from "@clerk/clerk-react";
import CitizenNavbar from "@/components/layout/CitizenNavbar";
import CitizenFooter from "@/components/layout/CitizenFooter";
import {
  FileText,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Edit3,
} from "lucide-react";

const CATEGORY_MAP = {
  "Street Light": "STREET_LIGHT",
  Roads: "ROAD",
  "Water Supply": "WATER",
  Garbage: "GARBAGE",
  Pothole: "POTHOLE",
  Other: "OTHER",
};

const CitizenReviewIssue = () => {
  const { issueDraft, clearIssueDraft } = useIssue();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const reportedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const finalDescription =
    issueDraft.extraDescription?.trim() || issueDraft.description?.trim();

  const handleSubmit = async () => {
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("title", issueDraft.title.trim());

      const normalizedCategory =
        CATEGORY_MAP[issueDraft.category] ?? issueDraft.category?.toUpperCase();
      formData.append("category", normalizedCategory);
      formData.append("description", finalDescription);
      formData.append(
        "location",
        JSON.stringify({
          lat: issueDraft.location.lat,
          lng: issueDraft.location.lng,
          address: issueDraft.location.address,
        }),
      );

      issueDraft.images.forEach((img) => {
        if (img instanceof File) formData.append("images", img);
      });

      await axios.post("/api/issues", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      clearIssueDraft();
      navigate("/citizen/my-issues");
    } catch (error) {
      console.error(error);
      alert("Failed to submit issue");
    }
  };

  const SectionHeader = ({ title, icon: Icon, onEdit, editPath }) => (
    <div className="flex justify-between items-center p-5 border-b-2 border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
          <Icon size={20} className="text-slate-700" />
        </div>
        <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
      </div>
      <button
        onClick={() => navigate(editPath)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 font-bold text-sm transition-colors"
      >
        <Edit3 size={14} /> Edit
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      <CitizenNavbar />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-10">
          <ReportStepper currentStep={3} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Details & Location */}
          <div className="lg:col-span-8 space-y-8">
            {/* Issue Details Card */}
            <div className="bg-white border-2 border-slate-900 rounded-4xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(15,23,42,0.05)]">
              <SectionHeader
                title="Issue Details"
                icon={FileText}
                editPath="/citizen/report"
              />
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Category
                    </p>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                      {issueDraft.category}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Reported Date
                    </p>
                    <p className="font-bold text-slate-800">{reportedDate}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Issue Title
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    {issueDraft.title}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Description
                  </p>
                  <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {finalDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white border-2 border-slate-900 rounded-4xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(15,23,42,0.05)]">
              <SectionHeader
                title="Location"
                icon={MapPin}
                editPath="/citizen/report/location"
              />
              <div className="p-2">
                <div className="rounded-3xl border-2 border-slate-50">
                  <LocationPreviewMap
                    lat={issueDraft.location.lat}
                    lng={issueDraft.location.lng}
                  />
                </div>
                <div className="p-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Pinpointed Address
                  </p>
                  <p className="text-sm font-bold text-slate-700 flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-500 mt-0.5">📍</span>{" "}
                    {issueDraft.location.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Evidence & Final Action */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-8">
            {/* Evidence Card */}
            <div className="bg-white border-2 border-slate-900 rounded-4xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(15,23,42,0.05)]">
              <SectionHeader
                title="Evidence"
                icon={ImageIcon}
                editPath="/citizen/report/location"
              />
              <div className="p-6 grid grid-cols-2 gap-3">
                {issueDraft.images.map((img, index) => (
                  <div
                    key={index}
                    className="relative group overflow-hidden rounded-2xl border-2 border-slate-100 shadow-sm"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt="evidence"
                      className="h-28 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Card */}
            <div className="bg-white border-2 border-slate-900 rounded-4xl p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,0.05)]">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-emerald-200">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                Ready to Submit?
              </h3>
              <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
                By submitting, you confirm that the provided information and
                visual evidence are accurate.
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleSubmit}
                  className="group w-full cursor-pointer bg-green-400 flex items-center justify-center gap-2 border-2 border-slate-900 py-4 rounded-2xl font-black hover:shadow-none transition-all active:scale-95"
                >
                  Confirm & Submit Issue
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigate("/citizen/report/location")}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
                >
                  <ArrowLeft size={18} /> Back to Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <CitizenFooter />
    </div>
  );
};

export default CitizenReviewIssue;
