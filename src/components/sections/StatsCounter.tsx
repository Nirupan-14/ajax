'use client';

import { useEffect, useRef, useState } from 'react';
import { STATS } from '@/lib/constants';

/* ─── Count-up hook ──────────────────────────────────────────── */
function useCountUp(
    target: number,
    decimals = 0,
    duration = 2200,
    shouldStart = false,
) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!shouldStart) return;
        const startTime = performance.now();
        const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(parseFloat((target * eased).toFixed(decimals)));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [shouldStart, target, decimals, duration]);
    return value;
}

/* ─── Single stat ────────────────────────────────────────────── */
function StatItem({
    stat,
    shouldStart,
    index,
    visible,
}: {
    stat: typeof STATS[0];
    shouldStart: boolean;
    index: number;
    visible: boolean;
}) {
    const [hovered, setHovered] = useState(false);
    const val = useCountUp(stat.number, stat.decimals ?? 0, 2200, shouldStart);
    const display =
        (stat.decimals ? val.toFixed(stat.decimals) : Math.round(val).toString()) +
        stat.suffix;

    return (
        <div
            className={`st-item${visible ? ' st-vis' : ''}${hovered ? ' st-hov' : ''}`}
            style={{ transitionDelay: `${index * 0.1}s` }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* corner brackets */}
            <span className="st-br st-br-tl" />
            <span className="st-br st-br-br" />

            {/* index */}
            <span className="st-idx">0{index + 1}</span>

            {/* number */}
            <div className="st-num">{display}</div>

            {/* label */}
            <div className="st-lbl">{stat.label}</div>

            {/* bottom gold line */}
            <span className="st-line" />
        </div>
    );
}

