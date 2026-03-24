import { useEffect, useRef, useState } from "react";

import Navbar from "../components/Navbar";
import AboutSection from "../components/AboutSection";
import InternshipSection from "../components/InternshipSection";
import EventSection from "../components/EventSection";
import ProjectSection from "../components/ProjectSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

import {
  getPublicInternships,
  getPublicEvents,
  getPublicProjects,
} from "../api/publicApi";

export default function HomePage() {
  const [internships, setInternships] = useState([]);
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const bgCanvasRef = useRef(null);
  const sphereCanvasRef = useRef(null);
  const sphereWrapRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [internshipsData, eventsData, projectsData] = await Promise.all([
          getPublicInternships(),
          getPublicEvents(),
          getPublicProjects(),
        ]);

        setInternships(internshipsData?.data || internshipsData || []);
        setEvents(eventsData?.data || eventsData || []);
        setProjects(projectsData?.data || projectsData || []);
      } catch (err) {
        console.error("Homepage load error:", err);
        setError("Failed to load public content.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Background animated particles
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId = 0;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      radius: 150,
      active: false,
    };

    let particles = [];

    const createParticleCount = () =>
      Math.min(140, Math.max(80, Math.floor(window.innerWidth / 11)));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const particleCount = createParticleCount();

      particles = Array.from({ length: particleCount }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;

        return {
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          size: Math.random() * 1.8 + 1,
          alpha: Math.random() * 0.35 + 0.25,
          hue:
            Math.random() > 0.5
              ? 190 + Math.random() * 18
              : 245 + Math.random() * 18,
        };
      });
    };

    const drawBackgroundGlow = () => {
      const glow1 = ctx.createRadialGradient(
        width * 0.22,
        height * 0.18,
        0,
        width * 0.22,
        height * 0.18,
        width * 0.38
      );
      glow1.addColorStop(0, "rgba(108,79,255,0.11)");
      glow1.addColorStop(1, "rgba(108,79,255,0)");

      const glow2 = ctx.createRadialGradient(
        width * 0.78,
        height * 0.28,
        0,
        width * 0.78,
        height * 0.28,
        width * 0.34
      );
      glow2.addColorStop(0, "rgba(0,229,255,0.08)");
      glow2.addColorStop(1, "rgba(0,229,255,0)");

      const glow3 = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        180
      );
      glow3.addColorStop(0, "rgba(0,229,255,0.08)");
      glow3.addColorStop(1, "rgba(0,229,255,0)");

      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, width, height);

      if (mouse.active) {
        ctx.fillStyle = glow3;
        ctx.fillRect(0, 0, width, height);
      }

      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.82
      );
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.5)");

      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    };

    const updateParticles = () => {
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        p.baseX += p.vx;
        p.baseY += p.vy;

        if (p.baseX < -30) p.baseX = width + 30;
        if (p.baseX > width + 30) p.baseX = -30;
        if (p.baseY < -30) p.baseY = height + 30;
        if (p.baseY > height + 30) p.baseY = -30;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius && distance > 0.01) {
            const force = (mouse.radius - distance) / mouse.radius;
            const push = force * 5.2;

            p.x += (dx / distance) * push;
            p.y += (dy / distance) * push;
          }
        }

        p.x += (p.baseX - p.x) * 0.06;
        p.y += (p.baseY - p.y) * 0.06;
      }
    };

    const drawParticles = () => {
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 100%, 72%, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 135) {
            const alpha = (1 - distance / 135) * 0.18;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      drawBackgroundGlow();
      updateParticles();
      drawConnections();
      drawParticles();

      animationId = window.requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = width / 2;
      mouse.y = height / 2;
    };

    resize();
    animate();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Hero sphere particles around V
  useEffect(() => {
    const canvas = sphereCanvasRef.current;
    const wrap = sphereWrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    let animationId = 0;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = {
      x: 0,
      y: 0,
      active: false,
      radius: 90,
    };

    let particles = [];
    const particleCount = 950;

    const resize = () => {
      width = wrap.clientWidth;
      height = wrap.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cx = width / 2;
      const cy = height / 2;
      const outerRadius = Math.min(width, height) * 0.29;

      particles = Array.from({ length: particleCount }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const ringSpread = outerRadius + (Math.random() - 0.5) * 34;
        const depth = (Math.random() - 0.5) * 2;
        const x = cx + Math.cos(angle) * ringSpread;
        const y = cy + Math.sin(angle) * ringSpread * 0.88;

        return {
          x,
          y,
          baseX: x,
          baseY: y,
          angle,
          orbitRadius: ringSpread,
          speed: 0.001 + Math.random() * 0.003,
          size: 0.7 + Math.random() * 1.8,
          alpha: 0.25 + Math.random() * 0.75,
          hue: Math.random() > 0.5 ? 190 + Math.random() * 20 : 240 + Math.random() * 25,
          depth,
          pulseOffset: i * 0.03,
        };
      });
    };

    const drawCoreGlow = (time) => {
      const cx = width / 2;
      const cy = height / 2;

      const glow = ctx.createRadialGradient(
        cx,
        cy,
        10,
        cx,
        cy,
        Math.min(width, height) * 0.36
      );
      glow.addColorStop(0, "rgba(70,190,255,0.42)");
      glow.addColorStop(0.35, "rgba(0,229,255,0.20)");
      glow.addColorStop(0.7, "rgba(108,79,255,0.16)");
      glow.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(width, height) * 0.37, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = "rgba(108,79,255,0.22)";
      ctx.lineWidth = 1.2;

      for (let i = 0; i < 3; i += 1) {
        ctx.rotate(0.8 + i * 0.35 + time * 0.08);
        ctx.beginPath();
        ctx.ellipse(
          0,
          0,
          Math.min(width, height) * (0.18 + i * 0.02),
          Math.min(width, height) * (0.33 - i * 0.03),
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawParticleLinks = () => {
      for (let i = 0; i < particles.length; i += 8) {
        for (let j = i + 8; j < particles.length; j += 16) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 26) {
            const alpha = (1 - distance / 26) * 0.16;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,229,255,${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = (timeMs = 0) => {
      const time = timeMs * 0.001;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      drawCoreGlow(time);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        p.angle += p.speed;

        const breathing = Math.sin(time * 1.7 + p.pulseOffset) * 8;
        const targetX = cx + Math.cos(p.angle) * (p.orbitRadius + breathing);
        const targetY =
          cy + Math.sin(p.angle) * (p.orbitRadius + breathing) * 0.88;

        p.baseX = targetX;
        p.baseY = targetY;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius && distance > 0.01) {
            const force = (mouse.radius - distance) / mouse.radius;
            const push = force * 8.5;
            p.x += (dx / distance) * push;
            p.y += (dy / distance) * push;
          }
        }

        p.x += (p.baseX - p.x) * 0.09;
        p.y += (p.baseY - p.y) * 0.09;

        const flicker = 0.65 + Math.sin(time * 2.5 + p.pulseOffset) * 0.25;

        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 100%, 72%, ${p.alpha * flicker})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(0,229,255,0.55)";
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      drawParticleLinks();

      animationId = window.requestAnimationFrame(animate);
    };

    const updateMousePosition = (clientX, clientY) => {
      const rect = wrap.getBoundingClientRect();
      mouse.x = clientX - rect.left;
      mouse.y = clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseMove = (e) => {
      updateMousePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (!e.touches[0]) return;
      updateMousePosition(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleLeave = () => {
      mouse.active = false;
    };

    resize();
    animate();

    window.addEventListener("resize", resize);
    wrap.addEventListener("mousemove", handleMouseMove, { passive: true });
    wrap.addEventListener("mouseleave", handleLeave);
    wrap.addEventListener("touchstart", handleTouchMove, { passive: true });
    wrap.addEventListener("touchmove", handleTouchMove, { passive: true });
    wrap.addEventListener("touchend", handleLeave);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      wrap.removeEventListener("mousemove", handleMouseMove);
      wrap.removeEventListener("mouseleave", handleLeave);
      wrap.removeEventListener("touchstart", handleTouchMove);
      wrap.removeEventListener("touchmove", handleTouchMove);
      wrap.removeEventListener("touchend", handleLeave);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loading, error, internships, events, projects]);

  return (
    <div className="site-shell home-page">
      <canvas id="bg-canvas" ref={bgCanvasRef} />
      <div className="aurora" />
      <div className="noise-overlay" />

      <Navbar />

      <main>
        <section className="hero hero-section">
          <div className="container hero-grid">
            <div className="hero-content reveal visible">
              <div className="hero-tag">🚀 Next-Gen AI Innovation Hub</div>

              <h1 className="hero-title">
                Building the next
                <br />
                <span className="grad-text">animated innovation</span>
                <br />
                hub for the future
              </h1>

              <p className="hero-sub">
                VERTRIXIS is a premium, futuristic learning-and-collaboration
                ecosystem for internships, events, and real-world projects —
                powered by AI and driven by purpose.
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

            <div className="sphere-wrap reveal visible" ref={sphereWrapRef}>
              <canvas ref={sphereCanvasRef} className="sphere-canvas" />

              <div className="sphere-core-logo">V</div>

              <div className="inner-badge inner-badge-ai">
                <span>⚡</span> AI Smart Programs
              </div>

              <div className="inner-badge inner-badge-3d">
                <span>🌀</span> Interactive Experience
              </div>
            </div>
          </div>
        </section>

        <AboutSection />

        {loading && (
          <section className="section">
            <div className="container">
              <div className="panel pad reveal visible">
                <div className="empty-state">
                  <h3>Loading content...</h3>
                  <p>
                    Please wait while we load internships, events, and projects.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {error && !loading && (
          <section className="section">
            <div className="container">
              <div className="panel pad reveal visible">
                <div className="empty-state error">
                  <h3>{error}</h3>
                  <p>
                    Backend connection is safe. Only the public content could
                    not be loaded right now.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {!loading && !error && (
          <>
            <InternshipSection data={internships} />
            <EventSection data={events} />
            <ProjectSection data={projects} />
          </>
        )}

        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}