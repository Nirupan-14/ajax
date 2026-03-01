import type { Package, Service, GalleryImage, AboutImage, Review, FAQ, Stat, Addon } from './types';

export const BUSINESS_INFO = {
    name: 'Ceramic Pro Ajax',
    subtitle: 'c/o Flawless Finish',
    address: '14 Cedar St, Ajax, ON L1S 1V1, Canada',
    phone: '[Your Phone Number]',
    email: '[Your Email Address]',
    hours: 'Monday – Sunday: 8:00 AM – 6:00 PM',
    mapsUrl: 'https://maps.google.com/?q=14+Cedar+St+Ajax+ON',
    coords: { lat: 43.8484, lng: -79.0204 },
    googleRating: 5.0,
    reviewCount: 193,
};

export const PACKAGES: Package[] = [
    {
        id: 'normal',
        label: 'Normal',
        badge: 'Essential',
        price: 99,
        color: 'default',
        features: [
            { text: 'Exterior Hand Wash', included: true },
            { text: 'Interior Vacuum', included: true },
            { text: 'Window Cleaning', included: true },
            { text: 'Tire & Rim Cleaning', included: false },
            { text: 'Paint Decontamination', included: false },
            { text: 'Interior Shampoo', included: false },
            { text: 'Paint Correction', included: false },
            { text: 'Ceramic Coating', included: false },
        ],
    },
    {
        id: 'silver',
        label: 'Silver',
        badge: 'Most Popular',
        price: 249,
        color: 'featured',
        features: [
            { text: 'Exterior Hand Wash', included: true },
            { text: 'Interior Vacuum', included: true },
            { text: 'Window Cleaning', included: true },
            { text: 'Tire & Rim Cleaning', included: true },
            { text: 'Paint Decontamination', included: true },
            { text: 'Interior Shampoo', included: true },
            { text: 'One-Step Paint Correction', included: true },
            { text: 'Ceramic Coating', included: false },
        ],
    },
    {
        id: 'gold',
        label: 'Gold',
        badge: 'Premium',
        price: 599,
        color: 'gold',
        features: [
            { text: 'Exterior Hand Wash', included: true },
            { text: 'Interior Vacuum', included: true },
            { text: 'Window Cleaning', included: true },
            { text: 'Tire & Rim Cleaning', included: true },
            { text: 'Paint Decontamination', included: true },
            { text: 'Full Interior Deep Detail', included: true },
            { text: 'Multi-Step Paint Correction', included: true },
            { text: 'Ceramic Coating (1 Layer)', included: true },
        ],
    },
];

export const SERVICES: Service[] = [
    { id: 'paint-correction', icon: '🛡️', name: 'Paint Correction' },
    { id: 'ceramic-coating', icon: '✨', name: 'Ceramic Coating' },
    { id: 'auto-detailing', icon: '🚗', name: 'Auto Detailing' },
    { id: 'window-tinting', icon: '🪟', name: 'Window Tinting' },
    { id: 'vehicle-wraps', icon: '🎨', name: 'Vehicle Wraps' },
    { id: 'ppf', icon: '💧', name: 'PPF' },
];

export const GALLERY_IMAGES: GalleryImage[] = [
    { id: 1, src: '/images/gallery/gallery-1.jpg', category: 'Ceramic Coating', label: 'Full Ceramic Package' },
    { id: 2, src: '/images/gallery/gallery-2.jpg', category: 'Paint Correction', label: 'Multi-Stage Correction' },
    { id: 3, src: '/images/gallery/gallery-3.jpg', category: 'Detailing', label: 'Interior Deep Clean' },
    { id: 4, src: '/images/gallery/gallery-4.jpg', category: 'Ceramic Coating', label: 'Hydrophobic Coating' },
    { id: 5, src: '/images/gallery/gallery-5.jpg', category: 'Wraps', label: 'Full Vehicle Wrap' },
    { id: 6, src: '/images/gallery/gallery-6.jpg', category: 'Tinting', label: 'Window Tint Package' },
    { id: 7, src: '/images/gallery/gallery-7.jpg', category: 'Paint Correction', label: 'Swirl Removal' },
    { id: 8, src: '/images/gallery/gallery-8.jpg', category: 'Detailing', label: 'Exterior Detail' },
    { id: 9, src: '/images/gallery/gallery-9.jpg', category: 'Ceramic Coating', label: 'New Car Protection' },
];

