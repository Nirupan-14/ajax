'use client';

import { useEffect, useRef, useState } from 'react';
import { PACKAGES, ADDONS } from '@/lib/constants';
import type { Package } from '@/lib/types';

/* ─── Pricing Card ───────────────────────────────────────────── */
function PricingCard({ pkg, index, visible }: { pkg: Package; index: number; visible: boolean }) {
    const isFeatured = pkg.color === 'featured';
    const isGold     = pkg.color === 'gold';
    const [hovered, setHovered] = useState(false);
    const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
    const ref = useRef<HTMLDivElement>(null);

    const onMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        ref.current.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        ref.current.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    };

    const onBtnClick = (e: React.MouseEvent) => {
        const btn = e.currentTarget as HTMLElement;
        const r = btn.getBoundingClientRect();
        const id = Date.now();
        setRipples(p => [...p, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
        setTimeout(() => setRipples(p => p.filter(rp => rp.id !== id)), 700);
    };

    const type = isFeatured ? 'feat' : isGold ? 'gold' : 'base';

    return (
        <div
            ref={ref}
            className={`pc pc--${type}${visible ? ' pc--vis' : ''}${hovered ? ' pc--hov' : ''}`}
            style={{ transitionDelay: (index * 0.1) + 's' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseMove={onMouseMove}
        >
            <div className="pc-cursor-glow" />
            <div className="pc-top-bar" />
            <span className="pc-idx">0{index + 1}</span>
            {pkg.badge && <div className="pc-badge">{pkg.badge}</div>}
            <div className="pc-name">{pkg.label}</div>

            <div className="pc-price-row">
                <span className="pc-from-top">Starting from</span>
                <div className="pc-price-num">
                    <span className="pc-currency">$</span>
                    <span className="pc-amount">{pkg.price}</span>
                </div>
            </div>

            <div className="pc-divider" />

            <ul className="pc-features">
                {pkg.features.map((f, i) => (
                    <li
                        key={f.text}
                        className={`pc-feat ${f.included ? 'pc-feat--yes' : 'pc-feat--no'}`}
                        style={{ transitionDelay: visible ? (index * 0.1 + i * 0.045) + 's' : '0s' }}
                    >
                        <span className="pc-check">{f.included ? '✓' : '×'}</span>
                        <span className="pc-feat-text">{f.text}</span>
                    </li>
                ))}
            </ul>

            <a href="#contact" className={`pc-btn pc-btn--${type}`} onClick={onBtnClick}>
                {ripples.map(rp => (
                    <span key={rp.id} className="pc-ripple" style={{ left: rp.x, top: rp.y }} />
                ))}
                Book {pkg.label}
                <span className="pc-btn-arr">→</span>
            </a>
        </div>
    );
}

/* ─── Main Section ───────────────────────────────────────────── */
export default function PricingSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold: 0.08 },
        );
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

    return (
        <>
            <style>{`
                .pr {
                    --gold:        #C9A96E;
                    --gold-dim:    rgba(201,169,110,.12);
                    --gold-border: rgba(201,169,110,.24);
                    --white:       #FFFFFF;
                    --off:         #EDE8DF;
                    --muted:       rgba(237,232,223,.52);
                    --feat-bg:     #161108;
                }

                /* Dark ladder step — #131311 */
                .pr {
                    position: relative;
                    padding: clamp(80px,11vw,130px) clamp(24px,6vw,80px);
                    background: #131311;
                    overflow: hidden;
                    font-family: 'Georgia', serif;
                }
                .pr::before {
                    content: '';
                    position: absolute; top:0; left:0; right:0; height:1px;
                    background: linear-gradient(to right, transparent, rgba(201,169,110,.45) 30%, rgba(201,169,110,.45) 70%, transparent);
                    z-index: 1;
                }
                .pr-glow {
                    position: absolute; left:50%; top:55%;
                    transform: translate(-50%,-50%);
                    width:700px; height:700px; border-radius:50%;
                    background: radial-gradient(circle, rgba(201,169,110,.05) 0%, transparent 65%);
                    pointer-events: none; z-index:0;
                    animation: prPulse 7s ease-in-out infinite;
                }
                @keyframes prPulse {
                    0%,100%{opacity:.5;transform:translate(-50%,-50%) scale(1)}
                    50%{opacity:1;transform:translate(-50%,-50%) scale(1.18)}
                }
                .pr-inner { position:relative; z-index:1; max-width:1200px; margin:0 auto; }

                /* ── Header ── */
                .pr-header { margin-bottom: clamp(48px,7vw,72px); }
                .pr-label {
                    display: inline-flex; align-items: center; gap:12px;
                    font-family: 'Courier New', monospace;
                    font-size:10px; font-weight:700; letter-spacing:.28em; text-transform:uppercase;
                    color:var(--gold); margin-bottom:14px;
                    opacity:0; transform:translateX(-16px);
                    transition: opacity .6s ease .1s, transform .6s cubic-bezier(.22,1,.36,1) .1s;
                }
                .pr-label.vis { opacity:1; transform:translateX(0); }
                .pr-label::before {
                    content:''; width:30px; height:1.5px;
                    background:var(--gold); border-radius:2px; flex-shrink:0;
                }
                .pr-title {
                    font-size: clamp(2rem,3.8vw,3.2rem);
                    font-weight:700; line-height:1.08; letter-spacing:-.024em;
                    color: var(--white);
                    margin:0 0 14px;
                    opacity:0; transform:translateY(20px);
                    transition: opacity .7s ease .22s, transform .7s cubic-bezier(.22,1,.36,1) .22s;
                }
                .pr-title.vis { opacity:1; transform:translateY(0); }
                .pr-title em { font-style:italic; color:var(--gold); }
                .pr-sub {
                    font-size: clamp(.9rem,1.2vw,.98rem); line-height:1.75;
                    color: rgba(237,232,223,.72);
                    max-width:480px;
                    opacity:0; transform:translateY(12px);
                    transition: opacity .6s ease .36s, transform .6s cubic-bezier(.22,1,.36,1) .36s;
                }
                .pr-sub.vis { opacity:1; transform:translateY(0); }

                /* ── Card grid ── */
                .pr-grid {
                    display:grid;
                    grid-template-columns: repeat(3,1fr);
                    gap:3px; align-items:start;
                }
                @media(max-width:900px){ .pr-grid{grid-template-columns:1fr;max-width:480px;margin:0 auto;} }

                /* ══ CARD ══ */
                .pc {
                    --mx:50%; --my:50%;
                    position:relative; overflow:hidden;
                    display:flex; flex-direction:column;
                    padding:36px 30px 30px;
                    border:1px solid rgba(255,255,255,.07);
                    background:rgba(255,255,255,.025);
                    border-radius:3px;
                    opacity:0; transform:translateY(32px);
                    transition: opacity .55s ease, transform .55s cubic-bezier(.22,1,.36,1),
                                border-color .25s, box-shadow .25s, background .25s;
                }
                .pc.pc--vis { opacity:1; transform:translateY(0); }
                .pc:hover {
                    border-color:var(--gold-border);
                    box-shadow:0 20px 60px rgba(0,0,0,.5), 0 0 0 1px rgba(201,169,110,.14);
                    transform:translateY(-4px) !important;
                }
                .pc--feat {
                    background:var(--feat-bg);
                    border-color:rgba(201,169,110,.38);
                    box-shadow:0 24px 64px rgba(0,0,0,.6), 0 0 0 1px rgba(201,169,110,.28);
                    transform:translateY(-8px) scale(1.018) !important; z-index:2;
                }
                .pc--feat.pc--vis { transform:translateY(-8px) scale(1.018) !important; }
                .pc--feat:hover   { transform:translateY(-13px) scale(1.018) !important; }
                .pc--gold { background:rgba(201,169,110,.04); border-color:rgba(201,169,110,.18); }

                .pc-cursor-glow {
                    position:absolute; inset:0; pointer-events:none; z-index:0;
                    background:radial-gradient(circle 150px at var(--mx) var(--my), rgba(201,169,110,.08), transparent);
                    opacity:0; transition:opacity .3s;
                }
                .pc--hov .pc-cursor-glow { opacity:1; }

                .pc-top-bar {
                    position:absolute; top:0; left:0; right:0; height:2px;
                    background:transparent; z-index:1; transition:background .25s;
                }
                .pc--feat .pc-top-bar {
                    background:linear-gradient(to right, transparent, var(--gold), transparent);
                    box-shadow:0 0 18px rgba(201,169,110,.5);
                }
                .pc--base:hover .pc-top-bar,
                .pc--gold:hover .pc-top-bar {
                    background:linear-gradient(to right, transparent, rgba(201,169,110,.5), transparent);
                }

                /* index */
                .pc-idx {
                    position:absolute; top:14px; right:18px; z-index:1;
                    font-family:'Courier New',monospace; font-size:9.5px; letter-spacing:.16em;
                    color:rgba(201,169,110,.2); transition:color .2s;
                }
                .pc--hov .pc-idx, .pc--feat .pc-idx { color:rgba(201,169,110,.55); }

                /* badge */
                .pc-badge {
                    display:inline-block; align-self:flex-start; z-index:1; position:relative;
                    font-family:'Courier New',monospace; font-size:9px; font-weight:700;
                    letter-spacing:.18em; text-transform:uppercase;
                    background:var(--gold); color:#0a0a0a;
                    padding:5px 11px; border-radius:2px; margin-bottom:16px;
                    box-shadow:0 4px 14px rgba(201,169,110,.35);
                }

                /* ★ Package name — full white, large, clear */
                .pc-name {
                    font-family:'Georgia',serif;
                    font-size:clamp(1.25rem,1.65vw,1.5rem);
                    font-weight:700; letter-spacing:-.015em; line-height:1.2;
                    color:var(--white);
                    margin-bottom:18px; position:relative; z-index:1; transition:color .2s;
                }
                .pc--hov .pc-name { color:var(--gold); }

                /* price */
                .pc-price-row { display:flex; flex-direction:column; gap:2px; margin-bottom:22px; position:relative; z-index:1; }
                .pc-from-top {
                    font-family:'Courier New',monospace;
                    font-size:9px; letter-spacing:.18em; text-transform:uppercase;
                    color:rgba(237,232,223,.48);
                }
                .pc-price-num { display:flex; align-items:baseline; gap:3px; }
                .pc-currency {
                    font-family:'Courier New',monospace; font-size:18px; font-weight:700;
                    color:var(--gold); align-self:flex-start; margin-top:6px;
                }
                /* ★ Price amount — bright white, always readable */
                .pc-amount {
                    font-family:'Georgia',serif;
                    font-size:clamp(44px,5vw,58px);
                    font-weight:700; line-height:1; letter-spacing:-.03em;
                    color:var(--white);
                    text-shadow:0 0 28px rgba(201,169,110,.12);
                }
                .pc--feat .pc-amount { color:var(--gold); text-shadow:0 0 28px rgba(201,169,110,.4); }

                /* divider */
                .pc-divider {
                    height:1px; margin-bottom:22px;
                    background:linear-gradient(to right, var(--gold-border), transparent);
                    position:relative; z-index:1;
                    transform:scaleX(0); transform-origin:left;
                    transition:transform .65s cubic-bezier(.22,1,.36,1) .3s;
                }
                .pc.pc--vis .pc-divider { transform:scaleX(1); }

                /* ★ Features — clear contrast text */
                .pc-features {
                    list-style:none; margin:0 0 28px; padding:0;
                    display:flex; flex-direction:column; gap:11px;
                    flex:1; position:relative; z-index:1;
                }
                .pc-feat {
                    display:flex; align-items:flex-start; gap:10px;
                    opacity:0; transform:translateX(-8px);
                    transition:opacity .4s ease, transform .4s cubic-bezier(.22,1,.36,1);
                }
                .pc.pc--vis .pc-feat { opacity:1; transform:translateX(0); }

                /* included — near-white, clearly visible */
                .pc-feat--yes .pc-feat-text {
                    font-family:'Georgia',serif; font-size:13.5px; line-height:1.5;
                    color:rgba(237,232,223,.92);
                }
                /* excluded — dim + strikethrough so users can tell the difference */
                .pc-feat--no .pc-feat-text {
                    font-family:'Georgia',serif; font-size:13.5px; line-height:1.5;
                    color:rgba(237,232,223,.32);
                    text-decoration:line-through;
                    text-decoration-color:rgba(237,232,223,.18);
                }

                .pc-check {
                    font-size:10px; font-weight:700; flex-shrink:0;
                    width:18px; height:18px; border-radius:50%;
                    display:flex; align-items:center; justify-content:center; margin-top:1px;
                }
                .pc-feat--yes .pc-check { color:var(--gold); background:var(--gold-dim); border:1px solid rgba(201,169,110,.28); }
                .pc-feat--no  .pc-check { color:rgba(237,232,223,.2); background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); }

                /* ── CTA ── */
                .pc-btn {
                    position:relative; overflow:hidden;
                    display:flex; align-items:center; justify-content:center; gap:9px;
                    padding:14px 20px; border-radius:3px;
                    font-family:'Courier New',monospace; font-size:11px; font-weight:800;
                    letter-spacing:.16em; text-transform:uppercase; text-decoration:none; z-index:1;
                    transition:transform .22s, box-shadow .22s, background .22s, border-color .22s;
                }
                .pc-btn:hover { transform:translateY(-2px); }
                .pc-btn:active { transform:scale(.97); }
                .pc-btn-arr { transition:transform .2s; }
                .pc-btn:hover .pc-btn-arr { transform:translateX(4px); }
                .pc-btn::before {
                    content:''; position:absolute; top:0; left:-72px; width:52px; height:100%;
                    background:linear-gradient(105deg,transparent,rgba(255,255,255,.28),transparent);
                    transition:left .42s; pointer-events:none;
                }
                .pc-btn:hover::before { left:120%; }

                .pc-btn--feat { background:var(--gold); color:#0a0a0a; box-shadow:0 4px 20px rgba(201,169,110,.35); font-weight:900; }
                .pc-btn--feat:hover { box-shadow:0 8px 32px rgba(201,169,110,.55); }
                .pc-btn--gold { background:rgba(201,169,110,.12); color:var(--gold); border:1px solid rgba(201,169,110,.32); }
                .pc-btn--gold:hover { background:rgba(201,169,110,.22); border-color:var(--gold); }
                /* ★ Ghost button — white text, always readable */
                .pc-btn--base { background:transparent; color:var(--white); border:1px solid rgba(255,255,255,.18); }
                .pc-btn--base:hover { border-color:rgba(201,169,110,.45); background:rgba(201,169,110,.07); }

                .pc-ripple {
                    position:absolute; transform:translate(-50%,-50%);
                    width:0; height:0; border-radius:50%;
                    background:rgba(255,255,255,.18);
                    animation:pcRipple .65s ease-out forwards; pointer-events:none;
                }
                @keyframes pcRipple { to{width:300px;height:300px;opacity:0;} }

                /* ── Add-ons ── */
                .pr-addons {
                    margin-top:44px; padding:22px 28px;
                    border:1px solid var(--gold-border); border-radius:3px;
                    background:rgba(201,169,110,.04);
                    display:flex; flex-wrap:wrap; align-items:center; gap:12px;
                    opacity:0; transform:translateY(12px);
                    transition:opacity .6s ease .75s, transform .6s cubic-bezier(.22,1,.36,1) .75s;
                }
                .pr-addons.vis { opacity:1; transform:translateY(0); }
                .pr-addons-lbl {
                    font-family:'Courier New',monospace; font-size:9.5px; font-weight:700;
                    letter-spacing:.22em; text-transform:uppercase; color:var(--gold); flex-shrink:0;
                }
                /* ★ Addon pills — white text, clearly labeled */
                .pr-addon {
                    display:flex; align-items:center; gap:7px; padding:6px 13px;
                    background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.09);
                    border-radius:2px;
                    font-family:'Courier New',monospace; font-size:10.5px; letter-spacing:.1em;
                    color:rgba(237,232,223,.78);
                    cursor:default; transition:border-color .2s, background .2s, color .2s;
                }
                .pr-addon:hover { border-color:var(--gold-border); color:var(--white); background:var(--gold-dim); }
                .pr-addon-price { font-weight:700; color:var(--gold); }
                .pr-addons-note {
                    margin-left:auto;
                    font-family:'Courier New',monospace; font-size:9px; letter-spacing:.16em;
                    text-transform:uppercase; color:rgba(237,232,223,.35);
                }
                @media(max-width:600px){ .pr-addons-note{display:none;} }
            `}</style>

            <section className="pr" id="pricing" ref={sectionRef}>
                <div className="pr-glow" />
                <div className="pr-inner">

                    <div className="pr-header">
                        <p className={`pr-label${visible ? ' vis' : ''}`}>Packages</p>
                        <h2 className={`pr-title${visible ? ' vis' : ''}`}>
                            Transparent <em>Pricing.</em><br />Premium Results.
                        </h2>
                        <p className={`pr-sub${visible ? ' vis' : ''}`}>
                            Every package tailored to your vehicle. Prices vary by size and condition — always quoted upfront, no surprises.
                        </p>
                    </div>

                    <div className="pr-grid">
                        {PACKAGES.map((pkg, i) => (
                            <PricingCard key={pkg.id} pkg={pkg} index={i} visible={visible} />
                        ))}
                    </div>

                    <div className={`pr-addons${visible ? ' vis' : ''}`}>
                        <span className="pr-addons-lbl">Add-ons</span>
                        {ADDONS.map(a => (
                            <div className="pr-addon" key={a.name}>
                                {a.name}
                                <span className="pr-addon-price">${a.price}</span>
                            </div>
                        ))}
                        <span className="pr-addons-note">Prices vary by vehicle size</span>
                    </div>

                </div>
            </section>
        </>
    );
}