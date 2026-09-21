import { business } from "../data/business";
export default function BusinessContact() {
  return <div className="business-contact">
    <p><strong>{business.name}</strong></p>
    <p>Support: <a href={`mailto:${business.email}`}>{business.email}</a></p>
    <p>Phone: {business.phone.startsWith("[") ? <span className="contact-placeholder">{business.phone}</span> : <a href={`tel:${business.phone.replace(/[^+0-9]/g, "")}`}>{business.phone}</a>}</p>
    <p>Business location: {business.address}</p>
    <p>Support hours: {business.hours}</p>
  </div>;
}
