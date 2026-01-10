import editIcon from "../../assets/edit.svg";
import locationIcon from "../../assets/location.svg";
import checkIcon from "../../assets/check.svg";

const steps = [
  { id: 1, label: "Details", icon: editIcon },
  { id: 2, label: "Location", icon: locationIcon },
  { id: 3, label: "Review", icon: checkIcon },
];

const ReportStepper = ({ currentStep }) => {
  return (
    <div className="flex justify-center items-center mt-6">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;

        return (
          <div key={step.id} className="flex items-center">
            {/* STEP */}
            <div className="flex flex-col items-center">
              {/* CIRCLE */}
              <div
                className={`h-9 w-9 flex items-center justify-center rounded-full border-2 transition
                  ${
                    isCompleted || isActive
                      ? "bg-green-500 border-green-500"
                      : "bg-white border-gray-300"
                  }`}
              >
                {/* ICON — ALWAYS SHOWN */}
                <img
                  src={step.icon}
                  alt={step.label}
                  className="h-4 w-4"
                />
              </div>

              {/* LABEL */}
              <p
                className={`mt-2 text-xs font-medium
                  ${
                    isCompleted || isActive
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
              >
                {step.label}
              </p>
            </div>

            {/* CONNECTOR */}
            {index < steps.length - 1 && (
              <div
                className={`w-20 h-0.5 mx-2 transition
                  ${
                    step.id < currentStep
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReportStepper;
