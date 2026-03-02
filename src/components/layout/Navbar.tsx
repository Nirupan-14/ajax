'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Pricing',  href: '#pricing'  },
    { label: 'Gallery',  href: '#gallery'  },
    { label: 'Reviews',  href: '#reviews'  },
    { label: 'About',    href: '#about'    },
    { label: 'Contact',  href: '#contact'  },
];

export default function Navbar() {
    const [scrolled,   setScrolled]   = useState(false);
    const [menuOpen,   setMenuOpen]   = useState(false);
    const [progress,   setProgress]   = useState(0);
    const [activeHash, setActiveHash] = useState('');
    const [mounted,    setMounted]    = useState(false);

    /* ── Scroll progress + glass trigger ── */
    useEffect(() => {
        const fn = () => {
            const sy  = window.scrollY;
            const max = document.body.scrollHeight - window.innerHeight;
            setScrolled(sy > 50);
            setProgress(max > 0 ? (sy / max) * 100 : 0);
        };
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    /* ── Active section ── */
    useEffect(() => {
        const obs = new IntersectionObserver(
            entries => entries.forEach(e => { if (e.isIntersecting) setActiveHash('#' + e.target.id); }),
            { threshold: 0.4 },
        );
        navLinks.forEach(l => { const el = document.getElementById(l.href.slice(1)); if (el) obs.observe(el); });
        return () => obs.disconnect();
    }, []);

    /* ── Mount drop-in ── */
    useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

    /* ── Body lock ── */
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const close = useCallback(() => setMenuOpen(false), []);

    return (
        <>
            <style>{`
                /* ── Tokens ── */
                .nb-wrap { --gold:#C9A96E; --gold-dim:rgba(201,169,110,.18); --white:#FFFFFF; --off:#E8E2D9; --muted:rgba(232,226,217,.55); --bg:rgba(10,10,10,.96); --nav-h:68px; }

                /* ── Shell ── */
                .nb-wrap {
                    position: fixed; inset: 0 0 auto; z-index: 900;
                    transform: translateY(-100%);
                    transition: transform .65s cubic-bezier(.22,1,.36,1);
                }
                .nb-wrap.nb-mounted { transform: translateY(0); }

                /* Glass bg */
                .nb-bg {
                    position: absolute; inset: 0; pointer-events: none;
                    background: rgba(10,10,10,.0);
                    backdrop-filter: blur(0px) saturate(100%);
                    border-bottom: 1px solid transparent;
                    transition: background .35s, backdrop-filter .35s, border-color .35s;
                }
                .nb-wrap.nb-scrolled .nb-bg {
                    background: var(--bg);
                    backdrop-filter: blur(28px) saturate(160%);
                    border-color: rgba(201,169,110,.2);
                }

                /* Progress */
                .nb-prog {
                    position: absolute; bottom: 0; left: 0; height: 2px;
                    background: linear-gradient(90deg, var(--gold) 0%, rgba(201,169,110,.5) 100%);
                    box-shadow: 0 0 12px rgba(201,169,110,.5);
                    transition: width .12s linear;
                    border-radius: 0 2px 2px 0;
                    pointer-events: none; z-index: 1;
                }

                /* ── Row ── */
                .nb-row {
                    position: relative; z-index: 1;
                    height: var(--nav-h);
                    max-width: 1360px; margin: 0 auto;
                    padding: 0 clamp(20px,5vw,64px);
                    display: flex; align-items: center; gap: 32px;
                }

                /* ── Logo ── */
                .nb-logo {
                    text-decoration: none; flex-shrink: 0;
                    display: flex; align-items: center; gap: 12px;
                    margin-right: auto;
                }
                .nb-logo-mark {
                    width: 36px; height: 36px; border-radius: 50%;
                    border: 1.5px solid var(--gold);
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Georgia', serif;
                    font-size: 13px; font-weight: 700; color: var(--gold);
                    letter-spacing: .04em;
                    transition: background .22s, box-shadow .22s;
                    flex-shrink: 0;
                }
                .nb-logo:hover .nb-logo-mark {
                    background: rgba(201,169,110,.12);
                    box-shadow: 0 0 18px rgba(201,169,110,.35);
                }
                .nb-logo-text { display: flex; flex-direction: column; gap: 1px; }
                .nb-logo-name {
                    font-family: 'Georgia', serif;
                    font-size: 15px; font-weight: 700;
                    color: var(--white); letter-spacing: .02em; line-height: 1;
                }
                .nb-logo-sub {
                    font-family: 'Courier New', monospace;
                    font-size: 9.5px; letter-spacing: .22em; text-transform: uppercase;
                    color: var(--gold); line-height: 1;
                }

                /* ── Desktop links ── */
                .nb-links {
                    display: flex; align-items: center; gap: 2px;
                    list-style: none; margin: 0; padding: 0;
                }
                @media(max-width:880px) { .nb-links { display: none; } }

                .nb-link {
                    position: relative;
                    opacity: 0; transform: translateY(-8px);
                    animation: nb-drop .45s cubic-bezier(.22,1,.36,1) forwards;
                }
                @keyframes nb-drop { to { opacity:1; transform:translateY(0); } }

                .nb-link a {
                    display: block;
                    padding: 8px 16px;
                    font-family: 'Courier New', monospace;
                    font-size: 11.5px; font-weight: 700;
                    letter-spacing: .13em; text-transform: uppercase;
                    /* ★ ALWAYS bright white — never dim */
                    color: var(--white);
                    text-decoration: none;
                    border-radius: 3px;
                    position: relative;
                    transition: color .18s, background .18s;
                    white-space: nowrap;
                }
                .nb-link a::after {
                    content: '';
                    position: absolute; bottom: 4px; left: 16px; right: 16px;
                    height: 1.5px;
                    background: var(--gold);
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform .28s cubic-bezier(.22,1,.36,1);
                    border-radius: 2px;
                }
                .nb-link a:hover,
                .nb-link.nb-active a {
                    color: var(--gold);
                    background: var(--gold-dim);
                }
                .nb-link a:hover::after,
                .nb-link.nb-active a::after { transform: scaleX(1); }

                /* ── Book Now ── */
                .nb-book {
                    position: relative; overflow: hidden;
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 11px 24px;
                    background: var(--gold); color: #0a0a0a;
                    font-family: 'Courier New', monospace;
                    font-size: 11px; font-weight: 800; letter-spacing: .15em;
                    text-transform: uppercase; text-decoration: none;
                    border-radius: 3px; flex-shrink: 0;
                    box-shadow: 0 2px 16px rgba(201,169,110,.3);
                    transition: transform .22s, box-shadow .22s;
                    white-space: nowrap;
                    opacity: 0;
                    animation: nb-bookFade .5s ease .8s forwards;
                }
                @keyframes nb-bookFade { to { opacity:1; } }
                .nb-book:hover { transform: translateY(-2px); box-shadow: 0 6px 28px rgba(201,169,110,.5); }
                .nb-book:active { transform: scale(.97); }
                .nb-book::before {
                    content: ''; position: absolute;
                    top: 0; left: -72px; width: 52px; height: 100%;
                    background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,.38), transparent 80%);
                    transition: left .42s ease; pointer-events: none;
                }
                .nb-book:hover::before { left: 120%; }
                .nb-book-arr { transition: transform .2s; }
                .nb-book:hover .nb-book-arr { transform: translateX(4px); }
                @media(max-width:880px) { .nb-book { display: none; } }

                /* ── Hamburger ── */
                .nb-ham {
                    display: none; flex-direction: column; align-items: flex-end;
                    justify-content: center; gap: 5px;
                    width: 44px; height: 44px;
                    background: none; border: 1px solid rgba(255,255,255,.12);
                    border-radius: 4px; cursor: pointer; padding: 0 10px;
                    flex-shrink: 0; position: relative; z-index: 1100;
                    transition: border-color .2s;
                }
                .nb-ham:hover { border-color: rgba(201,169,110,.5); }
                @media(max-width:880px) { .nb-ham { display: flex; } }
                .nb-ham span {
                    display: block; height: 1.5px; border-radius: 2px; background: var(--white);
                    transition: transform .38s cubic-bezier(.22,1,.36,1), width .28s, opacity .2s, background .2s;
                }
                .nb-ham span:nth-child(1) { width: 22px; }
                .nb-ham span:nth-child(2) { width: 14px; }
                .nb-ham span:nth-child(3) { width: 18px; }
                .nb-ham.open span:nth-child(1) { width: 22px; transform: translateY(6.5px) rotate(45deg); background: var(--gold); }
                .nb-ham.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
                .nb-ham.open span:nth-child(3) { width: 22px; transform: translateY(-6.5px) rotate(-45deg); background: var(--gold); }

                /* ── Mobile drawer ── */
                .nb-drawer {
                    position: fixed; inset: 0; z-index: 1050;
                    display: flex; flex-direction: column;
                    pointer-events: none;
                }
                /* backdrop */
                .nb-drawer-bd {
                    position: absolute; inset: 0;
                    background: rgba(0,0,0,.6);
                    backdrop-filter: blur(6px);
                    opacity: 0; transition: opacity .35s ease;
                }
                .nb-drawer.open .nb-drawer-bd { opacity: 1; }
                /* panel slides in from right */
                .nb-drawer-panel {
                    position: absolute; top: 0; right: 0; bottom: 0;
                    width: min(320px, 88vw);
                    background: #0d0d0d;
                    border-left: 1px solid rgba(201,169,110,.2);
                    display: flex; flex-direction: column;
                    transform: translateX(100%);
                    transition: transform .45s cubic-bezier(.22,1,.36,1);
                    overflow: hidden;
                }
                .nb-drawer.open .nb-drawer-panel { transform: translateX(0); }
                .nb-drawer.open { pointer-events: all; }

                /* panel top strip */
                .nb-drawer-top {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 0 24px;
                    height: var(--nav-h);
                    border-bottom: 1px solid rgba(255,255,255,.07);
                    flex-shrink: 0;
                }
                .nb-drawer-brand {
                    font-family: 'Georgia', serif;
                    font-size: 14px; font-weight: 700;
                    color: var(--white); letter-spacing: .03em;
                }
                .nb-drawer-close {
                    width: 36px; height: 36px;
                    background: rgba(255,255,255,.06);
                    border: 1px solid rgba(255,255,255,.1);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; color: var(--white); font-size: 18px; line-height: 1;
                    transition: background .2s, border-color .2s, color .2s;
                }
                .nb-drawer-close:hover { background: rgba(201,169,110,.15); border-color: var(--gold); color: var(--gold); }

                /* links inside panel */
                .nb-drawer-links {
                    flex: 1; overflow-y: auto; padding: 16px 0;
                    display: flex; flex-direction: column;
                }
                .nb-drawer-link {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 15px 24px;
                    text-decoration: none;
                    border-bottom: 1px solid rgba(255,255,255,.06);
                    position: relative;
                    opacity: 0; transform: translateX(20px);
                    transition:
                        opacity .35s ease,
                        transform .35s cubic-bezier(.22,1,.36,1),
                        background .2s;
                }
                .nb-drawer.open .nb-drawer-link { opacity: 1; transform: translateX(0); }
                .nb-drawer-link:hover { background: rgba(201,169,110,.07); }
                .nb-drawer-link-label {
                    font-family: 'Courier New', monospace;
                    font-size: 13px; font-weight: 700;
                    letter-spacing: .13em; text-transform: uppercase;
                    /* ★ crystal-clear white */
                    color: var(--white);
                    transition: color .18s;
                }
                .nb-drawer-link:hover .nb-drawer-link-label { color: var(--gold); }
                .nb-drawer-link-arr {
                    font-size: 14px; color: rgba(255,255,255,.25);
                    transition: color .18s, transform .22s;
                }
                .nb-drawer-link:hover .nb-drawer-link-arr { color: var(--gold); transform: translateX(4px); }

                /* gold left accent on active */
                .nb-drawer-link.nb-active::before {
                    content: '';
                    position: absolute; left: 0; top: 0; bottom: 0;
                    width: 3px; background: var(--gold);
                    border-radius: 0 2px 2px 0;
                }
                .nb-drawer-link.nb-active .nb-drawer-link-label { color: var(--gold); }

                /* panel footer */
                .nb-drawer-footer {
                    padding: 20px 24px 28px; flex-shrink: 0;
                    border-top: 1px solid rgba(255,255,255,.07);
                    display: flex; flex-direction: column; gap: 12px;
                    opacity: 0; transition: opacity .35s ease .5s;
                }
                .nb-drawer.open .nb-drawer-footer { opacity: 1; }
                .nb-drawer-book {
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    padding: 14px 20px;
                    background: var(--gold); color: #0a0a0a;
                    font-family: 'Courier New', monospace;
                    font-size: 11.5px; font-weight: 800; letter-spacing: .15em;
                    text-transform: uppercase; text-decoration: none;
                    border-radius: 3px;
                    transition: box-shadow .22s, transform .22s;
                    position: relative; overflow: hidden;
                }
                .nb-drawer-book:hover { box-shadow: 0 6px 28px rgba(201,169,110,.5); transform: translateY(-1px); }
                .nb-drawer-book::before {
                    content: ''; position: absolute;
                    top: 0; left: -72px; width: 52px; height: 100%;
                    background: linear-gradient(105deg, transparent, rgba(255,255,255,.32), transparent);
                    transition: left .42s; pointer-events: none;
                }
                .nb-drawer-book:hover::before { left: 120%; }
                .nb-drawer-meta {
                    font-family: 'Courier New', monospace;
                    font-size: 9.5px; letter-spacing: .16em; text-transform: uppercase;
                    color: rgba(255,255,255,.3); text-align: center; line-height: 1.7;
                }
                .nb-drawer-meta em { font-style: normal; color: rgba(201,169,110,.6); }
            `}</style>

            {/* ── NAV BAR ─────────────────────────────────── */}
            <div className={`nb-wrap${mounted ? ' nb-mounted' : ''}${scrolled ? ' nb-scrolled' : ''}`}>
                <div className="nb-bg" />
                <div className="nb-prog" style={{ width: `${progress}%` }} />

                <div className="nb-row">
                    {/* Logo */}
                    <Link href="/" className="nb-logo">
                        <div className="nb-logo-mark">CP</div>
                        <div className="nb-logo-text">
                            <span className="nb-logo-name">Ceramic Pro Ajax</span>
                            <span className="nb-logo-sub">c/o Flawless Finish</span>
                        </div>
                    </Link>

                    {/* Desktop links */}
                    <ul className="nb-links">
                        {navLinks.map((l, i) => (
                            <li
                                key={l.href}
                                className={`nb-link${activeHash === l.href ? ' nb-active' : ''}`}
                                style={{ animationDelay: `${.1 + i * .06}s` }}
                            >
                                <a href={l.href} onClick={close}>{l.label}</a>
                            </li>
                        ))}
                    </ul>

                    {/* Book Now */}
                    <a href="#contact" className="nb-book">
                        Book Now <span className="nb-book-arr">→</span>
                    </a>

                    {/* Hamburger */}
                    <button
                        className={`nb-ham${menuOpen ? ' open' : ''}`}
                        onClick={() => setMenuOpen(v => !v)}
                        aria-label="Toggle menu"
                    >
                        <span /><span /><span />
                    </button>
                </div>
            </div>

            {/* ── MOBILE DRAWER ───────────────────────────── */}
            <div className={`nb-drawer${menuOpen ? ' open' : ''}`}>
                {/* Backdrop — tap to close */}
                <div className="nb-drawer-bd" onClick={close} />

                <div className="nb-drawer-panel">
                    {/* Top */}
                    <div className="nb-drawer-top">
                        <span className="nb-drawer-brand">Ceramic Pro Ajax</span>
                        <button className="nb-drawer-close" onClick={close} aria-label="Close menu">✕</button>
                    </div>

                    {/* Links */}
                    <nav className="nb-drawer-links">
                        {navLinks.map((l, i) => (
                            <a
                                key={l.href}
                                href={l.href}
                                className={`nb-drawer-link${activeHash === l.href ? ' nb-active' : ''}`}
                                onClick={close}
                                style={{ transitionDelay: menuOpen ? `${.08 + i * .055}s` : '0s' }}
                            >
                                <span className="nb-drawer-link-label">{l.label}</span>
                                <span className="nb-drawer-link-arr">→</span>
                            </a>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="nb-drawer-footer">
                        <a href="#contact" className="nb-drawer-book" onClick={close}>
                            Book a Free Quote →
                        </a>
                        <p className="nb-drawer-meta">
                            Ajax, ON &nbsp;·&nbsp; <em>Mon–Sun 8AM–6PM</em>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}