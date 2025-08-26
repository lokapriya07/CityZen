import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react"
import './footer.css'

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">

        {/* Brand Section */}
        <div className="footer-brand">
          <h2>
            <Leaf size={24} /> WasteSpot
          </h2>
          <p>
            Building cleaner communities through smart waste management and citizen engagement.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#dashboard">Dashboard</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-contact">
          <h3>Contact Info</h3>
          <div><Phone size={18} /> +1 (555) 123-4567</div>
          <div><Mail size={18} /> hello@wastespot.com</div>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="footer-social-icons">
            <Facebook size={20} />
            <Twitter size={20} />
            <Instagram size={20} />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        © 2025 WasteSpot. All rights reserved. Building a cleaner tomorrow, today.
      </div>
    </footer>
  )
}

export default Footer
