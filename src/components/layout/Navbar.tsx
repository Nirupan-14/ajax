'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const closeMenu = () => setMenuOpen(false);

    return (
        <>
            <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
                <div className="navbar-inner">
                    {/* Logo */}
                    <Link href="/" className="navbar-logo" style={{ textDecoration: 'none' }}>
                        <span className="navbar-logo-name">Ceramic Pro Ajax</span>
                        <span className="navbar-logo-sub">c/o Flawless Finish</span>
                    </Link>

                    {/* Desktop Nav */}
                    <ul className="navbar-links">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <a href={link.href} onClick={closeMenu}>
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Book Now + Hamburger */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <a href="#contact" className="btn btn-navy navbar-book" style={{ padding: '0.65rem 1.4rem', fontSize: '0.73rem' }}>
                            Book Now
                        </a>
                        <button
                            className={`hamburger${menuOpen ? ' open' : ''}`}
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            <span />
                            <span />
                            <span />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
                {navLinks.map((link) => (
                    <a key={link.href} href={link.href} onClick={closeMenu}>
                        {link.label}
                    </a>
                ))}
                <a href="#contact" className="btn btn-navy" onClick={closeMenu} style={{ marginTop: '1.5rem', alignSelf: 'flex-start' }}>
                    Book Now
                </a>
            </div>
        </>
    );
}
