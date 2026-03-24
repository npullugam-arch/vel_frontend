import { useEffect, useState } from "react";
import { API_ORIGIN, filesApi, qrConfigsApi } from "../api/adminApi";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";

const initialForm = {
  title: "",
  qrImageUrl: "",
  upiId: "",
  instructions: "",
  active: true,
};

export default function QrConfigsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingItem, setEditingItem] = useState(null);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const result = await qrConfigsApi.getAll();
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
      qrImageUrl: item.qrImageUrl || "",
      upiId: item.upiId || "",
      instructions: item.instructions || "",
      active: item.active ?? true,
    });
    setOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await filesApi.upload("qr", file);
      setForm((prev) => ({
        ...prev,
        qrImageUrl: result?.data?.fileUrl || "",
      }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingItem) {
      await qrConfigsApi.update(editingItem.id, form);
    } else {
      await qrConfigsApi.create(form);
    }

    setOpen(false);
    setForm(initialForm);
    await loadItems();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this QR config?")) return;
    await qrConfigsApi.remove(id);
    await loadItems();
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "upiId", label: "UPI ID" },
    {
      key: "qrImageUrl",
      label: "QR Image",
      render: (row) =>
        row.qrImageUrl ? (
          <a href={`${API_ORIGIN}${row.qrImageUrl}`} target="_blank" rel="noreferrer">
            View
          </a>
        ) : (
          "-"
        ),
    },
    {
      key: "active",
      label: "Active",
      render: (row) => (row.active ? "Yes" : "No"),
    },
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
        title="QR Configs"
        subtitle="Manage active QR code and payment instructions."
        action={
          <button className="btn btn-primary" onClick={openCreate}>
            Add QR Config
          </button>
        }
      />

      <DataTable columns={columns} rows={items} />

      <Modal open={open} title={editingItem ? "Edit QR Config" : "Add QR Config"} onClose={() => setOpen(false)}>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <input name="upiId" placeholder="UPI ID" value={form.upiId} onChange={handleChange} />
          <textarea
            name="instructions"
            placeholder="Instructions"
            value={form.instructions}
            onChange={handleChange}
            rows="4"
          />

          <label className="upload-box">
            Upload QR Image
            <input type="file" accept="image/*" onChange={handleFileUpload} />
          </label>

          {uploading && <p className="muted-text">Uploading...</p>}
          {form.qrImageUrl && <p className="muted-text">Uploaded: {form.qrImageUrl}</p>}

          <label className="checkbox-row">
            <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
            Active
          </label>

          <button className="btn btn-primary full-width">
            {editingItem ? "Update QR Config" : "Create QR Config"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
