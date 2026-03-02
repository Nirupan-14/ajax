'use client';

import { useEffect, useRef, useState } from 'react';
import { REVIEWS, BUSINESS_INFO } from '@/lib/constants';
import type { Review } from '@/lib/types';

export default function ReviewsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [active, setActive] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const goTo = (index: number, dir: 'next' | 'prev') => {
        if (animating) return;
        setDirection(dir);
        setAnimating(true);
        setTimeout(() => {
            setActive(index);
            setAnimating(false);
        }, 420);
    };

    const next = () => goTo((active + 1) % REVIEWS.length, 'next');
    const prev = () => goTo((active - 1 + REVIEWS.length) % REVIEWS.length, 'prev');

    // Auto-advance
    useEffect(() => {
        if (!visible) return;
        timerRef.current = setInterval(next, 5000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [visible, active, animating]);

    const review: Review = REVIEWS[active];

    return (
        <>
            <style>{`
                .rv-section {
                    position: relative;
                    padding: clamp(80px, 11vw, 130px) 0;
                    background: #ffffff;
                    overflow: hidden;
                    --gold: #b8882a;
                    --navy: #0f1f3d;
                    --muted: #6b7280;
                    --border: rgba(184,136,42,.15);
                }
                .rv-section::before {
                    content: '';
                    position: absolute; inset: 0; pointer-events: none;
                    background:
                        radial-gradient(ellipse 60% 70% at 50% 50%, rgba(184,136,42,.04) 0%, transparent 65%),
                        radial-gradient(ellipse 30% 40% at 95% 10%, rgba(15,31,61,.03) 0%, transparent 50%);
                }

                .rv-container {
                    position: relative; z-index: 1;
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 0 clamp(24px, 6vw, 80px);
                }

                /* ── Header ── */
                .rv-header {
                    display: flex; align-items: flex-end;
                    justify-content: space-between; gap: 32px;
                    flex-wrap: wrap;
                    margin-bottom: clamp(48px, 7vw, 72px);
                }

                .rv-label {
                    display: inline-flex; align-items: center; gap: 11px;
                    font-family: 'Courier New', monospace;
                    font-size: 11px; font-weight: 700;
                    letter-spacing: .26em; text-transform: uppercase;
                    color: var(--gold); margin-bottom: 16px;
                    opacity: 0; transform: translateX(-16px);
                    transition: opacity .6s ease .1s, transform .6s cubic-bezier(.22,1,.36,1) .1s;
                }
                .rv-label.vis { opacity: 1; transform: translateX(0); }
                .rv-label::before {
                    content: ''; width: 30px; height: 2px;
                    background: var(--gold); border-radius: 1px; flex-shrink: 0;
                }

                .rv-title {
                    font-family: 'Georgia', 'Times New Roman', serif;
                    font-size: clamp(1.9rem, 3.6vw, 3rem);
                    font-weight: 700; line-height: 1.1;
                    letter-spacing: -.022em; color: var(--navy); margin: 0;
                    opacity: 0; transform: translateY(20px);
                    transition: opacity .7s ease .22s, transform .7s cubic-bezier(.22,1,.36,1) .22s;
                }
                .rv-title.vis { opacity: 1; transform: translateY(0); }
                .rv-title em { font-style: italic; color: var(--gold); }

                /* Rating block */
                .rv-rating-block {
                    display: flex; flex-direction: column; align-items: center;
                    gap: 4px; flex-shrink: 0;
                    padding: 20px 28px;
                    border: 1px solid var(--border);
                    border-radius: 4px;
                    background: rgba(184,136,42,.03);
                    opacity: 0; transform: translateY(16px);
                    transition: opacity .6s ease .4s, transform .6s cubic-bezier(.22,1,.36,1) .4s;
                }
                .rv-rating-block.vis { opacity: 1; transform: translateY(0); }

                .rv-big-num {
                    font-family: 'Georgia', serif;
                    font-size: 52px; font-weight: 700;
                    color: var(--gold); line-height: 1;
                    letter-spacing: -.04em;
                }
                .rv-stars {
                    font-size: 15px; color: var(--gold);
                    letter-spacing: 2px;
                }
                .rv-count {
                    font-family: 'Courier New', monospace;
                    font-size: 10px; letter-spacing: .16em;
                    text-transform: uppercase; color: var(--muted);
                }
                .rv-link {
                    font-family: 'Courier New', monospace;
                    font-size: 10px; letter-spacing: .1em;
                    color: var(--navy); text-decoration: none;
                    border-bottom: 1px solid rgba(15,31,61,.2);
                    transition: border-color .2s ease, color .2s ease;
                }
                .rv-link:hover { color: var(--gold); border-color: var(--gold); }

                /* ── Stage ── */
                .rv-stage {
                    position: relative;
                    opacity: 0; transform: translateY(24px);
                    transition: opacity .7s ease .5s, transform .7s cubic-bezier(.22,1,.36,1) .5s;
                }
                .rv-stage.vis { opacity: 1; transform: translateY(0); }

                /* Large quote mark */
                .rv-quote-mark {
                    position: absolute; top: -20px; left: 24px;
                    font-family: 'Georgia', serif;
                    font-size: 120px; line-height: 1;
                    color: rgba(184,136,42,.08);
                    pointer-events: none; user-select: none;
                    z-index: 0;
                }

                /* Card */
                .rv-card {
                    position: relative; z-index: 1;
                    background: #fff;
                    border: 1px solid var(--border);
                    border-radius: 6px;
                    padding: clamp(32px, 5vw, 56px);
                    box-shadow:
                        0 2px 4px rgba(0,0,0,.04),
                        0 16px 56px rgba(0,0,0,.08);
                    overflow: hidden;
                }
                /* Gold left accent bar */
                .rv-card::before {
                    content: '';
                    position: absolute; top: 0; left: 0;
                    width: 3px; height: 100%;
                    background: linear-gradient(to bottom, var(--gold), rgba(184,136,42,.2));
                }

                /* Card content transition */
                .rv-card-inner {
                    transition: opacity .4s ease, transform .4s cubic-bezier(.22,1,.36,1);
                }
                .rv-card-inner.exit-next  { opacity: 0; transform: translateX(-40px); }
                .rv-card-inner.exit-prev  { opacity: 0; transform: translateX(40px); }
                .rv-card-inner.enter-next { opacity: 0; transform: translateX(40px); }
                .rv-card-inner.enter-prev { opacity: 0; transform: translateX(-40px); }

                /* Stars */
                .rv-card-stars {
                    font-size: 18px; color: var(--gold);
                    letter-spacing: 3px; margin-bottom: 20px; display: block;
                }

                /* Review text */
                .rv-card-text {
                    font-family: 'Georgia', serif;
                    font-size: clamp(1rem, 1.5vw, 1.15rem);
                    line-height: 1.82; color: #374151;
                    margin: 0 0 28px;
                    font-style: italic;
                }

                /* Footer */
                .rv-card-footer {
                    display: flex; align-items: center;
                    justify-content: space-between; gap: 16px; flex-wrap: wrap;
                }

                .rv-avatar {
                    width: 44px; height: 44px; border-radius: 50%;
                    background: linear-gradient(135deg, var(--navy), #1a3a6b);
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Georgia', serif;
                    font-size: 17px; font-weight: 700; color: #fff;
                    flex-shrink: 0;
                    border: 2px solid var(--border);
                }

                .rv-reviewer {
                    display: flex; align-items: center; gap: 12px;
                }

                .rv-reviewer-info { display: flex; flex-direction: column; gap: 2px; }

                .rv-reviewer-name {
                    font-family: 'Georgia', serif;
                    font-size: .98rem; font-weight: 700; color: var(--navy);
                }
                .rv-reviewer-meta {
                    font-family: 'Courier New', monospace;
                    font-size: 9.5px; letter-spacing: .1em;
                    text-transform: uppercase; color: var(--muted);
                }

                .rv-badge {
                    display: inline-flex; align-items: center; gap: 5px;
                    padding: 3px 9px; border-radius: 20px;
                    background: rgba(184,136,42,.08);
                    border: 1px solid rgba(184,136,42,.2);
                    font-family: 'Courier New', monospace;
                    font-size: 9px; letter-spacing: .12em;
                    text-transform: uppercase; color: var(--gold);
                    font-weight: 700;
                }

                .rv-date {
                    font-family: 'Courier New', monospace;
                    font-size: 10px; letter-spacing: .1em;
                    color: var(--muted); text-transform: uppercase;
                }

                /* ── Controls ── */
                .rv-controls {
                    display: flex; align-items: center;
                    justify-content: space-between;
                    margin-top: 28px;
                }

                /* Dots */
                .rv-dots {
                    display: flex; gap: 8px; align-items: center;
                }
                .rv-dot {
                    width: 6px; height: 6px; border-radius: 50%;
                    background: rgba(184,136,42,.25);
                    cursor: pointer;
                    transition: background .25s ease, transform .25s ease, width .3s ease;
                    border: none; padding: 0;
                }
                .rv-dot.active {
                    background: var(--gold);
                    width: 24px; border-radius: 3px;
                    transform: none;
                }

                /* Arrow buttons */
                .rv-arrows { display: flex; gap: 10px; }
                .rv-arrow {
                    width: 44px; height: 44px; border-radius: 50%;
                    border: 1px solid var(--border);
                    background: #fff;
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                    font-size: 16px; color: var(--navy);
                    transition: background .2s ease, border-color .2s ease,
                                color .2s ease, transform .2s ease;
                    box-shadow: 0 2px 8px rgba(0,0,0,.06);
                }
                .rv-arrow:hover {
                    background: var(--navy); color: #fff;
                    border-color: var(--navy); transform: scale(1.08);
                }
                .rv-arrow:active { transform: scale(.95); }

                /* Progress bar */
                .rv-progress {
                    position: absolute; bottom: 0; left: 0;
                    height: 2px; background: var(--gold);
                    animation: rvProgress 5s linear infinite;
                    transform-origin: left;
                }
                @keyframes rvProgress {
                    from { width: 0%; }
                    to   { width: 100%; }
                }

                /* Counter */
                .rv-counter {
                    font-family: 'Courier New', monospace;
                    font-size: 11px; letter-spacing: .14em;
                    color: var(--muted);
                }
                .rv-counter strong { color: var(--navy); }

                @media (max-width: 600px) {
                    .rv-rating-block { flex-direction: row; width: 100%; justify-content: center; padding: 16px 20px; }
                    .rv-big-num { font-size: 38px; }
                }
            `}</style>

            <section className="rv-section" id="reviews" ref={sectionRef}>
                <div className="rv-container">

                    {/* Header */}
                    <div className="rv-header">
                        <div>
                            <div className={`rv-label${visible ? ' vis' : ''}`}>Customer Reviews</div>
                            <h2 className={`rv-title${visible ? ' vis' : ''}`}>
                                What Our<br /><em>Customers Say</em>
                            </h2>
                        </div>

                        <div className={`rv-rating-block${visible ? ' vis' : ''}`}>
                            <div className="rv-big-num">{BUSINESS_INFO.googleRating.toFixed(1)}</div>
                            <div className="rv-stars">★★★★★</div>
                            <div className="rv-count">{BUSINESS_INFO.reviewCount} Google Reviews</div>
                            <a
                                href="https://www.google.com/search?q=Ceramic+Pro+Ajax+Flawless+Finish"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rv-link"
                            >
                                Read All Reviews →
                            </a>
                        </div>
                    </div>

                    {/* Stage */}
                    <div className={`rv-stage${visible ? ' vis' : ''}`}>
                        <div className="rv-quote-mark">&ldquo;</div>

                        <div className="rv-card">
                            {/* Auto-progress bar */}
                            <div
                                className="rv-progress"
                                key={active}
                            />

                            <div
                                className={`rv-card-inner${
                                    animating
                                        ? ` exit-${direction}`
                                        : ''
                                }`}
                            >
                                <span className="rv-card-stars">★★★★★</span>

                                <p className="rv-card-text">
                                    &ldquo;{review.text}&rdquo;
                                </p>

                                <div className="rv-card-footer">
                                    <div className="rv-reviewer">
                                        <div className="rv-avatar">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div className="rv-reviewer-info">
                                            <span className="rv-reviewer-name">{review.name}</span>
                                            <span className="rv-reviewer-meta">{review.meta}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                                        {review.isLocalGuide && (
                                            <span className="rv-badge">★ Local Guide</span>
                                        )}
                                        <span className="rv-date">{review.date}</span>
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
                                        className={`rv-dot${i === active ? ' active' : ''}`}
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
                    </div>

                </div>
            </section>
        </>
    );
}