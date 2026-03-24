import { useEffect, useState } from "react";
import { getPublicInternships } from "../api/api";
import { fallbackInternships } from "../data/fallbackData";
import SectionTitle from "./SectionTitle";
import RegisterModal from "./RegisterModal";

export default function InternshipSection() {
  const [internships, setInternships] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function loadInternships() {
      try {
        const result = await getPublicInternships();
        setInternships(result?.data?.length ? result.data : fallbackInternships);
      } catch {
        setInternships(fallbackInternships);
      }
    }
    loadInternships();
  }, []);

  return (
    <section id="internships" className="section">
      <div className="container">
        <SectionTitle
          eyebrow="Internships"
          title="Premium internship tracks designed for real learning"
          subtitle="Explore ongoing, upcoming, and completed internship experiences."
        />

        <div className="card-grid">
          {internships.map((item) => (
            <div key={item.id} className="glass-card interactive-card">
              <span className="badge">{item.status}</span>
              <h3>{item.title}</h3>
              <p><strong>Domain:</strong> {item.domain}</p>
              <p><strong>Mentor:</strong> {item.mentorName}</p>
              <p><strong>Duration:</strong> {item.duration}</p>
              <p><strong>Mode:</strong> {item.mode}</p>
              <p>{item.description}</p>
              <button
                className="btn btn-primary"
                onClick={() => setSelected(item)}
                disabled={!item.registrationOpen}
              >
                {item.registrationOpen ? "Register" : "Closed"}
              </button>
            </div>
          ))}
        </div>

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