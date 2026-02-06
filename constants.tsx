
import { Project, ThemeConfig, SEOConfig } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: '미니멀리즘의 재해석',
    category: '브랜딩',
    description: '공간과 여백의 미학을 극대화한 현대적 브랜딩 프로젝트입니다.',
    imageUrl: 'https://picsum.photos/seed/jp1/1200/800',
    date: '2024.03'
  },
  {
    id: '2',
    title: '도시의 낮과 밤',
    category: '사진',
    description: '서울의 역동적인 조명과 건축물을 핑크빛 톤으로 담아낸 시리즈.',
    imageUrl: 'https://picsum.photos/seed/jp2/1200/800',
    date: '2024.01'
  },
  {
    id: '3',
    title: '디지털 플로럴',
    category: '디지털 아트',
    description: '자연의 곡선과 디지털 기하학이 만난 추상 예술 작품.',
    imageUrl: 'https://picsum.photos/seed/jp3/1200/800',
    date: '2023.12'
  },
  {
    id: '4',
    title: '에테르 아카이브',
    category: 'UI/UX',
    description: '사용자 경험을 넘어서는 감각적인 인터페이스 디자인 연구.',
    imageUrl: 'https://picsum.photos/seed/jp4/1200/800',
    date: '2023.10'
  }
];

export const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#ffffff',
  accentColor: '#ec4899', // Pink-500
  headingFont: 'serif',
  siteName: 'J.Park Studio',
  heroTitle: '감각적인 시각 예술의 기록',
  heroSubtitle: 'Professional Designer & Artist Portfolio',
  socialLinks: {
    instagram: 'https://instagram.com',
    behance: 'https://behance.net',
    email: 'contact@jpark.studio'
  }
};

export const DEFAULT_SEO: SEOConfig = {
  metaTitle: 'J.Park Studio | 디자인 포트폴리오',
  metaDescription: 'J.Park의 현대적이고 감각적인 작품들을 만나보세요.',
  keywords: '디자인, 포트폴리오, J.Park Studio, 브랜딩, 사진'
};
