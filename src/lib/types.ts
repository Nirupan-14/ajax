export interface Package {
  id: string;
  label: string;
  badge: string;
  price: number;
  color: 'default' | 'featured' | 'gold';
  features: { text: string; included: boolean }[];
}

export interface Service {
  id: string;
  icon: string;
  name: string;
}

export interface GalleryImage {
  id: number;
  src: string;
  category: string;
  label: string;
}

export interface AboutImage {
  src: string;
  alt: string;
}

export interface Review {
  name: string;
  meta: string;
  date: string;
  isLocalGuide: boolean;
  text: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Stat {
  number: number;
  suffix: string;
  label: string;
  decimals?: number;
}

export interface Addon {
  name: string;
  price: number;
}
