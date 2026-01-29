import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { useAuth } from "@clerk/clerk-react";

const AdminSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const token = await getToken();

        const res = await axios.get("/api/admin/support/tickets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTickets(res.data.tickets || []);
      } catch (err) {
        console.error("Failed to load tickets", err);
      } finally {
        setLoading(false); // ✅ HERE
      }
    };

    loadTickets();
  }, [getToken]);

  const updateStatus = async (id, status) => {
    const token = await getToken();

    await axios.patch(
      `/api/admin/support/tickets/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setTickets((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status } : t)),
    );
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Support Tickets</h1>

      <div className="bg-white border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-slate-500">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="p-10 text-slate-500">No support tickets found</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">Raised By</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {tickets.map((t) => (
                <tr key={t._id}>
                  <td className="px-6 py-4 font-medium">{t.title}</td>
                  <td className="px-6 py-4">
                    {t.raisedBy?.name || t.raisedBy?.email}
                  </td>
                  <td className="px-6 py-4">{t.priority}</td>
                  <td className="px-6 py-4">{t.status}</td>
                  <td className="px-6 py-4 text-right">
                    <select
                      value={t.status}
                      onChange={(e) => updateStatus(t._id, e.target.value)}
                      className="border rounded px-2 py-1"
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
        )}
      </div>
    </div>
  );
};

export default AdminSupportTickets;
