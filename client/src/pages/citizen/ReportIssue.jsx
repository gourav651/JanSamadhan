import React from "react";
import { motion } from "framer-motion";
import ReportStepper from "../../components/citizen/ReportStepper";
import ReportForm from "../../components/citizen/ReportForm";
import ReportTips from "../../components/citizen/ReportTips";
import CitizenNavbar from "@/components/layout/CitizenNavbar";
import CitizenFooter from "@/components/layout/CitizenFooter";

const CitizenReportIssue = () => {
  return (
    <div className="relative min-h-screen bg-white">
      {/* Dynamic Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[70%] sm:w-[45%] h-[70%] sm:h-[45%] rounded-full bg-emerald-50/60 blur-[100px] sm:blur-[120px]" />
        <div className="absolute bottom-[5%] -right-[10%] w-[60%] sm:w-[35%] h-[60%] sm:h-[35%] rounded-full bg-teal-50/40 blur-[80px] sm:blur-[100px]" />
      </div>

      <CitizenNavbar />

      <main className="relative z-10 py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Animated Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Submit a <span className="text-emerald-600">Report</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium max-w-md mx-auto">
              Your contribution helps us build a cleaner, safer, and better
              city.
            </p>
          </motion.div>

          <div className="space-y-5 sm:space-y-6">
            {/* Stepper Wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-md p-2 sm:p-3 rounded-3xl sm:rounded-[2.5rem] border border-emerald-100/50 shadow-sm"
            >
              <ReportStepper currentStep={1} />
            </motion.div>

            {/* Form Wrapper */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ReportForm />
            </motion.div>

            {/* Tips Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ReportTips />
            </motion.div>
          </div>
        </div>
      </main>

      <CitizenFooter />
    </div>
  );
};

export default CitizenReportIssue;
