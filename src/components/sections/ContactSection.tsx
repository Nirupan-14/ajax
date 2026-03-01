'use client';

import { useState } from 'react';
import { BUSINESS_INFO } from '@/lib/constants';

const SERVICE_OPTIONS = [
    'Paint Correction',
    'Ceramic Coating',
    'Auto Detailing',
    'Window Tinting',
    'Vehicle Wraps',
    'Paint Protection Film (PPF)',
    'Gold Package',
    'Other / Not Sure',
];

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    service: string;
    vehicle: string;
    message: string;
}

interface FormErrors {
    [key: string]: string;
}

export default function ContactSection() {
    const [form, setForm] = useState<FormData>({
        firstName: '', lastName: '', email: '', phone: '',
        service: '', vehicle: '', message: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);

    const validate = (): boolean => {
        const errs: FormErrors = {};
        if (!form.firstName.trim()) errs.firstName = 'Required';
        if (!form.lastName.trim()) errs.lastName = 'Required';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
        if (!form.message.trim()) errs.message = 'Required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSending(true);
        setTimeout(() => {
            setSending(false);
            setSuccess(true);
            setForm({ firstName: '', lastName: '', email: '', phone: '', service: '', vehicle: '', message: '' });
        }, 1600);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
    };

    return (
        <section className="contact-section section-pad" id="contact">
            <div className="container">
                <span className="section-label">Get In Touch</span>
                <h2 style={{ marginBottom: '3.5rem' }}>Contact Us</h2>

                <div className="contact-grid">
                    {/* Left: Info + Map */}
                    <div>
                        <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                            Have a question or ready to book?<br />
                            Open 7 days a week — we respond quickly.
                        </p>

                        {[
                            { icon: '📍', label: 'Address', value: BUSINESS_INFO.address },
                            { icon: '📞', label: 'Phone', value: BUSINESS_INFO.phone },
                            { icon: '📧', label: 'Email', value: BUSINESS_INFO.email },
                            { icon: '🕐', label: 'Hours', value: 'Monday – Sunday\n8:00 AM – 6:00 PM · Open 7 Days' },
                        ].map((row) => (
                            <div className="contact-info-row" key={row.label}>
                                <span className="contact-info-icon">{row.icon}</span>
                                <div>
                                    <span className="contact-info-label">{row.label}</span>
                                    <div className="contact-info-value" style={{ whiteSpace: 'pre-line' }}>{row.value}</div>
                                </div>
                            </div>
                        ))}

                        {/* Map Placeholder */}
                        <div className="map-placeholder">
                            <span className="map-placeholder-icon">🗺️</span>
                            <p className="map-placeholder-text">14 Cedar St, Ajax, ON L1S 1V1</p>
                            <a
                                href={BUSINESS_INFO.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-navy"
                                style={{ padding: '0.6rem 1.4rem', fontSize: '0.72rem' }}
                            >
                                Get Directions →
                            </a>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="contact-form-box">
                        <h3 style={{ marginBottom: '0.4rem' }}>Send a Message</h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.8rem' }}>
                            We&apos;ll get back to you within 24 hours.
                        </p>

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="firstName">First Name *</label>
                                    <input
                                        id="firstName" name="firstName" type="text"
                                        className={`form-input${errors.firstName ? ' error-field' : ''}`}
                                        placeholder="John"
                                        value={form.firstName} onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="lastName">Last Name *</label>
                                    <input
                                        id="lastName" name="lastName" type="text"
                                        className={`form-input${errors.lastName ? ' error-field' : ''}`}
                                        placeholder="Smith"
                                        value={form.lastName} onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="email">Email Address *</label>
                                <input
                                    id="email" name="email" type="email"
                                    className={`form-input${errors.email ? ' error-field' : ''}`}
                                    placeholder="john@example.com"
                                    value={form.email} onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="phone">Phone Number</label>
                                <input
                                    id="phone" name="phone" type="tel"
                                    className="form-input"
                                    placeholder="+1 (416) 000-0000"
                                    value={form.phone} onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="service">Service Interested In</label>
                                <select
                                    id="service" name="service"
                                    className="form-select"
                                    value={form.service} onChange={handleChange}
                                >
                                    <option value="">Select a service…</option>
                                    {SERVICE_OPTIONS.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="vehicle">Your Vehicle</label>
                                <input
                                    id="vehicle" name="vehicle" type="text"
                                    className="form-input"
                                    placeholder="e.g. 2022 Honda Civic Sedan"
                                    value={form.vehicle} onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="message">Message *</label>
                                <textarea
                                    id="message" name="message"
                                    className={`form-input${errors.message ? ' error-field' : ''}`}
                                    placeholder="Tell us about your vehicle and what you need…"
                                    value={form.message} onChange={handleChange}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-navy btn-full"
                                disabled={sending}
                                style={{ opacity: sending ? 0.7 : 1 }}
                            >
                                {sending ? 'Sending…' : 'Send Message'}
                            </button>

                            {success && (
                                <div className="form-success">
                                    ✅ Message sent! We&apos;ll be in touch within 24 hours.
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
