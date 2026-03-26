import { useEffect, useMemo, useState } from "react";
import { getPublicProjects } from "../api/api";
import { fallbackProjects } from "../data/fallbackData";
import SectionTitle from "./SectionTitle";
import RegisterModal from "./RegisterModal";

function normalizeCategory(value) {
  return (value || "").trim().toUpperCase();
}

function prettyCategory(value) {
  if (!value) return "Project";

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getCategoryClass(category) {
  const normalized = normalizeCategory(category);

  if (normalized.includes("ONGOING")) return "project-category-ongoing";
  if (normalized.includes("COMPLETED")) return "project-category-completed";
  if (normalized.includes("RESEARCH")) return "project-category-research";
  if (normalized.includes("LIVE")) return "project-category-live";
  return "project-category-default";
}

export default function ProjectSection() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const result = await getPublicProjects();
        const data = result?.data?.length ? result.data : fallbackProjects;
        setProjects(data);
      } catch (error) {
        setProjects(fallbackProjects);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        projects
          .map((item) => item.category)
          .filter(Boolean)
      )
    );

    return ["ALL", ...unique];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "ALL") return projects;

    return projects.filter(
      (item) => normalizeCategory(item.category) === normalizeCategory(activeCategory)
    );
  }, [projects, activeCategory]);

  return (
    <section id="projects" className="section project-showcase-section">
      <div className="container">
        <SectionTitle
          eyebrow="Projects"
          title="Built through mentorship, teamwork, and real execution"
          subtitle="Explore Veltrixix projects with full clarity on mentor guidance, team structure, project status, collaboration availability, and execution details."
        />

        {categories.length > 1 && (
          <div className="project-filter-row">
            {categories.map((category) => (
              <button
                key={category}
                className={`project-filter-btn ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category === "ALL" ? "All Projects" : prettyCategory(category)}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="project-empty-state">
            <h3>Loading projects...</h3>
            <p>Please wait while we fetch the latest project details.</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="project-empty-state">
            <h3>No projects found</h3>
            <p>There are no project entries available in this category right now.</p>
          </div>
        ) : (
          <div className="project-pro-grid">
            {filteredProjects.map((item) => {
              const collaborationOpen = !!item.collaborationOpen;
              const categoryClass = getCategoryClass(item.category);

              return (
                <article key={item.id} className="project-pro-card">
                  <div className="project-card-glow"></div>

                  <div className="project-card-top">
                    <div className="project-badge-row">
                      <span className={`project-category-badge ${categoryClass}`}>
                        {prettyCategory(item.category)}
                      </span>

                      <span
                        className={`project-collab-badge ${
                          collaborationOpen ? "open" : "closed"
                        }`}
                      >
                        {collaborationOpen
                          ? "Collaboration Open"
                          : "Collaboration Closed"}
                      </span>
                    </div>

                    <h3 className="project-card-title">
                      {item.title || "Untitled Project"}
                    </h3>

                    <p className="project-card-description">
                      {item.description || "Project description will be updated soon."}
                    </p>
                  </div>

                  <div className="project-insight-panel">
                    <div className="project-info-box">
                      <span className="project-info-label">Mentor</span>
                      <strong>{item.mentorName || "Not specified"}</strong>
                    </div>

                    <div className="project-info-box">
                      <span className="project-info-label">Status</span>
                      <strong>{item.statusText || "Not specified"}</strong>
                    </div>
                  </div>

                  <div className="project-team-block">
                    <div className="project-team-header">
                      <span className="project-team-dot"></span>
                      <h4>Team Information</h4>
                    </div>
                    <p>{item.teamInfo || "Team information will be updated soon."}</p>
                  </div>

                  <div className="project-action-zone">
                    <button
                      className={`btn project-action-btn ${
                        collaborationOpen ? "btn-primary" : "btn-disabled-look"
                      }`}
                      onClick={() => setSelected(item)}
                      disabled={!collaborationOpen}
                    >
                      {collaborationOpen ? "Collaborate Now" : "Collaboration Closed"}
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
          type="PROJECT"
          itemId={selected?.id}
          itemTitle={selected?.title || ""}
        />
      </div>
    </section>
  );
}