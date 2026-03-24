export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <div className="logo-box small">V</div>
              <div>
                <strong style={{ fontSize: 14, letterSpacing: ".1em" }}>
                  VELTRIXIX
                </strong>
                <br />
                <small style={{ color: "var(--muted)", fontSize: 11 }}>
                  Future · Motion · Intelligence
                </small>
              </div>
            </div>

            <p style={{ fontSize: 13, lineHeight: 1.7 }}>
              Building the next generation of innovators through structured
              learning, mentorship, and collaboration.
            </p>

            <div className="social-links">
              <div className="social-icon">𝕏</div>
              <div className="social-icon">🔗</div>
              <div className="social-icon">📷</div>
              <div className="social-icon">▶️</div>
            </div>
          </div>

          <div>
            <h4>Quick Links</h4>
            <a href="#about">About</a>
            <a href="#mission">Mission</a>
            <a href="#internships">Internships</a>
            <a href="#events">Events</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>

          <div>
            <h4>Leadership</h4>
            <p>Board of Directors</p>
            <p>Research &amp; Innovation</p>
            <p>Core Team</p>
            <p>Mentorship Council</p>
          </div>

          <div>
            <h4>Contact Us</h4>
            <p>📧 hello@veltrixix.com</p>
            <p style={{ marginTop: 8 }}>📞 +91 12345 67890</p>
            <p style={{ marginTop: 8 }}>📍 Hyderabad, India</p>
            <p style={{ marginTop: 8 }}>🕐 Mon–Fri, 9am–6pm IST</p>
            <a
              className="btn primary sm"
              style={{ marginTop: 14, width: "100%", justifyContent: "center" }}
              href="#contact"
            >
              Send Message
            </a>
          </div>
        </div>

        <div className="footer-copy">
          © 2026 Veltrixix. All rights reserved. Built with ❤️ &amp; Intelligence.
        </div>
      </div>
    </footer>
  );
}