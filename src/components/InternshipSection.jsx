import { useEffect, useMemo, useState } from "react";
import { getPublicInternships } from "../api/api";
import { fallbackInternships } from "../data/fallbackData";
import SectionTitle from "./SectionTitle";
import RegisterModal from "./RegisterModal";

function formatDate(dateValue) {
  if (!dateValue) return "Not specified";

  try {
    return new Date(dateValue).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateValue;
  }
}

function formatFee(fee) {
  if (fee === null || fee === undefined || fee === "") return "Free / Not specified";

  const numericFee = Number(fee);
  if (Number.isNaN(numericFee)) return fee;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericFee);
}

function getStatusClass(status) {
  const normalized = (status || "").toUpperCase();

  if (normalized === "ONGOING") return "status-ongoing";
  if (normalized === "UPCOMING") return "status-upcoming";
  if (normalized === "COMPLETED") return "status-completed";
  return "";
}

export default function InternshipSection() {
  const [internships, setInternships] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInternships() {
      try {
        setLoading(true);
        const result = await getPublicInternships();
        const data = result?.data?.length ? result.data : fallbackInternships;
        setInternships(data);
      } catch (error) {
        setInternships(fallbackInternships);
      } finally {
        setLoading(false);
      }
    }

    loadInternships();
  }, []);

  const filteredInternships = useMemo(() => {
    if (activeFilter === "ALL") return internships;
    return internships.filter(
      (item) => (item.status || "").toUpperCase() === activeFilter
    );
  }, [internships, activeFilter]);

  return (
    <section id="internships" className="section internship-showcase-section">
      <div className="container">
        <SectionTitle
          eyebrow="Internships"
          title="Industry-ready internship programs with complete transparency"
          subtitle="Explore every internship with full details including mentor, duration, mode, fee, capacity, description, and registration timeline."
        />

        <div className="internship-filter-row">
          <button
            className={`internship-filter-btn ${activeFilter === "ALL" ? "active" : ""}`}
            onClick={() => setActiveFilter("ALL")}
          >
            All
          </button>
          <button
            className={`internship-filter-btn ${activeFilter === "ONGOING" ? "active" : ""}`}
            onClick={() => setActiveFilter("ONGOING")}
          >
            Ongoing
          </button>
          <button
            className={`internship-filter-btn ${activeFilter === "UPCOMING" ? "active" : ""}`}
            onClick={() => setActiveFilter("UPCOMING")}
          >
            Upcoming
          </button>
          <button
            className={`internship-filter-btn ${activeFilter === "COMPLETED" ? "active" : ""}`}
            onClick={() => setActiveFilter("COMPLETED")}
          >
            Completed
          </button>
        </div>

        {loading ? (
          <div className="internship-empty-state">
            <h3>Loading internships...</h3>
            <p>Please wait while we fetch the latest internship opportunities.</p>
          </div>
        ) : filteredInternships.length === 0 ? (
          <div className="internship-empty-state">
            <h3>No internships found</h3>
            <p>There are no internship entries available in this category right now.</p>
          </div>
        ) : (
          <div className="internship-pro-grid">
            {filteredInternships.map((item) => {
              const isRegistrationOpen = !!item.registrationOpen;
              const statusClass = getStatusClass(item.status);

              return (
                <article key={item.id} className="internship-pro-card">
                  <div className="internship-card-top">
                    <div className="internship-top-tags">
                      <span className={`internship-status-badge ${statusClass}`}>
                        {item.status || "N/A"}
                      </span>
                      <span
                        className={`internship-registration-pill ${
                          isRegistrationOpen ? "open" : "closed"
                        }`}
                      >
                        {isRegistrationOpen ? "Registration Open" : "Registration Closed"}
                      </span>
                    </div>

                    <h3 className="internship-card-title">{item.title || "Untitled Internship"}</h3>

                    <p className="internship-card-domain">
                      {item.domain || "General Domain"}
                    </p>
                  </div>

                  <div className="internship-key-highlights">
                    <div className="internship-mini-box">
                      <span className="internship-mini-label">Mentor</span>
                      <strong>{item.mentorName || "Not specified"}</strong>
                    </div>
                    <div className="internship-mini-box">
                      <span className="internship-mini-label">Mode</span>
                      <strong>{item.mode || "Not specified"}</strong>
                    </div>
                    <div className="internship-mini-box">
                      <span className="internship-mini-label">Duration</span>
                      <strong>{item.duration || "Not specified"}</strong>
                    </div>
                    <div className="internship-mini-box">
                      <span className="internship-mini-label">Fee</span>
                      <strong>{formatFee(item.fee)}</strong>
                    </div>
                  </div>

                  <div className="internship-description-block">
                    <h4>About this internship</h4>
                    <p>{item.description || "Description will be updated soon."}</p>
                  </div>

                  <div className="internship-details-list">
                    <div className="internship-detail-row">
                      <span>Capacity</span>
                      <strong>{item.capacity ?? "Not specified"}</strong>
                    </div>

                    <div className="internship-detail-row">
                      <span>Registration Starts</span>
                      <strong>{formatDate(item.startDate)}</strong>
                    </div>

                    <div className="internship-detail-row">
                      <span>Registration Ends</span>
                      <strong>{formatDate(item.endDate)}</strong>
                    </div>
                  </div>

                  <div className="internship-card-actions">
                    <button
                      className={`btn internship-register-btn ${
                        isRegistrationOpen ? "btn-primary" : "btn-disabled-look"
                      }`}
                      onClick={() => setSelected(item)}
                      disabled={!isRegistrationOpen}
                    >
                      {isRegistrationOpen ? "Register Now" : "Registrations Closed"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <RegisterModal
          open={!!selected}
          onClose={() => setSelected(null)}
          type="INTERNSHIP"
          itemId={selected?.id}
          itemTitle={selected?.title || ""}
        />
      </div>
    </section>
  );
}