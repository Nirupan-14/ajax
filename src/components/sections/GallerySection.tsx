'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { GALLERY_IMAGES, GALLERY_CATEGORIES } from '@/lib/constants';

const INITIAL_VISIBLE = 6;

export default function GallerySection() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [showAll, setShowAll] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const filtered = activeFilter === 'All'
        ? GALLERY_IMAGES
        : GALLERY_IMAGES.filter((img) => img.category === activeFilter);

    const visible = showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE);

    const openLightbox = useCallback((idx: number) => {
        setLightboxIndex(idx);
        setLightboxOpen(true);
    }, []);

    const slides = filtered.map((img) => ({ src: img.src, alt: img.label }));

    return (
        <section className="gallery-section section-pad" id="gallery">
            <div className="container">
                {/* Header */}
                <span className="section-label">Our Work</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 style={{ marginBottom: '0.5rem' }}>Before &amp; After Results</h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Hover or tap any image to explore the transformation
                        </p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="gallery-filters">
                    {GALLERY_CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            className={`filter-btn${activeFilter === cat ? ' active' : ''}`}
                            onClick={() => { setActiveFilter(cat); setShowAll(false); }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="gallery-grid">
                    {visible.map((img, idx) => (
                        <div
                            key={img.id}
                            className="gallery-card"
                            onClick={() => openLightbox(idx)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && openLightbox(idx)}
                            aria-label={`View ${img.label}`}
                        >
                            <Image
                                src={img.src}
                                alt={img.label}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 768px) 100vw, 33vw"
                                quality={80}
                            />
                            <div className="gallery-card-overlay">
                                <span className="gallery-card-category">{img.category}</span>
                                <div className="gallery-card-expand">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                                    </svg>
                                </div>
                                <div className="gallery-card-bottom">{img.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                {filtered.length > INITIAL_VISIBLE && !showAll && (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <button className="btn btn-navy" onClick={() => setShowAll(true)}>
                            Load More
                        </button>
                    </div>
                )}

                {/* Lightbox */}
                <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    index={lightboxIndex}
                    slides={slides}
                    on={{ view: ({ index }) => setLightboxIndex(index) }}
                />
            </div>
        </section>
    );
}
