import React from "react";

const ToggleSwitch = ({ checked = true, onChange, disabled = false }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${checked ? "bg-primary" : "bg-slate-500"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform
          ${checked ? "translate-x-5" : "translate-x-1"}
        `}
      />
    </button>
  );
};

export default ToggleSwitch;
