import { useState } from "react";
import { submitContact } from "../api/api";
import SectionTitle from "./SectionTitle";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactSection() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await submitContact(form);
      setMessage(result?.message || "Inquiry submitted successfully");
      setForm(initialForm);
    } catch (error) {
      setMessage(error.message || "Failed to submit inquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionTitle
          eyebrow="Contact"
          title="Let’s build something powerful together"
          subtitle="Reach out for internships, projects, events, and strategic collaboration."
        />

        <div className="contact-grid">
          <div className="glass-card">
            <h3>Veltrixix</h3>
            <p>Email: contact@veltrixix.com</p>
            <p>Phone: +91 90000 00000</p>
            <p>Location: Hyderabad, India</p>
          </div>

          <form className="glass-card form-grid" onSubmit={handleSubmit}>
            <input name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
            <input name="email" placeholder="Your Email" value={form.email} onChange={handleChange} required />
            <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
            <input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} />
            <textarea
              name="message"
              placeholder="Message"
              rows="5"
              value={form.message}
              onChange={handleChange}
            />
            <button className="btn btn-primary full-width" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
            {message && <p className="form-message">{message}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}