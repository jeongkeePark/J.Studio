
export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string; // Cover image
  gallery?: string[]; // Additional works/images
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
  bioContent: string;
  profileImageUrl: string;
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
