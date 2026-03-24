export default function AboutSection() {
  return (
    <>
      <section id="about" className="section">
        <div className="container">
          <div className="sec-head reveal">
            <span className="sec-label">About Veltrixix</span>
            <h2>Who we are &amp; what we do</h2>
            <p>
              A curated ecosystem connecting learners, mentors, and organizations
              through structured programs, guided internships, and high-impact
              collaboration.
            </p>
          </div>

          <div className="about-grid reveal">
            <div className="about-card glow-track">
              <span
                className="pill"
                style={{ borderColor: "rgba(0,229,255,.3)", marginBottom: 16 }}
              >
                📖 Our Story
              </span>
              <h3>About Veltrixix</h3>
              <p>
                Veltrixix was founded with a singular vision — to bridge the gap
                between academic learning and industry-ready skills. We design
                immersive, mentor-led programs that transform theoretical knowledge
                into real-world capability. Every program is crafted with intention,
                every project built with purpose.
              </p>
              <div className="quote-block">
                "We don&apos;t just teach — we build builders."
                <em>— Veltrixix Founding Team</em>
              </div>
            </div>

            <div className="about-card glow-track">
              <span
                className="pill"
                style={{ borderColor: "rgba(108,79,255,.3)", marginBottom: 16 }}
              >
                ✨ Why Veltrixix
              </span>
              <h3>Why we&apos;re different</h3>
              <p>
                Transparent timelines, quality-focused mentorship, real project
                outcomes, visible progress, and a premium futuristic interface.
                We believe the environment you learn in shapes the professional
                you become.
              </p>
              <div className="quote-block">
                "Innovation is not a moment — it is a system."
                <em>— Veltrixix</em>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="mission" className="section">
        <div className="container">
          <div className="sec-head reveal">
            <span className="sec-label">Mission · Vision</span>
            <h2>What drives us forward</h2>
            <p>
              Our mission and vision guide every decision, every program design,
              and every collaboration we pursue.
            </p>
          </div>

          <div className="mv-grid reveal">
            <div className="mv-card mission glow-track">
              <span
                className="pill"
                style={{
                  background: "rgba(0,229,157,.1)",
                  borderColor: "rgba(0,229,157,.3)",
                  color: "var(--good)",
                }}
              >
                🎯 Mission
              </span>
              <h3>Enable Practical Growth</h3>
              <p>
                Provide structured, outcome-driven opportunities through
                internships, events, and collaborative projects — with expert
                mentor guidance and measurable deliverables that make every
                participant industry-ready.
              </p>
              <div
                className="quote-block"
                style={{
                  background: "rgba(0,229,157,.07)",
                  borderLeftColor: "var(--good)",
                }}
              >
                "Learn fast. Build real. Ship with confidence."
              </div>
            </div>

            <div className="mv-card vision glow-track">
              <span
                className="pill"
                style={{
                  background: "rgba(255,209,102,.1)",
                  borderColor: "rgba(255,209,102,.3)",
                  color: "var(--warn)",
                }}
              >
                🔭 Vision
              </span>
              <h3>Build an Ecosystem of Creators</h3>
              <p>
                Create a globally connected community where learning is measurable,
                collaboration is seamless, and outcomes are visible. Veltrixix
                envisions a future where every learner becomes a builder who
                contributes to the world.
              </p>
              <div
                className="quote-block"
                style={{
                  background: "rgba(255,209,102,.07)",
                  borderLeftColor: "var(--warn)",
                }}
              >
                "The future belongs to those who build together."
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}