import React from "react";
import { CheckCircle2, Clock, MapPin, CheckCircle, Circle } from "lucide-react";

const IssueTimeline = ({ status = "OPEN", createdAt }) => {
  const STEPS = [
    {
      key: "REPORTED",
      title: "Issue Reported",
      description: "Submitted by citizen",
      icon: Clock,
    },
    {
      key: "ASSIGNED", // Changed to match your STATUS_TO_STEP_INDEX
      title: "Issue Acknowledged",
      description: "Assigned to concerned authority",
      icon: MapPin,
    },
    {
      key: "RESOLVED",
      title: "Issue Resolved",
      description: "Marked as resolved by authority",
      icon: CheckCircle2,
    },
  ];

  const STATUS_TO_STEP_INDEX = {
    OPEN: 0,
    ASSIGNED: 1,
    RESOLVED: 2,
  };

  const currentStepIndex = STATUS_TO_STEP_INDEX[status] ?? 0;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-slate-800">Tracking Progress</h3>
        <div className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-100 uppercase tracking-tighter">
          Step {currentStepIndex + 1} of 3
        </div>
      </div>

      <div className="relative">
        {/* Animated Background Line */}
        <div className="absolute left-4.75 top-2 bottom-2 w-0.5 bg-slate-100" />
        <div 
          className="absolute left-4.75 top-2 w-0.5 bg-linear-to-b from-indigo-500 to-emerald-500 transition-all duration-1000 ease-in-out" 
          style={{ height: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
        />

        <div className="space-y-10">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex;
            const StepIcon = step.icon;

            return (
              <div key={step.key} className="relative flex items-start group">
                {/* Icon Container */}
                <div className="relative z-10">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500
                    ${isCompleted ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" : ""}
                    ${isCurrent ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 ring-4 ring-indigo-50" : ""}
                    ${isPending ? "bg-white border-2 border-slate-200 text-slate-300" : ""}
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <StepIcon className={`w-5 h-5 ${isCurrent ? "animate-pulse" : ""}`} />
                    )}
                  </div>
                </div>

                {/* Text Content */}
                <div className="ml-6">
                  <h4 className={`text-base font-bold transition-colors duration-300 ${
                    isPending ? "text-slate-400" : "text-slate-900"
                  }`}>
                    {step.title}
                  </h4>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                    <p className={`text-sm leading-relaxed ${
                      isPending ? "text-slate-300" : "text-slate-500"
                    }`}>
                      {step.description}
                    </p>
                    
                    {step.key === "REPORTED" && createdAt && (
                      <span className="hidden sm:inline text-slate-200">|</span>
                    )}
                    
                    {step.key === "REPORTED" && createdAt && (
                      <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        {new Date(createdAt).toLocaleDateString(undefined, { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Indicator for Current Step */}
                {isCurrent && (
                  <span className="absolute right-0 top-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IssueTimeline;