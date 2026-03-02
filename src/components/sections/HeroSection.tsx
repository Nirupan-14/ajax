'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { BUSINESS_INFO } from '@/lib/constants';

/* ─── Types ──────────────────────────────────────────────────── */
interface Particle { id: number; x: number; y: number; vx: number; vy: number; life: number; size: number; }

const RAW_STATS = [
    { strong: `${BUSINESS_INFO.googleRating}`, suffix: '★', text: 'Google Rating', detail: 'Top-rated in Durham' },
    { strong: `${BUSINESS_INFO.reviewCount}`, suffix: '+', text: 'Reviews', detail: 'Verified customers' },
    { strong: 'Mon–Sun', suffix: '', text: '8AM–6PM', detail: 'Book any day' },
    { strong: 'Mobile', suffix: '', text: 'Service', detail: 'We come to you' },
    { strong: 'Ajax, ON', suffix: '', text: '& GTA', detail: 'Durham + metro' },
];

/* ─── Magnetic Button ─────────────────────────────────────────── */
function MagneticBtn({ href, primary, children }: { href: string; primary?: boolean; children: React.ReactNode }) {
    const ref = useRef<HTMLAnchorElement>(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

    const onMove = (e: React.MouseEvent) => {
        const r = ref.current!.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        setPos({ x: dx * 0.28, y: dy * 0.28 });
    };
    const onLeave = () => setPos({ x: 0, y: 0 });
    const onClick = (e: React.MouseEvent) => {
        const r = ref.current!.getBoundingClientRect();
        const id = Date.now();
        setRipples(prev => [...prev, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
        setTimeout(() => setRipples(prev => prev.filter(rip => rip.id !== id)), 700);
    };

    return (
        <a
            ref={ref}
            href={href}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            onClick={onClick}
            style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                transition: pos.x === 0 ? 'transform .5s cubic-bezier(.22,1,.36,1)' : 'transform .1s ease-out',
            }}
            className={`mag-btn ${primary ? 'mag-btn--primary' : 'mag-btn--ghost'}`}
        >
            {ripples.map(rip => (
                <span
                    key={rip.id}
                    className="ripple"
                    style={{ left: rip.x, top: rip.y }}
                />
            ))}
            {children}
        </a>
    );
}

/* ─── Animated Counter ────────────────────────────────────────── */
function Counter({ value, suffix }: { value: string; suffix: string }) {
    const num = parseFloat(value);
    const isNum = !isNaN(num);

    const [display, setDisplay] = useState(() =>
        isNum ? '0' : value
    );

    const ref = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        if (!isNum) return; // ✅ just return, no setState

        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !started.current) {
                started.current = true;

                const dur = 1400;
                const start = performance.now();

                const step = (t: number) => {
                    const p = Math.min((t - start) / dur, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    const cur = num * eased;

                    setDisplay(
                        Number.isInteger(num)
                            ? Math.round(cur).toString()
                            : cur.toFixed(1)
                    );

                    if (p < 1) requestAnimationFrame(step);
                };

                requestAnimationFrame(step);
            }
        }, { threshold: 0.5 });

        if (ref.current) obs.observe(ref.current);

        return () => obs.disconnect();
    }, [isNum, num]);

    return <span ref={ref}>{display}{suffix}</span>;
}

