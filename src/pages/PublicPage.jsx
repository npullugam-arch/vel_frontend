import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageMeta from "../components/PageMeta";
import BusinessContact from "../components/BusinessContact";
import ContactSection from "../components/ContactSection";
import InternshipSection from "../components/InternshipSection";
import ProjectSection from "../components/ProjectSection";
import { policies } from "../data/policies";
export default function PublicPage({ page }) {
  const policy = policies[page];
  const title = policy?.title || ({ contact: "Contact Us", programs: "Programs & Internships", projects: "Projects" })[page];
  const description = policy?.description || `Explore Veltrixis ${title.toLowerCase()} and information about our student services.`;
  return <>
    <PageMeta title={title} description={description} /><Navbar />
    <main className="public-page">
      <div className="container policy-content">
        <p className="section-eyebrow">Veltrixis &middot; Student opportunities</p>
        <h1>{title}</h1><p className="section-subtitle">{description}</p>
        {policy && <article className="glass-card policy-article">
          {policy.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}
          <section><h2>Contact & support</h2><BusinessContact /></section>
        </article>}
      </div>
      {page === "contact" && <ContactSection />}
      {page === "programs" && <InternshipSection />}
      {page === "projects" && <ProjectSection />}
    </main><Footer />
  </>;
}
