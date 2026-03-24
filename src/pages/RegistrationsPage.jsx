import { useEffect, useState } from "react";
import { registrationsApi } from "../api/adminApi";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";

const selectionStatuses = ["NEW", "UNDER_REVIEW", "APPROVED", "REJECTED", "WAITLISTED"];

export default function RegistrationsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const result = await registrationsApi.getAll();
    setItems(result?.data || []);
  };

  const handleStatusChange = async (id, value) => {
    await registrationsApi.updateSelectionStatus(id, value);
    await loadItems();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this registration?")) return;
    await registrationsApi.remove(id);
    await loadItems();
  };

  const columns = [
    { key: "fullName", label: "Name" },
    { key: "collegeName", label: "College" },
    { key: "registrationType", label: "Type" },
    { key: "referenceId", label: "Reference ID" },
    { key: "paymentStatus", label: "Payment" },
    {
      key: "selectionStatus",
      label: "Selection Status",
      render: (row) => (
        <select
          value={row.selectionStatus || "NEW"}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
        >
          {selectionStatuses.map((status) => (
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
        title="Registrations"
        subtitle="Review applications and update selection status."
      />
      <DataTable columns={columns} rows={items} />
    </div>
  );
}