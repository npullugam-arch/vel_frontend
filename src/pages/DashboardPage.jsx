import { useEffect, useState } from "react";
import { dashboardApi } from "../api/adminApi";
import PageHeader from "../components/PageHeader";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const result = await dashboardApi.summary();
      setSummary(result?.data || {});
    } catch {
      setSummary({});
    }
  };

  const cards = [
    { label: "Internships", value: summary?.totalInternships ?? 0 },
    { label: "Events", value: summary?.totalEvents ?? 0 },
    { label: "Projects", value: summary?.totalProjects ?? 0 },
    { label: "Registrations", value: summary?.totalRegistrations ?? 0 },
    { label: "Approved", value: summary?.approvedRegistrations ?? 0 },
    { label: "Pending Payments", value: summary?.pendingPayments ?? 0 },
    { label: "Verified Payments", value: summary?.verifiedPayments ?? 0 },
    { label: "Contact Inquiries", value: summary?.totalContactInquiries ?? 0 },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of platform activity and admin summary."
      />

      <div className="dashboard-grid">
        {cards.map((card) => (
          <div key={card.label} className="stat-panel">
            <p className="muted-text">{card.label}</p>
            <h2>{card.value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}