const QuickActions = () => {
  return (
    <section className="grid md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold text-base">Report Issues</h3>
        <p className="text-sm text-slate-600 mt-2">
          Easily report civic issues in your locality with basic details and
          supporting images.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold text-base">Track Progress</h3>
        <p className="text-sm text-slate-600 mt-2">
          Follow the status of your reported issues from submission to
          resolution.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold text-base">Community Awareness</h3>
        <p className="text-sm text-slate-600 mt-2">
          Stay informed about civic concerns across water, roads, and sanitation.
        </p>
      </div>
    </section>
  );
};

export default QuickActions;
