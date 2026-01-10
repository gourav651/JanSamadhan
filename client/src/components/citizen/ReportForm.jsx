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

    // ❌ VALIDATION
    if (
      !formData.category.trim() ||
      !formData.title.trim() ||
      !formData.description.trim()
    ) {
      alert("⚠️ All fields are required. Please fill all details.");
      return;
    }

    // ✅ SAVE STEP-1 DATA INTO CONTEXT
    updateIssueDraft({
      category: formData.category,
      title: formData.title,
      description: formData.description,
    });

    // ✅ MOVE TO STEP-2
    navigate("/citizen/report/location");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg border p-8 space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold mb-1">Report a New Issue</h1>
        <p className="text-gray-500 text-sm">
          Help us improve your neighborhood by providing details.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Issue Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        >
          <option value="">Select a category</option>
          <option value="STREET_LIGHT">Street Light</option>
          <option value="POTHOLE">Pothole</option>
          <option value="WATER">Water Leakage</option>
          <option value="GARBAGE">Garbage</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Issue Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="px-6 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-2 bg-primary text-black rounded-lg"
        >
          Next Step
        </button>
      </div>
    </form>
  );
};

export default ReportForm;
