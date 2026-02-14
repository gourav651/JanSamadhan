import CitizenNavbar from "@/components/layout/CitizenNavbar";
import EvidenceUpload from "../../components/citizen/EvidenceUpload";
import IssueSummary from "../../components/citizen/IssueSummary";
import LocationMap from "../../components/citizen/LocationMapPlaceholder";
import ReportStepper from "../../components/citizen/ReportStepper";
import CitizenFooter from "@/components/layout/CitizenFooter";

const CitizenReportLocation = () => {
  return (
    <>
      <CitizenNavbar />
      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <div className="space-y-3 sm:space-y-4">
          <ReportStepper currentStep={2} />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
            Report a New Issue
          </h2>
          <p className="text-sm sm:text-base text-gray-500">
            Step 2 of 3: Specify location and upload evidence
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          <div className="lg:col-span-7">
            <LocationMap />
          </div>

          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            <EvidenceUpload />
            <IssueSummary />
          </div>
        </div>
      </main>
      <CitizenFooter />
    </>
  );
};

export default CitizenReportLocation;
