import { useEffect, useRef } from "react";

export default function Hero() {
  const sphereRef = useRef(null);

  useEffect(() => {
    const sphere = sphereRef.current;
    if (!sphere) return;

    const onMove = (e) => {
      const rect = sphere.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateY = ((x / rect.width) - 0.5) * 18;
      const rotateX = ((y / rect.height) - 0.5) * -18;

      sphere.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const reset = () => {
      sphere.style.transform = "rotateX(0deg) rotateY(0deg)";
    };

    sphere.addEventListener("mousemove", onMove);
    sphere.addEventListener("mouseleave", reset);

    return () => {
      sphere.removeEventListener("mousemove", onMove);
      sphere.removeEventListener("mouseleave", reset);
    };
  }, []);

  return (
    <section id="home" className="hero">
      <div className="container hero-grid">
        <div className="fade-up">
          <div className="hero-tag">🚀 Next-Gen AI Innovation Hub</div>

          <h1 className="hero-title">
            Building the next
            <br />
            <span className="grad-text">animated innovation</span>
            <br />
            hub for the future
          </h1>

          <p className="hero-sub">
            Veltrixix is a premium, futuristic learning-and-collaboration ecosystem
            for internships, events, and real-world projects — powered by AI and
            driven by purpose.
          </p>

          <div className="hero-btns">
            <a href="#internships" className="btn primary">
              Explore Programs
            </a>
            <a href="#about" className="btn outline">
              About Us
            </a>
          </div>

          <div className="hero-stats">
            <div className="hstat">
              <strong>200+</strong>
              <span>Students Trained</span>
            </div>
            <div className="hstat">
              <strong>30+</strong>
              <span>Live Projects</span>
            </div>
            <div className="hstat">
              <strong>15+</strong>
              <span>Expert Mentors</span>
            </div>
          </div>
        </div>

        <div className="sphere-wrap fade-up delay-2">
          <div className="hero-sphere-outer" ref={sphereRef}>
            <div className="hero-sphere-ring ring-a" />
            <div className="hero-sphere-ring ring-b" />
            <div className="hero-sphere-ring ring-c" />
            <div className="hero-sphere-particles" />
            <div className="hero-sphere-core">
              <span>V</span>
            </div>
          </div>

          <div className="inner-badge inner-badge-ai">
            <span>⚡</span> AI Smart Programs
          </div>
          <div className="inner-badge inner-badge-3d">
            <span>🌀</span> Interactive Experience
          </div>
        </div>
      </div>
    </section>
  );
}