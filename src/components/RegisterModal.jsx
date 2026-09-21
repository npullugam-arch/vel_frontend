import ProgramDisclosure from "./ProgramDisclosure";
import { canShowPayment, hasFee } from "../data/programDetails";
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
  transactionId: "",
  utrId: "",
};

export default function RegisterModal({
  open,
  onClose,
  type,
  itemId,
  itemTitle,
  item,
}) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!open) return null;
  const paymentAvailable = canShowPayment(item);

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
      setMessage(
        result?.message ||
          "Registration submitted successfully. Our team will review your application and contact you about the next steps."
      );
      setForm(initialForm);
    } catch (error) {
      setMessage(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-box glass-card register-modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <h3 id="registration-title">Register for {itemTitle}</h3>
            <p className="modal-subtitle">
              Review the program information, then fill in your registration details.
            </p>
          </div>

          <button className="close-btn" onClick={onClose} type="button" aria-label="Close registration">
            ✕
          </button>
        </div>

        <ProgramDisclosure item={item} type={type} />
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-form-grid">
            <div className="form-field">
              <label>Full Name</label>
              <input
                name="fullName"
                placeholder="Enter full name"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>Roll Number</label>
              <input
                name="rollNumber"
                placeholder="Enter roll number"
                value={form.rollNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>College Name</label>
              <input
                name="collegeName"
                placeholder="Enter college name"
                value={form.collegeName}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Branch</label>
              <input
                name="branch"
                placeholder="Enter branch"
                value={form.branch}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>College Email</label>
              <input
                type="email"
                name="collegeEmail"
                placeholder="Enter college email"
                value={form.collegeEmail}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Personal Email</label>
              <input
                type="email"
                name="personalEmail"
                placeholder="Enter personal email"
                value={form.personalEmail}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>WhatsApp Number</label>
              <input
                name="whatsappNumber"
                placeholder="Enter WhatsApp number"
                value={form.whatsappNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Year of Study</label>
              <input
                name="yearOfStudy"
                placeholder="Example: 2nd Year"
                value={form.yearOfStudy}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>City</label>
              <input
                name="city"
                placeholder="Enter city"
                value={form.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Area of Interest</label>
              <input
                name="interestMessage"
                placeholder="Example: Web Development, AI, Data Science"
                value={form.interestMessage}
                onChange={handleChange}
              />
            </div>
          </div>

       {paymentAvailable && <div className="payment-section">
  <div className="payment-section-head">
    <h4>Payment Details</h4>
    <p>
      Please scan the QR code or use any one of the payment methods below, then
      enter your payment reference details.
    </p>
  </div>

  <div className="payment-qr-wrapper">
    <div className="payment-qr-card">
      <img
        src="https://i.postimg.cc/q4MZ4sDx/QR-VELTRIXIS.jpg"
        alt="Veltrixis Payment QR Code"
        className="payment-qr-image"
      />
      <p className="payment-qr-text">
        Scan this QR code to pay quickly using PhonePe / UPI apps.
      </p>
    </div>
  </div>

  <div className="payment-grid">
    <div className="payment-card">
      <h5>UPI Payment</h5>
      <p>
        <span>UPI ID:</span> prathibha918@ibl
      </p>
      <p>
        <span>App:</span> PhonePe / Google Pay / Paytm
      </p>
    </div>

    <div className="payment-card">
      <h5>Bank Transfer</h5>
      <p>
        <span>Bank Name:</span> Axis Bank
      </p>
      <p>
        <span>Account Number:</span> 925020036001196
      </p>
      <p>
        <span>IFSC Code:</span> UTIB0004244
      </p>
    </div>
  </div>

  <div className="register-form-grid payment-input-grid">
    <div className="form-field">
      <label htmlFor="transactionId">Transaction ID</label>
      <input
        id="transactionId"
        name="transactionId"
        placeholder="Enter transaction ID"
        value={form.transactionId}
        onChange={handleChange}
      />
    </div>

    <div className="form-field">
      <label htmlFor="utrId">UTR ID</label>
      <input
        id="utrId"
        name="utrId"
        placeholder="Enter UTR ID"
        value={form.utrId}
        onChange={handleChange}
      />
    </div>
  </div>

  <div className="payment-note">
    Our team will verify your payment details and contact you shortly regarding
    the next steps of your registration.
  </div>
</div>}
          <p className="listing-notice">{hasFee(item) && Number(item.fee) === 0 ? "This program is free. No payment is required." : !paymentAvailable ? "Submit your application without payment. Wait for complete program information before paying." : "Pay only the program fee shown above. Payment is verified before access is confirmed."}</p>
          <p>By submitting, you confirm that you have read the <a href="/terms-conditions" target="_blank" rel="noreferrer">Terms & Conditions</a>, <a href="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a> and refund policy above.</p>
          <button
            type="submit"
            className="btn btn-primary full-width submit-registration-btn"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Registration"}
          </button>
        </form>

        {message && <p className="form-message register-form-message">{message}</p>}
      </div>
    </div>
  );
}
