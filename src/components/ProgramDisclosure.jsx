import { business } from "../data/business";
import { formatProgramFee, missingProgramDetails } from "../data/programDetails";
export default function ProgramDisclosure({ item = {}, type }) {
  const missing = missingProgramDetails(item);
  const details = [
    ["Category", [type, item.domain || item.category || item.eventType].filter(Boolean).join(" / ")],
    ["Service description", item.description || item.aboutText],
    ["Registration / program fee (INR)", formatProgramFee(item)],
    ["Duration", item.duration], ["Program start", item.programStartInfo],
    ["What you receive", item.deliverables], ["Eligibility", item.eligibility],
    ["Delivery method & access timeline", item.deliveryDetails],
  ];
  return <section className="program-disclosure" aria-label="Program and payment information">
    <h4>Before you register</h4>
    <dl>{details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "Not yet published. Contact support before payment."}</dd></div>)}</dl>
    {missing.length > 0 && <p className="listing-notice">Payment is unavailable until the program details are complete. You may still submit an application. Missing: {missing.join(", ")}.</p>}
    <p>Cancellation before the program starts and before any access or resources are supplied is eligible for a full refund. Restrictions apply after delivery starts; service-failure remedies remain available.</p>
    <p><a href="/refund-cancellation-policy" target="_blank" rel="noreferrer">Refund & Cancellation Policy (opens in a new tab)</a> &middot; <a href="/service-delivery-policy" target="_blank" rel="noreferrer">Service delivery policy</a></p>
    <p>Questions? <a href={`mailto:${business.email}`}>{business.email}</a> &middot; <a href="/contact" target="_blank" rel="noreferrer">Contact support</a></p>
  </section>;
}
