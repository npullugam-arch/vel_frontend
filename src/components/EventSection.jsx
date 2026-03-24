import { useEffect, useState } from "react";
import { getPublicEvents } from "../api/api";
import { fallbackEvents } from "../data/fallbackData";
import SectionTitle from "./SectionTitle";
import RegisterModal from "./RegisterModal";

export default function EventSection() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const result = await getPublicEvents();
        setEvents(result?.data?.length ? result.data : fallbackEvents);
      } catch {
        setEvents(fallbackEvents);
      }
    }
    loadEvents();
  }, []);

  return (
    <section id="events" className="section">
      <div className="container">
        <SectionTitle
          eyebrow="Events"
          title="Participant and collaboration based events"
          subtitle="Join events, connect with ideas, and collaborate through Veltrixix."
        />

        <div className="card-grid">
          {events.map((item) => (
            <div key={item.id} className="glass-card interactive-card">
              <span className="badge">{item.eventType}</span>
              <h3>{item.title}</h3>
              <p><strong>Topic:</strong> {item.topic}</p>
              <p><strong>Domain:</strong> {item.domain}</p>
              <p><strong>Capacity:</strong> {item.capacity}</p>
              <p><strong>Location:</strong> {item.location}</p>
              <p><strong>Sponsors:</strong> {item.sponsors}</p>
              <p>{item.description}</p>
              <button
                className="btn btn-primary"
                onClick={() => setSelected(item)}
                disabled={!item.registrationOpen}
              >
                {item.registrationOpen ? "Join / Register" : "Closed"}
              </button>
            </div>
          ))}
        </div>

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