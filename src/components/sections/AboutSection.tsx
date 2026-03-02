'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ABOUT_IMAGES } from '@/lib/constants';

export default function AboutSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.15 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <style>{`
                .ab-section {
                    position: relative;
                    padding: clamp(72px, 10vw, 120px) 0;
                    background: #ffffff;
                    overflow: hidden;
                    --gold: #b8882a;
                    --navy: #0f1f3d;
                    --muted: #6b7280;
                }

                .ab-section::before {
                    content: '';
                    position: absolute; inset: 0;
                    background:
                        radial-gradient(ellipse 55% 60% at 75% 50%, rgba(184,136,42,.06) 0%, transparent 70%),
                        radial-gradient(ellipse 40% 40% at 5% 90%, rgba(15,31,61,.04) 0%, transparent 60%);
                    pointer-events: none;
                }

                .ab-container {
                    position: relative; z-index: 1;
                    max-width: 1160px;
                    margin: 0 auto;
                    padding: 0 clamp(24px, 6vw, 80px);
                }

                .ab-grid {
                    display: grid;
                    grid-template-columns: 1.1fr 0.9fr;
                    gap: clamp(48px, 7vw, 96px);
                    align-items: center;
                }
                @media (max-width: 860px) {
                    .ab-grid { grid-template-columns: 1fr; }
                }

                /* ── TEXT ── */
                .ab-text { display: flex; flex-direction: column; }

                .ab-label {
                    display: inline-flex; align-items: center; gap: 11px;
                    font-family: 'Courier New', monospace;
                    font-size: 11px; font-weight: 700;
                    letter-spacing: .26em; text-transform: uppercase;
                    color: var(--gold);
                    margin-bottom: 18px;
                    opacity: 0; transform: translateX(-20px);
                    transition: opacity .6s ease .1s, transform .6s cubic-bezier(.22,1,.36,1) .1s;
                }
                .ab-label.vis { opacity: 1; transform: translateX(0); }
                .ab-label::before {
                    content: ''; width: 32px; height: 2px;
                    background: var(--gold); border-radius: 1px; flex-shrink: 0;
                }

                .ab-heading {
                    font-family: 'Georgia', 'Times New Roman', serif;
                    font-size: clamp(2rem, 3.6vw, 3.1rem);
                    font-weight: 700; line-height: 1.1; letter-spacing: -.022em;
                    color: var(--navy); margin: 0 0 20px;
                    opacity: 0; transform: translateY(24px);
                    transition: opacity .7s ease .22s, transform .7s cubic-bezier(.22,1,.36,1) .22s;
                }
                .ab-heading.vis { opacity: 1; transform: translateY(0); }
                .ab-heading em {
                    font-style: italic; color: var(--gold);
                    position: relative; display: inline-block;
                }
                .ab-heading em::after {
                    content: ''; position: absolute; bottom: 2px; left: 0;
                    width: 0; height: 2px; background: var(--gold); border-radius: 1px;
                    transition: width .9s cubic-bezier(.22,1,.36,1) 1s;
                }
                .ab-heading em.vis::after { width: 100%; }

                .ab-divider {
                    width: 0; height: 2px; margin-bottom: 28px;
                    background: linear-gradient(to right, var(--gold), rgba(184,136,42,.12));
                    border-radius: 1px;
                    transition: width .8s cubic-bezier(.22,1,.36,1) .42s;
                }
                .ab-divider.vis { width: 60px; }

                .ab-p {
                    font-family: 'Georgia', serif;
                    font-size: clamp(.92rem, 1.25vw, 1.01rem);
                    line-height: 1.82; color: var(--muted);
                    margin-bottom: 1.2rem;
                    opacity: 0; transform: translateY(16px);
                    transition: opacity .6s ease .48s, transform .6s cubic-bezier(.22,1,.36,1) .48s;
                }
                .ab-p.ab-p2 { transition-delay: .58s; margin-bottom: 2.4rem; }
                .ab-p.vis { opacity: 1; transform: translateY(0); }

                .ab-btn {
                    display: inline-flex; align-items: center; gap: 9px;
                    padding: 13px 28px; border-radius: 2px;
                    font-family: 'Courier New', monospace;
                    font-size: 11px; letter-spacing: .16em;
                    text-transform: uppercase; font-weight: 700;
                    text-decoration: none; cursor: pointer;
                    background: var(--navy); color: #fff;
                    box-shadow: 0 4px 20px rgba(15,31,61,.22);
                    position: relative; overflow: hidden; align-self: flex-start;
                    opacity: 0; transform: translateY(14px);
                    transition: opacity .6s ease .7s, transform .6s cubic-bezier(.22,1,.36,1) .7s,
                                box-shadow .22s ease;
                }
                .ab-btn.vis { opacity: 1; transform: translateY(0); }
                .ab-btn::before {
                    content: ''; position: absolute; inset: 0;
                    background: rgba(255,255,255,.08); opacity: 0;
                    transition: opacity .18s ease;
                }
                .ab-btn:hover::before { opacity: 1; }
                .ab-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 32px rgba(15,31,61,.32); }
                .ab-btn:active { transform: scale(.98) !important; }
                .ab-arr { display: inline-block; transition: transform .2s ease; }
                .ab-btn:hover .ab-arr { transform: translateX(4px); }

                /* ── IMAGE ── */
                .ab-img-col {
                    position: relative;
                    max-width: 440px;
                    justify-self: center;
                    width: 100%;
                    opacity: 0; transform: translateX(28px);
                    transition: opacity .85s ease .3s, transform .85s cubic-bezier(.22,1,.36,1) .3s;
                }
                .ab-img-col.vis { opacity: 1; transform: translateX(0); }

                /* Offset gold shadow block */
                .ab-shadow-block {
                    position: absolute;
                    top: 20px; left: 20px; right: -20px; bottom: -20px;
                    background: rgba(184,136,42,.10);
                    border: 1px solid rgba(184,136,42,.14);
                    border-radius: 4px; z-index: 0;
                    transition: transform .4s ease;
                }
                .ab-img-col:hover .ab-shadow-block { transform: translate(5px, 5px); }

                /* Main card */
                .ab-card {
                    position: relative; z-index: 1;
                    border-radius: 4px; overflow: hidden;
                    box-shadow:
                        0 2px 4px rgba(0,0,0,.04),
                        0 16px 48px rgba(0,0,0,.11),
                        0 0 0 1px rgba(184,136,42,.13);
                    animation: abFloat 6s ease-in-out infinite;
                }
                @keyframes abFloat {
                    0%, 100% { transform: translateY(0px); }
                    50%       { transform: translateY(-9px); }
                }
                .ab-card img {
                    display: block; width: 100%; height: auto;
                    transition: transform .6s ease;
                }
                .ab-card:hover img { transform: scale(1.035); }

                /* Gold corner brackets */
                .ab-corner {
                    position: absolute; width: 20px; height: 20px; z-index: 3;
                    opacity: 0; transition: opacity .5s ease .95s;
                }
                .ab-img-col.vis .ab-corner { opacity: 1; }
                .ab-c-tl { top: -7px; left: -7px; border-top: 2px solid var(--gold); border-left: 2px solid var(--gold); }
                .ab-c-tr { top: -7px; right: -7px; border-top: 2px solid var(--gold); border-right: 2px solid var(--gold); }
                .ab-c-bl { bottom: -7px; left: -7px; border-bottom: 2px solid var(--gold); border-left: 2px solid var(--gold); }
                .ab-c-br { bottom: -7px; right: -7px; border-bottom: 2px solid var(--gold); border-right: 2px solid var(--gold); }

                /* Bottom badge */
                .ab-badge {
                    position: absolute; bottom: 16px; left: 16px; z-index: 4;
                    background: rgba(255,255,255,.93); backdrop-filter: blur(12px);
                    border: 1px solid rgba(184,136,42,.20); border-radius: 3px;
                    padding: 8px 14px;
                    display: flex; align-items: center; gap: 9px;
                    font-family: 'Courier New', monospace; font-size: 10px;
                    letter-spacing: .14em; text-transform: uppercase;
                    color: var(--navy); font-weight: 700;
                    box-shadow: 0 4px 16px rgba(0,0,0,.08);
                    opacity: 0; transform: translateY(10px);
                    transition: opacity .5s ease 1.15s, transform .5s cubic-bezier(.22,1,.36,1) 1.15s;
                }
                .ab-img-col.vis .ab-badge { opacity: 1; transform: translateY(0); }
                .ab-dot {
                    width: 7px; height: 7px; border-radius: 50%;
                    background: #22c55e; flex-shrink: 0;
                    animation: dotBlink 2s ease-in-out infinite;
                }
                @keyframes dotBlink { 0%,100%{opacity:1} 50%{opacity:.2} }

                /* Top-right stat chip */
                .ab-chip {
                    position: absolute; top: -18px; right: -18px; z-index: 4;
                    background: #fff;
                    border: 1px solid rgba(184,136,42,.18); border-radius: 3px;
                    padding: 10px 16px;
                    display: flex; flex-direction: column; align-items: center;
                    box-shadow: 0 8px 28px rgba(0,0,0,.10);
                    opacity: 0; transform: translateY(-8px);
                    transition: opacity .5s ease 1.05s, transform .5s cubic-bezier(.22,1,.36,1) 1.05s;
                }
                .ab-img-col.vis .ab-chip { opacity: 1; transform: translateY(0); }
                .ab-chip-val {
                    font-family: 'Georgia', serif;
                    font-size: 22px; font-weight: 700; color: var(--gold); line-height: 1;
                }
                .ab-chip-lbl {
                    font-family: 'Courier New', monospace;
                    font-size: 9px; letter-spacing: .14em;
                    text-transform: uppercase; color: var(--muted); margin-top: 4px;
                }

                @media (max-width: 860px) {
                    .ab-chip { top: auto; bottom: -18px; right: -10px; }
                }
                @media (max-width: 480px) {
                    .ab-shadow-block { display: none; }
                    .ab-chip { display: none; }
                }
            `}</style>

            <section className="ab-section" id="about" ref={sectionRef}>
                <div className="ab-container">
                    <div className="ab-grid">

                        {/* LEFT: Text */}
                        <div className="ab-text">
                            <span className={`ab-label${visible ? ' vis' : ''}`}>About Us</span>

                            <h2 className={`ab-heading${visible ? ' vis' : ''}`}>
                                Craftsmanship<br />
                                <em className={visible ? 'vis' : ''}>You Can See</em>
                            </h2>

                            <div className={`ab-divider${visible ? ' vis' : ''}`} />

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

                            <a href="#contact" className={`ab-btn${visible ? ' vis' : ''}`}>
                                Request a Quote <span className="ab-arr">→</span>
                            </a>
                        </div>

                        {/* RIGHT: Single image */}
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