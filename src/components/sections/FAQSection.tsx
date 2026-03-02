'use client';

import { useState, useRef, useEffect } from 'react';
import { FAQS } from '@/lib/constants';

/* ── Accordion item with animated height ── */
function FaqItem({
    faq,
    index,
    isOpen,
    onToggle,
    visible,
}: {
    faq: { q: string; a: string };
    index: number;
    isOpen: boolean;
    onToggle: () => void;
    visible: boolean;
}) {
    const bodyRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (bodyRef.current) {
            setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
        }
    }, [isOpen]);

    return (
        <div
            className={`fq-item${isOpen ? ' fq-open' : ''}${visible ? ' fq-vis' : ''}`}
            style={{ transitionDelay: visible ? `${0.1 + index * 0.07}s` : '0s' }}
        >
            <button
                className="fq-toggle"
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                {/* number */}
                <span className="fq-num">{String(index + 1).padStart(2, '0')}</span>
                {/* question */}
                <span className="fq-q">{faq.q}</span>
                {/* icon */}
                <span className="fq-icon" aria-hidden>
                    <span className="fq-icon-h" />
                    <span className="fq-icon-v" />
                </span>
            </button>

            {/* animated body */}
            <div
                className="fq-body"
                style={{ height, overflow: 'hidden', transition: 'height .38s cubic-bezier(.22,1,.36,1)' }}
            >
                <div ref={bodyRef} className="fq-body-inner">
                    <p className="fq-a">{faq.a}</p>
                </div>
            </div>
        </div>
    );
}

