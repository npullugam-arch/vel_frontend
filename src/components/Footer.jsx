export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* ===== LOGO SECTION (UPDATED) ===== */}
          <div>
            <div className="footer-brand">
              <img
                src="https://i.postimg.cc/hjbKr4p9/veltrix-logo-transparent.png"
                alt="Veltrixis Logo"
                className="footer-logo"
              />
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

          {/* ===== QUICK LINKS ===== */}
          <div>
            <h4>Quick Links</h4>
            <a href="#about">About</a>
            <a href="#mission">Mission</a>
            <a href="#internships">Internships</a>
            <a href="#events">Events</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>

          {/* ===== LEADERSHIP ===== */}
          <div>
            <h4>Leadership</h4>
            <p>Board of Directors</p>
            <p>Research &amp; Innovation</p>
            <p>Core Team</p>
            <p>Mentorship Council</p>
          </div>

          {/* ===== CONTACT ===== */}
          <div>
            <h4>Contact Us</h4>
            <p>📧 hello@veltrixis.com</p>
            {/* <p style={{ marginTop: 8 }}>📞 +91 96528 87222</p> */}
            <p style={{ marginTop: 8 }}>
              📍 Mig 146 -1/3 road no. 44 mayuri nagar, miyapur, hyderabad,
              500049
            </p>
            <p style={{ marginTop: 8 }}>🕐 Mon–Fri, 9am–6pm IST</p>

            <a
              className="btn primary sm"
              style={{
                marginTop: 14,
                width: "100%",
                justifyContent: "center",
              }}
              href="#contact"
            >
              Send Message
            </a>
          </div>
        </div>

        <div className="footer-copy">
          © 2026 Veltrixix. All rights reserved. Built with ❤️ &amp;
          Intelligence.
        </div>
      </div>
    </footer>
  );
}