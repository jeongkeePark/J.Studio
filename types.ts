
export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  gallery?: string[];
  date: string;
  link?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  headingFont: 'serif' | 'sans';
  siteName: string;
  heroTitle: string;
  heroTitleSize: number;
  heroSubtitle: string;
  bioContent: string;
  profileImageUrl: string;
  contactAddress: string;
  socialLinks: {
    instagram: string;
    blog: string;
    email: string;
    phone: string;
  };
}

export interface SEOConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}
