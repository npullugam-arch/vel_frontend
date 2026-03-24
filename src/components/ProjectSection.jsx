import { useEffect, useState } from "react";
import { getPublicProjects } from "../api/api";
import { fallbackProjects } from "../data/fallbackData";
import SectionTitle from "./SectionTitle";
import RegisterModal from "./RegisterModal";

export default function ProjectSection() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const result = await getPublicProjects();
        setProjects(result?.data?.length ? result.data : fallbackProjects);
      } catch {
        setProjects(fallbackProjects);
      }
    }
    loadProjects();
  }, []);

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionTitle
          eyebrow="Projects"
          title="Collaboration, previous work, and ongoing innovation"
          subtitle="Showcasing research, teamwork, and project execution under Veltrixix."
        />

        <div className="card-grid">
          {projects.map((item) => (
            <div key={item.id} className="glass-card interactive-card">
              <span className="badge">{item.category}</span>
              <h3>{item.title}</h3>
              <p><strong>Mentor:</strong> {item.mentorName}</p>
              <p><strong>Team:</strong> {item.teamInfo}</p>
              <p><strong>Status:</strong> {item.statusText}</p>
              <p>{item.description}</p>
              <button
                className="btn btn-primary"
                onClick={() => setSelected(item)}
              >
                Collaborate / Register
              </button>
            </div>
          ))}
        </div>

        <RegisterModal
          open={!!selected}
          onClose={() => setSelected(null)}
          type="PROJECT"
          itemId={selected?.id}
          itemTitle={selected?.title || ""}
        />
      </div>
    </section>
  );
}