import React from 'react'
import ReportStepper from '../../components/citizen/ReportStepper';
import ReportForm from '../../components/citizen/ReportForm';
import ReportTips from '../../components/citizen/ReportTips';

const CitizenReportIssue = () => {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <ReportStepper currentStep={1}  />
        <ReportForm />
        <ReportTips />
      </div>
    </main>
  );
};

export default CitizenReportIssue