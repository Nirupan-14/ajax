'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ABOUT_IMAGES } from '@/lib/constants';

const STATS = [
    { val: '5+',  label: 'Years Experience' },
    { val: '500+', label: 'Cars Detailed'    },
    { val: '5★',   label: 'Google Rating'   },
];

export default function AboutSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

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
                .ab {
                    --gold:        #C9A96E;
                    --gold-dim:    rgba(201,169,110,.10);
                    --gold-border: rgba(201,169,110,.22);
                    --white:       #FFFFFF;
                    --off:         #E8E2D9;
                    --muted:       rgba(232,226,217,.55);
                    --dark:        #0C0C0B;
                }

                /* ── Section
                   Background: #0C0C0B — one step warmer/lighter than services (#111210)
                   which itself is lighter than hero (#080808).
                   This gives hero → services → about a clear three-step dark ladder.
                ── */
                .ab {
                    position: relative;
                    padding: clamp(80px,10vw,128px) clamp(24px,6vw,80px);
                    background: #0C0C0B;
                    overflow: hidden;
                    font-family: 'Georgia', serif;
                }

                /* top divider line — same pattern as services section */
                .ab::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0;
                    height: 1px;
                    background: linear-gradient(
                        to right,
                        transparent 0%,
                        rgba(201,169,110,.45) 30%,
                        rgba(201,169,110,.45) 70%,
                        transparent 100%
                    );
                    z-index: 1;
                }

                /* large decorative BG number */
                .ab-bg-num {
                    position: absolute;
                    right: clamp(24px,6vw,80px); top: 50%;
                    transform: translateY(-50%);
                    font-family: 'Georgia', serif;
                    font-size: clamp(120px,18vw,220px);
                    font-weight: 700; line-height: 1;
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(201,169,110,.06);
                    pointer-events: none; user-select: none;
                    letter-spacing: -.04em;
                    z-index: 0;
                }

                /* subtle radial warm glow from the image side */
                .ab-glow {
                    position: absolute; right: 0; top: 50%;
                    transform: translateY(-50%);
                    width: 50%; height: 80%;
                    background: radial-gradient(ellipse 70% 60% at 80% 50%, rgba(201,169,110,.05) 0%, transparent 70%);
                    pointer-events: none; z-index: 0;
                }

                /* ── Inner ── */
                .ab-inner {
                    position: relative; z-index: 1;
                    max-width: 1160px; margin: 0 auto;
                }

                /* ── Grid ── */
                .ab-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: clamp(48px,7vw,96px);
                    align-items: center;
                }
                @media(max-width:860px) { .ab-grid { grid-template-columns: 1fr; } }

                /* ══════════════════════════════════
                   TEXT COLUMN
                ══════════════════════════════════ */
                .ab-text { display: flex; flex-direction: column; }

                .ab-label {
                    display: inline-flex; align-items: center; gap: 12px;
                    font-family: 'Courier New', monospace;
                    font-size: 10px; font-weight: 700;
                    letter-spacing: .28em; text-transform: uppercase;
                    color: var(--gold); margin-bottom: 18px;
                    opacity: 0; transform: translateX(-18px);
                    transition: opacity .6s ease .1s, transform .6s cubic-bezier(.22,1,.36,1) .1s;
                }
                .ab-label.vis { opacity: 1; transform: translateX(0); }
                .ab-label::before {
                    content: ''; width: 32px; height: 1.5px;
                    background: var(--gold); border-radius: 2px; flex-shrink: 0;
                }

                .ab-heading {
                    font-size: clamp(2rem,3.8vw,3.2rem);
                    font-weight: 700; line-height: 1.08; letter-spacing: -.025em;
                    color: var(--white); margin: 0 0 20px;
                    opacity: 0; transform: translateY(24px);
                    transition: opacity .7s ease .22s, transform .7s cubic-bezier(.22,1,.36,1) .22s;
                }
                .ab-heading.vis { opacity: 1; transform: translateY(0); }
                .ab-heading em {
                    font-style: italic; color: var(--gold);
                    position: relative; display: inline-block;
                }
                .ab-heading em::after {
                    content: ''; position: absolute; bottom: 1px; left: 0;
                    width: 0; height: 1.5px;
                    background: linear-gradient(to right, var(--gold), rgba(201,169,110,.3));
                    border-radius: 2px;
                    transition: width .9s cubic-bezier(.22,1,.36,1) 1s;
                }
                .ab-heading.vis em::after { width: 100%; }

                /* gold divider */
                .ab-rule {
                    width: 0; height: 1.5px; margin-bottom: 28px;
                    background: linear-gradient(to right, var(--gold), rgba(201,169,110,.1));
                    border-radius: 2px;
                    transition: width .8s cubic-bezier(.22,1,.36,1) .4s;
                }
                .ab-rule.vis { width: 56px; }

                .ab-p {
                    font-size: clamp(.9rem,1.22vw,1rem); line-height: 1.82;
                    color: rgba(232,226,217,.62); margin-bottom: 1.2rem;
                    opacity: 0; transform: translateY(14px);
                    transition: opacity .6s ease .48s, transform .6s cubic-bezier(.22,1,.36,1) .48s;
                }
                .ab-p2 { transition-delay: .58s !important; margin-bottom: 0 !important; }
                .ab-p.vis { opacity: 1; transform: translateY(0); }

                /* ── Inline stat row ── */
                .ab-stats {
                    display: flex; gap: 0;
                    margin: 28px 0 32px;
                    border: 1px solid var(--gold-border);
                    border-radius: 3px; overflow: hidden;
                    opacity: 0; transform: translateY(12px);
                    transition: opacity .6s ease .68s, transform .6s cubic-bezier(.22,1,.36,1) .68s;
                }
                .ab-stats.vis { opacity: 1; transform: translateY(0); }
                .ab-stat {
                    flex: 1; padding: 16px 14px;
                    display: flex; flex-direction: column; align-items: center; gap: 4px;
                    border-right: 1px solid var(--gold-border);
                    position: relative; cursor: default;
                    transition: background .2s;
                }
                .ab-stat:last-child { border-right: none; }
                .ab-stat:hover { background: var(--gold-dim); }
                .ab-stat::after {
                    content: ''; position: absolute; bottom: 0; left: 50%;
                    transform: translateX(-50%) scaleX(0);
                    width: 100%; height: 2px; background: var(--gold);
                    transition: transform .28s ease;
                    transform-origin: center;
                }
                .ab-stat:hover::after { transform: translateX(-50%) scaleX(1); }
                .ab-stat-val {
                    font-family: 'Georgia', serif;
                    font-size: 20px; font-weight: 700; color: var(--gold);
                    line-height: 1; letter-spacing: -.01em;
                    text-shadow: 0 0 16px rgba(201,169,110,.35);
                }
                .ab-stat-lbl {
                    font-family: 'Courier New', monospace;
                    font-size: 9px; font-weight: 700;
                    letter-spacing: .16em; text-transform: uppercase;
                    color: rgba(232,226,217,.5); white-space: nowrap;
                }

                /* ── CTA button ── */
                .ab-btn {
                    display: inline-flex; align-items: center; gap: 9px;
                    padding: 13px 28px; border-radius: 3px;
                    font-family: 'Courier New', monospace;
                    font-size: 11px; letter-spacing: .16em;
                    text-transform: uppercase; font-weight: 800;
                    text-decoration: none; align-self: flex-start;
                    background: var(--gold); color: #080808;
                    box-shadow: 0 4px 20px rgba(201,169,110,.28);
                    position: relative; overflow: hidden;
                    opacity: 0; transform: translateY(12px);
                    transition: opacity .6s ease .82s, transform .6s cubic-bezier(.22,1,.36,1) .82s,
                                box-shadow .22s, translateY .22s;
                }
                .ab-btn.vis { opacity: 1; transform: translateY(0); }
                .ab-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 32px rgba(201,169,110,.5); }
                .ab-btn:active { transform: scale(.97) !important; }
                .ab-btn::before {
                    content: ''; position: absolute; top: 0; left: -72px; width: 52px; height: 100%;
                    background: linear-gradient(105deg, transparent, rgba(255,255,255,.32), transparent);
                    transition: left .42s; pointer-events: none;
                }
                .ab-btn:hover::before { left: 120%; }
                .ab-arr { display: inline-block; transition: transform .2s; }
                .ab-btn:hover .ab-arr { transform: translateX(4px); }

                /* ══════════════════════════════════
                   IMAGE COLUMN
                ══════════════════════════════════ */
                .ab-img-col {
                    position: relative;
                    max-width: 460px; justify-self: center; width: 100%;
                    opacity: 0; transform: translateX(28px);
                    transition: opacity .85s ease .3s, transform .85s cubic-bezier(.22,1,.36,1) .3s;
                }
                .ab-img-col.vis { opacity: 1; transform: translateX(0); }

                /* offset shadow block — dark on dark, use border instead */
                .ab-shadow-block {
                    position: absolute;
                    top: 16px; left: 16px; right: -16px; bottom: -16px;
                    border: 1px solid var(--gold-border);
                    border-radius: 4px; z-index: 0;
                    background: rgba(201,169,110,.04);
                    transition: transform .35s ease;
                }
                .ab-img-col:hover .ab-shadow-block { transform: translate(4px, 4px); }

                /* corner brackets */
                .ab-corner {
                    position: absolute; width: 22px; height: 22px; z-index: 3;
                    opacity: 0; transform: scale(.5);
                    transition: opacity .5s ease .95s, transform .5s cubic-bezier(.22,1,.36,1) .95s;
                }
                .ab-img-col.vis .ab-corner { opacity: 1; transform: scale(1); }
                .ab-c-tl { top:-8px; left:-8px; border-top:2px solid var(--gold); border-left:2px solid var(--gold); }
                .ab-c-tr { top:-8px; right:-8px; border-top:2px solid var(--gold); border-right:2px solid var(--gold); }
                .ab-c-bl { bottom:-8px; left:-8px; border-bottom:2px solid var(--gold); border-left:2px solid var(--gold); }
                .ab-c-br { bottom:-8px; right:-8px; border-bottom:2px solid var(--gold); border-right:2px solid var(--gold); }

                /* main image card */
                .ab-card {
                    position: relative; z-index: 1;
                    border-radius: 4px; overflow: hidden;
                    border: 1px solid rgba(201,169,110,.15);
                    box-shadow: 0 24px 64px rgba(0,0,0,.6), 0 0 0 1px rgba(201,169,110,.1);
                    animation: abFloat 7s ease-in-out infinite;
                }
                @keyframes abFloat {
                    0%,100% { transform: translateY(0); }
                    50%     { transform: translateY(-8px); }
                }
                .ab-card img {
                    display: block; width: 100%; height: auto;
                    transition: transform .55s ease;
                }
                .ab-card:hover img { transform: scale(1.04); }

                /* image overlay gradient — darkens bottom for badge readability */
                .ab-card::after {
                    content: '';
                    position: absolute; inset: 0; z-index: 1; pointer-events: none;
                    background: linear-gradient(to top, rgba(0,0,0,.55) 0%, transparent 45%);
                }

                /* badge inside image */
                .ab-badge {
                    position: absolute; bottom: 14px; left: 14px; z-index: 4;
                    background: rgba(10,10,10,.85); backdrop-filter: blur(12px);
                    border: 1px solid var(--gold-border); border-radius: 3px;
                    padding: 8px 14px;
                    display: flex; align-items: center; gap: 9px;
                    font-family: 'Courier New', monospace; font-size: 10px;
                    letter-spacing: .14em; text-transform: uppercase;
                    color: var(--gold); font-weight: 700;
                    opacity: 0; transform: translateY(8px);
                    transition: opacity .5s ease 1.1s, transform .5s cubic-bezier(.22,1,.36,1) 1.1s,
                                border-color .22s, box-shadow .22s;
                }
                .ab-img-col.vis .ab-badge { opacity: 1; transform: translateY(0); }
                .ab-card:hover .ab-badge {
                    border-color: rgba(201,169,110,.5);
                    box-shadow: 0 0 16px rgba(201,169,110,.15);
                    transform: translateY(-3px) !important;
                }
                .ab-dot {
                    width: 7px; height: 7px; border-radius: 50%;
                    background: #4ade80; flex-shrink: 0;
                    box-shadow: 0 0 6px rgba(74,222,128,.6);
                    animation: dotBlink 2s ease-in-out infinite;
                }
                @keyframes dotBlink { 0%,100%{opacity:1} 50%{opacity:.2} }

                /* floating rating chip — top-right */
                .ab-chip {
                    position: absolute; top: -16px; right: -16px; z-index: 4;
                    background: #141412;
                    border: 1px solid var(--gold-border);
                    border-radius: 3px; padding: 12px 16px;
                    display: flex; flex-direction: column; align-items: center; gap: 3px;
                    box-shadow: 0 8px 28px rgba(0,0,0,.5);
                    opacity: 0; transform: translateY(-8px) scale(.9);
                    transition: opacity .5s ease 1.05s, transform .5s cubic-bezier(.22,1,.36,1) 1.05s;
                }
                .ab-img-col.vis .ab-chip { opacity: 1; transform: translateY(0) scale(1); }
                .ab-chip-val {
                    font-family: 'Georgia', serif;
                    font-size: 22px; font-weight: 700; color: var(--gold); line-height: 1;
                    text-shadow: 0 0 14px rgba(201,169,110,.4);
                }
                .ab-chip-lbl {
                    font-family: 'Courier New', monospace;
                    font-size: 9px; letter-spacing: .16em;
                    text-transform: uppercase; color: rgba(232,226,217,.45); margin-top: 2px;
                }

                /* ── Responsive ── */
                @media(max-width:860px) {
                    .ab-img-col { margin: 0 auto; }
                    .ab-chip { top: auto; bottom: -16px; right: -10px; }
                }
                @media(max-width:480px) {
                    .ab-shadow-block { display: none; }
                    .ab-chip { display: none; }
                    .ab-bg-num { display: none; }
                }
            `}</style>

            <section className="ab" id="about" ref={sectionRef}>
                {/* Decorative elements */}
                <div className="ab-bg-num">EST</div>
                <div className="ab-glow" />

                <div className="ab-inner">
                    <div className="ab-grid">

                        {/* ── LEFT: Text ── */}
                        <div className="ab-text">
                            <span className={`ab-label${visible ? ' vis' : ''}`}>About Us</span>

                            <h2 className={`ab-heading${visible ? ' vis' : ''}`}>
                                Craftsmanship<br />
                                <em>You Can See</em>
                            </h2>

                            <div className={`ab-rule${visible ? ' vis' : ''}`} />

                            <p className={`ab-p${visible ? ' vis' : ''}`}>
                                At Ceramic Pro Ajax c/o Flawless Finish, our expert team — led by
                                Newton, Raku, and Nicholas — brings precision craftsmanship and
                                transparent communication to every vehicle.
                            </p>

                            <p className={`ab-p ab-p2${visible ? ' vis' : ''}`}>
                                We listen, we care, and we deliver results that exceed expectations —
                                from a quick interior detail to a full ceramic coating package, every
                                car leaves looking brand new.
                            </p>

                            {/* Stat row */}
                            <div className={`ab-stats${visible ? ' vis' : ''}`}>
                                {STATS.map(s => (
                                    <div className="ab-stat" key={s.label}>
                                        <span className="ab-stat-val">{s.val}</span>
                                        <span className="ab-stat-lbl">{s.label}</span>
                                    </div>
                                ))}
                            </div>

                            <a href="#contact" className={`ab-btn${visible ? ' vis' : ''}`}>
                                Request a Quote <span className="ab-arr">→</span>
                            </a>
                        </div>

                        {/* ── RIGHT: Image ── */}
                        <div className={`ab-img-col${visible ? ' vis' : ''}`}>

                            <div className="ab-shadow-block" />

                            <div className="ab-corner ab-c-tl" />
                            <div className="ab-corner ab-c-tr" />
                            <div className="ab-corner ab-c-bl" />
                            <div className="ab-corner ab-c-br" />

                            <div className="ab-chip">
                                <span className="ab-chip-val">5★</span>
                                <span className="ab-chip-lbl">Google</span>
                            </div>

                            <div className="ab-card">
                                <Image
                                    src={ABOUT_IMAGES[0].src}
                                    alt={ABOUT_IMAGES[0].alt}
                                    width={480}
                                    height={360}
                                    quality={88}
                                    style={{ objectFit: 'cover', width: '100%', height: '360px' }}
                                />
                                <div className="ab-badge">
                                    <span className="ab-dot" />
                                    Expert Craftsmanship
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}