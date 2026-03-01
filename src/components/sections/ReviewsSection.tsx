'use client';

import { REVIEWS, BUSINESS_INFO } from '@/lib/constants';
import type { Review } from '@/lib/types';

function ReviewCard({ review }: { review: Review }) {
    return (
        <div className="review-card">
            <div className="stars">★★★★★</div>
            <p className="review-text">{review.text}</p>
            <div className="review-footer">
                <div>
                    <span className="reviewer-name">{review.name}</span>
                    <div className="reviewer-meta">{review.meta}</div>
                </div>
                <div className="review-date">
                    <span>{review.date}</span>
                    <span className="google-dot" aria-hidden="true" />
                </div>
            </div>
        </div>
    );
}

export default function ReviewsSection() {
    return (
        <section className="reviews-section section-pad" id="reviews">
            <div className="container">
                <div className="reviews-header">
                    <div>
                        <span className="section-label">Customer Reviews</span>
                        <h2>What Our Customers Say</h2>
                    </div>
                    <div className="reviews-rating-block">
                        <div className="reviews-big-rating">{BUSINESS_INFO.googleRating.toFixed(1)}</div>
                        <div className="stars" style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>★★★★★</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                            {BUSINESS_INFO.reviewCount} Google Reviews
                        </div>
                        <a
                            href="https://www.google.com/search?q=Ceramic+Pro+Ajax+Flawless+Finish"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.8rem', color: 'var(--navy)', textDecoration: 'underline' }}
                        >
                            Read All Reviews →
                        </a>
                    </div>
                </div>

                <div className="reviews-grid">
                    {REVIEWS.map((r) => (
                        <ReviewCard key={r.name} review={r} />
                    ))}
                </div>
            </div>
        </section>
    );
}
