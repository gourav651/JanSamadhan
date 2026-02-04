import React from "react";
import { motion } from "framer-motion";

const ServiceCard = ({ title, description, icon: Icon, image, color }) => {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative flex flex-col h-112.5 w-full bg-emerald-50 hover rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-shadow duration-300"
    >
      {/* Top Image Section */}
      <div className="h-1/2 w-full overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {/* Floating Icon Badge */}
        <div
          className={`absolute bottom-4 left-4 p-3 rounded-2xl bg-white shadow-lg text-${color}-600`}
        >
          <Icon size={24} strokeWidth={2.5} />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col grow">
        <h3 className="text-xl font-bold text-slate-800 mb-3 tracking-tight">
          {title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-4">
          {description}
        </p>

        {/* Bottom Decorative Line */}
        <div className="mt-auto pt-4">
          <div className={`h-1.5 w-12 rounded-full bg-${color}-500/20`} />
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
