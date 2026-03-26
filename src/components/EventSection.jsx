import { useEffect, useMemo, useState } from "react";
import { getPublicEvents } from "../api/api";
import { fallbackEvents } from "../data/fallbackData";
import SectionTitle from "./SectionTitle";
import RegisterModal from "./RegisterModal";

function formatDate(dateValue) {
  if (!dateValue) return "Date not announced";

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

function getStatusClass(status) {
  const normalized = (status || "").toUpperCase();

  if (normalized === "ONGOING") return "event-status-ongoing";
  if (normalized === "UPCOMING") return "event-status-upcoming";
  if (normalized === "COMPLETED") return "event-status-completed";
  return "";
}

function getTypeClass(type) {
  const normalized = (type || "").toUpperCase();

  if (normalized === "PARTICIPANT") return "event-type-participant";
  if (normalized === "COLLABORATE") return "event-type-collaborate";
  return "";
}

export default function EventSection() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ONGOING");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const result = await getPublicEvents();
        const data = result?.data?.length ? result.data : fallbackEvents;
        setEvents(data);
      } catch (error) {
        setEvents(fallbackEvents);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(
      (item) => (item.status || "").toUpperCase() === activeFilter
    );
  }, [events, activeFilter]);

  return (
    <section id="events" className="section event-showcase-section">
      <div className="container">
        <SectionTitle
          eyebrow="Events"
          title="Experiences built for participation, collaboration, and impact"
          subtitle="Discover events with complete details including topic, type, date, venue, sponsors, registration status, and participation capacity."
        />

        <div className="event-filter-row">
          <button
            className={`event-filter-btn ${activeFilter === "ONGOING" ? "active" : ""}`}
            onClick={() => setActiveFilter("ONGOING")}
          >
            Ongoing
          </button>

          <button
            className={`event-filter-btn ${activeFilter === "UPCOMING" ? "active" : ""}`}
            onClick={() => setActiveFilter("UPCOMING")}
          >
            Upcoming
          </button>

          <button
            className={`event-filter-btn ${activeFilter === "COMPLETED" ? "active" : ""}`}
            onClick={() => setActiveFilter("COMPLETED")}
          >
            Completed
          </button>
        </div>

        {loading ? (
          <div className="event-empty-state">
            <h3>Loading events...</h3>
            <p>Please wait while we fetch the latest event details.</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="event-empty-state">
            <h3>No events found</h3>
            <p>There are no events available in this category right now.</p>
          </div>
        ) : (
          <div className="event-pro-grid">
            {filteredEvents.map((item) => {
              const isRegistrationOpen = !!item.registrationOpen;
              const statusClass = getStatusClass(item.status);
              const typeClass = getTypeClass(item.eventType);

              return (
                <article key={item.id} className="event-pro-card">
                  <div className="event-date-strip">
                    <span className="event-date-label">Event Date</span>
                    <strong>{formatDate(item.eventDate)}</strong>
                  </div>

                  <div className="event-card-header">
                    <div className="event-badge-row">
                      <span className={`event-status-badge ${statusClass}`}>
                        {item.status || "N/A"}
                      </span>

                      <span className={`event-type-badge ${typeClass}`}>
                        {item.eventType || "N/A"}
                      </span>
                    </div>

                    <h3 className="event-card-title">
                      {item.title || "Untitled Event"}
                    </h3>

                    <p className="event-card-topic">
                      {item.topic || "Topic will be announced soon"}
                    </p>

                    <p className="event-card-domain">
                      {item.domain || "General Domain"}
                    </p>
                  </div>

                  <div className="event-info-panel">
                    <div className="event-info-item">
                      <span className="event-info-label">Location</span>
                      <strong>{item.location || "To be announced"}</strong>
                    </div>

                    <div className="event-info-item">
                      <span className="event-info-label">Capacity</span>
                      <strong>{item.capacity ?? "Not specified"}</strong>
                    </div>

                    <div className="event-info-item full">
                      <span className="event-info-label">Sponsors</span>
                      <strong>{item.sponsors || "No sponsors mentioned"}</strong>
                    </div>
                  </div>

                  <div className="event-description-block">
                    <h4>About this event</h4>
                    <p>{item.description || "Description will be updated soon."}</p>
                  </div>

                  <div className="event-footer">
                    <div
                      className={`event-registration-state ${
                        isRegistrationOpen ? "open" : "closed"
                      }`}
                    >
                      <span className="event-registration-dot"></span>
                      {isRegistrationOpen ? "Registrations Open" : "Registrations Closed"}
                    </div>

                    <button
                      className={`btn event-register-btn ${
                        isRegistrationOpen ? "btn-primary" : "btn-disabled-look"
                      }`}
                      onClick={() => setSelected(item)}
                      disabled={!isRegistrationOpen}
                    >
                      {isRegistrationOpen ? "Join Event" : "Closed"}
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
          type="EVENT"
          itemId={selected?.id}
          itemTitle={selected?.title || ""}
        />
      </div>
    </section>
  );
}