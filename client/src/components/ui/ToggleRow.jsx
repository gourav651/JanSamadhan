import React from "react";
import ToggleSwitch from "./ToggleSwitch";

const ToggleRow = ({ title, description, checked }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-slate-900">{title}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <ToggleSwitch checked={checked} />
    </div>
  );
};

export default ToggleRow;
