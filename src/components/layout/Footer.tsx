'use client';

import { useEffect, useRef, useState } from 'react';
import { BUSINESS_INFO } from '@/lib/constants';

const NAV_LINKS = [
    { label: 'Home',     href: '#'          },
    { label: 'About',    href: '#about'     },
    { label: 'Services', href: '#services'  },
    { label: 'Pricing',  href: '#pricing'   },
    { label: 'Gallery',  href: '#gallery'   },
    { label: 'Reviews',  href: '#reviews'   },
    { label: 'FAQ',      href: '#faq'       },
    { label: 'Contact',  href: '#contact'   },
];

const SERVICE_LINKS = [
    'Paint Correction',
    'Ceramic Coating',
    'Auto Detailing',
    'Window Tinting',
    'Vehicle Wraps',
    'Paint Protection Film',
];

const CONTACT_ROWS = [
    { icon: '◎', label: BUSINESS_INFO.address,               href: BUSINESS_INFO.mapsUrl, external: true  },
    { icon: '◇', label: BUSINESS_INFO.phone,                 href: `tel:${BUSINESS_INFO.phone}`, external: false },
    { icon: '△', label: BUSINESS_INFO.email,                 href: `mailto:${BUSINESS_INFO.email}`, external: false },
    { icon: '◈', label: 'Mon – Sun · 8AM – 6PM',            href: null, external: false },
];

