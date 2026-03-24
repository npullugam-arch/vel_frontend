import { useEffect, useState } from "react";
import { internshipsApi } from "../api/adminApi";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";

const initialForm = {
  title: "",
  domain: "",
  mentorName: "",
  description: "",
  duration: "",
  mode: "ONLINE",
  fee: "",
  capacity: "",
  status: "ONGOING",
  registrationOpen: true,
  startDate: "",
  endDate: "",
};

export default function InternshipsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingItem, setEditingItem] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const result = await internshipsApi.getAll();
    setItems(result?.data || []);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openCreate = () => {
    setEditingItem(null);
    setForm(initialForm);
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title || "",
      domain: item.domain || "",
      mentorName: item.mentorName || "",
      description: item.description || "",
      duration: item.duration || "",
      mode: item.mode || "ONLINE",
      fee: item.fee || "",
      capacity: item.capacity || "",
      status: item.status || "ONGOING",
      registrationOpen: item.registrationOpen ?? true,
      startDate: item.startDate || "",
      endDate: item.endDate || "",
    });
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      fee: form.fee === "" ? null : Number(form.fee),
      capacity: form.capacity === "" ? null : Number(form.capacity),
    };

    if (editingItem) {
      await internshipsApi.update(editingItem.id, payload);
    } else {
      await internshipsApi.create(payload);
    }

    setOpen(false);
    setForm(initialForm);
    await loadItems();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this internship?")) return;
    await internshipsApi.remove(id);
    await loadItems();
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "domain", label: "Domain" },
    { key: "mentorName", label: "Mentor" },
    { key: "mode", label: "Mode" },
    { key: "status", label: "Status" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="action-row">
          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(row)}>
            Edit
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row.id)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Internships"
        subtitle="Create, edit, and manage internship tracks."
        action={
          <button className="btn btn-primary" onClick={openCreate}>
            Add Internship
          </button>
        }
      />

      <DataTable columns={columns} rows={items} />

      <Modal
        open={open}
        title={editingItem ? "Edit Internship" : "Add Internship"}
        onClose={() => setOpen(false)}
      >
        <form className="form-grid" onSubmit={handleSubmit}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <input name="domain" placeholder="Domain" value={form.domain} onChange={handleChange} />
          <input name="mentorName" placeholder="Mentor Name" value={form.mentorName} onChange={handleChange} />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows="4" />
          <input name="duration" placeholder="Duration" value={form.duration} onChange={handleChange} />

          <select name="mode" value={form.mode} onChange={handleChange}>
            <option value="ONLINE">ONLINE</option>
            <option value="OFFLINE">OFFLINE</option>
            <option value="HYBRID">HYBRID</option>
          </select>

          <input name="fee" placeholder="Fee" value={form.fee} onChange={handleChange} />
          <input name="capacity" placeholder="Capacity" value={form.capacity} onChange={handleChange} />

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="ONGOING">ONGOING</option>
            <option value="UPCOMING">UPCOMING</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>

          <label className="checkbox-row">
            <input
              type="checkbox"
              name="registrationOpen"
              checked={form.registrationOpen}
              onChange={handleChange}
            />
            Registration Open
          </label>

          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />

          <button className="btn btn-primary full-width">
            {editingItem ? "Update Internship" : "Create Internship"}
          </button>
        </form>
      </Modal>
    </div>
  );
}