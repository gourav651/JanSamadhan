import EvidenceUpload from "../../components/citizen/EvidenceUpload";
import IssueSummary from "../../components/citizen/IssueSummary";
import LocationMap from "../../components/citizen/LocationMapPlaceholder";
import ReportStepper from "../../components/citizen/ReportStepper";

const CitizenReportLocation = () => {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <ReportStepper currentStep={2} />
        <h2 className="text-3xl font-bold">Report a New Issue</h2>
        <p className="text-gray-500">Step 2 of 3: Specify location and upload evidence</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
        <LocationMap/>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <EvidenceUpload />
          <IssueSummary />
        </div>
      </div>
    </main>
  );
};

export default CitizenReportLocation
