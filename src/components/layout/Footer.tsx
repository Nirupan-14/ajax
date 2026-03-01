import Link from 'next/link';
import { BUSINESS_INFO } from '@/lib/constants';

const navLinks = ['Home', 'About Us', 'Services', 'Pricing', 'Gallery', 'Reviews', 'Contact'];
const serviceLinks = [
    'Paint Correction',
    'Ceramic Coating',
    'Auto Detailing',
    'Window Tinting',
    'Vehicle Wraps',
    'Paint Protection Film',
];

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-grid">
                {/* Brand Col */}
                <div>
                    <div className="footer-logo-name">Ceramic Pro Ajax</div>
                    <div className="footer-logo-sub">c/o Flawless Finish</div>
                    <p className="footer-body">
                        Premium detailing and ceramic coating in Ajax, ON. Expert craftsmanship.
                        Lasting protection. Open 7 days a week.
                    </p>
                    <div className="footer-socials">
                        <a href="#" className="footer-social-link" aria-label="Instagram">📷</a>
                        <a href="#" className="footer-social-link" aria-label="Facebook">📘</a>
                        <a href={BUSINESS_INFO.mapsUrl} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Google Maps">📍</a>
                    </div>
                </div>

                {/* Navigate */}
                <div>
                    <h4 className="footer-col-title">Navigate</h4>
                    <ul className="footer-links">
                        {navLinks.map((l) => (
                            <li key={l}>
                                <a href={l === 'Home' ? '#' : `#${l.toLowerCase().replace(/\s+/g, '')}`}>{l}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Services */}
                <div>
                    <h4 className="footer-col-title">Services</h4>
                    <ul className="footer-links">
                        {serviceLinks.map((s) => (
                            <li key={s}>
                                <a href="#services">{s}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="footer-col-title">Contact</h4>
                    <div className="footer-contact-row">
                        <span>📍</span>
                        <span>{BUSINESS_INFO.address}</span>
                    </div>
                    <div className="footer-contact-row">
                        <span>📞</span>
                        <span>{BUSINESS_INFO.phone}</span>
                    </div>
                    <div className="footer-contact-row">
                        <span>📧</span>
                        <span>{BUSINESS_INFO.email}</span>
                    </div>
                    <div className="footer-contact-row">
                        <span>🕐</span>
                        <span>Mon–Sun: 8:00 AM – 6:00 PM</span>
                    </div>
                    <a href="#contact" className="footer-book-btn">
                        Book Appointment
                    </a>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <span className="footer-copyright">
                    © 2026 Ceramic Pro Ajax c/o Flawless Finish. All rights reserved.
                </span>
                <div className="footer-legal-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}
