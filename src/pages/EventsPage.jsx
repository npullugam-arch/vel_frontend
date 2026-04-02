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
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const result = await eventsApi.getAll();
      setItems(Array.isArray(result?.data) ? result.data : []);
    } catch (error) {
      console.error("Failed to load events:", error);
      setErrorMessage(error.message || "Failed to load events.");
      setItems([]);
    } finally {
      setLoading(false);
    }
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
    setErrorMessage("");
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
      capacity:
        item.capacity === null || item.capacity === undefined
          ? ""
          : String(item.capacity),
      eventType: item.eventType || "PARTICIPANT",
      status: item.status || "ONGOING",
      eventDate: item.eventDate ? String(item.eventDate).slice(0, 10) : "",
      registrationOpen: item.registrationOpen ?? true,
    });
    setErrorMessage("");
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingItem(null);
    setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      capacity: form.capacity === "" ? null : Number(form.capacity),
      eventDate: form.eventDate || null,
    };

    try {
      setSubmitting(true);
      setErrorMessage("");

      if (editingItem) {
        await eventsApi.update(editingItem.id, payload);
      } else {
        await eventsApi.create(payload);
      }

      closeModal();
      await loadItems();
    } catch (error) {
      console.error("Failed to save event:", error);
      setErrorMessage(error.message || "Failed to save event.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this event?");
    if (!confirmed) return;

    try {
      setDeletingId(id);
      setErrorMessage("");

      await eventsApi.remove(id);

      setItems((prev) => prev.filter((item) => item.id !== id));
      alert("Event deleted successfully.");
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert(error.message || "Failed to delete event.");
      setErrorMessage(error.message || "Failed to delete event.");
    } finally {
      setDeletingId(null);
    }
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
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => openEdit(row)}
            disabled={deletingId === row.id}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(row.id)}
            disabled={deletingId === row.id}
          >
            {deletingId === row.id ? "Deleting..." : "Delete"}
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
          <button className="btn btn-primary" onClick={openCreate} type="button">
            Add Event
          </button>
        }
      />

      {errorMessage && (
        <div className="alert alert-error" style={{ marginBottom: "16px" }}>
          {errorMessage}
        </div>
      )}

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <DataTable columns={columns} rows={items} />
      )}

      <Modal
        open={open}
        title={editingItem ? "Edit Event" : "Add Event"}
        onClose={closeModal}
      >
        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <input
            name="topic"
            placeholder="Topic"
            value={form.topic}
            onChange={handleChange}
          />

          <input
            name="domain"
            placeholder="Domain"
            value={form.domain}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows="4"
          />

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
          />

          <input
            name="sponsors"
            placeholder="Sponsors"
            value={form.sponsors}
            onChange={handleChange}
          />

          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={form.capacity}
            onChange={handleChange}
          />

          <select name="eventType" value={form.eventType} onChange={handleChange}>
            <option value="PARTICIPANT">PARTICIPANT</option>
            <option value="COLLABORATE">COLLABORATE</option>
          </select>

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="ONGOING">ONGOING</option>
            <option value="UPCOMING">UPCOMING</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>

          <input
            type="date"
            name="eventDate"
            value={form.eventDate}
            onChange={handleChange}
          />

          <label className="checkbox-row">
            <input
              type="checkbox"
              name="registrationOpen"
              checked={form.registrationOpen}
              onChange={handleChange}
            />
            Registration Open
          </label>

          <button
            type="submit"
            className="btn btn-primary full-width"
            disabled={submitting}
          >
            {submitting
              ? editingItem
                ? "Updating..."
                : "Creating..."
              : editingItem
              ? "Update Event"
              : "Create Event"}
          </button>
        </form>
      </Modal>
    </div>
  );
}