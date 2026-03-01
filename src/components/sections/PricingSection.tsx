'use client';

import { PACKAGES, ADDONS } from '@/lib/constants';
import type { Package } from '@/lib/types';

function PricingCard({ pkg }: { pkg: Package }) {
    const isFeatured = pkg.color === 'featured';
    const isGold = pkg.color === 'gold';

    return (
        <div className={`pricing-card${isFeatured ? ' featured' : ''}${isGold ? ' gold' : ''}`}>
            <span className="pricing-badge">{pkg.badge}</span>
            <div className="pricing-name">{pkg.label}</div>
            <div className="pricing-price">
                <span className="price-prefix">$</span>
                {pkg.price}
                <span className="price-suffix">from</span>
            </div>
            <div className="pricing-divider" />
            <ul className="pricing-features">
                {pkg.features.map((f) => (
                    <li key={f.text} className="pricing-feature">
                        <span className={`pricing-feature-check${!f.included ? ' pricing-feature-x' : ''}`}>
                            {f.included ? '✓' : '✕'}
                        </span>
                        <span style={{ opacity: f.included ? 1 : 0.45 }}>{f.text}</span>
                    </li>
                ))}
            </ul>
            <a
                href="#contact"
                className={`btn btn-full${isFeatured ? ' btn-cream' : isGold ? ' btn-gold' : ' btn-navy-outline'}`}
            >
                Book {pkg.label}
            </a>
        </div>
    );
}

export default function PricingSection() {
    return (
        <section className="pricing-section section-pad" id="pricing">
            <div className="container">
                <div style={{ maxWidth: 500, marginBottom: '3.5rem' }}>
                    <span className="section-label">Packages</span>
                    <h2 style={{ marginBottom: '1rem' }}>
                        Transparent Pricing.<br />Premium Results.
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Every package tailored to your vehicle. Prices vary by size and condition.
                    </p>
                </div>

                <div className="pricing-grid">
                    {PACKAGES.map((pkg) => (
                        <PricingCard key={pkg.id} pkg={pkg} />
                    ))}
                </div>

                <div className="pricing-addons">
                    <strong>* Prices vary by vehicle.</strong> Popular add-ons:{' '}
                    {ADDONS.map((a, i) => (
                        <span key={a.name}>
                            {a.name} <strong>${a.price}</strong>
                            {i < ADDONS.length - 1 ? ' · ' : ''}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
