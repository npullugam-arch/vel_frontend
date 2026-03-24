import { useEffect, useState } from "react";
import { contactsApi } from "../api/adminApi";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";

const inquiryStatuses = ["NEW", "READ", "RESPONDED"];

export default function ContactsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const result = await contactsApi.getAll();
    setItems(result?.data || []);
  };

  const handleStatusChange = async (id, value) => {
    await contactsApi.updateStatus(id, value);
    await loadItems();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this inquiry?")) return;
    await contactsApi.remove(id);
    await loadItems();
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "subject", label: "Subject" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <select
          value={row.status || "NEW"}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
        >
          {inquiryStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row.id)}>
          Delete
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Contact Inquiries"
        subtitle="Track and respond to incoming leads and contact forms."
      />
      <DataTable columns={columns} rows={items} />
    </div>
  );
}