'use client';

import { useEffect, useRef, useState } from 'react';
import { STATS } from '@/lib/constants';

function useCountUp(target: number, decimals = 0, duration = 2000, shouldStart = false) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!shouldStart) return;
        let start = 0;
        const step = (target / (duration / 16));
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                setValue(target);
                clearInterval(timer);
            } else {
                setValue(parseFloat(start.toFixed(decimals)));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [shouldStart, target, decimals, duration]);
    return value;
}

function StatItem({ stat, shouldStart }: { stat: typeof STATS[0]; shouldStart: boolean }) {
    const val = useCountUp(stat.number, stat.decimals ?? 0, 2000, shouldStart);
    const display = (stat.decimals ? val.toFixed(stat.decimals) : Math.round(val).toString()) + stat.suffix;
    return (
        <div className="stat-item">
            <div className="stat-number">{display}</div>
            <div className="stat-label">{stat.label}</div>
        </div>
    );
}

export default function StatsCounter() {
    const ref = useRef<HTMLDivElement>(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStarted(true); },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="stats-section" ref={ref}>
            <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
                <div className="stats-grid">
                    {STATS.map((s) => (
                        <StatItem key={s.label} stat={s} shouldStart={started} />
                    ))}
                </div>
            </div>
        </section>
    );
}
