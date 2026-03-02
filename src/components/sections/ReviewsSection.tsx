'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { REVIEWS, BUSINESS_INFO } from '@/lib/constants';
import type { Review } from '@/lib/types';

export default function ReviewsSection() {
    const sectionRef  = useRef<HTMLDivElement>(null);
    const cardRef     = useRef<HTMLDivElement>(null);
    const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);

    const [visible,   setVisible]   = useState(false);
    const [active,    setActive]    = useState(0);
    const [animating, setAnimating] = useState(false);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [tilt,      setTilt]      = useState({ rx: 0, ry: 0 });
    const [mousePos,  setMousePos]  = useState({ x: 50, y: 50 });
    const [cardHov,   setCardHov]   = useState(false);
    const [progress,  setProgress]  = useState(0);

    /* ── Scroll reveal ── */
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold: 0.1 },
        );
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

    /* ── Navigate ── */
    const goTo = useCallback((index: number, dir: 'next' | 'prev') => {
        if (animating) return;
        setDirection(dir);
        setAnimating(true);
        setProgress(0);
        setTimeout(() => {
            setActive(index);
            setAnimating(false);
        }, 380);
    }, [animating]);

    const next = useCallback(() => goTo((active + 1) % REVIEWS.length, 'next'), [active, goTo]);
    const prev = useCallback(() => goTo((active - 1 + REVIEWS.length) % REVIEWS.length, 'prev'), [active, goTo]);

    /* ── Auto-advance + progress ── */
    useEffect(() => {
        if (!visible) return;
        setProgress(0);
        const INTERVAL = 5000;
        const TICK     = 50;
        let elapsed    = 0;
        timerRef.current = setInterval(() => {
            elapsed += TICK;
            setProgress(Math.min((elapsed / INTERVAL) * 100, 100));
            if (elapsed >= INTERVAL) {
                elapsed = 0;
                setProgress(0);
                setDirection('next');
                setAnimating(true);
                setTimeout(() => {
                    setActive(a => (a + 1) % REVIEWS.length);
                    setAnimating(false);
                }, 380);
            }
        }, TICK);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [visible, active]);

    /* ── Card 3-D tilt ── */
    const onCardMove = (e: React.MouseEvent) => {
        const r = cardRef.current!.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width;
        const ny = (e.clientY - r.top)  / r.height;
        setTilt({ rx: (ny - 0.5) * -8, ry: (nx - 0.5) * 10 });
        setMousePos({ x: nx * 100, y: ny * 100 });
    };
    const onCardLeave = () => { setTilt({ rx: 0, ry: 0 }); setCardHov(false); };

    /* ── Keyboard ── */
    useEffect(() => {
        const fn = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft')  prev();
        };
        window.addEventListener('keydown', fn);
        return () => window.removeEventListener('keydown', fn);
    }, [next, prev]);

    const review: Review = REVIEWS[active];

    return (
        <>
            <style>{`
                /* ── Tokens ── */
                .rv {
                    --gold:        #C9A96E;
                    --gold-dim:    rgba(201,169,110,.10);
                    --gold-border: rgba(201,169,110,.22);
                    --white:       #FFFFFF;
                    --off:         #EDE8DF;
                    --muted:       rgba(237,232,223,.60);
                    --card-bg:     #111110;
                }

                /* ── Section
                   Dark ladder:
                     Hero     #080808
                     Services #111210
                     About    #0C0C0B
                     Why      #161614
                     Gallery  #0A0A09
                     Pricing  #131311
                     Stats    #0E0D0B
                     Reviews  #181715  ← warm dark, slightly lighter than Why
                ── */
                .rv {
                    position: relative;
                    padding: clamp(80px,11vw,130px) clamp(24px,6vw,80px);
                    background: #181715;
                    overflow: hidden;
                    font-family: 'Georgia', serif;
                }
                .rv::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(to right, transparent, rgba(201,169,110,.45) 30%, rgba(201,169,110,.45) 70%, transparent);
                    z-index: 1;
                }

                /* ambient glow — centred */
                .rv-glow {
                    position: absolute; left: 50%; top: 50%;
                    transform: translate(-50%,-50%);
                    width: 700px; height: 600px; border-radius: 50%;
                    background: radial-gradient(ellipse, rgba(201,169,110,.048) 0%, transparent 65%);
                    pointer-events: none; z-index: 0;
                    animation: rvPulse 7s ease-in-out infinite;
                }
                @keyframes rvPulse {
                    0%,100%{opacity:.5;transform:translate(-50%,-50%) scale(1)}
                    50%{opacity:1;transform:translate(-50%,-50%) scale(1.12)}
                }

                /* large faint quote watermark */
                .rv-wm {
                    position: absolute; left: clamp(24px,6vw,80px); top: 50%;
                    transform: translateY(-60%);
                    font-family: 'Georgia', serif;
                    font-size: clamp(200px,28vw,380px); line-height: 1;
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(201,169,110,.04);
                    pointer-events: none; user-select: none; z-index: 0;
                }

                .rv-inner {
                    position: relative; z-index: 1;
                    max-width: 1100px; margin: 0 auto;
                }

                /* ── Header ── */
                .rv-header {
                    display: flex; align-items: flex-end;
                    justify-content: space-between; gap: 32px;
                    flex-wrap: wrap; margin-bottom: clamp(48px,7vw,72px);
                }

                .rv-label {
                    display: inline-flex; align-items: center; gap: 12px;
                    font-family: 'Courier New', monospace;
                    font-size: 10px; font-weight: 700;
                    letter-spacing: .28em; text-transform: uppercase;
                    color: var(--gold); margin-bottom: 16px;
                    opacity: 0; transform: translateX(-16px);
                    transition: opacity .6s ease .1s, transform .6s cubic-bezier(.22,1,.36,1) .1s;
                }
                .rv-label.vis { opacity: 1; transform: translateX(0); }
                .rv-label::before {
                    content: ''; width: 30px; height: 1.5px;
                    background: var(--gold); border-radius: 2px; flex-shrink: 0;
                }

                /* ★ Title — full white */
                .rv-title {
                    font-family: 'Georgia', serif;
                    font-size: clamp(1.9rem,3.6vw,3rem);
                    font-weight: 700; line-height: 1.1; letter-spacing: -.022em;
                    color: var(--white); margin: 0;
                    opacity: 0; transform: translateY(20px);
                    transition: opacity .7s ease .22s, transform .7s cubic-bezier(.22,1,.36,1) .22s;
                }
                .rv-title.vis { opacity: 1; transform: translateY(0); }
                .rv-title em { font-style: italic; color: var(--gold); }

                /* ── Rating block ── */
                .rv-rating {
                    display: flex; flex-direction: column; align-items: center; gap: 5px;
                    padding: 22px 28px;
                    border: 1px solid var(--gold-border); border-radius: 4px;
                    background: rgba(201,169,110,.04); flex-shrink: 0;
                    opacity: 0; transform: translateY(16px);
                    transition: opacity .6s ease .4s, transform .6s cubic-bezier(.22,1,.36,1) .4s,
                                box-shadow .25s, border-color .25s;
                }
                .rv-rating.vis { opacity: 1; transform: translateY(0); }
                .rv-rating:hover {
                    border-color: rgba(201,169,110,.45);
                    box-shadow: 0 0 28px rgba(201,169,110,.1);
                }
                .rv-big-num {
                    font-family: 'Georgia', serif;
                    font-size: 52px; font-weight: 700; line-height: 1; letter-spacing: -.04em;
                    color: var(--gold);
                    text-shadow: 0 0 28px rgba(201,169,110,.4);
                }
                .rv-stars-big { font-size: 14px; color: var(--gold); letter-spacing: 3px; }
                /* ★ Count + link — clearly readable */
                .rv-count {
                    font-family: 'Courier New', monospace;
                    font-size: 10px; letter-spacing: .16em; text-transform: uppercase;
                    color: rgba(237,232,223,.65);
                }
                .rv-link {
                    font-family: 'Courier New', monospace;
                    font-size: 10px; letter-spacing: .12em; text-transform: uppercase;
                    color: var(--gold); text-decoration: none;
                    border-bottom: 1px solid rgba(201,169,110,.3);
                    transition: border-color .2s;
                }
                .rv-link:hover { border-color: var(--gold); }

                /* ── Stage ── */
                .rv-stage {
                    opacity: 0; transform: translateY(24px);
                    transition: opacity .7s ease .5s, transform .7s cubic-bezier(.22,1,.36,1) .5s;
                }
                .rv-stage.vis { opacity: 1; transform: translateY(0); }

                /* ── Card ── */
                .rv-card-wrap {
                    perspective: 800px;
                }
                .rv-card {
                    position: relative; overflow: hidden;
                    background: var(--card-bg);
                    border: 1px solid var(--gold-border);
                    border-radius: 4px;
                    padding: clamp(32px,5vw,52px);
                    box-shadow: 0 24px 64px rgba(0,0,0,.55), 0 0 0 1px rgba(201,169,110,.1);
                    transform-style: preserve-3d;
                    will-change: transform;
                    cursor: default;
                    transition: box-shadow .3s ease;
                }
                .rv-card:hover {
                    box-shadow: 0 32px 80px rgba(0,0,0,.65), 0 0 0 1px rgba(201,169,110,.28),
                                0 0 40px rgba(201,169,110,.07);
                }

                /* gold left accent bar */
                .rv-card::before {
                    content: '';
                    position: absolute; top: 0; left: 0; bottom: 0;
                    width: 3px;
                    background: linear-gradient(to bottom, var(--gold), rgba(201,169,110,.15));
                    box-shadow: 2px 0 16px rgba(201,169,110,.2);
                }

                /* cursor spotlight inside card */
                .rv-card-spot {
                    position: absolute; inset: 0; pointer-events: none; z-index: 0;
                    transition: opacity .3s;
                }

                /* progress bar — bottom of card */
                .rv-prog {
                    position: absolute; bottom: 0; left: 0;
                    height: 2px;
                    background: linear-gradient(to right, var(--gold), rgba(201,169,110,.4));
                    box-shadow: 0 0 8px rgba(201,169,110,.4);
                    border-radius: 0 2px 0 0;
                    transition: width .05s linear;
                    pointer-events: none;
                }

                /* card inner — slides on transition */
                .rv-inner-content {
                    position: relative; z-index: 1;
                    transition: opacity .38s ease, transform .38s cubic-bezier(.22,1,.36,1);
                }
                .rv-inner-content.ex-next { opacity: 0; transform: translateX(-36px); }
                .rv-inner-content.ex-prev { opacity: 0; transform: translateX(36px);  }

                /* stars inside card */
                .rv-card-stars {
                    font-size: 17px; color: var(--gold);
                    letter-spacing: 3px; margin-bottom: 20px; display: block;
                    text-shadow: 0 0 10px rgba(201,169,110,.4);
                }

                /* ★ Review text — bright, large, clearly readable */
                .rv-card-text {
                    font-family: 'Georgia', serif;
                    font-size: clamp(1.02rem,1.55vw,1.18rem);
                    line-height: 1.85;
                    color: rgba(237,232,223,.90);   /* near-white — was #374151 on white */
                    margin: 0 0 28px;
                    font-style: italic;
                }

                /* footer */
                .rv-footer {
                    display: flex; align-items: center;
                    justify-content: space-between; gap: 16px; flex-wrap: wrap;
                }
                .rv-reviewer { display: flex; align-items: center; gap: 13px; }

                /* avatar */
                .rv-avatar {
                    width: 44px; height: 44px; border-radius: 50%;
                    background: linear-gradient(135deg, rgba(201,169,110,.25), rgba(201,169,110,.08));
                    border: 1.5px solid var(--gold-border);
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Georgia', serif;
                    font-size: 17px; font-weight: 700;
                    color: var(--gold); flex-shrink: 0;
                    text-shadow: 0 0 10px rgba(201,169,110,.4);
                }

                /* ★ Reviewer name — full white */
                .rv-reviewer-name {
                    font-family: 'Georgia', serif;
                    font-size: 1rem; font-weight: 700;
                    color: var(--white);
                    line-height: 1.2;
                }
                /* ★ Meta — readable muted */
                .rv-reviewer-meta {
                    font-family: 'Courier New', monospace;
                    font-size: 9.5px; letter-spacing: .12em; text-transform: uppercase;
                    color: rgba(237,232,223,.55);
                    margin-top: 2px; display: block;
                }

                .rv-meta-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }

                /* ★ Local guide badge — gold on dark, clear */
                .rv-badge {
                    display: inline-flex; align-items: center; gap: 5px;
                    padding: 4px 10px; border-radius: 20px;
                    background: var(--gold-dim);
                    border: 1px solid var(--gold-border);
                    font-family: 'Courier New', monospace;
                    font-size: 9px; letter-spacing: .12em; text-transform: uppercase;
                    color: var(--gold); font-weight: 700;
                }

                /* ★ Date — clearly visible */
                .rv-date {
                    font-family: 'Courier New', monospace;
                    font-size: 10px; letter-spacing: .12em; text-transform: uppercase;
                    color: rgba(237,232,223,.45);
                }

                /* ── Controls ── */
                .rv-controls {
                    display: flex; align-items: center;
                    justify-content: space-between;
                    margin-top: 24px; gap: 16px;
                }

                /* dots */
                .rv-dots { display: flex; gap: 7px; align-items: center; }
                .rv-dot {
                    height: 5px; border-radius: 3px; border: none; padding: 0;
                    background: rgba(201,169,110,.22); cursor: pointer;
                    transition: background .25s, width .3s cubic-bezier(.22,1,.36,1);
                    width: 5px;
                }
                .rv-dot.rv-dot-active { background: var(--gold); width: 22px; }
                .rv-dot:hover:not(.rv-dot-active) { background: rgba(201,169,110,.5); }

                /* counter */
                .rv-counter {
                    font-family: 'Courier New', monospace;
                    font-size: 11px; letter-spacing: .16em;
                    /* ★ Clearly visible */
                    color: rgba(237,232,223,.55);
                }
                .rv-counter strong { color: var(--gold); font-weight: 700; }

                /* arrow buttons */
                .rv-arrows { display: flex; gap: 10px; }
                .rv-arrow {
                    width: 44px; height: 44px; border-radius: 50%;
                    border: 1px solid var(--gold-border);
                    background: rgba(255,255,255,.04);
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                    font-size: 15px;
                    /* ★ Arrow icon — full white */
                    color: var(--white);
                    transition: background .2s, border-color .2s, transform .2s, box-shadow .2s;
                }
                .rv-arrow:hover {
                    background: var(--gold); color: #0a0a0a;
                    border-color: var(--gold);
                    transform: scale(1.08);
                    box-shadow: 0 4px 16px rgba(201,169,110,.35);
                }
                .rv-arrow:active { transform: scale(.95); }

                /* keyboard hint */
                .rv-kb {
                    font-family: 'Courier New', monospace;
                    font-size: 9px; letter-spacing: .14em; text-transform: uppercase;
                    color: rgba(237,232,223,.25);
                    text-align: center; margin-top: 14px;
                }

                @media(max-width:600px) {
                    .rv-rating { flex-direction: row; width: 100%; justify-content: center; padding: 16px 20px; }
                    .rv-big-num { font-size: 38px; }
                    .rv-kb { display: none; }
                }
            `}</style>

            <section className="rv" id="reviews" ref={sectionRef}>
                <div className="rv-glow" />
                <div className="rv-wm">&ldquo;</div>

                <div className="rv-inner">

                    {/* Header */}
                    <div className="rv-header">
                        <div>
                            <div className={`rv-label${visible ? ' vis' : ''}`}>Customer Reviews</div>
                            <h2 className={`rv-title${visible ? ' vis' : ''}`}>
                                What Our<br /><em>Customers Say</em>
                            </h2>
                        </div>

                        <div className={`rv-rating${visible ? ' vis' : ''}`}>
                            <div className="rv-big-num">{BUSINESS_INFO.googleRating.toFixed(1)}</div>
                            <div className="rv-stars-big">★★★★★</div>
                            <div className="rv-count">{BUSINESS_INFO.reviewCount} Google Reviews</div>
                            <a
                                href="https://www.google.com/search?q=Ceramic+Pro+Ajax+Flawless+Finish"
                                target="_blank" rel="noopener noreferrer"
                                className="rv-link"
                            >
                                Read All Reviews →
                            </a>
                        </div>
                    </div>

                    {/* Stage */}
                    <div className={`rv-stage${visible ? ' vis' : ''}`}>
                        <div className="rv-card-wrap">
                            <div
                                ref={cardRef}
                                className="rv-card"
                                onMouseMove={onCardMove}
                                onMouseEnter={() => setCardHov(true)}
                                onMouseLeave={onCardLeave}
                                style={{
                                    transform: `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                                    transition: cardHov ? 'transform .12s ease-out, box-shadow .3s' : 'transform .45s cubic-bezier(.22,1,.36,1), box-shadow .3s',
                                }}
                            >
                                {/* cursor spotlight */}
                                <div
                                    className="rv-card-spot"
                                    style={{
                                        background: `radial-gradient(circle 200px at ${mousePos.x}% ${mousePos.y}%, rgba(201,169,110,.07), transparent 70%)`,
                                        opacity: cardHov ? 1 : 0,
                                    }}
                                />

                                {/* auto-progress */}
                                <div className="rv-prog" style={{ width: `${progress}%` }} />

                                {/* content */}
                                <div className={`rv-inner-content${animating ? ` ex-${direction}` : ''}`}>
                                    <span className="rv-card-stars">★★★★★</span>

                                    <p className="rv-card-text">&ldquo;{review.text}&rdquo;</p>

                                    <div className="rv-footer">
                                        <div className="rv-reviewer">
                                            <div className="rv-avatar">{review.name.charAt(0)}</div>
                                            <div>
                                                <div className="rv-reviewer-name">{review.name}</div>
                                                <span className="rv-reviewer-meta">{review.meta}</span>
                                            </div>
                                        </div>
                                        <div className="rv-meta-right">
                                            {review.isLocalGuide && (
                                                <span className="rv-badge">★ Local Guide</span>
                                            )}
                                            <span className="rv-date">{review.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="rv-controls">
                            <div className="rv-dots">
                                {REVIEWS.map((_, i) => (
                                    <button
                                        key={i}
                                        className={`rv-dot${i === active ? ' rv-dot-active' : ''}`}
                                        onClick={() => goTo(i, i > active ? 'next' : 'prev')}
                                        aria-label={`Review ${i + 1}`}
                                    />
                                ))}
                            </div>

                            <span className="rv-counter">
                                <strong>{String(active + 1).padStart(2, '0')}</strong>
                                {' / '}
                                {String(REVIEWS.length).padStart(2, '0')}
                            </span>

                            <div className="rv-arrows">
                                <button className="rv-arrow" onClick={prev} aria-label="Previous">←</button>
                                <button className="rv-arrow" onClick={next} aria-label="Next">→</button>
                            </div>
                        </div>

                        <p className="rv-kb">Use ← → arrow keys to navigate</p>
                    </div>
                </div>
            </section>
        </>
    );
}