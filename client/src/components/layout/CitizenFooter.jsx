const CitizenFooter = () => {
  return (
    <footer className="mt-12 border-t border-emerald-100/50 bg-emerald-50/20 py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span className="font-black text-emerald-800 tracking-tighter text-lg">
            JanSamadhan
          </span>
          <p className="text-xs text-slate-500 font-medium">
            Building smarter neighborhoods together.
          </p>
        </div>

        <div className="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-emerald-600 transition-colors uppercase"
          >
            Privacy
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-emerald-600 transition-colors uppercase"
          >
            Terms
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-emerald-600 transition-colors uppercase"
          >
            Contact
          </button>
        </div>

        <p className="text-sm text-slate-400 font-medium">
          © {new Date().getFullYear()}{" "}
          <span className="text-emerald-700/70">JanSamadhan</span>.
        </p>
      </div>
    </footer>
  );
};

export default CitizenFooter;
