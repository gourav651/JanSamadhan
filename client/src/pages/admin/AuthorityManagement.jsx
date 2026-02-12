import React, { useEffect, useState, useRef } from "react";
import { fetchAuthorities } from "../../services/adminApi";
import axios from "../../lib/axios";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Shield,
  MapPin,
  Briefcase,
  UserPlus,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AuthorityManagement = () => {
  const [authorities, setAuthorities] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null); // 👈 which row menu is open
  const [loadingId, setLoadingId] = useState(null); // 👈 disable during update
  const menuRef = useRef(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
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
    <div className="min-h-screen w-full bg-[#0b1120] text-slate-200 flex flex-col">
      <div className="grow p-6 md:p-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          {/* ================= HEADER SECTION ================= */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
                <Shield className="text-blue-500" size={32} />
                Authority Management
              </h2>
              <p className="text-slate-400 mt-2 text-lg">
                Manage registered officials, assign jurisdictions, and monitor
                account status.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/20 group cursor-pointer"
            >
              <Plus size={20} className="transition-transform" />
              Add New Authority
            </button>
          </div>

          {/* ================= FILTERS BAR ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-slate-800/60 shadow-xl">
            {/* Enhanced Search */}
            <div className="lg:col-span-5 relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                size={18}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#030712] border border-slate-700/50 rounded-xl text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-600"
                placeholder="Search by name, email, or ID..."
              />
            </div>

            {/* Custom Selects */}
            <div className="lg:col-span-7 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-slate-500 mr-2">
                <Filter size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Quick Filters
                </span>
              </div>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-[#030712] border border-slate-700/50 text-slate-300 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-blue-500/50 cursor-pointer hover:bg-slate-900 transition-colors"
              >
                <option value="">All Departments</option>
                {[
                  "Public Works",
                  "Sanitation",
                  "Traffic Control",
                  "Health & Safety",
                ].map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#030712] border border-slate-700/50 text-slate-300 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-blue-500/50 cursor-pointer hover:bg-slate-900 transition-colors"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="ON_LEAVE">On Leave</option>
                <option value="SUSPENDED">Suspended</option>
              </select>

              <button
                onClick={() => {
                  setSearch("");
                  setDepartmentFilter("");
                  setStatusFilter("");
                }}
                className="ml-auto text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-tighter transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* ================= DATA TABLE ================= */}
          <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/60 shadow-2xl overflow-visible">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800/30 text-slate-400 border-b border-slate-800/60">
                  <th className="px-8 py-5 text-left font-bold uppercase tracking-wider text-[11px]">
                    Authority Official
                  </th>
                  <th className="px-6 py-5 text-left font-bold uppercase tracking-wider text-[11px]">
                    Department
                  </th>
                  <th className="px-6 py-5 text-left font-bold uppercase tracking-wider text-[11px]">
                    Jurisdiction
                  </th>
                  <th className="px-6 py-5 text-center font-bold uppercase tracking-wider text-[11px]">
                    Status
                  </th>
                  <th className="px-8 py-5 text-right font-bold uppercase tracking-wider text-[11px]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/40">
                {authorities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-40">
                        <Shield size={48} />
                        <p className="text-lg">No authority records found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  authorities.map((auth) => (
                    <tr
                      key={auth._id}
                      className="hover:bg-blue-500/2 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                            {(auth.name || auth.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                              {auth.name || "N/A"}
                            </div>
                            <div className="text-xs text-slate-500 font-medium">
                              {auth.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Briefcase size={14} className="text-blue-500/60" />
                          {auth.department || "—"}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-400">
                          <MapPin size={14} className="text-emerald-500/60" />
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/5 text-emerald-400/80 text-[11px] font-bold border border-emerald-500/10">
                            {auth.assignedArea || "Not Assigned"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            auth.status === "SUSPENDED"
                              ? "bg-red-500/5 text-red-500 border-red-500/20"
                              : auth.status === "ON_LEAVE"
                                ? "bg-amber-500/5 text-amber-500 border-amber-500/20"
                                : "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                          }`}
                        >
                          {auth.status || "Active"}
                        </span>
                      </td>

                      <td className="px-8 py-5 text-right relative">
                        <button
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === auth._id ? null : auth._id,
                            )
                          }
                          className="p-2 rounded-xl hover:bg-slate-800 transition-colors text-slate-500 hover:text-white cursor-pointer"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {/* 🔽 ACTION MENU */}
                        {openMenuId === auth._id && (
                          <div
                            ref={menuRef}
                            className="absolute right-8 top-12 w-48 bg-[#030712] border border-slate-800 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in duration-200"
                          >
                            <button
                              onClick={() => openEditModal(auth)}
                              className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors"
                            >
                              Edit Details
                            </button>
                            <div className="h-px bg-slate-800 my-1 mx-2" />
                            <button
                              onClick={() => updateStatus(auth._id, "ACTIVE")}
                              className="w-full text-left px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                            >
                              Set Active
                            </button>
                            <button
                              onClick={() => updateStatus(auth._id, "ON_LEAVE")}
                              className="w-full text-left px-4 py-2 text-sm text-amber-400 hover:bg-amber-600 hover:text-white transition-colors"
                            >
                              Set On Leave
                            </button>
                            <button
                              onClick={() =>
                                updateStatus(auth._id, "SUSPENDED")
                              }
                              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-600 hover:text-white transition-colors font-bold"
                            >
                              Suspend Official
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
            <div className="flex items-center justify-between px-8 py-5 border-t border-slate-800/60 bg-slate-900/20">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Page {page} <span className="text-slate-700 mx-1">/</span>{" "}
                {totalPages}
              </span>

              <div className="flex gap-3">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 disabled:opacity-20 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 disabled:opacity-20 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MODALS (Simplified for brevity, but applied dark theme) ================= */}
        {(editAuthority || showAddModal) && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-100 p-4">
            <div className="bg-[#0b1120] border border-slate-800 rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-white">
                  {editAuthority ? "Edit Official" : "Register Official"}
                </h3>
                <button
                  onClick={() => {
                    setEditAuthority(null);
                    setShowAddModal(false);
                  }}
                  className="text-slate-500 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-5">
                {/* Form inputs would follow the same input styling as the Search Bar */}
                {!editAuthority && (
                  <input
                    value={newClerkId}
                    onChange={(e) => setNewClerkId(e.target.value)}
                    placeholder="Clerk User ID"
                    className="w-full bg-[#030712] border border-slate-700/50 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none"
                  />
                )}
                <select
                  value={editAuthority ? editDepartment : newDepartment}
                  onChange={(e) =>
                    editAuthority
                      ? setEditDepartment(e.target.value)
                      : setNewDepartment(e.target.value)
                  }
                  className="w-full bg-[#030712] border border-slate-700/50 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none"
                >
                  <option value="">Select Department</option>
                  {[
                    "Public Works",
                    "Sanitation",
                    "Traffic Control",
                    "Health & Safety",
                  ].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <input
                  value={editAuthority ? editArea : newArea}
                  onChange={(e) =>
                    editAuthority
                      ? setEditArea(e.target.value)
                      : setNewArea(e.target.value)
                  }
                  placeholder="Jurisdiction (e.g. North District)"
                  className="w-full bg-[#030712] border border-slate-700/50 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setEditAuthority(null);
                    setShowAddModal(false);
                  }}
                  className="flex-1 py-3 text-sm font-bold border border-slate-800 rounded-xl hover:bg-slate-900 transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={editAuthority ? saveEdit : createAuthority}
                  className="flex-1 py-3 text-sm font-bold bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-900/20"
                >
                  {editAuthority ? "Update Record" : "Confirm Entry"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="text-xs text-center text-[#9ca8ba] py-4 border-t border-slate-800/60">
        © {new Date().getFullYear()} JanSamadhan Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthorityManagement;
