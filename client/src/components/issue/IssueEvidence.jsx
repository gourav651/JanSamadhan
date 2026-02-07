import { useState, useEffect } from "react";
import {
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Highly recommended for that "premium" feel

const IssueEvidence = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") handleNext(e);
      if (e.key === "ArrowLeft") handlePrev(e);
    };
    if (activeIndex !== null) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [activeIndex]);

  if (!images.length) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
          <ImageIcon className="text-slate-400" size={24} />
        </div>
        <h3 className="text-slate-800 font-semibold">No Evidence Uploaded</h3>
        <p className="text-slate-500 text-sm max-w-50">
          No visual proof was provided with this report.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* 🧩 Modern Grid Card */}
      <div className="bg-emerald-50 rounded-2xl p-6 shadow-sm border border-slate-100 transition-all duration-300">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Evidence Gallery
            <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full font-medium">
              {images.length}
            </span>
          </h3>
          <span className="text-xs text-slate-400 font-medium italic">
            Click to expand
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="group relative h-32 rounded-xl overflow-hidden bg-slate-100 cursor-zoom-in border border-slate-200"
              onClick={() => setActiveIndex(index)}
            >
              <img
                src={img}
                alt={`Evidence ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300?text=Error";
                }}
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white/90 p-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <Maximize2 size={16} className="text-indigo-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔍 Cinematic Lightbox */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveIndex(null)}
          >
            {/* Controls */}
            <div className="absolute top-6 right-6 flex items-center gap-4">
              <span className="text-slate-400 text-sm font-mono">
                {activeIndex + 1} / {images.length}
              </span>
              <button
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                onClick={() => setActiveIndex(null)}
              >
                <X size={24} />
              </button>
            </div>

            <button
              className="absolute left-6 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all hover:scale-110"
              onClick={handlePrev}
            >
              <ChevronLeft size={32} />
            </button>

            <motion.img
              key={activeIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={images[activeIndex]}
              alt="Zoomed evidence"
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              className="absolute right-6 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all hover:scale-110"
              onClick={handleNext}
            >
              <ChevronRight size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default IssueEvidence;
