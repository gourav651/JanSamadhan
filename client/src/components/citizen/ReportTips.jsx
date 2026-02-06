import React from "react";
import { Info, Camera, ShieldCheck } from "lucide-react";

const tips = [
  {
    icon: <Info size={22} className="text-blue-600" />,
    title: "Be Specific",
    text: "Clear titles help categorize faster.",
    bgColor: "bg-blue-50/50",
    borderColor: "border-blue-100",
    iconBg: "bg-white",
  },
  {
    icon: <Camera size={22} className="text-amber-600" />,
    title: "Add Photos",
    text: "Visual proof speeds verification.",
    bgColor: "bg-amber-50/50",
    borderColor: "border-amber-100",
    iconBg: "bg-white",
  },
  {
    icon: <ShieldCheck size={22} className="text-emerald-600" />,
    title: "Stay Safe",
    text: "Don't put yourself in danger.",
    bgColor: "bg-emerald-50/50",
    borderColor: "border-emerald-100",
    iconBg: "bg-white",
  },
];

const ReportTips = () => {
  return (
    <div className="grid sm:grid-cols-3 gap-6 mt-10">
      {tips.map((tip) => (
        <div
          key={tip.title}
          className={`
            group p-6 rounded-3xl border ${tip.borderColor} ${tip.bgColor}
            hover:bg-white hover:shadow-xl hover:shadow-slate-900/5 
            transition-all duration-300 cursor-default
          `}
        >
          <div className="flex flex-col h-full">
            {/* ICON POD - Matches Home Page Style */}
            <div className={`
              w-12 h-12 rounded-2xl ${tip.iconBg} shadow-sm border ${tip.borderColor} 
              flex items-center justify-center mb-4 
              group-hover:scale-110 transition-transform duration-300
            `}>
              {tip.icon}
            </div>

            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2">
              {tip.title}
            </h3>
            
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {tip.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default ReportTips;