export const ABOUT_IMAGES: AboutImage[] = [
    { src: '/images/about/about-1.jpg', alt: 'Expert detailing' },
    { src: '/images/about/about-2.jpg', alt: 'Ceramic coating application' },
    { src: '/images/about/about-3.jpg', alt: 'Paint correction work' },
    { src: '/images/about/about-4.jpg', alt: 'Interior detail' },
];

export const REVIEWS: Review[] = [
    {
        name: 'Qasim Farooq',
        meta: '1 review',
        date: '1 month ago',
        isLocalGuide: false,
        text: 'Newton & Raku did an amazing job on my vehicle. The attention to detail was top-tier — inside and out looked brand new. Professional, friendly, clearly take pride in their work. Results exceeded my expectations.',
    },
    {
        name: 'Vamsi',
        meta: 'Local Guide · 8 reviews · 9 photos',
        date: '1 year ago',
        isLocalGuide: true,
        text: 'I needed an interior shampoo for my client\'s car and they did an excellent job. Very professional, came to my place without trouble. Price was very reasonable and service was top-notch. Highly recommend!',
    },
    {
        name: 'Shalini Uthirakumaran',
        meta: 'Local Guide · 33 reviews · 28 photos',
        date: '1 year ago',
        isLocalGuide: true,
        text: 'Nicholas tackled deep stains that had been there for 10 years. I was amazed at how new the car looked inside. He goes above and beyond at a reasonable price and listens carefully to every concern.',
    },
    {
        name: 'Rimple Zinder',
        meta: '2 reviews',
        date: '4 months ago',
        isLocalGuide: false,
        text: 'Excellent detailing service! My car looks and feels brand new — super clean inside and out. Friendly, professional, great attention to detail. Very happy and will definitely be back!',
    },
    {
        name: 'Moatassem Kenaan',
        meta: 'Local Guide · 18 reviews · 2 photos',
        date: '1 month ago',
        isLocalGuide: true,
        text: 'Newton and his crew are some of the nicest and most hardworking fellas I\'ve ever had the pleasure of working with. The reviews speak for themselves.',
    },
    {
        name: 'Basil Joy',
        meta: 'Local Guide · 71 reviews · 246 photos',
        date: '6 months ago',
        isLocalGuide: true,
        text: 'A bottle of Canada Dry exploded in my car covering the roof, seats and upholstery. They cleaned every bit of mess, even under the hood. I\'d easily give them a 10-star rating! Thank you, Newton!',
    },
];

export const FAQS: FAQ[] = [
    {
        q: 'What services does Ceramic Pro Ajax offer?',
        a: 'Paint correction, ceramic coating, auto detailing (interior & exterior), window tinting, vehicle wraps, and PPF. Mobile service available across Ajax and the GTA.',
    },
    {
        q: 'How long does ceramic coating last?',
        a: '3–5 years with proper maintenance, depending on environmental conditions and upkeep. We\'ll advise on the right option for your lifestyle.',
    },
    {
        q: 'Can I get a quote before the service?',
        a: 'Yes — provide vehicle details and we\'ll give a transparent, no-obligation quote. No hidden fees, no surprises.',
    },
    {
        q: 'Is an appointment required?',
        a: 'Yes, recommended 24–48 hours in advance to secure your preferred time slot.',
    },
    {
        q: 'Do you offer mobile detailing?',
        a: 'Yes — we come to your home, office, or any Ajax/Durham Region location. Just provide your address when booking.',
    },
];

export const ADDONS: Addon[] = [
    { name: 'Engine Bay Cleaning', price: 75 },
    { name: 'Headlight Restoration', price: 80 },
    { name: 'Odor Treatment', price: 60 },
    { name: 'Leather Conditioning', price: 50 },
    { name: 'Rim Coating', price: 120 },
];

export const STATS: Stat[] = [
    { number: 193, suffix: '+', label: 'Five-Star Reviews' },
    { number: 5.0, suffix: '', label: 'Google Rating', decimals: 1 },
    { number: 7, suffix: '', label: 'Days a Week' },
    { number: 100, suffix: '%', label: 'Satisfaction Guaranteed' },
];

export const GALLERY_CATEGORIES = ['All', 'Ceramic Coating', 'Paint Correction', 'Detailing', 'Wraps', 'Tinting'];
