'use client';

import { useState, useRef, useEffect } from 'react';
import { SERVICES } from '@/lib/constants';

const SERVICE_DETAILS: Record<string, { desc: string; features: string[] }> = {
    'paint-correction': {
        desc: 'Multi-stage machine polishing that removes swirl marks, scratches and oxidation — restoring factory-level gloss.',
        features: ['Single / Dual Stage', 'Swirl Removal', 'Gloss Enhancement'],
    },
    'ceramic-coating': {
        desc: 'Professional-grade nano-ceramic layers that bond permanently to your paint for long-lasting hydrophobic protection.',
        features: ['9H Hardness', '5–10 Year Warranty', 'Self-Cleaning'],
    },
    'auto-detailing': {
        desc: 'Full interior & exterior detail that leaves every surface showroom-ready — top to bottom, inside and out.',
        features: ['Interior Deep Clean', 'Exterior Polish', 'Engine Bay'],
    },
    'window-tinting': {
        desc: 'Premium ceramic film that blocks heat and UV rays while keeping the OEM look your vehicle deserves.',
        features: ['Ceramic Film', 'UV 99% Block', 'All Shades Available'],
    },
    'vehicle-wraps': {
        desc: 'Full and partial colour-change wraps using 3M & Avery cast vinyl — custom finishes with zero permanent paint change.',
        features: ['3M / Avery Vinyl', 'Colour Change', 'Paint Protection'],
    },
    'ppf': {
        desc: 'Self-healing thermoplastic urethane film shields high-impact zones from rock chips, road debris and micro-scratches.',
        features: ['Self-Healing', 'Full / Partial Kits', 'Gloss & Matte'],
    },
};

