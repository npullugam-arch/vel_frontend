import { Link } from "react-router-dom";
import { business } from "../data/business";
import BusinessContact from "./BusinessContact";
export default function Footer() {
  return <footer className="footer"><div className="container">
    <div className="footer-grid">
      <div><Link to="/" className="footer-brand"><img src="https://i.postimg.cc/hjbKr4p9/veltrix-logo-transparent.png" alt="Veltrixis home" className="footer-logo" /></Link><p>{business.category}</p><p>Internships, guided learning and student collaboration. Digital services; no physical shipping.</p></div>
      <nav aria-label="Explore"><h4>Explore</h4><Link to="/about-us">About Us</Link><Link to="/programs">Programs / Internships</Link><Link to="/projects">Projects</Link><Link to="/contact">Contact Us</Link></nav>
      <nav aria-label="Policies"><h4>Policies</h4><Link to="/privacy-policy">Privacy Policy</Link><Link to="/terms-conditions">Terms & Conditions</Link><Link to="/refund-cancellation-policy">Refund & Cancellation Policy</Link><Link to="/service-delivery-policy">Service Delivery & Shipping Policy</Link></nav>
      <div><h4>Contact Us</h4><BusinessContact /></div>
    </div><div className="footer-copy">&copy; {new Date().getFullYear()} Veltrixis. All rights reserved.</div>
  </div></footer>;
}
