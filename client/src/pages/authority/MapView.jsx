import AuthorityLayout from "../../components/authority/AuthorityLayout";

const AuthMapView = () => {
  return (
    <AuthorityLayout>
      <div className="relative w-full h-[calc(100vh-0px)] overflow-hidden font-display">

        {/* Header Floating */}
        <div className="absolute top-6 left-6 z-40">
          <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-xl shadow-lg border">
            <h2 className="text-lg font-bold">Geospatial Issue Monitor</h2>
            <p className="text-xs text-gray-500">
              Monitoring: Downtown District
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="absolute top-6 right-6 z-40">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border">
            <button className="px-3 py-2 text-xs font-semibold hover:bg-gray-100 rounded-lg">
              Category ▾
            </button>
            <button className="px-3 py-2 text-xs font-semibold hover:bg-gray-100 rounded-lg">
              Status ● ▾
            </button>
            <button className="px-3 py-2 text-xs font-semibold hover:bg-gray-100 rounded-lg">
              Radius: 5km ▾
            </button>
            <button className="ml-2 bg-primary px-4 py-2 rounded-lg text-xs font-bold">
              APPLY
            </button>
          </div>
        </div>

        {/* MAP PLACEHOLDER */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://lh3.googleusercontent.com/aida-public/AB6AXuCx-tOKQD0diA_Z9MBt__dWeBUDne-UsLtTbCD2CN6yK5vl7eWjh8btz5TyjUFp6z7QmPBcwmOIx-7qW4WiBiBNmznPALGkGzn_jdTsczbQcDEqBw4P2qArfHMqSzlPHYfLRr2qDZ6YVD9ZznGRhDtjWuvZLnztDgt4bD47edf40nuzP_gE99bIIK6lyEf7E3SpJJSx8145poec9FSARcwyfoGer82n85-wPxz5DXYmqSE1tiGKF5BhVyrE_9l80wqcDqp-ImwUA58)",
          }}
        >
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* MAP MARKERS */}
        {/* OPEN */}
        <div className="absolute top-1/3 left-1/4 z-30">
          <div className="w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-lg animate-pulse" />
        </div>

        {/* IN PROGRESS */}
        <div className="absolute top-1/2 left-1/2 z-30">
          <div className="w-4 h-4 bg-amber-500 border-2 border-white rounded-full shadow-lg animate-pulse" />
        </div>

        {/* RESOLVED */}
        <div className="absolute bottom-1/4 left-1/3 z-30">
          <div className="w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-lg" />
        </div>

        {/* ISSUE POPUP */}
        <div className="absolute top-[40%] left-[55%] z-40 w-80 bg-white rounded-xl shadow-2xl border overflow-hidden">
          <div
            className="h-32 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://lh3.googleusercontent.com/aida-public/AB6AXuCU9HOLDSYUoaJLjZwRvviBNNWjPgjcJLWvaevVVdPGOByJshL5MVTYaTJOSbs1F-Ro60bi1bTVpWHengRoxaZmNxFqzhZtNZv_fIFx0irR29jHGgRqzp23edJj98v9BTObkGkzVvdKNlgF8Gp_8PMIJFMjil2cpKZ5jdJFTqn9lC3KVQ1N8JP1AjeVNvjFpUKOl52IOrS4Tt6mIRfxrZ073jyNE9hTl-k95AA8AJQ9tVVCuWSnU4m8NxdbyPK9XBdnQZ-pjJsyhXo)",
            }}
          >
            <div className="p-3">
              <span className="bg-red-500 text-[10px] font-bold px-2 py-1 rounded">
                OPEN
              </span>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div>
              <div className="flex justify-between">
                <h4 className="text-sm font-bold">Severe Water Main Leak</h4>
                <span className="text-[10px] text-gray-400">ID: #4492</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                42nd St & Lex Ave
              </p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                Large volume of water erupting from pavement. Traffic lane blocked.
              </p>
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <div>
                <p className="text-[10px] uppercase text-gray-400">Reported By</p>
                <p className="text-xs font-semibold">Sarah Jenkins</p>
              </div>
              <button className="bg-primary text-xs font-bold px-4 py-2 rounded-lg">
                VIEW ISSUE
              </button>
            </div>
          </div>
        </div>

        {/* LEGEND */}
        <div className="absolute left-6 bottom-8 z-40">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase">
              Status Legend
            </p>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 bg-red-500 rounded-full" /> Open
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 bg-amber-500 rounded-full" /> In Progress
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 bg-emerald-500 rounded-full" /> Resolved
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-full max-w-md px-4 z-40">
          <input
            placeholder="Search location or issue ID..."
            className="w-full bg-white/90 backdrop-blur-md border rounded-2xl py-4 px-5 shadow-xl text-sm focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>
    </AuthorityLayout>
  );
};

export default AuthMapView;