/* ─── Spark Particles ─────────────────────────────────────────── */
function SparkCanvas({ active }: { active: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const raf = useRef<number>(0);
    const idCounter = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        const w = canvas.offsetWidth; const h = canvas.offsetHeight;
        canvas.width = w; canvas.height = h;

        const spawn = () => {
            if (!active) return;
            for (let i = 0; i < 3; i++) {
                particles.current.push({
                    id: idCounter.current++,
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 1.8,
                    vy: -Math.random() * 2.5 - 0.5,
                    life: 1,
                    size: Math.random() * 3 + 1,
                });
            }
        };
        const spawnInt = active ? setInterval(spawn, 80) : null;

        const loop = () => {
            ctx.clearRect(0, 0, w, h);
            particles.current = particles.current.filter(p => p.life > 0);
            particles.current.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.022;

                const radius = Math.max(0, p.size * p.life); // ✅ prevent negative
                const alpha = Math.max(0, p.life * 0.85);     // ✅ prevent negative opacity

                if (radius <= 0) return; // skip drawing dead particles

                ctx.beginPath();
                ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200,169,110,${alpha})`;
                ctx.fill();
            });
            raf.current = requestAnimationFrame(loop);
        };
        raf.current = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(raf.current);
            if (spawnInt) clearInterval(spawnInt);
        };
    }, [active]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                pointerEvents: 'none', zIndex: 3,
                borderRadius: '4px',
            }}
        />
    );
}

/* ─── Main Component ──────────────────────────────────────────── */
export default function HeroSection() {
    const heroRef = useRef<HTMLDivElement>(null);
    const [on, setOn] = useState(false);
    const [mouse, setMouse] = useState({ x: 0, y: 0, px: 0, py: 0 }); // px/py = pixel coords
    const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
    const [carHover, setCarHover] = useState(false);
    const [hoveredStat, setHoveredStat] = useState<number | null>(null);

    useEffect(() => { const t = setTimeout(() => setOn(true), 80); return () => clearTimeout(t); }, []);

    const onMouseMove = useCallback((e: MouseEvent) => {
        const el = heroRef.current; if (!el) return;
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        setMouse({ x: nx, y: ny, px: e.clientX - r.left, py: e.clientY - r.top });
    }, []);

    useEffect(() => {
        const el = heroRef.current; if (!el) return;
        el.addEventListener('mousemove', onMouseMove);
        return () => el.removeEventListener('mousemove', onMouseMove);
    }, [onMouseMove]);

    const onCarMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        setTilt({ rx: ny * -18, ry: nx * 22 });
    };
    const onCarLeave = () => setTilt({ rx: 0, ry: 0 });

    /* Split headline chars */
    const renderSplit = (text: string, baseDelay: number) =>
        text.split('').map((ch, i) => (
            <span
                key={i}
                className={`split-ch${on ? ' on' : ''}`}
                style={{ transitionDelay: `${baseDelay + i * 28}ms` }}
            >
                {ch === ' ' ? '\u00A0' : ch}
            </span>
        ));

    return (
        <>
            <style>{`
                /* ── Reset & Shell ── */
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                .h {
                    position: relative;
                    min-height: 100svh;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    background: #060606;
                    font-family: 'Georgia','Times New Roman',serif;
                    --gold: #c8a96e;
                    --gold-glow: rgba(200,169,110,.55);
                    --cream: #f5f0e8;
                    --dark: #060606;
                    cursor: none;
                }

                /* ── Custom Cursor ── */
                .cursor-dot {
                    position: fixed;
                    width: 8px; height: 8px;
                    border-radius: 50%;
                    background: var(--gold);
                    pointer-events: none;
                    z-index: 9999;
                    transform: translate(-50%, -50%);
                    transition: transform .08s ease, width .2s ease, height .2s ease, opacity .2s ease;
                    mix-blend-mode: difference;
                }
                .cursor-ring {
                    position: fixed;
                    width: 36px; height: 36px;
                    border-radius: 50%;
                    border: 1px solid rgba(200,169,110,.6);
                    pointer-events: none;
                    z-index: 9998;
                    transform: translate(-50%, -50%);
                    transition: transform .18s cubic-bezier(.22,1,.36,1), width .25s ease, height .25s ease, border-color .2s ease;
                }

                /* ── Background ── */
                .h-bg {
                    position: absolute; inset: 0;
                    will-change: transform;
                    transition: transform .18s ease-out;
                }
                .h-bg img { object-fit: cover; object-position: center 35%; }
                .h-ov {
                    position: absolute; inset: 0; z-index: 1;
                    background:
                        linear-gradient(115deg, rgba(4,4,4,.96) 0%, rgba(4,4,4,.72) 50%, rgba(4,4,4,.28) 100%),
                        linear-gradient(to top, rgba(4,4,4,.92) 0%, transparent 48%);
                }
                .h-grain {
                    position: absolute; inset: 0; z-index: 2;
                    pointer-events: none; opacity: .042;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                    background-size: 180px;
                }

                /* ── Spotlight / torch ── */
                .h-spotlight {
                    position: absolute; inset: 0; z-index: 3;
                    pointer-events: none;
                    transition: background .06s ease;
                }

                /* ── Gold left rule ── */
                .h-rule {
                    position: absolute; top: 0; left: 0; z-index: 8;
                    width: 2px; height: 0;
                    background: linear-gradient(to bottom, var(--gold), rgba(200,169,110,.1));
                    transition: height 1.8s cubic-bezier(.22,1,.36,1) .3s;
                }
                .h-rule.on { height: 100%; }

                /* ── Ambient glow ── */
                .h-glow {
                    position: absolute; top: -5%; right: 8%; z-index: 2;
                    width: 700px; height: 700px;
                    border-radius: 50%; pointer-events: none;
                    background: radial-gradient(circle, rgba(200,169,110,.07) 0%, transparent 65%);
                    animation: glowPulse 6s ease-in-out infinite;
                }
                @keyframes glowPulse { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.15)} }

                /* ── Scan lines ── */
                .h-scan {
                    position: absolute; inset: 0; z-index: 4; pointer-events: none;
                    background: repeating-linear-gradient(
                        to bottom,
                        transparent 0px,
                        transparent 3px,
                        rgba(0,0,0,.025) 3px,
                        rgba(0,0,0,.025) 4px
                    );
                    opacity: .35;
                }

                /* ── Body grid ── */
                .h-body {
                    position: relative; z-index: 5; flex: 1;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 48px;
                    align-items: center;
                    padding: clamp(100px,12vw,155px) clamp(28px,7vw,100px) 48px;
                }
                @media(max-width: 880px) {
                    .h-body { grid-template-columns: 1fr; padding-top: clamp(90px,17vw,130px); }
                    .h { cursor: auto; }
                    .cursor-dot, .cursor-ring { display: none; }
                }

                /* ── Text column ── */
                .h-text { display: flex; flex-direction: column; gap: 24px; }

                /* ── Eyebrow ── */
                .h-eye {
                    display: inline-flex; align-items: center; gap: 12px;
                    font-family: 'Courier New', monospace;
                    font-size: 12px; font-weight: 700;
                    letter-spacing: .24em; text-transform: uppercase;
                    color: var(--gold);
                    text-shadow: 0 0 22px rgba(200,169,110,.65);
                    opacity: 0; transform: translateX(-20px);
                    transition: opacity .7s ease .1s, transform .7s cubic-bezier(.22,1,.36,1) .1s;
                }
                .h-eye.on { opacity: 1; transform: translateX(0); }
                .h-eye::before {
                    content: ''; width: 38px; height: 1.5px;
                    background: linear-gradient(to right, transparent, var(--gold));
                    flex-shrink: 0;
                    animation: eyeLineGrow .9s cubic-bezier(.22,1,.36,1) .6s both;
                }
                @keyframes eyeLineGrow { from{width:0} to{width:38px} }

                /* ── Split headline ── */
                .h-h1 {
                    font-size: clamp(2.6rem, 5.4vw, 5rem);
                    font-weight: 700; line-height: 1.04; letter-spacing: -.028em;
                    color: var(--cream);
                }
                .split-ch {
                    display: inline-block;
                    opacity: 0; transform: translateY(40px) rotateX(-60deg);
                    transition: opacity .55s ease, transform .55s cubic-bezier(.22,1,.36,1);
                    transform-origin: bottom;
                }
                .split-ch.on { opacity: 1; transform: translateY(0) rotateX(0deg); }
                .h-em { color: var(--gold); font-style: italic; position: relative; }
                .h-em-line {
                    position: absolute; bottom: 2px; left: 0;
                    height: 2px; width: 0;
                    background: linear-gradient(to right, var(--gold), rgba(200,169,110,.3));
                    border-radius: 2px;
                    transition: width 1s cubic-bezier(.22,1,.36,1) 1.1s;
                    box-shadow: 0 0 8px rgba(200,169,110,.5);
                }
                .h-em-line.on { width: 100%; }

                /* ── Para ── */
                .h-p {
                    font-size: clamp(.88rem, 1.42vw, 1rem); line-height: 1.78;
                    color: rgba(245,240,232,.58); max-width: 420px;
                    opacity: 0; transform: translateY(20px);
                    transition: opacity .7s ease .72s, transform .7s cubic-bezier(.22,1,.36,1) .72s;
                }
                .h-p.on { opacity: 1; transform: translateY(0); }

                /* ── CTAs ── */
                .h-ctas {
                    display: flex; flex-wrap: wrap; gap: 14px;
                    opacity: 0; transform: translateY(18px);
                    transition: opacity .7s ease .9s, transform .7s cubic-bezier(.22,1,.36,1) .9s;
                }
                .h-ctas.on { opacity: 1; transform: translateY(0); }

                .mag-btn {
                    position: relative; overflow: hidden;
                    display: inline-flex; align-items: center; gap: 10px;
                    padding: 14px 28px; border-radius: 2px;
                    font-family: 'Courier New', monospace; font-size: 11px;
                    letter-spacing: .17em; text-transform: uppercase;
                    font-weight: 700; text-decoration: none;
                    will-change: transform;
                }
                .mag-btn--primary {
                    background: var(--gold); color: #070707;
                    box-shadow: 0 4px 24px rgba(200,169,110,.4);
                }
                .mag-btn--primary:hover { box-shadow: 0 8px 40px rgba(200,169,110,.6); }
                .mag-btn--ghost {
                    background: transparent; color: var(--cream);
                    border: 1px solid rgba(245,240,232,.28);
                }
                .mag-btn--ghost:hover { border-color: rgba(245,240,232,.7); }
                .btn-arr { display: inline-block; transition: transform .22s ease; }
                .mag-btn:hover .btn-arr { transform: translateX(5px); }

                .ripple {
                    position: absolute; transform: translate(-50%,-50%);
                    width: 0; height: 0;
                    border-radius: 50%;
                    background: rgba(255,255,255,.22);
                    animation: rippleAnim .65s ease-out forwards;
                    pointer-events: none;
                }
                @keyframes rippleAnim {
                    to { width: 260px; height: 260px; opacity: 0; }
                }

                /* ── Car column ── */
                .h-car-col {
                    position: relative;
                    display: flex; align-items: center; justify-content: center;
                    opacity: 0;
                    transition: opacity .9s ease .6s;
                    perspective: 900px;
                }
                .h-car-col.on { opacity: 1; }

                /* Decorative ring */
                .h-ring {
                    position: absolute; inset: -10%;
                    border-radius: 50%;
                    border: 1px solid rgba(200,169,110,.09);
                    animation: ringRot 28s linear infinite;
                    pointer-events: none;
                }
                .h-ring::before {
                    content: ''; position: absolute; inset: 14%;
                    border-radius: 50%;
                    border: 1px dashed rgba(200,169,110,.05);
                }
                @keyframes ringRot { to { transform: rotate(360deg); } }

                /* 3-D tilt frame */
                .h-car-tilt {
                    width: 100%;
                    transform-style: preserve-3d;
                    will-change: transform;
                    transition: transform .15s ease-out;
                    border-radius: 4px;
                }
                .h-car-frame {
                    position: relative; width: 100%; border-radius: 4px; overflow: hidden;
                    box-shadow: 0 30px 80px rgba(0,0,0,.75), 0 0 0 1px rgba(200,169,110,.18);
                    transition: box-shadow .3s ease;
                }
                .h-car-frame:hover {
                    box-shadow: 0 50px 110px rgba(0,0,0,.85), 0 0 0 1px rgba(200,169,110,.4), 0 0 70px rgba(200,169,110,.12);
                }
                .h-car-frame img { display: block; width: 100%; height: auto; }

                /* Sheen overlay on tilt */
                .h-car-sheen {
                    position: absolute; inset: 0; z-index: 2;
                    border-radius: 4px; pointer-events: none;
                    background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.08), transparent 60%);
                    transition: background .15s ease;
                }

                /* Badge */
                .h-badge {
                    position: absolute; bottom: 12px; left: 12px; z-index: 4;
                    background: rgba(4,4,4,.85); backdrop-filter: blur(12px);
                    border: 1px solid rgba(200,169,110,.3); border-radius: 3px;
                    padding: 8px 14px;
                    display: flex; align-items: center; gap: 9px;
                    font-family: 'Courier New', monospace; font-size: 9.5px;
                    letter-spacing: .15em; text-transform: uppercase; color: var(--gold);
                    transition: transform .25s ease, border-color .25s ease;
                }
                .h-car-frame:hover .h-badge {
                    transform: translateY(-4px);
                    border-color: rgba(200,169,110,.55);
                }
                .h-dot {
                    width: 6px; height: 6px; border-radius: 50%;
                    background: #4ade80; flex-shrink: 0;
                    animation: blink 2s ease-in-out infinite;
                    box-shadow: 0 0 6px rgba(74,222,128,.6);
                }
                @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.2} }

                /* Corner brackets */
                .h-bk {
                    position: absolute; width: 22px; height: 22px; z-index: 2; pointer-events: none;
                    opacity: 0; transition: opacity .5s ease .85s, transform .5s ease .85s;
                    transform: scale(.6);
                }
                .h-car-col.on .h-bk { opacity: 1; transform: scale(1); }
                .h-bk-tl { top:-7px; left:-7px; border-top:2px solid var(--gold); border-left:2px solid var(--gold); }
                .h-bk-tr { top:-7px; right:-7px; border-top:2px solid var(--gold); border-right:2px solid var(--gold); }
                .h-bk-bl { bottom:-7px; left:-7px; border-bottom:2px solid var(--gold); border-left:2px solid var(--gold); }
                .h-bk-br { bottom:-7px; right:-7px; border-bottom:2px solid var(--gold); border-right:2px solid var(--gold); }

                /* ── Stats bar ── */
                .h-stats {
                    position: relative; z-index: 10;
                    background: rgba(5,5,5,.92);
                    backdrop-filter: blur(24px);
                    border-top: 1px solid rgba(200,169,110,.28);
                    opacity: 0; transform: translateY(14px);
                    transition: opacity .7s ease 1s, transform .7s cubic-bezier(.22,1,.36,1) 1s;
                }
                .h-stats.on { opacity: 1; transform: translateY(0); }
                .h-stats-inner {
                    display: flex; overflow-x: auto; scrollbar-width: none;
                    padding: 0 clamp(24px,6vw,100px);
                }
                .h-stats-inner::-webkit-scrollbar { display: none; }

                .h-stat {
                    flex: 1 0 auto; min-width: 90px;
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    gap: 6px; padding: 18px 20px;
                    border-right: 1px solid rgba(200,169,110,.12);
                    position: relative; cursor: default;
                    transition: background .22s ease;
                    overflow: hidden;
                }
                .h-stat:last-child { border-right: none; }
                .h-stat::after {
                    content: ''; position: absolute; bottom: 0; left: 50%;
                    width: 0; height: 2px;
                    background: linear-gradient(to right, transparent, var(--gold), transparent);
                    transition: width .3s ease, left .3s ease;
                    transform: translateX(-50%);
                }
                .h-stat:hover::after { width: 100%; left: 50%; }
                .h-stat:hover { background: rgba(200,169,110,.06); }

                .h-stat strong {
                    font-size: 21px; font-weight: 800; color: var(--gold);
                    font-family: 'Georgia', serif; letter-spacing: -.01em;
                    text-shadow: 0 0 18px rgba(200,169,110,.45);
                    line-height: 1;
                }
                .h-stat span {
                    font-family: 'Courier New', monospace; font-size: 11.5px;
                    font-weight: 600; letter-spacing: .13em; text-transform: uppercase;
                    color: rgba(245,240,232,.65);
                    transition: color .2s ease;
                }
                .h-stat:hover span { color: rgba(245,240,232,.9); }

                /* Stat tooltip */
                .h-stat-tip {
                    position: absolute; bottom: calc(100% + 8px); left: 50%;
                    transform: translateX(-50%) translateY(6px);
                    background: rgba(8,8,8,.92); border: 1px solid rgba(200,169,110,.3);
                    backdrop-filter: blur(12px);
                    padding: 6px 12px; border-radius: 3px;
                    font-family: 'Courier New', monospace; font-size: 9px;
                    letter-spacing: .12em; text-transform: uppercase; color: var(--gold);
                    white-space: nowrap; pointer-events: none;
                    opacity: 0; transition: opacity .18s ease, transform .18s ease;
                }
                .h-stat:hover .h-stat-tip { opacity: 1; transform: translateX(-50%) translateY(0); }

                /* ── Scroll hint ── */
                .h-scroll {
                    position: absolute; bottom: 80px; left: clamp(28px,7vw,100px);
                    z-index: 8;
                    display: flex; flex-direction: column; align-items: center; gap: 8px;
                    opacity: 0; transition: opacity .6s ease 1.5s;
                }
                .h-scroll.on { opacity: .38; }
                .h-scroll-line {
                    width: 1px; height: 40px;
                    background: linear-gradient(to bottom, var(--gold), transparent);
                    animation: scrollPulse 2.2s ease-in-out infinite;
                }
                @keyframes scrollPulse { 0%,100%{opacity:.35;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.3)} }
                .h-scroll-lbl {
                    font-family: 'Courier New', monospace; font-size: 9px;
                    letter-spacing: .24em; text-transform: uppercase; color: var(--cream);
                    writing-mode: vertical-lr;
                }

                /* ── Responsive ── */
                @media(max-width: 880px) {
                    .h-car-col { order: -1; }
                    .h-ring { display: none; }
                    .h-scroll { display: none; }
                }
                @media(max-width: 520px) {
                    .h-stat { padding: 14px 10px; }
                    .h-stat strong { font-size: 18px; }
                    .h-stat span { font-size: 10px; }
                    .h-eye { font-size: 11px; }
                }
            `}</style>

            {/* Custom cursor dots — rendered via JS to track globally */}
            <CursorTracker />

            <section className="h" ref={heroRef}>

                {/* Spotlight layer */}
                <div
                    className="h-spotlight"
                    style={{
                        background: `radial-gradient(circle 420px at ${(mouse.x + 0.5) * 100}% ${(mouse.y + 0.5) * 100}%, rgba(200,169,110,.055) 0%, transparent 65%)`,
                    }}
                />

                {/* BG */}
                <div
                    className="h-bg"
                    style={{ transform: `scale(1.06) translate(${mouse.x * -16}px, ${mouse.y * -9}px)` }}
                >
                    <Image src="/images/hero-bg.jpg" alt="" fill priority quality={85} sizes="100vw" />
                </div>
                <div className="h-ov" />
                <div className="h-grain" />
                <div className="h-scan" />
                <div className={`h-rule${on ? ' on' : ''}`} />
                <div className="h-glow" />

                {/* BODY */}
                <div className="h-body">

                    {/* LEFT: text */}
                    <div className="h-text">
                        <div className={`h-eye${on ? ' on' : ''}`}>Ajax, Ontario · Est. 2020</div>

                        <h1 className="h-h1">
                            <span style={{ display: 'block' }}>
                                {renderSplit('Premium ', 220)}
                            </span>
                            <span className="h-em">
                                {renderSplit('Detailing', 380)}
                                <span className={`h-em-line${on ? ' on' : ''}`} />
                            </span>
                            <br />
                            <span style={{ display: 'block' }}>
                                {renderSplit('& Ceramic Coating', 580)}
                            </span>
                        </h1>

                        <p className={`h-p${on ? ' on' : ''}`}>
                            Expert craftsmanship and transparent communication on every vehicle —
                            from a quick interior detail to a full ceramic coating package.
                        </p>

                        <div className={`h-ctas${on ? ' on' : ''}`}>
                            <MagneticBtn href="#contact" primary>
                                Get a Free Quote <span className="btn-arr">→</span>
                            </MagneticBtn>
                            <MagneticBtn href="#pricing">
                                View Packages <span className="btn-arr">↓</span>
                            </MagneticBtn>
                        </div>
                    </div>

                    {/* RIGHT: car with 3-D tilt + sparks */}
                    <div
                        className={`h-car-col${on ? ' on' : ''}`}
                        style={{ transform: `translate(${mouse.x * 20}px, ${mouse.y * 11}px)` }}
                    >
                        <div className="h-ring" />
                        <div className="h-bk h-bk-tl" /><div className="h-bk h-bk-tr" />
                        <div className="h-bk h-bk-bl" /><div className="h-bk h-bk-br" />

                        <div
                            className="h-car-tilt"
                            onMouseMove={onCarMove}
                            onMouseEnter={() => setCarHover(true)}
                            onMouseLeave={() => { onCarLeave(); setCarHover(false); }}
                            style={{
                                transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${carHover ? 1.03 : 1})`,
                            }}
                        >
                            <div className="h-car-frame">
                                <Image
                                    src="/images/hero-2.png"
                                    alt="Premium detail showcase"
                                    width={620}
                                    height={440}
                                    priority
                                    quality={92}
                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                />
                                {/* Sheen that shifts with tilt */}
                                <div
                                    className="h-car-sheen"
                                    style={{
                                        background: `radial-gradient(circle at ${50 + tilt.ry * 2}% ${50 + tilt.rx * 2}%, rgba(255,255,255,.1), transparent 55%)`,
                                    }}
                                />
                                {/* Spark canvas overlay */}
                                <SparkCanvas active={carHover} />
                                {/* Badge */}
                                <div className="h-badge">
                                    <span className="h-dot" />
                                    Available Today
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll hint */}
                <div className={`h-scroll${on ? ' on' : ''}`}>
                    <div className="h-scroll-line" />
                    <span className="h-scroll-lbl">Scroll</span>
                </div>

                {/* Stats */}
                <div className={`h-stats${on ? ' on' : ''}`}>
                    <div className="h-stats-inner">
                        {RAW_STATS.map((s, i) => (
                            <div
                                className="h-stat"
                                key={i}
                                onMouseEnter={() => setHoveredStat(i)}
                                onMouseLeave={() => setHoveredStat(null)}
                            >
                                <span className="h-stat-tip">{s.detail}</span>
                                <strong>
                                    <Counter value={s.strong} suffix={s.suffix} />
                                </strong>
                                <span>{s.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

/* ─── Cursor Tracker (renders into document body coords) ──────── */
function CursorTracker() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let mx = -100; let my = -100;
        let rx = -100; let ry = -100;
        let raf: number;

        const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
        document.addEventListener('mousemove', onMove);

        const loop = () => {
            rx += (mx - rx) * 0.13;
            ry += (my - ry) * 0.13;
            if (dotRef.current) { dotRef.current.style.left = `${mx}px`; dotRef.current.style.top = `${my}px`; }
            if (ringRef.current) { ringRef.current.style.left = `${rx}px`; ringRef.current.style.top = `${ry}px`; }
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => { document.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
    }, []);

    return (
        <>
            <div ref={dotRef} className="cursor-dot" style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9999 }} />
            <div ref={ringRef} className="cursor-ring" style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9998 }} />
        </>
    );
}