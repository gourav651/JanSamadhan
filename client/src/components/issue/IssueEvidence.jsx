import { useState, useEffect } from "react";

const IssueEvidence = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const activeImage =
    activeIndex !== null ? images[activeIndex] : null;

  // ⌨️ Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setActiveIndex(null);
    };

    if (activeIndex !== null) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [activeIndex]);

  if (!images.length) {
    return (
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Uploaded Evidence</h3>
        <p className="text-sm text-gray-500">No images uploaded.</p>
      </div>
    );
  }

  return (
    <>
      {/* 🧩 Thumbnails */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">
          Uploaded Evidence ({images.length})
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative h-28 rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
              onClick={() => setActiveIndex(index)}
            >
              <img
                src={img}
                alt={`Evidence ${index + 1}`}
                className="w-full h-full object-cover hover:opacity-90"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300?text=Image+Unavailable";
                }}
              />

              {/* 🔢 Index badge */}
              <span className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                {index + 1}/{images.length}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 🔍 Fullscreen Preview */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          {/* ❌ Close button */}
          <button
            onClick={() => setActiveIndex(null)}
            className="absolute top-6 right-6 text-white text-3xl font-bold hover:opacity-80"
          >
            ×
          </button>

          {/* 🔢 Image counter */}
          <div className="absolute top-6 left-6 text-white text-sm bg-black/60 px-3 py-1 rounded">
            {activeIndex + 1} / {images.length}
          </div>

          {/* 🖼️ Image */}
          <img
            src={activeImage}
            alt="Zoomed evidence"
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-xl"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/600?text=Image+Unavailable";
            }}
          />
        </div>
      )}
    </>
  );
};

export default IssueEvidence;