export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold: 0.06 },
        );
        if (footerRef.current) obs.observe(footerRef.current);
        return () => obs.disconnect();
    }, []);

    return (
        <>
            <style>{`
                /* ── Tokens ── */
                .ft {
                    --gold:        #C9A96E;
                    --gold-dim:    rgba(201,169,110,.10);
                    --gold-border: rgba(201,169,110,.18);
                    --white:       #FFFFFF;
                    --muted:       rgba(237,232,223,.52);
                }

                /* ── Footer — deepest dark, closes the ladder ── */
                .ft {
                    position: relative;
                    background: #060605;
                    overflow: hidden;
                    font-family: 'Georgia', serif;
                }

                /* gold top divider */
                .ft::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(to right, transparent, rgba(201,169,110,.55) 30%, rgba(201,169,110,.55) 70%, transparent);
                    z-index: 1;
                }

                /* subtle ambient glow */
                .ft-glow {
                    position: absolute; left: 50%; top: 0;
                    transform: translateX(-50%);
                    width: 600px; height: 300px;
                    background: radial-gradient(ellipse, rgba(201,169,110,.04) 0%, transparent 70%);
                    pointer-events: none; z-index: 0;
                }

                /* ── Main grid area ── */
                .ft-main {
                    position: relative; z-index: 1;
                    max-width: 1200px; margin: 0 auto;
                    padding: clamp(56px,8vw,96px) clamp(24px,6vw,80px) clamp(48px,6vw,72px);
                }

                .ft-grid {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
                    gap: clamp(36px,5vw,72px);
                }
                @media(max-width:1000px) { .ft-grid { grid-template-columns: 1fr 1fr; } }
                @media(max-width:560px)  { .ft-grid { grid-template-columns: 1fr; } }

                /* ── Column entrance ── */
                .ft-col {
                    opacity: 0; transform: translateY(20px);
                    transition: opacity .6s ease, transform .6s cubic-bezier(.22,1,.36,1);
                }
                .ft-col.ft-vis { opacity: 1; transform: translateY(0); }
                .ft-col:nth-child(1) { transition-delay: .1s; }
                .ft-col:nth-child(2) { transition-delay: .2s; }
                .ft-col:nth-child(3) { transition-delay: .3s; }
                .ft-col:nth-child(4) { transition-delay: .4s; }

                /* ── Brand column ── */
                .ft-brand-name {
                    font-family: 'Georgia', serif;
                    font-size: 20px; font-weight: 700; letter-spacing: -.02em;
                    color: var(--white); line-height: 1;
                    margin-bottom: 2px;
                }
                .ft-brand-sub {
                    font-family: 'Courier New', monospace;
                    font-size: 9px; font-weight: 700; letter-spacing: .22em;
                    text-transform: uppercase; color: var(--gold);
                    margin-bottom: 18px; display: block;
                }

                /* gold rule under brand */
                .ft-brand-rule {
                    width: 36px; height: 1.5px; margin-bottom: 18px;
                    background: linear-gradient(to right, var(--gold), transparent);
                    border-radius: 2px;
                }

                /* ★ Body text — readable */
                .ft-brand-body {
                    font-size: clamp(.85rem,1.1vw,.92rem); line-height: 1.78;
                    color: rgba(237,232,223,.62);
                    margin-bottom: 24px;
                }

                /* social icons */
                .ft-socials { display: flex; gap: 10px; }
                .ft-social {
                    width: 36px; height: 36px; border-radius: 50%;
                    border: 1px solid var(--gold-border);
                    background: var(--gold-dim);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 13px; color: var(--gold);
                    text-decoration: none;
                    transition: background .22s, border-color .22s, transform .22s, box-shadow .22s;
                }
                .ft-social:hover {
                    background: var(--gold); color: #060605;
                    border-color: var(--gold);
                    transform: translateY(-3px) scale(1.08);
                    box-shadow: 0 6px 18px rgba(201,169,110,.35);
                }

                /* ── Column headings ── */
                .ft-col-title {
                    font-family: 'Courier New', monospace;
                    font-size: 10px; font-weight: 700; letter-spacing: .26em;
                    text-transform: uppercase; color: var(--gold);
                    margin: 0 0 18px;
                    display: flex; align-items: center; gap: 10px;
                }
                .ft-col-title::after {
                    content: ''; flex: 1; height: 1px;
                    background: linear-gradient(to right, var(--gold-border), transparent);
                }

                /* ── Nav + service links ── */
                .ft-links {
                    list-style: none; margin: 0; padding: 0;
                    display: flex; flex-direction: column; gap: 9px;
                }
                /* ★ Link text — visible muted, full white on hover */
                .ft-links a {
                    font-family: 'Georgia', serif;
                    font-size: clamp(.85rem,1.05vw,.9rem); line-height: 1.4;
                    color: rgba(237,232,223,.62);
                    text-decoration: none;
                    display: inline-flex; align-items: center; gap: 7px;
                    transition: color .18s, gap .18s;
                }
                .ft-links a::before {
                    content: '';
                    width: 0; height: 1.5px; background: var(--gold); border-radius: 2px;
                    flex-shrink: 0;
                    transition: width .22s cubic-bezier(.22,1,.36,1);
                }
                .ft-links a:hover { color: var(--white); gap: 10px; }
                .ft-links a:hover::before { width: 14px; }

                /* ── Contact rows ── */
                .ft-contact-list { display: flex; flex-direction: column; gap: 13px; margin-bottom: 24px; }
                .ft-contact-row {
                    display: flex; align-items: flex-start; gap: 11px;
                    text-decoration: none;
                    transition: opacity .18s;
                }
                .ft-contact-row:hover { opacity: 1 !important; }
                a.ft-contact-row:hover .ft-contact-val { color: var(--white); }

                .ft-contact-icon {
                    font-size: 12px; color: var(--gold); flex-shrink: 0;
                    margin-top: 2px; font-style: normal;
                }
                .ft-contact-val {
                    font-family: 'Georgia', serif;
                    font-size: 13px; line-height: 1.5;
                    color: rgba(237,232,223,.68);
                    transition: color .18s;
                }

                /* Book btn */
                .ft-book {
                    position: relative; overflow: hidden;
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 11px 22px; border-radius: 3px;
                    font-family: 'Courier New', monospace;
                    font-size: 10px; font-weight: 800; letter-spacing: .16em;
                    text-transform: uppercase; text-decoration: none;
                    background: var(--gold); color: #060605;
                    box-shadow: 0 4px 18px rgba(201,169,110,.28);
                    transition: transform .22s, box-shadow .22s;
                }
                .ft-book:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(201,169,110,.48);
                }
                .ft-book::before {
                    content: ''; position: absolute; top: 0; left: -72px; width: 52px; height: 100%;
                    background: linear-gradient(105deg, transparent, rgba(255,255,255,.32), transparent);
                    transition: left .42s; pointer-events: none;
                }
                .ft-book:hover::before { left: 120%; }
                .ft-book-arr { transition: transform .2s; }
                .ft-book:hover .ft-book-arr { transform: translateX(4px); }

                /* ── Bottom bar ── */
                .ft-bottom {
                    position: relative; z-index: 1;
                    border-top: 1px solid rgba(201,169,110,.12);
                    max-width: 1200px; margin: 0 auto;
                    padding: 20px clamp(24px,6vw,80px);
                    display: flex; align-items: center;
                    justify-content: space-between; gap: 16px; flex-wrap: wrap;
                }

                /* ★ Copyright — readable */
                .ft-copy {
                    font-family: 'Courier New', monospace;
                    font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
                    color: rgba(237,232,223,.35);
                }
                .ft-copy em { font-style: normal; color: rgba(201,169,110,.6); }

                .ft-legal { display: flex; gap: 20px; }
                .ft-legal a {
                    font-family: 'Courier New', monospace;
                    font-size: 9.5px; letter-spacing: .14em; text-transform: uppercase;
                    color: rgba(237,232,223,.30); text-decoration: none;
                    transition: color .18s;
                }
                .ft-legal a:hover { color: var(--gold); }

                /* bottom gold bottom edge */
                .ft-edge {
                    height: 2px;
                    background: linear-gradient(to right, transparent, rgba(201,169,110,.35) 30%, rgba(201,169,110,.35) 70%, transparent);
                }
            `}</style>

            <footer className="ft" ref={footerRef}>
                <div className="ft-glow" />

                <div className="ft-main">
                    <div className="ft-grid">

                        {/* ── Col 1: Brand ── */}
                        <div className={`ft-col${visible ? ' ft-vis' : ''}`}>
                            <div className="ft-brand-name">Ceramic Pro Ajax</div>
                            <span className="ft-brand-sub">c/o Flawless Finish</span>
                            <div className="ft-brand-rule" />
                            <p className="ft-brand-body">
                                Premium detailing and ceramic coating in Ajax, ON. Expert craftsmanship,
                                lasting protection — open 7 days a week.
                            </p>
                            <div className="ft-socials">
                                <a href="#" className="ft-social" aria-label="Instagram">IG</a>
                                <a href="#" className="ft-social" aria-label="Facebook">FB</a>
                                <a href={BUSINESS_INFO.mapsUrl} target="_blank" rel="noopener noreferrer" className="ft-social" aria-label="Google Maps">G</a>
                            </div>
                        </div>

                        {/* ── Col 2: Navigate ── */}
                        <div className={`ft-col${visible ? ' ft-vis' : ''}`}>
                            <h4 className="ft-col-title">Navigate</h4>
                            <ul className="ft-links">
                                {NAV_LINKS.map(l => (
                                    <li key={l.label}>
                                        <a href={l.href}>{l.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ── Col 3: Services ── */}
                        <div className={`ft-col${visible ? ' ft-vis' : ''}`}>
                            <h4 className="ft-col-title">Services</h4>
                            <ul className="ft-links">
                                {SERVICE_LINKS.map(s => (
                                    <li key={s}>
                                        <a href="#services">{s}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ── Col 4: Contact ── */}
                        <div className={`ft-col${visible ? ' ft-vis' : ''}`}>
                            <h4 className="ft-col-title">Contact</h4>
                            <div className="ft-contact-list">
                                {CONTACT_ROWS.map(row => {
                                    const inner = (
                                        <>
                                            <i className="ft-contact-icon">{row.icon}</i>
                                            <span className="ft-contact-val">{row.label}</span>
                                        </>
                                    );
                                    return row.href ? (
                                        <a
                                            key={row.icon}
                                            href={row.href}
                                            className="ft-contact-row"
                                            target={row.external ? '_blank' : undefined}
                                            rel={row.external ? 'noopener noreferrer' : undefined}
                                        >
                                            {inner}
                                        </a>
                                    ) : (
                                        <div key={row.icon} className="ft-contact-row">{inner}</div>
                                    );
                                })}
                            </div>

                            <a href="#contact" className="ft-book">
                                Book Appointment <span className="ft-book-arr">→</span>
                            </a>
                        </div>

                    </div>
                </div>

                {/* Bottom bar */}
                <div className="ft-bottom">
                    <span className="ft-copy">
                        © 2026 <em>Ceramic Pro Ajax</em> c/o Flawless Finish. All rights reserved.
                    </span>
                    <nav className="ft-legal">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </nav>
                </div>

                {/* closing gold edge */}
                <div className="ft-edge" />
            </footer>
        </>
    );
}