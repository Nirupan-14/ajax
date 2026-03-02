'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { GALLERY_IMAGES, GALLERY_CATEGORIES } from '@/lib/constants';

const INITIAL_VISIBLE = 6;

export default function GallerySection() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [showAll, setShowAll]           = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [visible, setVisible]           = useState(false);
    const [animating, setAnimating]       = useState(false);
    const [displayedFilter, setDisplayedFilter] = useState('All');
    const sectionRef = useRef<HTMLElement>(null);

    /* ── Scroll-trigger ── */
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold: 0.08 },
        );
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

    /* ── Filter with fade-out/in ── */
    const handleFilter = (cat: string) => {
        if (cat === activeFilter) return;
        setAnimating(true);
        setTimeout(() => {
            setActiveFilter(cat);
            setDisplayedFilter(cat);
            setShowAll(false);
            setAnimating(false);
        }, 280);
    };

    const filtered = displayedFilter === 'All'
        ? GALLERY_IMAGES
        : GALLERY_IMAGES.filter(img => img.category === displayedFilter);

    const visibleImgs = showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE);

    const openLightbox = useCallback((idx: number) => {
        setLightboxIndex(idx);
        setLightboxOpen(true);
    }, []);

    const slides = filtered.map(img => ({ src: img.src, alt: img.label }));

    return (
        <>
            <style>{`
                /* ── Tokens ── */
                .gl {
                    --gold:        #C9A96E;
                    --gold-dim:    rgba(201,169,110,.10);
                    --gold-border: rgba(201,169,110,.20);
                    --white:       #FFFFFF;
                    --muted:       rgba(232,226,217,.52);
                    --dark:        #0A0A09;
                }

                /* ── Section
                   Dark ladder:
                     Hero     #080808
                     Services #111210
                     About    #0C0C0B
                     Why      #161614
                     Gallery  #0A0A09  ← back down — creates rhythm, not monotony
                ── */
                .gl {
                    position: relative;
                    padding: clamp(80px,11vw,130px) clamp(24px,6vw,80px);
                    background: #0A0A09;
                    overflow: hidden;
                    font-family: 'Georgia', serif;
                }

                /* gold top divider */
                .gl::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(to right, transparent, rgba(201,169,110,.45) 30%, rgba(201,169,110,.45) 70%, transparent);
                    z-index: 1;
                }

                /* ambient glow — centre */
                .gl-glow {
                    position: absolute; left: 50%; top: 30%;
                    transform: translate(-50%,-50%);
                    width: 70%; height: 500px; border-radius: 50%;
                    background: radial-gradient(ellipse, rgba(201,169,110,.04) 0%, transparent 65%);
                    pointer-events: none; z-index: 0;
                }

                .gl-inner { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; }

                /* ── Header ── */
                .gl-header {
                    display: flex; align-items: flex-end; justify-content: space-between;
                    gap: 24px; margin-bottom: clamp(36px,5vw,56px); flex-wrap: wrap;
                }
                .gl-label {
                    display: inline-flex; align-items: center; gap: 12px;
                    font-family: 'Courier New', monospace;
                    font-size: 10px; font-weight: 700;
                    letter-spacing: .28em; text-transform: uppercase;
                    color: var(--gold); margin-bottom: 12px;
                    opacity: 0; transform: translateX(-16px);
                    transition: opacity .6s ease .1s, transform .6s cubic-bezier(.22,1,.36,1) .1s;
                }
                .gl-label.vis { opacity: 1; transform: translateX(0); }
                .gl-label::before {
                    content: ''; width: 30px; height: 1.5px;
                    background: var(--gold); border-radius: 2px; flex-shrink: 0;
                }
                .gl-title {
                    font-size: clamp(2rem,3.8vw,3.2rem);
                    font-weight: 700; line-height: 1.08; letter-spacing: -.024em;
                    color: var(--white); margin: 0;
                    opacity: 0; transform: translateY(20px);
                    transition: opacity .7s ease .22s, transform .7s cubic-bezier(.22,1,.36,1) .22s;
                }
                .gl-title.vis { opacity: 1; transform: translateY(0); }
                .gl-title em { font-style: italic; color: var(--gold); }
                .gl-sub {
                    font-family: 'Courier New', monospace;
                    font-size: 10px; letter-spacing: .18em; text-transform: uppercase;
                    color: var(--muted); padding-bottom: 6px;
                    opacity: 0; transition: opacity .6s ease .4s;
                }
                .gl-sub.vis { opacity: 1; }
                .gl-sub em { font-style: normal; color: var(--gold); }

                /* ── Filter tabs ── */
                .gl-filters {
                    display: flex; flex-wrap: wrap; gap: 8px;
                    margin-bottom: clamp(28px,4vw,44px);
                    opacity: 0; transform: translateY(12px);
                    transition: opacity .6s ease .35s, transform .6s cubic-bezier(.22,1,.36,1) .35s;
                }
                .gl-filters.vis { opacity: 1; transform: translateY(0); }

                .gl-filter {
                    position: relative; overflow: hidden;
                    padding: 8px 18px;
                    font-family: 'Courier New', monospace;
                    font-size: 10px; font-weight: 700;
                    letter-spacing: .16em; text-transform: uppercase;
                    color: rgba(232,226,217,.55);
                    background: rgba(255,255,255,.03);
                    border: 1px solid rgba(255,255,255,.08);
                    border-radius: 2px; cursor: pointer;
                    transition: color .2s, background .2s, border-color .2s, transform .18s;
                }
                .gl-filter:hover {
                    color: var(--white); border-color: rgba(201,169,110,.3);
                    background: rgba(201,169,110,.07);
                    transform: translateY(-1px);
                }
                .gl-filter.gl-active {
                    color: #0a0a09; background: var(--gold);
                    border-color: var(--gold);
                    box-shadow: 0 4px 16px rgba(201,169,110,.3);
                }
                /* shimmer on active */
                .gl-filter.gl-active::before {
                    content: '';
                    position: absolute; top: 0; left: -60px; width: 44px; height: 100%;
                    background: linear-gradient(105deg, transparent, rgba(255,255,255,.28), transparent);
                    animation: filterShimmer 1.8s ease .1s;
                }
                @keyframes filterShimmer { to { left: 120%; } }

                /* ── Grid ── */
                .gl-grid {
                    display: grid;
                    grid-template-columns: repeat(3,1fr);
                    gap: 3px;
                    transition: opacity .28s ease;
                }
                .gl-grid.gl-fading { opacity: 0; }
                @media(max-width:860px) { .gl-grid { grid-template-columns: repeat(2,1fr); } }
                @media(max-width:520px) { .gl-grid { grid-template-columns: 1fr; } }

                /* ── Card ── */
                .gl-card {
                    position: relative; overflow: hidden;
                    aspect-ratio: 4/3;
                    cursor: pointer;
                    background: rgba(255,255,255,.03);

                    opacity: 0; transform: scale(.94) translateY(16px);
                    transition:
                        opacity .5s ease,
                        transform .5s cubic-bezier(.22,1,.36,1);
                }
                .gl-card.gl-card-vis {
                    opacity: 1; transform: scale(1) translateY(0);
                }

                /* image zoom */
                .gl-card img {
                    transition: transform .6s cubic-bezier(.22,1,.36,1);
                }
                .gl-card:hover img { transform: scale(1.08); }

                /* dark gradient overlay — always present, intensifies on hover */
                .gl-card-ov {
                    position: absolute; inset: 0; z-index: 1; pointer-events: none;
                    background: linear-gradient(
                        to top,
                        rgba(0,0,0,.75) 0%,
                        rgba(0,0,0,.15) 45%,
                        rgba(0,0,0,0) 100%
                    );
                    transition: opacity .3s ease;
                }
                .gl-card:hover .gl-card-ov {
                    background: linear-gradient(
                        to top,
                        rgba(0,0,0,.88) 0%,
                        rgba(0,0,0,.4) 55%,
                        rgba(0,0,0,.08) 100%
                    );
                }

                /* gold border reveal on hover */
                .gl-card::after {
                    content: '';
                    position: absolute; inset: 0; z-index: 2; pointer-events: none;
                    border: 1px solid rgba(201,169,110,0);
                    transition: border-color .3s ease;
                }
                .gl-card:hover::after { border-color: rgba(201,169,110,.45); }

                /* category pill — top left */
                .gl-card-cat {
                    position: absolute; top: 12px; left: 12px; z-index: 3;
                    font-family: 'Courier New', monospace;
                    font-size: 9px; font-weight: 700;
                    letter-spacing: .18em; text-transform: uppercase;
                    color: var(--gold);
                    background: rgba(0,0,0,.7); backdrop-filter: blur(8px);
                    border: 1px solid var(--gold-border);
                    border-radius: 2px; padding: 4px 10px;
                    opacity: 0; transform: translateY(-6px);
                    transition: opacity .25s ease, transform .25s ease;
                }
                .gl-card:hover .gl-card-cat { opacity: 1; transform: translateY(0); }

                /* expand icon — top right */
                .gl-card-expand {
                    position: absolute; top: 12px; right: 12px; z-index: 3;
                    width: 34px; height: 34px; border-radius: 50%;
                    background: rgba(0,0,0,.65); backdrop-filter: blur(8px);
                    border: 1px solid rgba(201,169,110,.3);
                    display: flex; align-items: center; justify-content: center;
                    color: var(--gold);
                    opacity: 0; transform: scale(.6) rotate(-45deg);
                    transition: opacity .28s ease, transform .32s cubic-bezier(.22,1,.36,1);
                }
                .gl-card:hover .gl-card-expand { opacity: 1; transform: scale(1) rotate(0deg); }

                /* label — bottom */
                .gl-card-label {
                    position: absolute; bottom: 0; left: 0; right: 0; z-index: 3;
                    padding: 12px 14px;
                    font-family: 'Georgia', serif;
                    font-size: 13px; font-weight: 700;
                    color: var(--white); letter-spacing: -.01em;
                    transform: translateY(6px); opacity: 0;
                    transition: opacity .28s ease, transform .28s cubic-bezier(.22,1,.36,1);
                }
                .gl-card:hover .gl-card-label { opacity: 1; transform: translateY(0); }

                /* gold bottom line */
                .gl-card-line {
                    position: absolute; bottom: 0; left: 0; z-index: 4;
                    height: 2px; width: 0;
                    background: linear-gradient(to right, var(--gold), rgba(201,169,110,.3));
                    transition: width .38s cubic-bezier(.22,1,.36,1);
                    pointer-events: none;
                }
                .gl-card:hover .gl-card-line { width: 100%; }

                /* ── Load More ── */
                .gl-more {
                    text-align: center; margin-top: 36px;
                    opacity: 0; transform: translateY(10px);
                    transition: opacity .5s ease .2s, transform .5s ease .2s;
                }
                .gl-more.vis { opacity: 1; transform: translateY(0); }
                .gl-more-btn {
                    position: relative; overflow: hidden;
                    display: inline-flex; align-items: center; gap: 9px;
                    padding: 13px 32px;
                    background: transparent; color: var(--white);
                    border: 1px solid rgba(201,169,110,.35);
                    font-family: 'Courier New', monospace;
                    font-size: 11px; font-weight: 700; letter-spacing: .16em;
                    text-transform: uppercase; border-radius: 2px; cursor: pointer;
                    transition: border-color .22s, background .22s, transform .22s, box-shadow .22s;
                }
                .gl-more-btn:hover {
                    border-color: var(--gold);
                    background: var(--gold-dim);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 24px rgba(201,169,110,.2);
                }
                .gl-more-btn::before {
                    content: '';
                    position: absolute; top: 0; left: -72px; width: 52px; height: 100%;
                    background: linear-gradient(105deg, transparent, rgba(255,255,255,.12), transparent);
                    transition: left .4s; pointer-events: none;
                }
                .gl-more-btn:hover::before { left: 120%; }
                .gl-more-arr { transition: transform .2s; }
                .gl-more-btn:hover .gl-more-arr { transform: translateY(3px); }

                /* ── Count badge ── */
                .gl-count {
                    display: inline-block;
                    margin-top: 14px;
                    font-family: 'Courier New', monospace;
                    font-size: 9.5px; letter-spacing: .18em; text-transform: uppercase;
                    color: var(--muted);
                }
                .gl-count em { font-style: normal; color: var(--gold); }
            `}</style>

            <section className="gl" id="gallery" ref={sectionRef}>
                <div className="gl-glow" />

                <div className="gl-inner">
                    {/* Header */}
                    <div className="gl-header">
                        <div>
                            <p className={`gl-label${visible ? ' vis' : ''}`}>Our Work</p>
                            <h2 className={`gl-title${visible ? ' vis' : ''}`}>
                                Before &amp; <em>After</em><br />Results
                            </h2>
                        </div>
                        <span className={`gl-sub${visible ? ' vis' : ''}`}>
                            <em>{GALLERY_IMAGES.length}</em> transformations documented
                        </span>
                    </div>

                    {/* Filters */}
                    <div className={`gl-filters${visible ? ' vis' : ''}`}>
                        {GALLERY_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={`gl-filter${activeFilter === cat ? ' gl-active' : ''}`}
                                onClick={() => handleFilter(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className={`gl-grid${animating ? ' gl-fading' : ''}`}>
                        {visibleImgs.map((img, idx) => (
                            <GalleryCard
                                key={img.id}
                                img={img}
                                idx={idx}
                                sectionVisible={visible && !animating}
                                onClick={() => openLightbox(idx)}
                            />
                        ))}
                    </div>

                    {/* Load More */}
                    {filtered.length > INITIAL_VISIBLE && !showAll && (
                        <div className={`gl-more${visible ? ' vis' : ''}`}>
                            <button className="gl-more-btn" onClick={() => setShowAll(true)}>
                                Load More <span className="gl-more-arr">↓</span>
                            </button>
                            <br />
                            <span className="gl-count">
                                Showing <em>{visibleImgs.length}</em> of <em>{filtered.length}</em>
                            </span>
                        </div>
                    )}
                </div>

                {/* Lightbox */}
                <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    index={lightboxIndex}
                    slides={slides}
                    on={{ view: ({ index }) => setLightboxIndex(index) }}
                />
            </section>
        </>
    );
}

/* ── Individual card with its own IntersectionObserver ────────── */
function GalleryCard({
    img, idx, sectionVisible, onClick,
}: {
    img: { src: string; label: string; category: string };
    idx: number;
    sectionVisible: boolean;
    onClick: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [cardVis, setCardVis] = useState(false);

    useEffect(() => {
        if (!sectionVisible) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setCardVis(true); },
            { threshold: 0.1 },
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [sectionVisible]);

    return (
        <div
            ref={ref}
            className={`gl-card${cardVis ? ' gl-card-vis' : ''}`}
            style={{ transitionDelay: `${(idx % 3) * 0.08}s` }}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onClick()}
            aria-label={`View ${img.label}`}
        >
            <Image
                src={img.src}
                alt={img.label}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width:520px) 100vw, (max-width:860px) 50vw, 33vw"
                quality={80}
            />
            <div className="gl-card-ov" />
            <span className="gl-card-cat">{img.category}</span>
            <div className="gl-card-expand">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
            </div>
            <div className="gl-card-label">{img.label}</div>
            <div className="gl-card-line" />
        </div>
    );
}