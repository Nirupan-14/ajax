'use client';
import { useEffect, useRef, useState } from 'react';

const cells = [
    {
        num: '01',
        title: 'Quality Service',
        icon: '✦',
        body: 'Expert Detailers — Newton, Raku & Nicholas — certified and trained to deliver exceptional results on every vehicle.',
    },
    {
        num: '02',
        title: 'Convenience',
        icon: '◎',
        body: 'Mobile Service available across Ajax and the GTA. We come to your home, office, or wherever suits you best.',
    },
    {
        num: '03',
        title: 'Luxury Care',
        icon: '◈',
        body: 'Premium Products and meticulous attention to detail. Every vehicle treated with the same high standard of care.',
    },
    {
        num: '04',
        title: 'Customer Satisfaction',
        icon: '★',
        body: 'Exceptional Results backed by 193 five-star Google reviews and transparent, honest pricing every time.',
    },
];

export default function WhySection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [hovered, setHovered] = useState<string | null>(null);

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
                .wy {
                    --gold:        #C9A96E;
                    --gold-dim:    rgba(201,169,110,.10);
                    --gold-border: rgba(201,169,110,.18);
                    --white:       #FFFFFF;
                    --off:         #E8E2D9;
                    --muted:       rgba(232,226,217,.52);
                    --cell-bg:     rgba(255,255,255,.025);
                    --cell-hover:  rgba(255,255,255,.048);
                }

                /* ── Section
                   Dark ladder so far:
                     Hero     #080808  (deepest)
                     Services #111210
                     About    #0C0C0B
                     Why      #161614  ← new step — slightly lighter warm charcoal
                   + same gold top-border divider for section language consistency
                ── */
                .wy {
                    position: relative;
                    padding: clamp(80px,11vw,130px) clamp(24px,6vw,80px);
                    background: #161614;
                    overflow: hidden;
                    font-family: 'Georgia', serif;
                }

                /* gold top divider — consistent with services + about */
                .wy::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(
                        to right,
                        transparent 0%,
                        rgba(201,169,110,.45) 30%,
                        rgba(201,169,110,.45) 70%,
                        transparent 100%
                    );
                    z-index: 1;
                }

                /* faint radial glow — left side */
                .wy-glow {
                    position: absolute; left: -5%; top: 50%;
                    transform: translateY(-50%);
                    width: 45%; height: 80%;
                    background: radial-gradient(ellipse 70% 55% at 20% 50%, rgba(201,169,110,.045) 0%, transparent 70%);
                    pointer-events: none; z-index: 0;
                }

                /* large watermark — now gold stroke on dark */
                .wy-watermark {
                    position: absolute; right: -1%; top: 50%;
                    transform: translateY(-50%);
                    font-family: 'Georgia', serif;
                    font-size: clamp(160px,20vw,260px);
                    font-weight: 700; line-height: 1;
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(201,169,110,.05);
                    letter-spacing: -.05em;
                    pointer-events: none; user-select: none; z-index: 0;
                }

                .wy-inner {
                    position: relative; z-index: 1;
                    max-width: 1160px; margin: 0 auto;
                }

                /* ── Header ── */
                .wy-header {
                    display: flex; align-items: flex-end;
                    justify-content: space-between;
                    gap: 32px; margin-bottom: clamp(48px,7vw,72px);
                    flex-wrap: wrap;
                }

                .wy-label {
                    display: inline-flex; align-items: center; gap: 12px;
                    font-family: 'Courier New', monospace;
                    font-size: 10px; font-weight: 700;
                    letter-spacing: .28em; text-transform: uppercase;
                    color: var(--gold); margin-bottom: 16px;
                    opacity: 0; transform: translateX(-16px);
                    transition: opacity .6s ease .1s, transform .6s cubic-bezier(.22,1,.36,1) .1s;
                }
                .wy-label.vis { opacity: 1; transform: translateX(0); }
                .wy-label::before {
                    content: ''; width: 30px; height: 1.5px;
                    background: var(--gold); border-radius: 2px; flex-shrink: 0;
                }

                .wy-title {
                    font-family: 'Georgia', serif;
                    font-size: clamp(2rem,3.8vw,3.2rem);
                    font-weight: 700; line-height: 1.08; letter-spacing: -.024em;
                    color: var(--white); margin: 0;
                    opacity: 0; transform: translateY(20px);
                    transition: opacity .7s ease .22s, transform .7s cubic-bezier(.22,1,.36,1) .22s;
                }
                .wy-title.vis { opacity: 1; transform: translateY(0); }
                .wy-title em { font-style: italic; color: var(--gold); }

                /* horizontal rule between heading and sub */
                .wy-rule {
                    flex: 1; max-width: 180px; height: 1px;
                    background: var(--gold-border); align-self: center;
                    width: 0;
                    transition: width 1s cubic-bezier(.22,1,.36,1) .5s;
                    display: none;
                }
                @media(min-width:700px) { .wy-rule { display: block; } }
                .wy-rule.vis { width: 100%; }

                .wy-sub {
                    font-family: 'Georgia', serif;
                    font-size: .92rem; line-height: 1.72;
                    color: var(--muted); max-width: 240px;
                    opacity: 0; transform: translateY(12px);
                    transition: opacity .6s ease .4s, transform .6s cubic-bezier(.22,1,.36,1) .4s;
                    flex-shrink: 0;
                }
                .wy-sub.vis { opacity: 1; transform: translateY(0); }

                /* ── Grid ── */
                .wy-grid {
                    display: grid;
                    grid-template-columns: repeat(4,1fr);
                    gap: 0;
                    border: 1px solid var(--gold-border);
                    border-radius: 4px;
                    overflow: hidden;
                }
                @media(max-width:900px) { .wy-grid { grid-template-columns: repeat(2,1fr); } }
                @media(max-width:520px)  { .wy-grid { grid-template-columns: 1fr; } }

                /* ── Cell ── */
                .wy-cell {
                    position: relative;
                    padding: clamp(28px,4vw,44px) clamp(22px,3vw,36px);
                    background: var(--cell-bg);
                    border-right: 1px solid var(--gold-border);
                    border-bottom: 1px solid var(--gold-border);
                    overflow: hidden; cursor: default;
                    opacity: 0; transform: translateY(28px);
                    transition:
                        opacity .55s ease,
                        transform .55s cubic-bezier(.22,1,.36,1),
                        background .25s ease,
                        box-shadow .25s ease;
                }
                /* remove redundant borders */
                .wy-cell:last-child,
                .wy-cell:nth-child(4) { border-right: none; }
                @media(max-width:900px) {
                    .wy-cell:nth-child(2n) { border-right: none; }
                    .wy-cell:nth-child(3),
                    .wy-cell:nth-child(4) { border-bottom: none; }
                }
                @media(max-width:520px) {
                    .wy-cell { border-right: none; }
                    .wy-cell:last-child { border-bottom: none; }
                }

                .wy-cell.vis { opacity: 1; transform: translateY(0); }
                .wy-cell:nth-child(1) { transition-delay: .14s; }
                .wy-cell:nth-child(2) { transition-delay: .24s; }
                .wy-cell:nth-child(3) { transition-delay: .34s; }
                .wy-cell:nth-child(4) { transition-delay: .44s; }

                .wy-cell:hover {
                    background: var(--cell-hover);
                    box-shadow: inset 0 0 0 1px rgba(201,169,110,.2);
                }

                /* gold bottom bar */
                .wy-cell::after {
                    content: ''; position: absolute; bottom: 0; left: 0;
                    width: 0; height: 2px;
                    background: linear-gradient(to right, var(--gold), rgba(201,169,110,.25));
                    transition: width .35s cubic-bezier(.22,1,.36,1);
                }
                .wy-cell:hover::after { width: 100%; }

                /* radial glow in corner */
                .wy-cell-glow {
                    position: absolute; top: -50px; right: -50px;
                    width: 160px; height: 160px; border-radius: 50%;
                    background: radial-gradient(circle, rgba(201,169,110,.08) 0%, transparent 65%);
                    opacity: 0; transform: scale(.5);
                    transition: opacity .35s ease, transform .35s ease;
                    pointer-events: none;
                }
                .wy-cell:hover .wy-cell-glow { opacity: 1; transform: scale(1); }

                /* Number */
                .wy-num {
                    font-family: 'Courier New', monospace;
                    font-size: 10px; font-weight: 700;
                    letter-spacing: .22em; color: var(--gold);
                    margin-bottom: 22px;
                    display: flex; align-items: center; gap: 10px;
                }
                .wy-num::after {
                    content: ''; flex: 1; height: 1px;
                    background: linear-gradient(to right, var(--gold-border), transparent);
                }

                /* Icon */
                .wy-icon {
                    font-size: 22px; color: var(--gold);
                    margin-bottom: 14px; display: block; line-height: 1;
                    transition: transform .3s cubic-bezier(.22,1,.36,1);
                    text-shadow: 0 0 14px rgba(201,169,110,.4);
                }
                .wy-cell:hover .wy-icon { transform: scale(1.18) rotate(8deg); }

                /* Title — always bright white */
                .wy-cell-title {
                    font-family: 'Georgia', serif;
                    font-size: clamp(1.05rem,1.5vw,1.18rem);
                    font-weight: 700; line-height: 1.2;
                    color: var(--white);
                    margin: 0 0 12px; letter-spacing: -.01em;
                    transition: color .2s ease;
                }
                .wy-cell:hover .wy-cell-title { color: var(--gold); }

                /* Body — readable soft cream */
                .wy-cell-body {
                    font-family: 'Georgia', serif;
                    font-size: clamp(.86rem,1.1vw,.94rem);
                    line-height: 1.78;
                    color: rgba(232,226,217,.60);
                    margin: 0;
                    transition: color .2s ease;
                }
                .wy-cell:hover .wy-cell-body { color: rgba(232,226,217,.80); }

                /* ── Active indicator dot top-right ── */
                .wy-dot {
                    position: absolute; top: 16px; right: 18px;
                    width: 6px; height: 6px; border-radius: 50%;
                    background: var(--gold);
                    opacity: 0; transform: scale(0);
                    transition: opacity .2s ease, transform .2s cubic-bezier(.22,1,.36,1);
                    box-shadow: 0 0 8px rgba(201,169,110,.6);
                }
                .wy-cell:hover .wy-dot { opacity: 1; transform: scale(1); }
            `}</style>

            <section className="wy" id="why" ref={sectionRef}>
                <div className="wy-glow" />
                <div className="wy-watermark">WHY</div>

                <div className="wy-inner">
                    {/* Header */}
                    <div className="wy-header">
                        <div>
                            <div className={`wy-label${visible ? ' vis' : ''}`}>Why Choose Us</div>
                            <h2 className={`wy-title${visible ? ' vis' : ''}`}>
                                The <em>Flawless</em><br />Difference
                            </h2>
                        </div>
                        <div className={`wy-rule${visible ? ' vis' : ''}`} />
                        <p className={`wy-sub${visible ? ' vis' : ''}`}>
                            Four reasons Ajax and the GTA trust Flawless Finish for every detail.
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="wy-grid">
                        {cells.map((c) => (
                            <div
                                key={c.num}
                                className={`wy-cell${visible ? ' vis' : ''}${hovered === c.num ? ' wy-hovered' : ''}`}
                                onMouseEnter={() => setHovered(c.num)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                <div className="wy-cell-glow" />
                                <div className="wy-dot" />
                                <div className="wy-num">{c.num}</div>
                                <span className="wy-icon">{c.icon}</span>
                                <h3 className="wy-cell-title">{c.title}</h3>
                                <p className="wy-cell-body">{c.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}