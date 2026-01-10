import { useIssue } from "../../context/IssueContext";

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
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <span className="material-icons-outlined text-primary">
          add_a_photo
        </span>
        Visual Evidence
      </h3>

      {/* Upload box */}
      <label className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer block hover:bg-gray-50">
        <span className="material-icons-outlined text-4xl text-blue-500">
          cloud_upload
        </span>
        <p className="font-medium mt-2">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-gray-500">
          PNG, JPG up to 3MB
        </p>

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
              className="flex items-center gap-3 p-3 border rounded-lg"
            >
              <img
                src={URL.createObjectURL(img)}
                alt="preview"
                className="w-12 h-12 rounded object-cover"
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {img.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(img.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <button
                onClick={() => removeImage(index)}
                className="text-red-500 hover:text-red-700"
              >
                <span className="material-icons-outlined">
                  delete
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EvidenceUpload;