export default function ServicesStrip() {
    const [active, setActive] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold: 0.12 },
        );
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

    return (
        <>
            <style>{`
                /* ── Tokens ── */
                .ss {
                    --gold: #C9A96E;
                    --gold-dim: rgba(201,169,110,.12);
                    --gold-border: rgba(201,169,110,.25);
                    --white: #FFFFFF;
                    --muted: rgba(232,226,217,.5);
                    --surface: rgba(255,255,255,.04);
                    --surface-h: rgba(255,255,255,.07);
                }

                /* ── Section shell ──────────────────────────────────────────
                   Hero is #080808 (near-black).
                   We use #111210 — a warm dark with a faint brown/charcoal
                   tone — so the two sections are visually distinct at a glance.
                   The top edge uses a gold separator line + a soft radial glow
                   to further "cut" the boundary.
                ──────────────────────────────────────────────────────────── */
                .ss {
                    position: relative;
                    background: #111210;
                    padding: clamp(72px,10vw,120px) clamp(24px,6vw,80px);
                    font-family: 'Georgia', serif;
                    /* subtle vignette from top — deepens near the hero edge */
                    background-image:
                        radial-gradient(ellipse 70% 280px at 50% 0%, rgba(201,169,110,.055) 0%, transparent 100%);
                }

                /* gold divider line at the very top */
                .ss::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0;
                    height: 1px;
                    background: linear-gradient(
                        to right,
                        transparent 0%,
                        rgba(201,169,110,.55) 30%,
                        rgba(201,169,110,.55) 70%,
                        transparent 100%
                    );
                }

                /* faint noise texture so surface reads differently from the hero */
                .ss::after {
                    content: '';
                    position: absolute; inset: 0; pointer-events: none; z-index: 0;
                    opacity: .028;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                    background-size: 200px;
                }

                .ss-inner {
                    position: relative; z-index: 1;
                    max-width: 1200px; margin: 0 auto;
                }

                /* ── Header ── */
                .ss-header {
                    display: flex; align-items: flex-end; justify-content: space-between;
                    gap: 24px; margin-bottom: clamp(40px,6vw,64px);
                    flex-wrap: wrap;
                }
                .ss-label {
                    font-family: 'Courier New', monospace;
                    font-size: 10px; font-weight: 700;
                    letter-spacing: .28em; text-transform: uppercase;
                    color: var(--gold); margin-bottom: 10px;
                    display: flex; align-items: center; gap: 12px;
                }
                .ss-label::before {
                    content: ''; display: block;
                    width: 32px; height: 1.5px;
                    background: var(--gold); border-radius: 2px;
                }
                .ss-title {
                    font-size: clamp(28px,4vw,42px);
                    font-weight: 700; line-height: 1.1;
                    letter-spacing: -.02em; color: var(--white);
                    margin: 0;
                }
                .ss-title em { font-style: italic; color: var(--gold); }
                .ss-count {
                    font-family: 'Courier New', monospace;
                    font-size: 10px; letter-spacing: .18em; text-transform: uppercase;
                    color: var(--muted); white-space: nowrap; padding-bottom: 4px;
                }
                .ss-count em { font-style: normal; color: var(--gold); }

                /* ── Grid ── */
                .ss-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2px;
                }
                @media(max-width:780px) { .ss-grid { grid-template-columns: repeat(2,1fr); } }
                @media(max-width:480px) { .ss-grid { grid-template-columns: 1fr; } }

                /* ── Card ── */
                .ss-card {
                    position: relative; overflow: hidden;
                    background: var(--surface);
                    border: 1px solid rgba(255,255,255,.06);
                    padding: 32px 28px 44px;
                    cursor: pointer;
                    opacity: 0; transform: translateY(24px);
                    transition:
                        opacity .5s ease,
                        transform .5s cubic-bezier(.22,1,.36,1),
                        background .22s,
                        border-color .22s,
                        box-shadow .22s;
                }
                .ss-card.ss-visible { opacity: 1; transform: translateY(0); }
                .ss-card:hover, .ss-card.ss-open {
                    background: var(--surface-h);
                    border-color: var(--gold-border);
                    transform: translateY(-3px);
                    box-shadow: 0 12px 40px rgba(0,0,0,.45), 0 0 0 1px rgba(201,169,110,.18);
                }
                .ss-card.ss-open { background: rgba(201,169,110,.06); }

                /* corner bracket */
                .ss-card::before {
                    content: '';
                    position: absolute; top: 0; left: 0;
                    width: 0; height: 0;
                    border-top: 2px solid transparent;
                    border-left: 2px solid transparent;
                    transition: width .3s ease .05s, height .3s ease, border-color .3s;
                }
                .ss-card:hover::before, .ss-card.ss-open::before {
                    width: 22px; height: 22px; border-color: var(--gold);
                }

                /* index */
                .ss-card-idx {
                    position: absolute; top: 14px; right: 18px;
                    font-family: 'Courier New', monospace;
                    font-size: 10px; letter-spacing: .16em;
                    color: rgba(201,169,110,.2);
                    transition: color .2s;
                }
                .ss-card:hover .ss-card-idx,
                .ss-card.ss-open .ss-card-idx { color: rgba(201,169,110,.55); }

                /* icon */
                .ss-icon {
                    font-size: 28px; line-height: 1;
                    margin-bottom: 16px; display: block;
                    filter: saturate(.8);
                    transition: transform .3s cubic-bezier(.22,1,.36,1), filter .2s;
                }
                .ss-card:hover .ss-icon, .ss-card.ss-open .ss-icon {
                    transform: scale(1.15) translateY(-2px); filter: saturate(1.1);
                }

                /* name */
                .ss-name {
                    font-family: 'Georgia', serif;
                    font-size: 18px; font-weight: 700;
                    color: var(--white); letter-spacing: -.01em;
                    line-height: 1.2; display: block;
                    transition: color .18s;
                }
                .ss-card:hover .ss-name, .ss-card.ss-open .ss-name { color: var(--gold); }

                /* chevron */
                .ss-chevron {
                    position: absolute; bottom: 16px; right: 18px;
                    width: 22px; height: 22px;
                    border: 1px solid rgba(201,169,110,.22); border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 10px; color: rgba(201,169,110,.4);
                    transition: transform .3s cubic-bezier(.22,1,.36,1), background .2s, border-color .2s, color .2s;
                }
                .ss-card:hover .ss-chevron { border-color: var(--gold); color: var(--gold); background: var(--gold-dim); }
                .ss-card.ss-open .ss-chevron { transform: rotate(180deg); background: var(--gold-dim); border-color: var(--gold); color: var(--gold); }

                /* expandable detail */
                .ss-detail { max-height: 0; overflow: hidden; transition: max-height .42s cubic-bezier(.22,1,.36,1); }
                .ss-detail.ss-open { max-height: 240px; }
                .ss-detail-inner {
                    padding-top: 16px;
                    border-top: 1px solid rgba(201,169,110,.12);
                    margin-top: 16px;
                }
                .ss-desc {
                    font-family: 'Georgia', serif;
                    font-size: 13.5px; line-height: 1.7;
                    color: rgba(232,226,217,.72); margin: 0 0 14px;
                }
                .ss-features { display: flex; flex-wrap: wrap; gap: 6px; }
                .ss-feat {
                    font-family: 'Courier New', monospace;
                    font-size: 9.5px; font-weight: 700;
                    letter-spacing: .14em; text-transform: uppercase;
                    color: var(--gold);
                    background: var(--gold-dim);
                    border: 1px solid rgba(201,169,110,.22);
                    border-radius: 2px; padding: 4px 9px; white-space: nowrap;
                }

                /* ── CTA ── */
                .ss-cta {
                    margin-top: 40px;
                    display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
                }
                .ss-cta-btn {
                    display: inline-flex; align-items: center; gap: 9px;
                    padding: 13px 28px;
                    background: var(--gold); color: #0a0a0a;
                    font-family: 'Courier New', monospace;
                    font-size: 11px; font-weight: 800; letter-spacing: .15em;
                    text-transform: uppercase; text-decoration: none;
                    border-radius: 3px;
                    box-shadow: 0 4px 20px rgba(201,169,110,.28);
                    transition: box-shadow .22s, transform .22s;
                    position: relative; overflow: hidden;
                }
                .ss-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(201,169,110,.5); }
                .ss-cta-btn::before {
                    content: ''; position: absolute; top: 0; left: -72px; width: 52px; height: 100%;
                    background: linear-gradient(105deg, transparent, rgba(255,255,255,.35), transparent);
                    transition: left .4s; pointer-events: none;
                }
                .ss-cta-btn:hover::before { left: 120%; }
                .ss-cta-arr { transition: transform .2s; }
                .ss-cta-btn:hover .ss-cta-arr { transform: translateX(4px); }
                .ss-cta-note {
                    font-family: 'Courier New', monospace;
                    font-size: 10px; letter-spacing: .18em; text-transform: uppercase;
                    color: var(--muted);
                }
                .ss-cta-note em { font-style: normal; color: var(--gold); }
            `}</style>

            <section className="ss" id="services" ref={sectionRef}>
                <div className="ss-inner">
                    <div className="ss-header">
                        <div>
                            <p className="ss-label">What We Do</p>
                            <h2 className="ss-title">
                                Premium <em>Protection</em><br />& Detailing Services
                            </h2>
                        </div>
                        <span className="ss-count">
                            <em>{SERVICES.length}</em> Services Available
                        </span>
                    </div>

                    <div className="ss-grid">
                        {SERVICES.map((s, i) => {
                            const detail = SERVICE_DETAILS[s.id];
                            const isOpen = active === s.id;
                            return (
                                <div
                                    key={s.id}
                                    className={`ss-card${visible ? ' ss-visible' : ''}${isOpen ? ' ss-open' : ''}`}
                                    style={{ transitionDelay: visible ? `${i * 0.07}s` : '0s' }}
                                    onClick={() => setActive(isOpen ? null : s.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={e => e.key === 'Enter' && setActive(isOpen ? null : s.id)}
                                    aria-expanded={isOpen}
                                >
                                    <span className="ss-card-idx">0{i + 1}</span>
                                    <span className="ss-icon">{s.icon}</span>
                                    <span className="ss-name">{s.name}</span>
                                    <span className="ss-chevron">▾</span>
                                    {detail && (
                                        <div className={`ss-detail${isOpen ? ' ss-open' : ''}`}>
                                            <div className="ss-detail-inner">
                                                <p className="ss-desc">{detail.desc}</p>
                                                <div className="ss-features">
                                                    {detail.features.map(f => (
                                                        <span className="ss-feat" key={f}>{f}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="ss-cta">
                        <a href="#pricing" className="ss-cta-btn">
                            View Pricing <span className="ss-cta-arr">→</span>
                        </a>
                        <span className="ss-cta-note">Free quotes · <em>Same-day availability</em></span>
                    </div>
                </div>
            </section>
        </>
    );
}