'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { BUSINESS_INFO } from '@/lib/constants';

const stats = [
    { strong: `${BUSINESS_INFO.googleRating}★`, text: 'Google Rating' },
    { strong: `${BUSINESS_INFO.reviewCount}+`, text: 'Reviews' },
    { strong: 'Mon–Sun', text: '8AM–6PM' },
    { strong: 'Mobile', text: 'Service' },
    { strong: 'Ajax, ON', text: '& GTA' },
];

export default function HeroSection() {
    const heroRef = useRef<HTMLDivElement>(null);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [on, setOn] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setOn(true), 100);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const el = heroRef.current;
        if (!el) return;
        const fn = (e: MouseEvent) => {
            const r = el.getBoundingClientRect();
            setMouse({
                x: (e.clientX - r.left) / r.width - 0.5,
                y: (e.clientY - r.top) / r.height - 0.5,
            });
        };
        el.addEventListener('mousemove', fn);
        return () => el.removeEventListener('mousemove', fn);
    }, []);

    return (
        <>
            <style>{`
                /* ── Shell ── */
                .h {
                    position: relative;
                    min-height: 100svh;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    background: #080808;
                    font-family: 'Georgia','Times New Roman',serif;
                    --gold: #c8a96e;
                    --cream: #f5f0e8;
                }

                /* ── Background ── */
                .h-bg {
                    position: absolute; inset: 0;
                    will-change: transform;
                    transition: transform .14s ease-out;
                }
                .h-bg img { object-fit: cover; object-position: center 35%; }
                .h-ov {
                    position: absolute; inset: 0; z-index: 1;
                    background:
                        linear-gradient(115deg, rgba(4,4,4,.95) 0%, rgba(4,4,4,.7) 50%, rgba(4,4,4,.25) 100%),
                        linear-gradient(to top, rgba(4,4,4,.9) 0%, transparent 48%);
                }
                .h-grain {
                    position: absolute; inset: 0; z-index: 2; pointer-events: none; opacity: .038;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                    background-size: 180px;
                }
                /* Gold left rule */
                .h-rule {
                    position: absolute; top: 0; left: 0; z-index: 8;
                    width: 2px; height: 0;
                    background: linear-gradient(to bottom, var(--gold), rgba(200,169,110,.15));
                    transition: height 1.6s cubic-bezier(.22,1,.36,1) .3s;
                }
                .h-rule.on { height: 100%; }
                /* Ambient glow */
                .h-glow {
                    position: absolute; top: 0; right: 5%; z-index: 2;
                    width: 640px; height: 640px; border-radius: 50%; pointer-events: none;
                    background: radial-gradient(circle, rgba(200,169,110,.08) 0%, transparent 65%);
                    animation: glowPulse 5s ease-in-out infinite;
                }
                @keyframes glowPulse { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.14)} }

                /* ── Two-column body ── */
                .h-body {
                    position: relative; z-index: 5; flex: 1;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 48px;
                    align-items: center;
                    padding: clamp(100px,12vw,155px) clamp(28px,7vw,100px) 48px;
                }
                @media(max-width:880px) {
                    .h-body { grid-template-columns: 1fr; padding-top: clamp(90px,17vw,130px); }
                }

                /* ── Text column ── */
                .h-text { display: flex; flex-direction: column; gap: 22px; }

                .h-eye {
                    display: inline-flex; align-items: center; gap: 10px;
                    font-family:'Courier New',monospace; font-size:10px;
                    letter-spacing:.26em; text-transform:uppercase; color:var(--gold);
                    opacity:0; transform:translateX(-18px);
                    transition:opacity .6s ease .1s,transform .6s cubic-bezier(.22,1,.36,1) .1s;
                }
                .h-eye.on { opacity:1; transform:translateX(0); }
                .h-eye::before { content:''; width:28px; height:1px; background:var(--gold); flex-shrink:0; }

                .h-h1 {
                    margin:0;
                    font-size: clamp(2.5rem,5.2vw,4.8rem);
                    font-weight:700; line-height:1.06; letter-spacing:-.025em;
                    color:var(--cream);
                    opacity:0; transform:translateY(30px);
                    transition:opacity .8s ease .22s,transform .8s cubic-bezier(.22,1,.36,1) .22s;
                }
                .h-h1.on { opacity:1; transform:translateY(0); }
                .h-h1 em {
                    font-style:italic; color:var(--gold);
                    position:relative; display:inline-block;
                }
                .h-h1 em::after {
                    content:''; position:absolute; bottom:2px; left:0;
                    width:0; height:2px; background:var(--gold);
                    transition:width .9s cubic-bezier(.22,1,.36,1) 1.05s;
                }
                .h-h1 em.on::after { width:100%; }

                .h-p {
                    font-size:clamp(.88rem,1.45vw,1.02rem); line-height:1.75;
                    color:rgba(245,240,232,.60); max-width:430px;
                    opacity:0; transform:translateY(18px);
                    transition:opacity .7s ease .38s,transform .7s cubic-bezier(.22,1,.36,1) .38s;
                }
                .h-p.on { opacity:1; transform:translateY(0); }

                .h-ctas {
                    display:flex; flex-wrap:wrap; gap:13px;
                    opacity:0; transform:translateY(16px);
                    transition:opacity .7s ease .52s,transform .7s cubic-bezier(.22,1,.36,1) .52s;
                }
                .h-ctas.on { opacity:1; transform:translateY(0); }

                .btn {
                    display:inline-flex; align-items:center; gap:9px;
                    padding:13px 26px; border-radius:2px;
                    font-family:'Courier New',monospace; font-size:11px;
                    letter-spacing:.16em; text-transform:uppercase;
                    font-weight:700; text-decoration:none; cursor:pointer;
                    position:relative; overflow:hidden;
                    transition:transform .22s ease,box-shadow .22s ease;
                }
                .btn::before {
                    content:''; position:absolute; inset:0;
                    background:rgba(255,255,255,.1); opacity:0;
                    transition:opacity .18s ease;
                }
                .btn:hover::before { opacity:1; }
                .btn:hover { transform:translateY(-2px); }
                .btn:active { transform:scale(.98); }
                .btn-g { background:var(--gold); color:#080808; box-shadow:0 4px 22px rgba(200,169,110,.38); }
                .btn-g:hover { box-shadow:0 8px 36px rgba(200,169,110,.55); }
                .btn-o { background:transparent; color:var(--cream); border:1px solid rgba(245,240,232,.3); }
                .btn-o:hover { border-color:rgba(245,240,232,.65); }
                .btn-arr { display:inline-block; transition:transform .2s ease; }
                .btn:hover .btn-arr { transform:translateX(4px); }

                /* ── Car column ── */
                .h-car-col {
                    position:relative;
                    display:flex; align-items:center; justify-content:center;
                    opacity:0;
                    transition:opacity .9s ease .55s;
                    /* transform managed inline for parallax */
                }
                .h-car-col.on { opacity:1; }

                /* Decorative rings */
                .h-ring {
                    position:absolute; inset:-8%;
                    border-radius:50%;
                    border:1px solid rgba(200,169,110,.1);
                    animation:ringRot 24s linear infinite;
                    pointer-events:none;
                }
                .h-ring::before {
                    content:''; position:absolute; inset:12%;
                    border-radius:50%;
                    border:1px dashed rgba(200,169,110,.06);
                }
                @keyframes ringRot { to { transform:rotate(360deg); } }

                /* Corner brackets */
                .h-bk {
                    position:absolute; width:20px; height:20px; z-index:2;
                    opacity:0; transition:opacity .5s ease .8s;
                }
                .h-car-col.on .h-bk { opacity:1; }
                .h-bk-tl { top:-6px; left:-6px; border-top:2px solid var(--gold); border-left:2px solid var(--gold); }
                .h-bk-tr { top:-6px; right:-6px; border-top:2px solid var(--gold); border-right:2px solid var(--gold); }
                .h-bk-bl { bottom:-6px; left:-6px; border-bottom:2px solid var(--gold); border-left:2px solid var(--gold); }
                .h-bk-br { bottom:-6px; right:-6px; border-bottom:2px solid var(--gold); border-right:2px solid var(--gold); }

                /* Card frame */
                .h-car-frame {
                    position:relative; width:100%; border-radius:4px;
                    overflow:hidden;
                    box-shadow:
                        0 28px 80px rgba(0,0,0,.78),
                        0 0 0 1px rgba(200,169,110,.12),
                        inset 0 1px 0 rgba(255,255,255,.05);
                    animation:carFloat 6s ease-in-out infinite;
                    transition:box-shadow .3s ease;
                }
                .h-car-frame:hover {
                    box-shadow:
                        0 40px 100px rgba(0,0,0,.82),
                        0 0 0 1px rgba(200,169,110,.28),
                        0 0 60px rgba(200,169,110,.1);
                }
                @keyframes carFloat {
                    0%,100% { transform:translateY(0); }
                    50%     { transform:translateY(-10px); }
                }
                .h-car-frame img {
                    display:block; width:100%; height:auto;
                    transition:transform .5s ease;
                }
                .h-car-frame:hover img { transform:scale(1.04); }
                /* Shimmer on hover */
                .h-car-frame::after {
                    content:''; position:absolute; inset:0; pointer-events:none;
                    background:linear-gradient(135deg,transparent 45%,rgba(200,169,110,.07));
                    opacity:0; transition:opacity .3s ease;
                }
                .h-car-frame:hover::after { opacity:1; }

                /* Badge inside image */
                .h-badge {
                    position:absolute; bottom:12px; left:12px; z-index:2;
                    background:rgba(4,4,4,.82); backdrop-filter:blur(8px);
                    border:1px solid rgba(200,169,110,.25); border-radius:3px;
                    padding:7px 13px;
                    display:flex; align-items:center; gap:8px;
                    font-family:'Courier New',monospace; font-size:9.5px;
                    letter-spacing:.14em; text-transform:uppercase; color:var(--gold);
                }
                .h-dot {
                    width:6px; height:6px; border-radius:50%;
                    background:#4ade80; flex-shrink:0;
                    animation:blink 2s ease-in-out infinite;
                }
                @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.25} }

                /* ── Stats bar ── */
                .h-stats {
                    position:relative; z-index:10;
                    background:rgba(6,6,6,.82); backdrop-filter:blur(16px);
                    border-top:1px solid rgba(200,169,110,.18);
                    opacity:0; transform:translateY(14px);
                    transition:opacity .7s ease .9s,transform .7s cubic-bezier(.22,1,.36,1) .9s;
                }
                .h-stats.on { opacity:1; transform:translateY(0); }
                .h-stats-inner {
                    display:flex; overflow-x:auto; scrollbar-width:none;
                    padding:0 clamp(24px,6vw,100px);
                }
                .h-stats-inner::-webkit-scrollbar { display:none; }
                .h-stat {
                    flex:1 0 auto; min-width:80px;
                    display:flex; flex-direction:column; align-items:center; justify-content:center;
                    gap:3px; padding:16px 18px; cursor:default;
                    border-right:1px solid rgba(200,169,110,.1);
                    position:relative; transition:background .2s ease;
                }
                .h-stat:last-child { border-right:none; }
                .h-stat::after {
                    content:''; position:absolute; bottom:0; left:0;
                    width:0; height:2px; background:var(--gold);
                    transition:width .28s ease;
                }
                .h-stat:hover::after { width:100%; }
                .h-stat:hover { background:rgba(200,169,110,.05); }
                .h-stat strong {
                    font-size:15px; font-weight:700; color:var(--gold);
                    font-family:'Georgia',serif; letter-spacing:-.01em;
                }
                .h-stat span {
                    font-family:'Courier New',monospace; font-size:10px;
                    letter-spacing:.1em; text-transform:uppercase;
                    color:rgba(245,240,232,.42);
                }

                /* ── Scroll hint ── */
                .h-scroll {
                    position:absolute; bottom:76px; left:clamp(28px,7vw,100px);
                    z-index:8;
                    display:flex; flex-direction:column; align-items:center; gap:8px;
                    opacity:0; transition:opacity .6s ease 1.3s;
                }
                .h-scroll.on { opacity:.4; }
                .h-scroll-line {
                    width:1px; height:38px;
                    background:linear-gradient(to bottom,var(--gold),transparent);
                    animation:scrollPulse 2s ease-in-out infinite;
                }
                @keyframes scrollPulse { 0%,100%{opacity:.4;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.25)} }
                .h-scroll-lbl {
                    font-family:'Courier New',monospace; font-size:9px;
                    letter-spacing:.22em; text-transform:uppercase; color:var(--cream);
                    writing-mode:vertical-lr;
                }

                /* ── Responsive ── */
                @media(max-width:880px) {
                    .h-car-col { order:-1; }
                    .h-ring { display:none; }
                    .h-scroll { display:none; }
                }
                @media(max-width:520px) {
                    .h-stat { padding:12px 10px; }
                    .h-stat strong { font-size:13px; }
                }
            `}</style>

            <section className="h" ref={heroRef}>

                {/* BG */}
                <div
                    className="h-bg"
                    style={{ transform: `scale(1.06) translate(${mouse.x * -14}px,${mouse.y * -8}px)` }}
                >
                    <Image src="/images/hero-bg.jpg" alt="" fill priority quality={85} sizes="100vw" />
                </div>
                <div className="h-ov" />
                <div className="h-grain" />
                <div className={`h-rule${on ? ' on' : ''}`} />
                <div className="h-glow" />

                {/* BODY */}
                <div className="h-body">

                    {/* LEFT: text */}
                    <div className="h-text">
                        <div className={`h-eye${on ? ' on' : ''}`}>Ajax, Ontario · Est. 2020</div>

                        <h1 className={`h-h1${on ? ' on' : ''}`}>
                            Premium <em className={on ? 'on' : ''}>Detailing</em>
                            <br />&amp; Ceramic Coating
                        </h1>

                        <p className={`h-p${on ? ' on' : ''}`}>
                            Expert craftsmanship and transparent communication on every vehicle —
                            from a quick interior detail to a full ceramic coating package.
                        </p>

                        <div className={`h-ctas${on ? ' on' : ''}`}>
                            <a href="#contact" className="btn btn-g">
                                Get a Free Quote <span className="btn-arr">→</span>
                            </a>
                            <a href="#pricing" className="btn btn-o">
                                View Packages <span className="btn-arr">↓</span>
                            </a>
                        </div>
                    </div>

                    {/* RIGHT: car */}
                    <div
                        className={`h-car-col${on ? ' on' : ''}`}
                        style={{
                            transform: `translate(${mouse.x * 18}px,${mouse.y * 10}px)`,
                            transition: 'opacity .9s ease .55s, transform .12s ease-out',
                        }}
                    >
                        <div className="h-ring" />
                        <div className="h-bk h-bk-tl" />
                        <div className="h-bk h-bk-tr" />
                        <div className="h-bk h-bk-bl" />
                        <div className="h-bk h-bk-br" />

                        <div className="h-car-frame">
                            <Image
                                src="/images/about/about-1.jpg"
                                alt="Ceramic coated vehicle"
                                width={620}
                                height={440}
                                priority
                                quality={92}
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                            <div className="h-badge">
                                <span className="h-dot" />
                                Ceramic Coated · Ajax, ON
                            </div>
                        </div>
                    </div>
                </div>

                {/* SCROLL HINT */}
                <div className={`h-scroll${on ? ' on' : ''}`}>
                    <div className="h-scroll-line" />
                    <span className="h-scroll-lbl">Scroll</span>
                </div>

                {/* STATS */}
                <div className={`h-stats${on ? ' on' : ''}`}>
                    <div className="h-stats-inner">
                        {stats.map((s, i) => (
                            <div className="h-stat" key={i}>
                                <strong>{s.strong}</strong>
                                <span>{s.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}