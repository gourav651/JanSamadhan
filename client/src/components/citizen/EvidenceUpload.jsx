import { useIssue } from "../../context/IssueContext";
import { ImagePlus, CloudUpload, Trash2, FileImage } from "lucide-react";

const EvidenceUpload = () => {
  const { issueDraft, updateIssueDraft } = useIssue();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    updateIssueDraft({
      images: [...issueDraft.images, ...files],
    });
  };

  const removeImage = (index) => {
    updateIssueDraft({
      images: issueDraft.images.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-4 sm:p-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
          <ImagePlus size={18} className="sm:w-5 sm:h-5" />
        </div>
        Visual Evidence
      </h3>

      {/* Upload box */}
      <label className="border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer block hover:bg-gray-50">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          <CloudUpload size={26} className="sm:w-8 sm:h-8" />
        </div>
        <p className="font-medium mt-2">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-500">PNG, JPG up to 3MB</p>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Preview */}
      {issueDraft.images.length > 0 && (
        <div className="mt-4 space-y-3">
          {issueDraft.images.map((img, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2.5 sm:p-3 border rounded-lg"
            >
              <img
                src={URL.createObjectURL(img)}
                alt="preview"
                className="w-12 h-12 rounded object-cover"
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{img.name}</p>
                <p className="text-xs text-gray-500">
                  {(img.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <button
                onClick={() => removeImage(index)}
                className="text-red-500 hover:text-red-700"
              >
                <span className="material-icons-outlined">delete</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EvidenceUpload;
