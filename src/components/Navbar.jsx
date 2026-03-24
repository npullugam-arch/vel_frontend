import { useEffect, useState } from "react";

const links = [
  { label: "About", href: "#about" },
  { label: "Mission", href: "#mission" },
  { label: "Internships", href: "#internships" },
  { label: "Events", href: "#events" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("#home");

  useEffect(() => {
    const updateHash = () => {
      setActiveHash(window.location.hash || "#home");
    };

    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  const handleNavClick = () => {
    setOpen(false);
  };

  return (
    <header className="topbar">
      <div className="container nav">
        <a href="#home" className="brand" onClick={handleNavClick}>
          <div className="logo-box">V</div>
          <div className="brand-info">
            <strong>VELTRIXIX</strong>
            <small>Future · Motion · Intelligence</small>
          </div>
        </a>

        <nav className={`navlinks ${open ? "open" : ""}`}>
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={activeHash === link.href ? "active" : ""}
              onClick={handleNavClick}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-cta">
          <a href="#internships" className="btn">
            Internships
          </a>
          <a href="#projects" className="btn primary">
            Get Started
          </a>

          <button
            type="button"
            className="menu-btn"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}