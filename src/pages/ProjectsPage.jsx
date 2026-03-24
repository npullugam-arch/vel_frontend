import { useEffect, useState } from "react";
import { projectsApi } from "../api/adminApi";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";

const initialForm = {
  title: "",
  description: "",
  mentorName: "",
  teamInfo: "",
  category: "ONGOING",
  statusText: "",
  collaborationOpen: false,
};

export default function ProjectsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingItem, setEditingItem] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const result = await projectsApi.getAll();
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
      description: item.description || "",
      mentorName: item.mentorName || "",
      teamInfo: item.teamInfo || "",
      category: item.category || "ONGOING",
      statusText: item.statusText || "",
      collaborationOpen: item.collaborationOpen ?? false,
    });
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingItem) {
      await projectsApi.update(editingItem.id, form);
    } else {
      await projectsApi.create(form);
    }

    setOpen(false);
    setForm(initialForm);
    await loadItems();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await projectsApi.remove(id);
    await loadItems();
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "mentorName", label: "Mentor" },
    { key: "category", label: "Category" },
    { key: "statusText", label: "Status Text" },
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
        title="Projects"
        subtitle="Manage collaboration and innovation projects."
        action={
          <button className="btn btn-primary" onClick={openCreate}>
            Add Project
          </button>
        }
      />

      <DataTable columns={columns} rows={items} />

      <Modal open={open} title={editingItem ? "Edit Project" : "Add Project"} onClose={() => setOpen(false)}>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows="4" />
          <input name="mentorName" placeholder="Mentor Name" value={form.mentorName} onChange={handleChange} />
          <input name="teamInfo" placeholder="Team Info" value={form.teamInfo} onChange={handleChange} />

          <select name="category" value={form.category} onChange={handleChange}>
            <option value="COLLABORATE">COLLABORATE</option>
            <option value="PREVIOUS">PREVIOUS</option>
            <option value="ONGOING">ONGOING</option>
            <option value="RESEARCH_INNOVATION">RESEARCH_INNOVATION</option>
            <option value="OUR_TEAM">OUR_TEAM</option>
            <option value="BOARD_OF_DIRECTORS">BOARD_OF_DIRECTORS</option>
          </select>

          <input name="statusText" placeholder="Status Text" value={form.statusText} onChange={handleChange} />

          <label className="checkbox-row">
            <input
              type="checkbox"
              name="collaborationOpen"
              checked={form.collaborationOpen}
              onChange={handleChange}
            />
            Collaboration Open
          </label>

          <button className="btn btn-primary full-width">
            {editingItem ? "Update Project" : "Create Project"}
          </button>
        </form>
      </Modal>
    </div>
  );
}