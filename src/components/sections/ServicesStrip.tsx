'use client';
import { SERVICES } from '@/lib/constants';

export default function ServicesStrip() {
    return (
        <section className="services-strip section-pad" id="services">
            <div className="container">
                <span className="section-label">What We Do</span>
                <div className="services-grid">
                    {SERVICES.map((s) => (
                        <div className="service-cell" key={s.id}>
                            <span className="service-icon">{s.icon}</span>
                            <span className="service-name">{s.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
