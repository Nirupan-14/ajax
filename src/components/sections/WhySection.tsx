'use client';

const cells = [
    {
        num: '01',
        title: 'Quality Service',
        body: 'Expert Detailers — Newton, Raku & Nicholas certified and trained to deliver exceptional results on every vehicle.',
    },
    {
        num: '02',
        title: 'Convenience',
        body: 'Mobile Service available across Ajax and the GTA. We come to your home, office, or wherever suits you best.',
    },
    {
        num: '03',
        title: 'Luxury Care',
        body: 'Premium Products and meticulous attention to detail. Every vehicle treated with the same high standard of care.',
    },
    {
        num: '04',
        title: 'Customer Satisfaction',
        body: 'Exceptional Results backed by 193 five-star Google reviews and transparent, honest pricing every time.',
    },
];

export default function WhySection() {
    return (
        <section className="why-section section-pad">
            <div className="container">
                <span className="section-label">Why Choose Us</span>
                <h2 style={{ marginBottom: '3rem' }}>Why Choose Us</h2>
                <div className="why-grid">
                    {cells.map((c) => (
                        <div className="why-cell" key={c.num}>
                            <div className="why-num">{c.num}</div>
                            <h3 className="why-title">{c.title}</h3>
                            <p className="why-body">{c.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
