import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIssue } from "../../context/IssueContext";

const ReportForm = () => {
  const navigate = useNavigate();
  const { updateIssueDraft } = useIssue();

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.category.trim() ||
      !formData.title.trim() ||
      !formData.description.trim()
    ) {
      alert("⚠️ All fields are required. Please fill all details.");
      return;
    }

    updateIssueDraft({
      category: formData.category,
      title: formData.title,
      description: formData.description,
    });

    navigate("/citizen/report/location");
  };

  // Reusable style for inputs to ensure they look exactly like your image
  const inputBaseStyle =
    "w-full rounded-xl px-4 py-3 outline-none font-medium text-slate-800";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-4xl border border-black p-10 space-y-8 shadow-sm"
    >
      {/* HEADER SECTION */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Report a New Issue
        </h1>
        <p className="text-slate-500 text-sm">
          Help us improve your neighborhood by providing details.
        </p>
      </div>

      {/* CATEGORY FIELD */}
      <div className="space-y-2">
        <label className="block text-[15px] font-bold text-slate-900 ml-1">
          Issue Category
        </label>
        <div className="relative group">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`
      ${inputBaseStyle} 
      appearance-none 
      cursor-pointer
      bg-white 
      pr-12
      border-2 
      border-slate-200 
      group-hover:border-emerald-500 
      focus:border-emerald-500 
      focus:ring-4 
      focus:ring-emerald-500/10 
      transition-all 
      duration-300
    `}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2310b981' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1.25rem center",
              backgroundSize: "1.2em",
            }}
          >
            <option value="" disabled className="text-slate-900">
              Select a category
            </option>
            <option value="STREET_LIGHT" className="py-2">
              Street Light
            </option>
            <option value="POTHOLE" className="py-2">
              Pothole
            </option>
            <option value="WATER" className="py-2">
              Water Leakage
            </option>
            <option value="GARBAGE" className="py-2">
              Garbage
            </option>
            <option value="OTHER" className="py-2">
              Other
            </option>
          </select>

          {/* Subtle bottom highlight line */}
          <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full" />
        </div>
      </div>

      {/* TITLE FIELD */}
      <div className="space-y-2 group">
        <label className="block text-[15px] font-bold text-slate-900 ml-1 group-focus-within:text-emerald-600 transition-colors">
          Issue Title
        </label>
        <div className="relative">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`
        ${inputBaseStyle}
        border-2 
        border-slate-200 
        hover:border-emerald-400
        focus:border-emerald-500 
        focus:ring-4 
        focus:ring-emerald-500/10 
        placeholder:text-slate-400
        transition-all 
        duration-300
        bg-white/50
        backdrop-blur-sm
      `}
            placeholder="Enter a brief title"
          />

          {/* Decorative internal glow effect on hover */}
          <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_0_15px_rgba(16,185,129,0.05)]" />
        </div>
      </div>

      {/* DESCRIPTION FIELD */}
      <div className="space-y-2 group">
        <label className="block text-[15px] font-bold text-slate-900 ml-1 group-focus-within:text-emerald-600 transition-colors">
          Description
        </label>
        <div className="relative">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className={`
        ${inputBaseStyle}
        border-2 
        border-slate-200 
        hover:border-emerald-400
        focus:border-emerald-500 
        focus:ring-4 
        focus:ring-emerald-500/10 
        placeholder:text-slate-400
        transition-all 
        duration-300
        bg-white/50
        backdrop-blur-sm
        resize-none
      `}
            placeholder="Provide more details about the problem..."
          />

          {/* Subtle corner accent for a "premium" touch */}
          <div className="absolute bottom-3 right-3 pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-focus-within:bg-emerald-400 transition-colors" />
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end items-center gap-6 pt-10 border-t-2 border-slate-900/5">
        {/* CANCEL BUTTON: Clean Outline Style */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="px-8 py-3 rounded-2xl border-2 border-slate-900 font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
        >
          Cancel
        </button>

        {/* NEXT STEP BUTTON: Premium Emerald Action */}
        <button
          type="submit"
          className="group w-40 cursor-pointer bg-green-400 flex items-center justify-center gap-2 border-2 border-slate-900 py-4 rounded-2xl font-black hover:shadow-none transition-all active:scale-95"
        >
          Next Step
          <svg
            className="w-5 h-5 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default ReportForm;
