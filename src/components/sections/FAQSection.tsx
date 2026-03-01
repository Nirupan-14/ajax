'use client';

import { useState } from 'react';
import { FAQS } from '@/lib/constants';

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

    return (
        <section className="faq-section section-pad">
            <div className="container">
                <div className="faq-grid">
                    {/* Left */}
                    <div>
                        <span className="section-label">FAQ</span>
                        <h2>Frequently<br />Asked</h2>
                        <span className="divider-navy" />
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.75 }}>
                            Can&apos;t find your answer? Contact us and we&apos;ll respond within a few hours.
                        </p>
                        <a href="#contact" className="btn btn-navy">Contact Us</a>
                    </div>

                    {/* Right: Accordion */}
                    <div className="faq-accordion">
                        {FAQS.map((faq, i) => (
                            <div key={i} className={`faq-item${openIndex === i ? ' open' : ''}`}>
                                <button className="faq-toggle" onClick={() => toggle(i)} aria-expanded={openIndex === i}>
                                    <span className="faq-question">{faq.q}</span>
                                    <span className="faq-icon">+</span>
                                </button>
                                <div className="faq-answer">
                                    <p>{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