/* ─── Section ────────────────────────────────────────────────── */
export default function StatsCounter() {
    const ref = useRef<HTMLElement>(null);
    const [started,  setStarted]  = useState(false);
    const [visible,  setVisible]  = useState(false);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setVisible(true);
                    setStarted(true);
                }
            },
            { threshold: 0.2 },
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <>
            <style>{`
                /* ── Tokens ── */
                .st-wrap {
                    --gold:        #C9A96E;
                    --gold-dim:    rgba(201,169,110,.10);
                    --gold-border: rgba(201,169,110,.22);
                    --white:       #FFFFFF;
                    --muted:       rgba(237,232,223,.52);
                }

                /* ── Section
                   Sits between sections — use a contrasting accent background
                   so it acts as a visual "breath" in the dark ladder.
                   #0E0D0B is a warm near-black that reads distinct but cohesive.
                ── */
                .st-wrap {
                    position: relative;
                    padding: clamp(56px,8vw,96px) clamp(24px,6vw,80px);
                    background: #0E0D0B;
                    overflow: hidden;
                    font-family: 'Georgia', serif;
                }

                /* gold top + bottom dividers */
                .st-wrap::before,
                .st-wrap::after {
                    content: '';
                    position: absolute; left: 0; right: 0; height: 1px;
                    background: linear-gradient(
                        to right,
                        transparent,
                        rgba(201,169,110,.42) 30%,
                        rgba(201,169,110,.42) 70%,
                        transparent
                    );
                }
                .st-wrap::before { top: 0; }
                .st-wrap::after  { bottom: 0; }

                /* ambient glow */
                .st-glow {
                    position: absolute; left: 50%; top: 50%;
                    transform: translate(-50%,-50%);
                    width: 800px; height: 300px; border-radius: 50%;
                    background: radial-gradient(ellipse, rgba(201,169,110,.045) 0%, transparent 65%);
                    pointer-events: none; z-index: 0;
                }

                .st-inner {
                    position: relative; z-index: 1;
                    max-width: 1200px; margin: 0 auto;
                }

                /* ── Grid ── */
                .st-grid {
                    display: grid;
                    grid-template-columns: repeat(var(--cols, 4), 1fr);
                    gap: 0;
                    border: 1px solid var(--gold-border);
                    border-radius: 3px;
                    overflow: hidden;
                }
                /* auto-adjust columns */
                @media(max-width:860px) { .st-grid { --cols: 2; } }
                @media(max-width:420px) { .st-grid { --cols: 1; } }

                /* ── Stat item ── */
                .st-item {
                    position: relative; overflow: hidden;
                    padding: clamp(28px,4vw,44px) clamp(20px,3vw,36px);
                    display: flex; flex-direction: column;
                    align-items: center; text-align: center;
                    border-right: 1px solid var(--gold-border);
                    cursor: default;
                    background: rgba(255,255,255,.022);

                    /* entrance animation */
                    opacity: 0; transform: translateY(20px);
                    transition:
                        opacity .6s ease,
                        transform .6s cubic-bezier(.22,1,.36,1),
                        background .25s ease,
                        box-shadow .25s ease;
                }
                .st-item:last-child { border-right: none; }
                @media(max-width:860px) {
                    .st-item:nth-child(2n) { border-right: none; }
                    .st-item:nth-child(1),
                    .st-item:nth-child(2) { border-bottom: 1px solid var(--gold-border); }
                }
                @media(max-width:420px) {
                    .st-item { border-right: none; border-bottom: 1px solid var(--gold-border); }
                    .st-item:last-child { border-bottom: none; }
                }

                .st-item.st-vis { opacity: 1; transform: translateY(0); }
                .st-item:hover, .st-item.st-hov {
                    background: rgba(201,169,110,.06);
                    box-shadow: inset 0 0 0 1px rgba(201,169,110,.18);
                }

                /* corner brackets — appear on hover */
                .st-br {
                    position: absolute; width: 14px; height: 14px;
                    opacity: 0; transition: opacity .25s ease, transform .25s ease;
                    transform: scale(.4);
                }
                .st-item:hover .st-br { opacity: 1; transform: scale(1); }
                .st-br-tl { top: 6px; left: 6px; border-top: 1.5px solid var(--gold); border-left: 1.5px solid var(--gold); }
                .st-br-br { bottom: 6px; right: 6px; border-bottom: 1.5px solid var(--gold); border-right: 1.5px solid var(--gold); }

                /* index — top right */
                .st-idx {
                    position: absolute; top: 10px; right: 14px;
                    font-family: 'Courier New', monospace;
                    font-size: 9px; letter-spacing: .18em;
                    color: rgba(201,169,110,.2);
                    transition: color .2s;
                }
                .st-item:hover .st-idx { color: rgba(201,169,110,.55); }

                /* ★ Number — large, bright gold, always readable */
                .st-num {
                    font-family: 'Georgia', serif;
                    font-size: clamp(36px,5vw,56px);
                    font-weight: 700; line-height: 1; letter-spacing: -.03em;
                    color: var(--gold);
                    text-shadow: 0 0 32px rgba(201,169,110,.35);
                    margin-bottom: 10px;
                    transition: text-shadow .25s;
                }
                .st-item:hover .st-num {
                    text-shadow: 0 0 40px rgba(201,169,110,.6);
                }

                /* ★ Label — bright white, clear */
                .st-lbl {
                    font-family: 'Courier New', monospace;
                    font-size: clamp(10px,1.1vw,12px);
                    font-weight: 700; letter-spacing: .18em; text-transform: uppercase;
                    color: rgba(237,232,223,.78);
                    line-height: 1.4;
                    transition: color .2s;
                }
                .st-item:hover .st-lbl { color: var(--white); }

                /* gold bottom line sweep */
                .st-line {
                    position: absolute; bottom: 0; left: 0;
                    height: 2px; width: 0;
                    background: linear-gradient(to right, var(--gold), rgba(201,169,110,.3));
                    transition: width .35s cubic-bezier(.22,1,.36,1);
                    border-radius: 0 2px 0 0;
                }
                .st-item:hover .st-line { width: 100%; }
            `}</style>

            <section className="st-wrap" id="stats" ref={ref}>
                <div className="st-glow" />
                <div className="st-inner">
                    <div className="st-grid">
                        {STATS.map((s, i) => (
                            <StatItem
                                key={s.label}
                                stat={s}
                                shouldStart={started}
                                index={i}
                                visible={visible}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}