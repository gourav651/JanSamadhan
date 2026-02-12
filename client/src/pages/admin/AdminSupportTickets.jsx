import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { useAuth } from "@clerk/clerk-react";
import { Ticket, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const AdminSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const token = await getToken();
        const res = await axios.get("/api/admin/support/tickets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(res.data.tickets || []);
      } catch (err) {
        console.error("Failed to load tickets", err);
      } finally {
        setLoading(false);
      }
    };
    loadTickets();
  }, [getToken]);

  const updateStatus = async (id, status) => {
    const token = await getToken();
    await axios.patch(
      `/api/admin/support/tickets/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    setTickets((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status } : t)),
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#0b1120] text-slate-200 flex flex-col font-sans">
      <div className="grow p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <Ticket className="text-blue-500" size={32} />
              Support Tickets
            </h1>
            <p className="text-slate-400 mt-2 text-lg">
              Manage and resolve citizen inquiries and technical issues.
            </p>
          </div>

          {/* Table Container with Glassmorphism */}
          <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/60 shadow-2xl overflow-hidden">
            {loading ? (
              <div className="p-20 text-center text-slate-500 flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p>Loading tickets...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-20 text-center">
                <div className="flex flex-col items-center gap-3 opacity-40">
                  <CheckCircle2 size={48} />
                  <p className="text-lg font-medium">
                    No support tickets found
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-800/30 text-slate-400 border-b border-slate-800/60">
                      <th className="px-8 py-5 text-left font-bold uppercase tracking-wider text-[11px]">
                        Title
                      </th>
                      <th className="px-6 py-5 text-left font-bold uppercase tracking-wider text-[11px]">
                        Raised By
                      </th>
                      <th className="px-6 py-5 text-center font-bold uppercase tracking-wider text-[11px]">
                        Priority
                      </th>
                      <th className="px-6 py-5 text-center font-bold uppercase tracking-wider text-[11px]">
                        Status
                      </th>
                      <th className="px-8 py-5 text-right font-bold uppercase tracking-wider text-[11px]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800/40">
                    {tickets.map((t) => (
                      <tr
                        key={t._id}
                        className="hover:bg-blue-500/5 transition-colors group"
                      >
                        <td className="px-8 py-5 font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                          {t.title}
                        </td>
                        <td className="px-6 py-5 text-slate-400 font-medium">
                          {t.raisedBy?.name || t.raisedBy?.email}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span
                            className={`px-2 py-1 rounded text-[10px] font-black border ${
                              t.priority === "HIGH"
                                ? "bg-red-500/5 text-red-500 border-red-500/20"
                                : "bg-blue-500/5 text-blue-500 border-blue-500/20"
                            }`}
                          >
                            {t.priority}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center gap-2 w-32 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              t.status === "OPEN"
                                ? "bg-amber-500/5 text-amber-500 border-amber-500/20"
                                : t.status === "IN_PROGRESS"
                                  ? "bg-blue-500/5 text-blue-400 border-blue-500/20"
                                  : "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                                t.status === "OPEN"
                                  ? "bg-amber-500"
                                  : t.status === "IN_PROGRESS"
                                    ? "bg-blue-400"
                                    : "bg-emerald-500"
                              }`}
                            />
                            {t.status.replace("_", " ")}
                          </span>
                        </td>

                        <td className="px-8 py-5 text-right">
                          <select
                            value={t.status}
                            onChange={(e) =>
                              updateStatus(t._id, e.target.value)
                            }
                            className="bg-[#030712] border border-slate-700/50 text-slate-300 px-3 py-1.5 rounded-xl text-xs outline-none focus:border-blue-500/50 cursor-pointer hover:bg-slate-900 transition-colors"
                          >
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="text-xs text-center text-[#9ca8ba] py-4 border-t border-slate-800/60">
        © {new Date().getFullYear()} JanSamadhan Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default AdminSupportTickets;
