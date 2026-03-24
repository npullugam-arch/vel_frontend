import { useEffect, useState } from "react";
import { eventsApi } from "../api/adminApi";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";

const initialForm = {
  title: "",
  topic: "",
  domain: "",
  description: "",
  location: "",
  sponsors: "",
  capacity: "",
  eventType: "PARTICIPANT",
  status: "ONGOING",
  eventDate: "",
  registrationOpen: true,
};

export default function EventsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingItem, setEditingItem] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const result = await eventsApi.getAll();
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
      topic: item.topic || "",
      domain: item.domain || "",
      description: item.description || "",
      location: item.location || "",
      sponsors: item.sponsors || "",
      capacity: item.capacity || "",
      eventType: item.eventType || "PARTICIPANT",
      status: item.status || "ONGOING",
      eventDate: item.eventDate || "",
      registrationOpen: item.registrationOpen ?? true,
    });
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      capacity: form.capacity === "" ? null : Number(form.capacity),
    };

    if (editingItem) {
      await eventsApi.update(editingItem.id, payload);
    } else {
      await eventsApi.create(payload);
    }

    setOpen(false);
    setForm(initialForm);
    await loadItems();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await eventsApi.remove(id);
    await loadItems();
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "topic", label: "Topic" },
    { key: "eventType", label: "Type" },
    { key: "status", label: "Status" },
    { key: "location", label: "Location" },
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
        title="Events"
        subtitle="Manage participant and collaboration events."
        action={
          <button className="btn btn-primary" onClick={openCreate}>
            Add Event
          </button>
        }
      />

      <DataTable columns={columns} rows={items} />

      <Modal open={open} title={editingItem ? "Edit Event" : "Add Event"} onClose={() => setOpen(false)}>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <input name="topic" placeholder="Topic" value={form.topic} onChange={handleChange} />
          <input name="domain" placeholder="Domain" value={form.domain} onChange={handleChange} />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows="4" />
          <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
          <input name="sponsors" placeholder="Sponsors" value={form.sponsors} onChange={handleChange} />
          <input name="capacity" placeholder="Capacity" value={form.capacity} onChange={handleChange} />

          <select name="eventType" value={form.eventType} onChange={handleChange}>
            <option value="PARTICIPANT">PARTICIPANT</option>
            <option value="COLLABORATE">COLLABORATE</option>
          </select>

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="ONGOING">ONGOING</option>
            <option value="UPCOMING">UPCOMING</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>

          <input type="date" name="eventDate" value={form.eventDate} onChange={handleChange} />

          <label className="checkbox-row">
            <input
              type="checkbox"
              name="registrationOpen"
              checked={form.registrationOpen}
              onChange={handleChange}
            />
            Registration Open
          </label>

          <button className="btn btn-primary full-width">
            {editingItem ? "Update Event" : "Create Event"}
          </button>
        </form>
      </Modal>
    </div>
  );
}