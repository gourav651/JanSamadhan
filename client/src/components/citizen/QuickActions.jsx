import React from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, Activity, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";

const QuickActions = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const actions = [
    {
      title: "Report Issues",
      desc: "Easily report civic issues in your locality with basic details and supporting images.",
      icon: <ClipboardCheck className="text-emerald-600" size={24} />,
      gradient: "from-emerald-50 to-teal-50",
    },
    {
      title: "Track Progress",
      desc: "Follow the status of your reported issues from submission to resolution in real-time.",
      icon: <Activity className="text-blue-600" size={24} />,
      gradient: "from-blue-50 to-indigo-50",
    },
    {
      title: "Community Awareness",
      desc: "Stay informed about civic concerns across water, roads, and sanitation in your area.",
      icon: <Users className="text-purple-600" size={24} />,
      gradient: "from-purple-50 to-fuchsia-50",
    },
  ];

  return (
    <section className="space-y-8 py-6">
      {/* SECTION HEADER */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Quick Actions
        </h2>
        {/* Animated Underline */}
        <motion.div
          className="h-1.5 bg-emerald-500 rounded-full mx-auto mb-6"
          initial={{ width: "1rem" }}
          animate={{ width: "14rem" }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
          JanSamadhan provides you with immediate tools to interact with city
          authorities. Report issues, track maintenance, and stay updated on
          your community in real-time.
        </p>
      </div>

      {/* CARDS GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className={`group p-6 rounded-3xl border border-emerald-100/50 bg-emerald-50 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 transition-all cursor-pointer`}
          >
            <div className="flex flex-col h-full">
              {/* ICON POD */}
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {action.icon}
              </div>

              <h3 className="font-bold text-slate-800 text-lg mb-2">
                {action.title}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                {action.desc}
              </p>

              {/* ACTION LINK */}
              <div
                onClick={() => {
                  if (index === 0) {
                    if (!isSignedIn) {
                      openSignIn(); // 🔐 open login / register
                      return;
                    }
                    navigate("/citizen/report"); // ✅ allowed
                  }
                }}
                className="mt-6 flex items-center text-xs font-black text-emerald-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Get Started →
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
