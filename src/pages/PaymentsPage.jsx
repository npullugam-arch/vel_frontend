import { useEffect, useState } from "react";
import { paymentsApi } from "../api/adminApi";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";

const verificationStatuses = ["PENDING", "VERIFIED", "REJECTED"];

export default function PaymentsPage() {
  const [items, setItems] = useState([]);
  const [remarksMap, setRemarksMap] = useState({});

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const result = await paymentsApi.getAll();
    setItems(result?.data || []);
  };

  const setRemark = (id, value) => {
    setRemarksMap((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const verifyPayment = async (id, verificationStatus) => {
    await paymentsApi.verify(id, {
      verificationStatus,
      adminRemarks: remarksMap[id] || "",
    });
    await loadItems();
  };

  const columns = [
    { key: "registrationId", label: "Registration ID" },
    { key: "transactionId", label: "Transaction ID" },
    { key: "amount", label: "Amount" },
    { key: "paymentDate", label: "Payment Date" },
    { key: "verificationStatus", label: "Current Status" },
    {
      key: "remarks",
      label: "Remarks",
      render: (row) => (
        <input
          placeholder="Admin remarks"
          value={remarksMap[row.id] || row.adminRemarks || ""}
          onChange={(e) => setRemark(row.id, e.target.value)}
        />
      ),
    },
    {
      key: "actions",
      label: "Verify",
      render: (row) => (
        <div className="action-row">
          {verificationStatuses.map((status) => (
            <button
              key={status}
              className="btn btn-secondary btn-sm"
              onClick={() => verifyPayment(row.id, status)}
            >
              {status}
            </button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle="Verify submitted transaction IDs and payment proofs."
      />
      <DataTable columns={columns} rows={items} />
    </div>
  );
}