import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusCircle, ArrowRight } from "lucide-react";
import cityHeroImg from "../../assets/cityview.avif";
import { useClerk, useUser } from "@clerk/clerk-react";

const HeroSection = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  return (
    <section className="relative min-h-105 sm:min-h-95 w-full overflow-hidden rounded-2xl bg-slate-950 text-white shadow-2xl border border-white/5">
      <div className="absolute inset-0 z-0">
        <img
          src={cityHeroImg}
          className="h-full w-full object-cover opacity-30"
          alt="Cityscape"
        />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/90 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex h-full min-h-105 sm:min-h-95 flex-col justify-center px-5 sm:px-8 md:px-12 py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl space-y-4"
        >
          {/* Mini Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold tracking-wider text-emerald-100 uppercase">
              Live Portal
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Better{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">
              Neighborhoods
            </span>{" "}
            Start With You.
          </h1>

          <p className="max-w-lg text-xs sm:text-sm md:text-base text-slate-400 leading-relaxed font-medium">
            JanSamadhan connects you directly with city authorities. Report
            issues and track maintenance in real-time.
          </p>

          {/* Streamlined Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (!isSignedIn) {
                  openSignIn(); // 🔐 open login / register
                  return;
                }
                navigate("/citizen/report"); // ✅ allowed
              }}
              className="group relative flex items-center gap-2 rounded-xl bg-white px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-bold text-slate-950 transition-all hover:bg-emerald-50 cursor-pointer shadow-lg shadow-white/5"
            >
              <PlusCircle
                size={18}
                className="transition-transform group-hover:rotate-90"
              />
              Report Issue
            </motion.button>

            <button
              onClick={() => {
                if (!isSignedIn) {
                  openSignIn(); // 🔐 open login / register
                  return;
                }
                navigate("/citizen/my-issues");
              }}
              className="flex items-center gap-2 rounded-xl cursor-pointer border border-white/10 bg-white/5 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold backdrop-blur-md transition-all hover:bg-white/10"
            >
              Track Progress
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* 3. Integrated Stats Row */}
      <div className="absolute bottom-4 left-5 sm:left-8 md:left-12 z-10 right-5 sm:right-auto">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-white ml-3">12k+</span> Resolved
          </div>
          <div className="h-3 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-white ml-6">24/7</span> Monitoring
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