/* ── Section ── */
export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [visible,   setVisible]   = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold: 0.1 },
        );
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

    const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

    return (
        <>
            <style>{`
                /* ── Tokens ── */
                .fq-wrap {
                    --gold:        #C9A96E;
                    --gold-dim:    rgba(201,169,110,.10);
                    --gold-border: rgba(201,169,110,.20);
                    --white:       #FFFFFF;
                    --muted:       rgba(237,232,223,.62);
                }

                /* ── Section
                   Dark ladder:
                     ...
                     Reviews  #181715
                     FAQ      #0F0F0D  ← deep warm step, distinct from Reviews
                ── */
                .fq-wrap {
                    position: relative;
                    padding: clamp(80px,11vw,130px) clamp(24px,6vw,80px);
                    background: #0F0F0D;
                    overflow: hidden;
                    font-family: 'Georgia', serif;
                }
                .fq-wrap::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(to right, transparent, rgba(201,169,110,.45) 30%, rgba(201,169,110,.45) 70%, transparent);
                    z-index: 1;
                }

                /* ambient glow — left column side */
                .fq-glow {
                    position: absolute; left: -5%; top: 50%; transform: translateY(-50%);
                    width: 42%; height: 70%;
                    background: radial-gradient(ellipse 65% 55% at 15% 50%, rgba(201,169,110,.04) 0%, transparent 70%);
                    pointer-events: none; z-index: 0;
                }

                /* faint large "?" watermark */
                .fq-wm {
                    position: absolute; right: 2%; top: 50%; transform: translateY(-50%);
                    font-family: 'Georgia', serif;
                    font-size: clamp(200px,28vw,360px); font-weight: 700; line-height: 1;
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(201,169,110,.04);
                    pointer-events: none; user-select: none; z-index: 0;
                }

                .fq-inner {
                    position: relative; z-index: 1;
                    max-width: 1160px; margin: 0 auto;
                }

                /* ── Two-column grid ── */
                .fq-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.55fr;
                    gap: clamp(48px,7vw,96px);
                    align-items: start;
                }
                @media(max-width:860px) { .fq-grid { grid-template-columns: 1fr; } }

                /* ══ LEFT COLUMN ══ */
                .fq-left { display: flex; flex-direction: column; position: sticky; top: 100px; }

                .fq-label {
                    display: inline-flex; align-items: center; gap: 12px;
                    font-family: 'Courier New', monospace;
                    font-size: 10px; font-weight: 700;
                    letter-spacing: .28em; text-transform: uppercase;
                    color: var(--gold); margin-bottom: 16px;
                    opacity: 0; transform: translateX(-16px);
                    transition: opacity .6s ease .1s, transform .6s cubic-bezier(.22,1,.36,1) .1s;
                }
                .fq-label.vis { opacity: 1; transform: translateX(0); }
                .fq-label::before {
                    content: ''; width: 30px; height: 1.5px;
                    background: var(--gold); border-radius: 2px; flex-shrink: 0;
                }

                /* ★ Heading — full white */
                .fq-heading {
                    font-family: 'Georgia', serif;
                    font-size: clamp(2rem,3.8vw,3.2rem);
                    font-weight: 700; line-height: 1.08; letter-spacing: -.024em;
                    color: var(--white); margin: 0 0 20px;
                    opacity: 0; transform: translateY(20px);
                    transition: opacity .7s ease .22s, transform .7s cubic-bezier(.22,1,.36,1) .22s;
                }
                .fq-heading.vis { opacity: 1; transform: translateY(0); }
                .fq-heading em { font-style: italic; color: var(--gold); }

                /* gold rule */
                .fq-rule {
                    width: 0; height: 1.5px; margin-bottom: 24px;
                    background: linear-gradient(to right, var(--gold), rgba(201,169,110,.1));
                    border-radius: 2px;
                    transition: width .8s cubic-bezier(.22,1,.36,1) .42s;
                }
                .fq-rule.vis { width: 52px; }

                /* ★ Sub text — clearly readable */
                .fq-sub {
                    font-family: 'Georgia', serif;
                    font-size: clamp(.9rem,1.15vw,.97rem); line-height: 1.78;
                    color: rgba(237,232,223,.70);
                    margin-bottom: 32px;
                    opacity: 0; transform: translateY(12px);
                    transition: opacity .6s ease .38s, transform .6s cubic-bezier(.22,1,.36,1) .38s;
                }
                .fq-sub.vis { opacity: 1; transform: translateY(0); }

                /* CTA */
                .fq-cta {
                    position: relative; overflow: hidden;
                    display: inline-flex; align-items: center; gap: 9px;
                    align-self: flex-start;
                    padding: 13px 28px; border-radius: 3px;
                    font-family: 'Courier New', monospace;
                    font-size: 11px; font-weight: 800; letter-spacing: .16em;
                    text-transform: uppercase; text-decoration: none;
                    background: var(--gold); color: #0a0a0a;
                    box-shadow: 0 4px 20px rgba(201,169,110,.28);
                    opacity: 0; transform: translateY(12px);
                    transition: opacity .6s ease .52s, transform .6s cubic-bezier(.22,1,.36,1) .52s,
                                box-shadow .22s, translateY .22s;
                }
                .fq-cta.vis { opacity: 1; transform: translateY(0); }
                .fq-cta:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 32px rgba(201,169,110,.5); }
                .fq-cta:active { transform: scale(.97) !important; }
                .fq-cta::before {
                    content: ''; position: absolute; top: 0; left: -72px; width: 52px; height: 100%;
                    background: linear-gradient(105deg, transparent, rgba(255,255,255,.32), transparent);
                    transition: left .42s; pointer-events: none;
                }
                .fq-cta:hover::before { left: 120%; }
                .fq-cta-arr { transition: transform .2s; }
                .fq-cta:hover .fq-cta-arr { transform: translateX(4px); }

                /* faq count pill */
                .fq-count {
                    display: inline-flex; align-items: center; gap: 7px;
                    margin-top: 20px;
                    font-family: 'Courier New', monospace;
                    font-size: 9.5px; letter-spacing: .16em; text-transform: uppercase;
                    color: rgba(237,232,223,.38);
                    opacity: 0; transition: opacity .5s ease .7s;
                }
                .fq-count.vis { opacity: 1; }
                .fq-count em { font-style: normal; color: var(--gold); }

                /* ══ RIGHT COLUMN — accordion ══ */
                .fq-accordion {
                    display: flex; flex-direction: column;
                    border: 1px solid var(--gold-border);
                    border-radius: 4px; overflow: hidden;
                }

                /* ── FAQ item ── */
                .fq-item {
                    border-bottom: 1px solid var(--gold-border);
                    background: rgba(255,255,255,.022);
                    opacity: 0; transform: translateX(20px);
                    transition:
                        opacity .5s ease,
                        transform .5s cubic-bezier(.22,1,.36,1),
                        background .22s ease;
                }
                .fq-item:last-child { border-bottom: none; }
                .fq-item.fq-vis { opacity: 1; transform: translateX(0); }
                .fq-item.fq-open { background: rgba(201,169,110,.05); }
                .fq-item:hover:not(.fq-open) { background: rgba(255,255,255,.038); }

                /* toggle button */
                .fq-toggle {
                    width: 100%; display: flex; align-items: center; gap: 16px;
                    padding: 22px 24px;
                    background: none; border: none; cursor: pointer; text-align: left;
                }

                /* number */
                .fq-num {
                    font-family: 'Courier New', monospace;
                    font-size: 9px; font-weight: 700; letter-spacing: .18em;
                    color: rgba(201,169,110,.35); flex-shrink: 0;
                    transition: color .2s;
                }
                .fq-item.fq-open .fq-num,
                .fq-item:hover .fq-num { color: var(--gold); }

                /* ★ Question text — full white, clearly readable */
                .fq-q {
                    font-family: 'Georgia', serif;
                    font-size: clamp(.95rem,1.3vw,1.05rem);
                    font-weight: 700; line-height: 1.35; letter-spacing: -.01em;
                    color: rgba(237,232,223,.88);
                    flex: 1; text-align: left;
                    transition: color .2s;
                }
                .fq-item.fq-open .fq-q { color: var(--white); }
                .fq-item:hover .fq-q   { color: var(--white); }

                /* +/× icon — custom CSS cross */
                .fq-icon {
                    position: relative; flex-shrink: 0;
                    width: 20px; height: 20px;
                    border: 1px solid var(--gold-border); border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    transition: background .22s, border-color .22s, transform .35s cubic-bezier(.22,1,.36,1);
                }
                .fq-item:hover .fq-icon { border-color: rgba(201,169,110,.5); }
                .fq-item.fq-open .fq-icon {
                    background: var(--gold-dim);
                    border-color: var(--gold);
                    transform: rotate(45deg);
                }

                .fq-icon-h, .fq-icon-v {
                    position: absolute; background: var(--gold); border-radius: 1px;
                    transition: background .2s;
                }
                .fq-icon-h { width: 9px; height: 1.5px; }
                .fq-icon-v { width: 1.5px; height: 9px; transition: opacity .25s, background .2s; }

                /* body */
                .fq-body-inner {
                    padding: 0 24px 22px;
                    padding-left: calc(24px + 9px + 16px); /* align with question text */
                }

                /* ★ Answer text — bright, clearly legible */
                .fq-a {
                    font-family: 'Georgia', serif;
                    font-size: clamp(.88rem,1.15vw,.96rem); line-height: 1.82;
                    color: rgba(237,232,223,.75);   /* clearly readable on dark */
                    margin: 0;
                }
            `}</style>

            <section className="fq-wrap" id="faq" ref={sectionRef}>
                <div className="fq-glow" />
                <div className="fq-wm">?</div>

                <div className="fq-inner">
                    <div className="fq-grid">

                        {/* ── LEFT ── */}
                        <div className="fq-left">
                            <span className={`fq-label${visible ? ' vis' : ''}`}>FAQ</span>

                            <h2 className={`fq-heading${visible ? ' vis' : ''}`}>
                                Frequently<br /><em>Asked</em>
                            </h2>

                            <div className={`fq-rule${visible ? ' vis' : ''}`} />

                            <p className={`fq-sub${visible ? ' vis' : ''}`}>
                                Can&apos;t find your answer? Contact us directly and we&apos;ll respond within a few hours.
                            </p>

                            <a href="#contact" className={`fq-cta${visible ? ' vis' : ''}`}>
                                Contact Us <span className="fq-cta-arr">→</span>
                            </a>

                            <div className={`fq-count${visible ? ' vis' : ''}`}>
                                <em>{FAQS?.length ?? 0}</em> questions answered
                            </div>
                        </div>

                        {/* ── RIGHT — accordion ── */}
                        <div className="fq-accordion">
                            {(FAQS ?? []).map((faq, i) => (
                                <FaqItem
                                    key={i}
                                    faq={faq}
                                    index={i}
                                    isOpen={openIndex === i}
                                    onToggle={() => toggle(i)}
                                    visible={visible}
                                />
                            ))}
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}