'use client';

import { useState, useRef, useEffect } from 'react';
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

const INFO_ROWS = [
    { icon: '◎', label: 'Address', value: BUSINESS_INFO.address,          href: BUSINESS_INFO.mapsUrl,           external: true  },
    { icon: '◇', label: 'Phone',   value: BUSINESS_INFO.phone,            href: `tel:${BUSINESS_INFO.phone}`,    external: false },
    { icon: '△', label: 'Email',   value: BUSINESS_INFO.email,            href: `mailto:${BUSINESS_INFO.email}`, external: false },
    { icon: '◈', label: 'Hours',   value: 'Mon – Sun · 8:00 AM – 6:00 PM', href: null,                           external: false },
];

interface FormData   { firstName: string; lastName: string; email: string; phone: string; service: string; message: string; }
interface FormErrors { [k: string]: string; }

export default function ContactSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const [visible,  setVisible]  = useState(false);
    const [form,     setForm]     = useState<FormData>({ firstName: '', lastName: '', email: '', phone: '', service: '', message: '' });
    const [errors,   setErrors]   = useState<FormErrors>({});
    const [sending,  setSending]  = useState(false);
    const [success,  setSuccess]  = useState(false);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold: 0.08 },
        );
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

    const validate = () => {
        const errs: FormErrors = {};
        if (!form.firstName.trim()) errs.firstName = 'Required';
        if (!form.lastName.trim())  errs.lastName  = 'Required';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
        if (!form.message.trim())   errs.message   = 'Required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSending(true);
        setTimeout(() => { setSending(false); setSuccess(true); setForm({ firstName: '', lastName: '', email: '', phone: '', service: '', message: '' }); }, 1600);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
        if (errors[name]) setErrors(p => { const n = { ...p }; delete n[name]; return n; });
    };

    return (
        <>
            <style>{`
                /* ── Tokens ── */
                .cf {
                    --gold:        #C9A96E;
                    --gold-dim:    rgba(201,169,110,.10);
                    --gold-border: rgba(201,169,110,.22);
                    --white:       #FFFFFF;
                    --muted:       rgba(237,232,223,.60);
                    --input-bg:    rgba(255,255,255,.04);
                    --input-bdr:   rgba(255,255,255,.1);
                }

                /* ── Section — #0A0908 deep warm near-black ── */
                .cf {
                    position: relative;
                    padding: clamp(80px,11vw,130px) clamp(24px,6vw,80px);
                    background: #0A0908;
                    overflow: hidden;
                    font-family: 'Georgia', serif;
                }
                .cf::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(to right, transparent, rgba(201,169,110,.45) 30%, rgba(201,169,110,.45) 70%, transparent);
                    z-index: 1;
                }

                /* ambient glow — form side */
                .cf-glow {
                    position: absolute; right: 0; top: 50%; transform: translateY(-50%);
                    width: 55%; height: 80%;
                    background: radial-gradient(ellipse 65% 55% at 80% 50%, rgba(201,169,110,.045) 0%, transparent 70%);
                    pointer-events: none; z-index: 0;
                }

                /* large faint @ watermark */
                .cf-wm {
                    position: absolute; left: clamp(24px,6vw,80px); top: 50%;
                    transform: translateY(-55%);
                    font-family: 'Georgia', serif;
                    font-size: clamp(180px,25vw,340px); font-weight: 700; line-height: 1;
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(201,169,110,.04);
                    pointer-events: none; user-select: none; z-index: 0;
                }

                .cf-inner {
                    position: relative; z-index: 1;
                    max-width: 1160px; margin: 0 auto;
                }

                /* ── Two-column grid ── */
                .cf-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.5fr;
                    gap: clamp(48px,7vw,96px);
                    align-items: start;
                }
                @media(max-width:900px) { .cf-grid { grid-template-columns: 1fr; } }

                /* ══ LEFT ══ */
                .cf-left { display: flex; flex-direction: column; }

                .cf-label-tag {
                    display: inline-flex; align-items: center; gap: 12px;
                    font-family: 'Courier New', monospace;
                    font-size: 10px; font-weight: 700; letter-spacing: .28em; text-transform: uppercase;
                    color: var(--gold); margin-bottom: 16px;
                    opacity: 0; transform: translateX(-16px);
                    transition: opacity .6s ease .1s, transform .6s cubic-bezier(.22,1,.36,1) .1s;
                }
                .cf-label-tag.vis { opacity: 1; transform: translateX(0); }
                .cf-label-tag::before {
                    content: ''; width: 30px; height: 1.5px;
                    background: var(--gold); border-radius: 2px; flex-shrink: 0;
                }

                /* ★ Heading — full white */
                .cf-heading {
                    font-size: clamp(2rem,3.8vw,3.2rem);
                    font-weight: 700; line-height: 1.08; letter-spacing: -.024em;
                    color: var(--white); margin: 0 0 20px;
                    opacity: 0; transform: translateY(20px);
                    transition: opacity .7s ease .22s, transform .7s cubic-bezier(.22,1,.36,1) .22s;
                }
                .cf-heading.vis { opacity: 1; transform: translateY(0); }
                .cf-heading em { font-style: italic; color: var(--gold); }

                .cf-rule {
                    width: 0; height: 1.5px; margin-bottom: 22px;
                    background: linear-gradient(to right, var(--gold), rgba(201,169,110,.1));
                    border-radius: 2px;
                    transition: width .8s cubic-bezier(.22,1,.36,1) .42s;
                }
                .cf-rule.vis { width: 52px; }

                /* ★ Sub — readable */
                .cf-sub {
                    font-size: clamp(.9rem,1.15vw,.97rem); line-height: 1.78;
                    color: rgba(237,232,223,.70);
                    margin-bottom: 36px;
                    opacity: 0; transform: translateY(12px);
                    transition: opacity .6s ease .38s, transform .6s cubic-bezier(.22,1,.36,1) .38s;
                }
                .cf-sub.vis { opacity: 1; transform: translateY(0); }

                /* info rows list */
                .cf-info-list {
                    display: flex; flex-direction: column; gap: 0;
                    border: 1px solid var(--gold-border); border-radius: 4px; overflow: hidden;
                    margin-bottom: 28px;
                    opacity: 0; transform: translateY(12px);
                    transition: opacity .6s ease .5s, transform .6s cubic-bezier(.22,1,.36,1) .5s;
                }
                .cf-info-list.vis { opacity: 1; transform: translateY(0); }

                .cf-info-row {
                    display: flex; align-items: flex-start; gap: 14px;
                    padding: 15px 20px;
                    border-bottom: 1px solid rgba(201,169,110,.12);
                    background: rgba(255,255,255,.022);
                    text-decoration: none;
                    position: relative; overflow: hidden;
                    transition: background .2s;
                }
                .cf-info-row:last-child { border-bottom: none; }
                .cf-info-row:hover { background: rgba(201,169,110,.06); }
                .cf-info-row::after {
                    content: ''; position: absolute; bottom: 0; left: 0;
                    height: 1.5px; width: 0; background: var(--gold);
                    transition: width .32s cubic-bezier(.22,1,.36,1);
                }
                .cf-info-row:hover::after { width: 100%; }

                .cf-info-icon {
                    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
                    border: 1px solid var(--gold-border);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 12px; color: var(--gold); background: var(--gold-dim);
                    transition: background .2s, border-color .2s;
                }
                .cf-info-row:hover .cf-info-icon { background: rgba(201,169,110,.2); border-color: var(--gold); }

                /* ★ Info label + value */
                .cf-info-label {
                    font-family: 'Courier New', monospace;
                    font-size: 9px; letter-spacing: .2em; text-transform: uppercase;
                    color: rgba(201,169,110,.55); font-weight: 700; display: block; margin-bottom: 2px;
                }
                .cf-info-value {
                    font-family: 'Georgia', serif; font-size: 13.5px; line-height: 1.45;
                    color: rgba(237,232,223,.88);
                    transition: color .18s;
                }
                .cf-info-row:hover .cf-info-value { color: var(--white); }

                /* directions btn */
                .cf-dir {
                    position: relative; overflow: hidden;
                    display: inline-flex; align-items: center; gap: 8px; align-self: flex-start;
                    padding: 11px 22px; border-radius: 3px;
                    font-family: 'Courier New', monospace; font-size: 10.5px; font-weight: 800;
                    letter-spacing: .15em; text-transform: uppercase; text-decoration: none;
                    background: transparent; color: var(--gold);
                    border: 1px solid var(--gold-border);
                    opacity: 0; transform: translateY(10px);
                    transition: opacity .6s ease .65s, transform .6s cubic-bezier(.22,1,.36,1) .65s,
                                background .22s, border-color .22s, box-shadow .22s;
                }
                .cf-dir.vis { opacity: 1; transform: translateY(0); }
                .cf-dir:hover { background: var(--gold-dim); border-color: var(--gold); transform: translateY(-2px); box-shadow: 0 6px 22px rgba(201,169,110,.2); }
                .cf-dir::before {
                    content: ''; position: absolute; top: 0; left: -72px; width: 52px; height: 100%;
                    background: linear-gradient(105deg, transparent, rgba(255,255,255,.18), transparent);
                    transition: left .4s; pointer-events: none;
                }
                .cf-dir:hover::before { left: 120%; }
                .cf-dir-arr { transition: transform .2s; }
                .cf-dir:hover .cf-dir-arr { transform: translateX(4px); }

                /* ══ RIGHT — form box ══ */
                .cf-form-box {
                    background: rgba(255,255,255,.028);
                    border: 1px solid var(--gold-border); border-radius: 4px;
                    padding: clamp(28px,4vw,48px);
                    box-shadow: 0 24px 64px rgba(0,0,0,.4);
                    position: relative; overflow: hidden;
                    opacity: 0; transform: translateY(20px);
                    transition: opacity .7s ease .3s, transform .7s cubic-bezier(.22,1,.36,1) .3s;
                }
                .cf-form-box.vis { opacity: 1; transform: translateY(0); }
                /* gold top accent bar */
                .cf-form-box::before {
                    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
                    background: linear-gradient(to right, transparent, var(--gold), transparent);
                    box-shadow: 0 0 16px rgba(201,169,110,.3);
                }

                /* ★ Form title + sub */
                .cf-form-title {
                    font-size: clamp(1.2rem,1.8vw,1.45rem); font-weight: 700;
                    letter-spacing: -.015em; color: var(--white);
                    margin: 0 0 6px; line-height: 1.2;
                }
                .cf-form-sub {
                    font-family: 'Courier New', monospace; font-size: 10px;
                    letter-spacing: .16em; text-transform: uppercase;
                    color: rgba(237,232,223,.48); margin-bottom: 28px; display: block;
                }

                .cf-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
                @media(max-width:520px) { .cf-row2 { grid-template-columns: 1fr; } }

                .cf-group {
                    display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px;
                    opacity: 0; transform: translateY(10px);
                    transition: opacity .45s ease, transform .45s cubic-bezier(.22,1,.36,1);
                }
                .cf-group.cf-fvis { opacity: 1; transform: translateY(0); }

                /* ★ Labels — clearly readable */
                .cf-lbl {
                    font-family: 'Courier New', monospace; font-size: 10px; font-weight: 700;
                    letter-spacing: .16em; text-transform: uppercase;
                    color: rgba(237,232,223,.72);
                    display: flex; align-items: center; gap: 4px;
                }
                .cf-req { color: var(--gold); }

                /* ★ Inputs — white text on dark, gold focus ring */
                .cf-input, .cf-select, .cf-textarea {
                    width: 100%; padding: 12px 16px;
                    background: var(--input-bg);
                    border: 1px solid var(--input-bdr); border-radius: 3px;
                    font-family: 'Georgia', serif; font-size: 14px;
                    color: var(--white); outline: none;
                    transition: border-color .22s, box-shadow .22s, background .22s;
                    -webkit-appearance: none;
                    box-sizing: border-box;
                }
                .cf-input::placeholder, .cf-textarea::placeholder { color: rgba(237,232,223,.28); }
                .cf-input:focus, .cf-select:focus, .cf-textarea:focus {
                    border-color: var(--gold);
                    box-shadow: 0 0 0 3px rgba(201,169,110,.1);
                    background: rgba(201,169,110,.04);
                }
                .cf-input:hover:not(:focus), .cf-select:hover:not(:focus), .cf-textarea:hover:not(:focus) {
                    border-color: rgba(255,255,255,.2);
                }
                .cf-group.cf-err .cf-input,
                .cf-group.cf-err .cf-textarea {
                    border-color: rgba(239,68,68,.55);
                    box-shadow: 0 0 0 3px rgba(239,68,68,.08);
                }

                .cf-select {
                    cursor: pointer; color: var(--white);
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23C9A96E' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
                    background-repeat: no-repeat; background-position: right 14px center; padding-right: 40px;
                }
                .cf-select option { background: #1a1a18; color: var(--white); }
                .cf-textarea { resize: vertical; min-height: 120px; line-height: 1.7; }

                .cf-errmsg {
                    font-family: 'Courier New', monospace; font-size: 9.5px;
                    letter-spacing: .12em; text-transform: uppercase; color: rgba(239,68,68,.85);
                }

                /* submit */
                .cf-submit {
                    position: relative; overflow: hidden;
                    width: 100%; padding: 15px 24px;
                    background: var(--gold); color: #0a0908;
                    font-family: 'Courier New', monospace; font-size: 12px;
                    font-weight: 900; letter-spacing: .18em; text-transform: uppercase;
                    border: none; border-radius: 3px; cursor: pointer; margin-top: 4px;
                    box-shadow: 0 4px 22px rgba(201,169,110,.32);
                    transition: transform .22s, box-shadow .22s, opacity .22s;
                    box-sizing: border-box;
                }
                .cf-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 36px rgba(201,169,110,.52); }
                .cf-submit:active { transform: scale(.98); }
                .cf-submit:disabled { opacity: .65; cursor: not-allowed; }
                .cf-submit::before {
                    content: ''; position: absolute; top: 0; left: -80px; width: 60px; height: 100%;
                    background: linear-gradient(105deg, transparent, rgba(255,255,255,.32), transparent);
                    transition: left .45s; pointer-events: none;
                }
                .cf-submit:hover::before { left: 120%; }

                .cf-spinner {
                    display: inline-block; width: 13px; height: 13px;
                    border: 2px solid rgba(10,10,10,.2); border-top-color: #0a0908;
                    border-radius: 50%; animation: cfSpin .7s linear infinite;
                    vertical-align: middle; margin-right: 8px;
                }
                @keyframes cfSpin { to { transform: rotate(360deg); } }

                .cf-success {
                    margin-top: 16px; padding: 16px 20px;
                    background: rgba(74,222,128,.08); border: 1px solid rgba(74,222,128,.25); border-radius: 3px;
                    font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: .14em;
                    text-transform: uppercase; color: rgba(74,222,128,.9); text-align: center;
                    animation: cfFadeIn .4s ease;
                }
                @keyframes cfFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
            `}</style>

            <section className="cf" id="contact" ref={sectionRef}>
                <div className="cf-glow" />
                <div className="cf-wm">@</div>

                <div className="cf-inner">
                    <div className="cf-grid">

                        {/* ── LEFT ── */}
                        <div className="cf-left">
                            <span className={`cf-label-tag${visible ? ' vis' : ''}`}>Get In Touch</span>

                            <h2 className={`cf-heading${visible ? ' vis' : ''}`}>
                                Let&apos;s Talk<br /><em>About Your Car</em>
                            </h2>

                            <div className={`cf-rule${visible ? ' vis' : ''}`} />

                            <p className={`cf-sub${visible ? ' vis' : ''}`}>
                                Ready to book or have a question?<br />
                                Open 7 days a week — we respond quickly.
                            </p>

                            <div className={`cf-info-list${visible ? ' vis' : ''}`}>
                                {INFO_ROWS.map(row => {
                                    const inner = (
                                        <>
                                            <div className="cf-info-icon">{row.icon}</div>
                                            <div>
                                                <span className="cf-info-label">{row.label}</span>
                                                <span className="cf-info-value">{row.value}</span>
                                            </div>
                                        </>
                                    );
                                    return row.href ? (
                                        <a key={row.label} href={row.href} className="cf-info-row"
                                            target={row.external ? '_blank' : undefined}
                                            rel={row.external ? 'noopener noreferrer' : undefined}>
                                            {inner}
                                        </a>
                                    ) : (
                                        <div key={row.label} className="cf-info-row">{inner}</div>
                                    );
                                })}
                            </div>

                            <a href={BUSINESS_INFO.mapsUrl} target="_blank" rel="noopener noreferrer"
                                className={`cf-dir${visible ? ' vis' : ''}`}>
                                Get Directions <span className="cf-dir-arr">→</span>
                            </a>
                        </div>

                        {/* ── RIGHT — form ── */}
                        <div className={`cf-form-box${visible ? ' vis' : ''}`}>
                            <h3 className="cf-form-title">Send a Message</h3>
                            <span className="cf-form-sub">We&apos;ll get back to you within 24 hours</span>

                            <form onSubmit={handleSubmit} noValidate>

                                <div className="cf-row2">
                                    <div className={`cf-group${errors.firstName ? ' cf-err' : ''}${visible ? ' cf-fvis' : ''}`}
                                        style={{ transitionDelay: visible ? '.42s' : '0s' }}>
                                        <label className="cf-lbl" htmlFor="firstName">
                                            First Name <span className="cf-req">*</span>
                                        </label>
                                        <input id="firstName" name="firstName" type="text"
                                            className="cf-input" placeholder="John"
                                            value={form.firstName} onChange={handleChange} />
                                        {errors.firstName && <span className="cf-errmsg">{errors.firstName}</span>}
                                    </div>

                                    <div className={`cf-group${errors.lastName ? ' cf-err' : ''}${visible ? ' cf-fvis' : ''}`}
                                        style={{ transitionDelay: visible ? '.46s' : '0s' }}>
                                        <label className="cf-lbl" htmlFor="lastName">
                                            Last Name <span className="cf-req">*</span>
                                        </label>
                                        <input id="lastName" name="lastName" type="text"
                                            className="cf-input" placeholder="Smith"
                                            value={form.lastName} onChange={handleChange} />
                                        {errors.lastName && <span className="cf-errmsg">{errors.lastName}</span>}
                                    </div>
                                </div>

                                <div className={`cf-group${errors.email ? ' cf-err' : ''}${visible ? ' cf-fvis' : ''}`}
                                    style={{ transitionDelay: visible ? '.5s' : '0s' }}>
                                    <label className="cf-lbl" htmlFor="email">
                                        Email Address <span className="cf-req">*</span>
                                    </label>
                                    <input id="email" name="email" type="email"
                                        className="cf-input" placeholder="john@example.com"
                                        value={form.email} onChange={handleChange} />
                                    {errors.email && <span className="cf-errmsg">{errors.email}</span>}
                                </div>

                                <div className={`cf-group${visible ? ' cf-fvis' : ''}`}
                                    style={{ transitionDelay: visible ? '.54s' : '0s' }}>
                                    <label className="cf-lbl" htmlFor="phone">Phone Number</label>
                                    <input id="phone" name="phone" type="tel"
                                        className="cf-input" placeholder="+1 (416) 000-0000"
                                        value={form.phone} onChange={handleChange} />
                                </div>

                                <div className={`cf-group${visible ? ' cf-fvis' : ''}`}
                                    style={{ transitionDelay: visible ? '.58s' : '0s' }}>
                                    <label className="cf-lbl" htmlFor="service">Service Interested In</label>
                                    <select id="service" name="service" className="cf-select"
                                        value={form.service} onChange={handleChange}>
                                        <option value="">Select a service…</option>
                                        {SERVICE_OPTIONS.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={`cf-group${errors.message ? ' cf-err' : ''}${visible ? ' cf-fvis' : ''}`}
                                    style={{ transitionDelay: visible ? '.62s' : '0s' }}>
                                    <label className="cf-lbl" htmlFor="message">
                                        Message <span className="cf-req">*</span>
                                    </label>
                                    <textarea id="message" name="message" rows={5}
                                        className="cf-textarea" placeholder="Tell us about what you need…"
                                        value={form.message} onChange={handleChange} />
                                    {errors.message && <span className="cf-errmsg">{errors.message}</span>}
                                </div>

                                <button type="submit" className="cf-submit" disabled={sending || success}>
                                    {sending
                                        ? <><span className="cf-spinner" />Sending…</>
                                        : success ? '✓ Message Sent!'
                                        : 'Send Message →'}
                                </button>

                                {success && (
                                    <div className="cf-success">
                                        ✓ Message received — we&apos;ll be in touch within 24 hours.
                                    </div>
                                )}
                            </form>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}