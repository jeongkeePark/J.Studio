
import { Project, ThemeConfig, SEOConfig, Notice } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Chromatic Silence',
    category: 'Photography',
    description: '서울의 새벽 풍경을 몽환적인 톤으로 포착한 연작입니다. 정적인 순간에 깃든 역동적인 빛의 변화를 탐구합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1493397212122-2b85def82820?auto=format&fit=crop&q=80&w=1200',
    date: '2025.01'
  },
  {
    id: '2',
    title: 'Surreal Lines',
    category: 'Illustration',
    description: '자연의 유기적 형태와 기하학적 구조의 융합을 시각화한 일러스트레이션 시리즈입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200',
    date: '2024.12'
  },
  {
    id: '3',
    title: 'Liquid Motion',
    category: 'Digital Art & Video',
    description: '디지털 입자들의 흐름을 유체 역학적으로 재구성한 실험적 영상 프로젝트입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-flowing-multi-colored-gradient-background-28682-large.mp4',
    date: '2024.11'
  },
  {
    id: '4',
    title: 'Geometric Flux',
    category: 'Vector Graphic',
    description: '벡터 그래픽의 선명함과 추상적 패턴을 결합한 비주얼 아트워크입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=1200',
    date: '2024.10'
  },
  {
    id: '5',
    title: 'Font as Architecture',
    category: 'Typography',
    description: '타이포그래피를 공간적 관점에서 재해석하여 글자의 구조적 아름다움을 극대화했습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200',
    date: '2024.09'
  },
  {
    id: '6',
    title: 'Ethereal Lab',
    category: 'Brand Identity',
    description: '미래지향적인 연구소를 위한 브랜딩 시스템. 로고부터 웹 인터페이스까지 아우르는 통합 디자인 솔루션입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1200',
    date: '2024.08'
  }
];

export const INITIAL_NOTICES: Notice[] = [];

export const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#ffffff',
  accentColor: '#ec4899', 
  headingFont: 'serif',
  siteName: 'JayKayPark_Design Lab.',
  heroTitle: 'JayKayPark_Design Lab.',
  heroTitleSize: 10,
  heroSubtitle: 'Professional Designer & Artist Portfolio based in Seoul',
  bioHeadline: 'Behind the Design Lab.',
  bioContent: `J.Park은 시각 매체의 경계를 허무는 작업을 이어오고 있는 아티스트입니다.\n\n그는 현대 사회의 복잡함 속에서 '본질적인 단순함'을 발견하고, 이를 현대적인 미학으로 재해석하는 데 집중합니다.`,
  profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
  contactAddress: 'Seoul, Republic of Korea\nGangnam-gu, Dosan-daero 123',
  adminId: 'admin',
  adminPw: 'admin1234',
  socialLinks: {
    instagram: 'https://instagram.com/jpark_studio',
    blog: 'https://blog.naver.com/jpark',
    email: 'contact@jpark.studio',
    phone: '+82 10-1234-5678'
  }
};

export const DEFAULT_SEO: SEOConfig = {
  metaTitle: 'JayKayPark_Design Lab. | Official Archive',
  metaDescription: '현대적이고 감각적인 J.Park의 디자인 아카이브입니다.',
  keywords: '디자인, 포트폴리오, J.Park, 브랜딩, 사진, 디지털아트',
};
