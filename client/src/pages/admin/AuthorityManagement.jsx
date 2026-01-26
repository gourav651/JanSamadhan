import React, { useEffect, useState, useRef } from "react";
import { fetchAuthorities } from "../../services/adminApi";
import axios from "../../lib/axios";

const AuthorityManagement = () => {
  const [authorities, setAuthorities] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null); // 👈 which row menu is open
  const [loadingId, setLoadingId] = useState(null); // 👈 disable during update
  const menuRef = useRef(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  // const [jurisdictionFilter, setJurisdictionFilter] = useState("");
  const [editAuthority, setEditAuthority] = useState(null);
  const [editDepartment, setEditDepartment] = useState("");
  const [editArea, setEditArea] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newClerkId, setNewClerkId] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [newArea, setNewArea] = useState("");

  const updateStatus = async (authorityId, status) => {
    try {
      setLoadingId(authorityId);

      await axios.patch(`/api/admin/authorities/${authorityId}/status`, {
        status,
      });

      // 🔄 Update UI without refetch
      setAuthorities((prev) =>
        prev.map((auth) =>
          auth._id === authorityId ? { ...auth, status } : auth,
        ),
      );

      setOpenMenuId(null);
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update authority status");
    } finally {
      setLoadingId(null);
    }
  };

  const saveEdit = async () => {
    try {
      await axios.patch(
        `/api/admin/authorities/${editAuthority._id}/assign-area`,
        {
          department: editDepartment,
          assignedArea: editArea,
        },
      );

      // update UI instantly
      setAuthorities((prev) =>
        prev.map((a) =>
          a._id === editAuthority._id
            ? { ...a, department: editDepartment, assignedArea: editArea }
            : a,
        ),
      );

      setEditAuthority(null);
    } catch (err) {
      alert("Failed to update authority");
    }
  };

  const openEditModal = (auth) => {
    setEditAuthority(auth);
    setEditDepartment(auth.department || "");
    setEditArea(auth.assignedArea || "");
    setOpenMenuId(null);
  };

  const createAuthority = async () => {
    // ✅ FRONTEND VALIDATION
    if (!newClerkId || !newDepartment || !newArea) {
      alert("All fields are required");
      return; // ⛔ stop here, don’t call API
    }
    try {
      await axios.post("/api/admin/authorities", {
        clerkUserId: newClerkId,
        department: newDepartment,
        assignedArea: newArea,
      });

      // reset + refresh
      setShowAddModal(false);
      setNewClerkId("");
      setNewDepartment("");
      setNewArea("");
      setPage(1); // go back to first page
    } catch (err) {
      alert("Failed to create authority");
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchAuthorities({
        search,
        status: statusFilter,
        department: departmentFilter,
        page,
        limit: 10,
      }).then((res) => {
        setAuthorities(res.data.authorities || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
      });
    }, 400);

    return () => clearTimeout(delay);
  }, [search, statusFilter, departmentFilter, page]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* ================= PAGE TITLE ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Authority Management
            </h2>
            <p className="text-slate-500">
              Manage registered officials, assign jurisdictions, and monitor
              account status.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 px-5 py-2.5 rounded-lg font-bold text-sm shadow-sm"
          >
            <span className="material-symbols-outlined">add</span>
            Add New Authority
          </button>
        </div>

        {/* ================= FILTERS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white p-4 rounded-xl border border-slate-200">
          {/* Search */}
          <div className="md:col-span-6 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              placeholder="Search by name, email, or ID..."
            />
          </div>

          {/* Filters */}
          <div className="md:col-span-6 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase text-slate-400 hidden lg:block">
              Filters:
            </span>

            {/* Department */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
            >
              <option value="">All Departments</option>
              <option value="Public Works">Public Works</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Traffic Control">Traffic Control</option>
              <option value="Health & Safety">Health & Safety</option>
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="SUSPENDED">Suspended</option>
            </select>

            {/* ✅ Jurisdiction (NEW – placed after Status) */}
            {/* <select
              value={jurisdictionFilter}
              onChange={(e) => setJurisdictionFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
            >
              <option value="">All Jurisdictions</option>
              <option value="North District">North District</option>
              <option value="South District">South District</option>
              <option value="Central District">Central District</option>
              <option value="East District">East District</option>
              <option value="West District">West District</option>
            </select> */}

            {/* Clear All */}
            <button
              onClick={() => {
                setSearch("");
                setDepartmentFilter("");
                setStatusFilter("");
              }}
              className="ml-auto text-sm text-primary font-medium hover:underline"
            >
              Clear all
            </button>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-visible">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">
                  Authority Official
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  Department
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  Assigned Area
                </th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {authorities.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-6 text-center text-slate-500 text-sm"
                  >
                    No authorities found
                  </td>
                </tr>
              ) : (
                authorities.map((auth) => (
                  <tr key={auth._id} className="hover:bg-slate-50">
                    {/* Authority Official */}
                    <td className="px-6 py-4 font-bold">
                      {auth.name || auth.email}
                      <div className="text-xs text-slate-400 font-normal">
                        {auth.email}
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-6 py-4 text-slate-600">
                      {auth.department || "—"}
                    </td>

                    {/* Assigned Area (future-ready) */}

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded text-xs bg-blue-50 text-blue-700">
                        {auth.assignedArea || "Not Assigned"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          auth.status === "SUSPENDED"
                            ? "bg-red-50 text-red-700"
                            : auth.status === "ON_LEAVE"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {auth.status || "Active"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === auth._id ? null : auth._id,
                          )
                        }
                        className="p-1.5 rounded-lg hover:bg-slate-100"
                      >
                        <span className="material-symbols-outlined">
                          more_vert
                        </span>
                      </button>

                      {/* 🔽 ACTION MENU */}
                      {openMenuId === auth._id && (
                        <div
                          ref={menuRef}
                          className="absolute right-6 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50"
                        >
                          <button
                            onClick={() => openEditModal(auth)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                          >
                            Edit Details
                          </button>
                          <hr />

                          <button
                            disabled={loadingId === auth._id}
                            onClick={() => updateStatus(auth._id, "ACTIVE")}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                          >
                            Set Active
                          </button>

                          <button
                            disabled={loadingId === auth._id}
                            onClick={() => updateStatus(auth._id, "ON_LEAVE")}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                          >
                            Set On Leave
                          </button>

                          <button
                            disabled={loadingId === auth._id}
                            onClick={() => updateStatus(auth._id, "SUSPENDED")}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Suspend
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* ================= PAGINATION ================= */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50">
            <span className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </span>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 rounded-md border disabled:opacity-50"
              >
                Previous
              </button>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded-md border disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {editAuthority && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-96 p-6 space-y-4">
            <h3 className="text-lg font-bold">Edit Authority</h3>

            {/* Department */}
            <select
              value={editDepartment}
              onChange={(e) => setEditDepartment(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select Department</option>
              <option value="Public Works">Public Works</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Traffic Control">Traffic Control</option>
              <option value="Health & Safety">Health & Safety</option>
            </select>

            {/* Assigned Area */}
            <input
              value={editArea}
              onChange={(e) => setEditArea(e.target.value)}
              placeholder="Assigned Area (e.g. North District)"
              className="w-full border rounded-lg px-3 py-2"
            />

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setEditAuthority(null)}
                className="px-4 py-2 text-sm border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 text-sm bg-primary rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-96 p-6 space-y-4">
            <h3 className="text-lg font-bold">Add Authority</h3>

            <input
              value={newClerkId}
              onChange={(e) => setNewClerkId(e.target.value)}
              placeholder="Clerk User ID"
              className="w-full border rounded-lg px-3 py-2"
            />

            <select
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select Department</option>
              <option value="Public Works">Public Works</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Traffic Control">Traffic Control</option>
              <option value="Health & Safety">Health & Safety</option>
            </select>

            <input
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              placeholder="Assigned Area (e.g. North District)"
              className="w-full border rounded-lg px-3 py-2"
            />

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={createAuthority}
                className="px-4 py-2 text-sm bg-primary rounded-lg"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorityManagement;
