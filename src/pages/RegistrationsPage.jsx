import { useEffect, useState } from "react";
import { registrationsApi } from "../api/adminApi";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";

const selectionStatuses = ["NEW", "UNDER_REVIEW", "APPROVED", "REJECTED", "WAITLISTED"];

function RegistrationDetailsModal({ item, onClose }) {
  if (!item) return null;

  const detailRows = [
    { label: "Full Name", value: item.fullName },
    { label: "College Name", value: item.collegeName },
    { label: "Roll Number", value: item.rollNumber },
    { label: "College Email", value: item.collegeEmail },
    { label: "Personal Email", value: item.personalEmail },
    { label: "WhatsApp Number", value: item.whatsappNumber },
    { label: "Branch", value: item.branch },
    { label: "Year of Study", value: item.yearOfStudy },
    { label: "City", value: item.city },
    { label: "Interest Details", value: item.interestMessage },
    { label: "Transaction ID", value: item.transactionId },
    { label: "UTR ID", value: item.utrId },
    { label: "Registration Type", value: item.registrationType },
    { label: "Reference ID", value: item.referenceId },
    { label: "Payment Status", value: item.paymentStatus },
    { label: "Selection Status", value: item.selectionStatus },
    { label: "Internship ID", value: item.internshipId },
    { label: "Event ID", value: item.eventId },
    { label: "Project ID", value: item.projectId },
    { label: "Created At", value: item.createdAt },
    { label: "Updated At", value: item.updatedAt },
  ];

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-head">
          <div>
            <h3>Registration Details</h3>
            <p>View complete information submitted by the applicant.</p>
          </div>
          <button className="admin-modal-close" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className="registration-detail-grid">
          {detailRows.map((row) => (
            <div className="registration-detail-card" key={row.label}>
              <span className="registration-detail-label">{row.label}</span>
              <span className="registration-detail-value">
                {row.value ? String(row.value) : "-"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RegistrationsPage() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

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
        <div className="registration-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setSelectedItem(row)}
            type="button"
          >
            View
          </button>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(row.id)}
            type="button"
          >
            Delete
          </button>
        </div>
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

      <RegistrationDetailsModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}