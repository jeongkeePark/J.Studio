
export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  date: string;
  link?: string;
}

export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  headingFont: 'serif' | 'sans';
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  socialLinks: {
    instagram: string;
    behance: string;
    email: string;
  };
}

export interface SEOConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}
