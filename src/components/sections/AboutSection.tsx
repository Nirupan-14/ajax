'use client';
import Image from 'next/image';
import { ABOUT_IMAGES } from '@/lib/constants';

export default function AboutSection() {
    return (
        <section className="about-section section-pad" id="about">
            <div className="container">
                <div className="about-grid">
                    {/* Left: Text */}
                    <div>
                        <span className="section-label">About Us</span>
                        <h2>Craftsmanship<br />You Can See</h2>
                        <span className="divider-navy" />
                        <p style={{ marginBottom: '1.2rem', fontSize: '0.95rem' }}>
                            At Ceramic Pro Ajax c/o Flawless Finish, our expert team — led by
                            Newton, Raku, and Nicholas — brings precision craftsmanship and
                            transparent communication to every vehicle.
                        </p>
                        <p style={{ marginBottom: '2.2rem', fontSize: '0.95rem' }}>
                            We listen, we care, and we deliver results that exceed expectations —
                            from a quick interior detail to a full ceramic coating package, every
                            car leaves looking brand new.
                        </p>
                        <a href="#contact" className="btn btn-navy">
                            Request a Quote
                        </a>
                    </div>

                    {/* Right: 2×2 Image Grid */}
                    <div className="about-images-grid">
                        {ABOUT_IMAGES.map((img, i) => (
                            <div className="about-img-wrapper" key={i}>
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    width={600}
                                    height={240}
                                    style={{ objectFit: 'cover', width: '100%', height: '240px' }}
                                    quality={85}
                                />
                                {i === 0 && (
                                    <span className="about-img-label">Expert Craftsmanship</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
