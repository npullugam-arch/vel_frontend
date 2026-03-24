import { useState } from "react";
import { submitRegistration } from "../api/api";

const initialForm = {
  fullName: "",
  collegeName: "",
  rollNumber: "",
  collegeEmail: "",
  personalEmail: "",
  whatsappNumber: "",
  branch: "",
  yearOfStudy: "",
  city: "",
  interestMessage: "",
};

export default function RegisterModal({
  open,
  onClose,
  type,
  itemId,
  itemTitle,
}) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!open) return null;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const buildPayload = () => {
    const payload = {
      ...form,
      registrationType: type,
    };

    if (type === "INTERNSHIP") payload.internshipId = itemId;
    if (type === "EVENT") payload.eventId = itemId;
    if (type === "PROJECT") payload.projectId = itemId;

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await submitRegistration(buildPayload());
      setMessage(result?.message || "Registration submitted successfully");
      setForm(initialForm);
    } catch (error) {
      setMessage(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Register for {itemTitle}</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
          <input name="collegeName" placeholder="College Name" value={form.collegeName} onChange={handleChange} />
          <input name="rollNumber" placeholder="Roll Number" value={form.rollNumber} onChange={handleChange} />
          <input name="collegeEmail" placeholder="College Email" value={form.collegeEmail} onChange={handleChange} />
          <input name="personalEmail" placeholder="Personal Email" value={form.personalEmail} onChange={handleChange} />
          <input name="whatsappNumber" placeholder="WhatsApp Number" value={form.whatsappNumber} onChange={handleChange} />
          <input name="branch" placeholder="Branch" value={form.branch} onChange={handleChange} />
          <input name="yearOfStudy" placeholder="Year of Study" value={form.yearOfStudy} onChange={handleChange} />
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
          <textarea
            name="interestMessage"
            placeholder="Interest / Details"
            value={form.interestMessage}
            onChange={handleChange}
            rows="4"
          />
          <button type="submit" className="btn btn-primary full-width" disabled={loading}>
            {loading ? "Submitting..." : "Submit Registration"}
          </button>
        </form>

        {message && <p className="form-message">{message}</p>}
      </div>
    </div>
  );
}