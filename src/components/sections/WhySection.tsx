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

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.12 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <style>{`
                .wy-section {
                    position: relative;
                    padding: clamp(80px, 11vw, 130px) 0;
                    background: #f8f7f4;
                    overflow: hidden;
                    --gold: #b8882a;
                    --gold-light: rgba(184,136,42,.08);
                    --navy: #0f1f3d;
                    --muted: #6b7280;
                    --border: rgba(184,136,42,.16);
                }

                /* Background geometric accents */
                .wy-section::before {
                    content: '';
                    position: absolute; inset: 0; pointer-events: none;
                    background:
                        radial-gradient(ellipse 50% 70% at 0% 50%, rgba(15,31,61,.04) 0%, transparent 60%),
                        radial-gradient(ellipse 40% 50% at 100% 20%, rgba(184,136,42,.05) 0%, transparent 55%);
                }
                /* Large faint number watermark */
                .wy-watermark {
                    position: absolute; right: -2%; top: 50%;
                    transform: translateY(-50%);
                    font-family: 'Georgia', serif;
                    font-size: clamp(180px, 22vw, 280px);
                    font-weight: 700; line-height: 1;
                    color: rgba(15,31,61,.04);
                    letter-spacing: -.05em;
                    pointer-events: none; user-select: none;
                    z-index: 0;
                }

                .wy-container {
                    position: relative; z-index: 1;
                    max-width: 1160px;
                    margin: 0 auto;
                    padding: 0 clamp(24px, 6vw, 80px);
                }

                /* Header */
                .wy-header {
                    display: flex; align-items: flex-end;
                    justify-content: space-between;
                    gap: 32px; margin-bottom: clamp(48px, 7vw, 72px);
                    flex-wrap: wrap;
                }

                .wy-label {
                    display: inline-flex; align-items: center; gap: 11px;
                    font-family: 'Courier New', monospace;
                    font-size: 11px; font-weight: 700;
                    letter-spacing: .26em; text-transform: uppercase;
                    color: var(--gold); margin-bottom: 16px;
                    opacity: 0; transform: translateX(-16px);
                    transition: opacity .6s ease .1s, transform .6s cubic-bezier(.22,1,.36,1) .1s;
                }
                .wy-label.vis { opacity: 1; transform: translateX(0); }
                .wy-label::before {
                    content: ''; width: 30px; height: 2px;
                    background: var(--gold); border-radius: 1px; flex-shrink: 0;
                }

                .wy-title {
                    font-family: 'Georgia', 'Times New Roman', serif;
                    font-size: clamp(2rem, 3.8vw, 3.2rem);
                    font-weight: 700; line-height: 1.1;
                    letter-spacing: -.024em; color: var(--navy); margin: 0;
                    opacity: 0; transform: translateY(20px);
                    transition: opacity .7s ease .22s, transform .7s cubic-bezier(.22,1,.36,1) .22s;
                }
                .wy-title.vis { opacity: 1; transform: translateY(0); }
                .wy-title em { font-style: italic; color: var(--gold); }

                .wy-rule {
                    width: 0; height: 1px; flex-shrink: 0; align-self: center;
                    background: var(--border);
                    transition: width 1s cubic-bezier(.22,1,.36,1) .5s;
                    display: none;
                }
                @media (min-width: 700px) { .wy-rule { display: block; flex: 1; max-width: 200px; } }
                .wy-rule.vis { width: 100%; }

                .wy-sub {
                    font-family: 'Georgia', serif; font-size: .92rem;
                    line-height: 1.7; color: var(--muted); max-width: 240px;
                    opacity: 0; transform: translateY(12px);
                    transition: opacity .6s ease .4s, transform .6s cubic-bezier(.22,1,.36,1) .4s;
                    flex-shrink: 0;
                }
                .wy-sub.vis { opacity: 1; transform: translateY(0); }

                /* Grid */
                .wy-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 0;
                    border: 1px solid var(--border);
                    border-radius: 4px;
                    overflow: hidden;
                    box-shadow: 0 8px 48px rgba(0,0,0,.07), 0 1px 3px rgba(0,0,0,.04);
                }
                @media (max-width: 900px) {
                    .wy-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 520px) {
                    .wy-grid { grid-template-columns: 1fr; }
                }

                /* Cell */
                .wy-cell {
                    position: relative;
                    padding: clamp(28px, 4vw, 44px) clamp(22px, 3vw, 36px);
                    background: #fff;
                    border-right: 1px solid var(--border);
                    border-bottom: 1px solid var(--border);
                    overflow: hidden;
                    cursor: default;
                    opacity: 0; transform: translateY(28px);
                    transition:
                        opacity .6s ease, transform .6s cubic-bezier(.22,1,.36,1),
                        background .3s ease, box-shadow .3s ease;
                }
                .wy-cell:last-child { border-right: none; }
                @media (max-width: 900px) {
                    .wy-cell:nth-child(2n) { border-right: none; }
                    .wy-cell:nth-child(3),
                    .wy-cell:nth-child(4) { border-bottom: none; }
                }
                @media (max-width: 520px) {
                    .wy-cell { border-right: none; }
                    .wy-cell:last-child { border-bottom: none; }
                }
                .wy-cell.vis { opacity: 1; transform: translateY(0); }
                .wy-cell:nth-child(1) { transition-delay: .15s; }
                .wy-cell:nth-child(2) { transition-delay: .25s; }
                .wy-cell:nth-child(3) { transition-delay: .35s; }
                .wy-cell:nth-child(4) { transition-delay: .45s; }

                /* Gold bottom bar reveal on hover */
                .wy-cell::after {
                    content: ''; position: absolute; bottom: 0; left: 0;
                    width: 0; height: 3px;
                    background: linear-gradient(to right, var(--gold), rgba(184,136,42,.3));
                    transition: width .35s cubic-bezier(.22,1,.36,1);
                }
                .wy-cell:hover::after { width: 100%; }
                .wy-cell:hover {
                    background: rgba(255,253,248,1);
                    box-shadow: inset 0 0 0 1px rgba(184,136,42,.12), 0 8px 32px rgba(0,0,0,.06);
                }

                /* Subtle background circle on hover */
                .wy-cell-bg {
                    position: absolute; top: -40px; right: -40px;
                    width: 140px; height: 140px; border-radius: 50%;
                    background: radial-gradient(circle, rgba(184,136,42,.07) 0%, transparent 70%);
                    opacity: 0; transition: opacity .4s ease, transform .4s ease;
                    transform: scale(.6);
                }
                .wy-cell:hover .wy-cell-bg { opacity: 1; transform: scale(1); }

                /* Number */
                .wy-num {
                    font-family: 'Courier New', monospace;
                    font-size: 10px; font-weight: 700;
                    letter-spacing: .22em; color: var(--gold);
                    margin-bottom: 20px;
                    display: flex; align-items: center; gap: 10px;
                }
                .wy-num::after {
                    content: ''; flex: 1; height: 1px;
                    background: linear-gradient(to right, var(--border), transparent);
                }

                /* Icon */
                .wy-icon {
                    font-size: 22px; color: var(--gold);
                    margin-bottom: 14px; display: block; line-height: 1;
                    transition: transform .3s ease;
                }
                .wy-cell:hover .wy-icon { transform: scale(1.15) rotate(8deg); }

                /* Title */
                .wy-cell-title {
                    font-family: 'Georgia', 'Times New Roman', serif;
                    font-size: clamp(1.05rem, 1.5vw, 1.2rem);
                    font-weight: 700; line-height: 1.2;
                    color: var(--navy); margin: 0 0 12px;
                    letter-spacing: -.01em;
                    transition: color .2s ease;
                }
                .wy-cell:hover .wy-cell-title { color: #0a1828; }

                /* Body */
                .wy-cell-body {
                    font-family: 'Georgia', serif;
                    font-size: clamp(.85rem, 1.1vw, .93rem);
                    line-height: 1.75; color: var(--muted);
                    margin: 0;
                }
            `}</style>

            <section className="wy-section" id="why" ref={sectionRef}>
                <div className="wy-watermark">WHY</div>

                <div className="wy-container">

                    {/* Header row */}
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
                        {cells.map((c, i) => (
                            <div className={`wy-cell${visible ? ' vis' : ''}`} key={c.num}>
                                <div className="wy-cell-bg" />
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