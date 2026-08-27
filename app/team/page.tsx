"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Pencil,
  Trash2,
  X,
  Check,
  Plus,
  Search,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import MainContent from "@/components/MainContent";

type User = {
  _id: string;
  name: string;
  email: string;
  role?: string;
  status?: "active" | "inactive";
};

type FormData = {
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
};

const initialForm: FormData = {
  name: "",
  email: "",
  role: "Developer",
  status: "active",
};

export default function TeamPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState<FormData>(initialForm);
  const [adding, setAdding] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<FormData>(initialForm);
  const [savingEdit, setSavingEdit] = useState(false);

  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchUsers() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/users", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setUsers(data.users || []);
      } else {
        setError(data.message || "Failed to load users");
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return users;

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        (user.role || "").toLowerCase().includes(value) ||
        (user.status || "").toLowerCase().includes(value)
      );
    });
  }, [users, search]);

  const totalMembers = users.length;

  const activeMembers = users.filter(
    (user) => user.status === "active" || !user.status
  ).length;

  const inactiveMembers = users.filter(
    (user) => user.status === "inactive"
  ).length;

  function openAddModal() {
    setForm(initialForm);
    setError(null);
    setIsAddOpen(true);
  }

  function closeAddModal() {
    if (adding) return;
    setIsAddOpen(false);
    setForm(initialForm);
  }

  function handleFormChange(
    field: keyof FormData,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    setAdding(true);
    setError(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
          status: form.status,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsAddOpen(false);
        setForm(initialForm);
        await fetchUsers();
      } else {
        setError(data.message || "Failed to add member");
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setAdding(false);
    }
  }

  function openEditModal(user: User) {
    setEditingUser(user);

    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role || "Developer",
      status: user.status || "active",
    });

    setError(null);
  }

  function closeEditModal() {
    if (savingEdit) return;

    setEditingUser(null);
    setEditForm(initialForm);
  }

  function handleEditChange(
    field: keyof FormData,
    value: string
  ) {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();

    if (!editingUser) return;

    if (!editForm.name.trim() || !editForm.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    setSavingEdit(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/users/${editingUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editForm.name.trim(),
            email: editForm.email.trim(),
            role: editForm.role,
            status: editForm.status,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setEditingUser(null);
        setEditForm(initialForm);
        await fetchUsers();
      } else {
        setError(data.message || "Failed to update member");
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setSavingEdit(false);
    }
  }

  function openDeleteModal(user: User) {
    setError(null);
    setDeleteUser(user);
  }

  function closeDeleteModal() {
    if (deletingId) return;
    setDeleteUser(null);
  }

  async function handleDelete() {
    if (!deleteUser) return;

    setDeletingId(deleteUser._id);
    setError(null);

    try {
      const res = await fetch(
        `/api/users/${deleteUser._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.success) {
        setDeleteUser(null);
        await fetchUsers();
      } else {
        setError(data.message || "Failed to delete member");
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setDeletingId(null);
    }
  }

  function memberId(id: string) {
    const numeric = id.replace(/\D/g, "").slice(-10);

    return numeric
      ? `#${numeric}`
      : `#${id.slice(-10)}`;
  }

  return (
    <MainContent
      title="Team"
      description="Manage your team members, roles and account status."
    >
      <div className="px-4 pb-8 sm:px-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-[303px]">
            <Search
              size={19}
              strokeWidth={1.7}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search team members..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-700 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <Plus size={18} />
            Add Member
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError(null)}
            >
              <X size={17} />
            </button>
          </div>
        )}

        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex h-[78px] items-center rounded-xl border border-gray-200 bg-white px-4">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
              <Users
                size={20}
                strokeWidth={1.8}
                className="text-indigo-600"
              />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Total Members
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {totalMembers}
              </p>
            </div>
          </div>

          <div className="h-[78px] rounded-xl border border-gray-200 bg-white px-4 py-3">
            <p className="text-xs text-slate-500">
              Active Members
            </p>

            <p className="mt-1 text-lg font-semibold text-gray-900">
              {activeMembers}
            </p>
          </div>

          <div className="h-[78px] rounded-xl border border-gray-200 bg-white px-4 py-3">
            <p className="text-xs text-slate-500">
              Inactive Members
            </p>

            <p className="mt-1 text-lg font-semibold text-gray-900">
              {inactiveMembers}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-[850px] w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Member
                </th>

                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Email
                </th>

                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Role
                </th>

                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm text-slate-400"
                  >
                    Loading team members...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm text-slate-400"
                  >
                    {search
                      ? "No team members found."
                      : "No team members yet."}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isActive =
                    user.status !== "inactive";

                  return (
                    <tr
                      key={user._id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-700">
                            {user.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {user.name}
                            </p>

                            <p className="text-[11px] text-slate-400">
                              ID {memberId(user._id)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3">
                        <span className="text-sm text-slate-600">
                          {user.email}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <span className="inline-flex rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {user.role || "Developer"}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(user)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                            aria-label="Edit member"
                          >
                            <Pencil
                              size={15}
                              strokeWidth={1.8}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openDeleteModal(user)
                            }
                            disabled={
                              deletingId === user._id
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            aria-label="Delete member"
                          >
                            <Trash2
                              size={15}
                              strokeWidth={1.8}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={isAddOpen}
        onClose={() => {
          if (!adding) closeAddModal();
        }}
        className="relative z-[100]"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0"
        />

        <div className="fixed inset-0 z-[100] w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <div>
                  <DialogTitle className="text-lg font-semibold text-gray-900">
                    Add Member
                  </DialogTitle>

                  <p className="mt-1 text-xs text-slate-500">
                    Add a new member to your team.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeAddModal}
                  disabled={adding}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={handleAdd}
                className="space-y-4 p-5"
              >
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Name
                  </label>

                  <input
                    value={form.name}
                    onChange={(e) =>
                      handleFormChange(
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="Enter member name"
                    className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      handleFormChange(
                        "email",
                        e.target.value
                      )
                    }
                    placeholder="name@example.com"
                    className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Role
                  </label>

                  <select
                    value={form.role}
                    onChange={(e) =>
                      handleFormChange(
                        "role",
                        e.target.value
                      )
                    }
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="Developer">
                      Developer
                    </option>
                    <option value="Designer">
                      Designer
                    </option>
                    <option value="Manager">
                      Manager
                    </option>
                    <option value="HR">HR</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Status
                  </label>

                  <select
                    value={form.status}
                    onChange={(e) =>
                      handleFormChange(
                        "status",
                        e.target.value
                      )
                    }
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="active">
                      Active
                    </option>
                    <option value="inactive">
                      Inactive
                    </option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    disabled={adding}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={adding}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    <Plus size={16} />
                    {adding
                      ? "Adding..."
                      : "Add Member"}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={editingUser !== null}
        onClose={() => {
          if (!savingEdit) closeEditModal();
        }}
        className="relative z-[100]"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0"
        />

        <div className="fixed inset-0 z-[100] w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <div>
                  <DialogTitle className="text-lg font-semibold text-gray-900">
                    Edit Member
                  </DialogTitle>

                  <p className="mt-1 text-xs text-slate-500">
                    Update team member details.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={savingEdit}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={saveEdit}
                className="space-y-4 p-5"
              >
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Name
                  </label>

                  <input
                    value={editForm.name}
                    onChange={(e) =>
                      handleEditChange(
                        "name",
                        e.target.value
                      )
                    }
                    className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email
                  </label>

                  <input    
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      handleEditChange(
                        "email",
                        e.target.value
                      )
                    }
                    className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Role
                  </label>

                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      handleEditChange(
                        "role",
                        e.target.value
                      )
                    }
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="Developer">
                      Developer
                    </option>
                    <option value="Designer">
                      Designer
                    </option>
                    <option value="Manager">
                      Manager
                    </option>
                    <option value="HR">HR</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Status
                  </label>

                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      handleEditChange(
                        "status",
                        e.target.value
                      )
                    }
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="active">
                      Active
                    </option>
                    <option value="inactive">
                      Inactive
                    </option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    disabled={savingEdit}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    <Check size={16} />

                    {savingEdit
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={deleteUser !== null}
        onClose={closeDeleteModal}
        className="relative z-[200]"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0"
        />

        <div className="fixed inset-0 z-[200] w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl"
            >
              <div className="px-5 py-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <Trash2
                      size={21}
                      className="text-red-600"
                    />
                  </div>

                  <div>
                    <DialogTitle className="text-base font-semibold text-gray-900">
                      Delete Member
                    </DialogTitle>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Are you sure you want to delete{" "}
                      <span className="font-semibold text-gray-700">
                        {deleteUser?.name}
                      </span>
                      ? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-200 bg-gray-50 px-5 py-4">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={!!deletingId}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={!!deletingId}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  <Trash2 size={16} />

                  {deletingId
                    ? "Deleting..."
                    : "Delete Member"}
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </MainContent>
  );
} 