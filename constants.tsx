
import { Project, ThemeConfig, SEOConfig } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Minimalist Void',
    category: 'Branding',
    description: '공간과 여백의 미학을 극대화한 현대적 브랜딩 프로젝트입니다. 단순함 속에 숨겨진 깊이감을 탐구합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=1200',
    date: '2024.03'
  },
  {
    id: '2',
    title: 'Neon Seoul Nocturne',
    category: 'Photography',
    description: '서울의 역동적인 조명과 건축물을 핑크빛 톤으로 담아낸 시리즈. 밤의 경계에서 피어나는 빛의 파편들을 기록합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1493397212122-2b85def82820?auto=format&fit=crop&q=80&w=1200',
    date: '2024.01'
  },
  {
    id: '3',
    title: 'Digital Flora',
    category: 'Digital Art',
    description: '자연의 곡선과 디지털 기하학이 만난 추상 예술 작품. 알고리즘으로 피워낸 가상의 정원을 표현합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200',
    date: '2023.12'
  },
  {
    id: '4',
    title: 'Ether Archive',
    category: 'UI/UX',
    description: '사용자 경험을 넘어서는 감각적인 인터페이스 디자인 연구. 보이지 않는 연결과 흐름을 시각화합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=1200',
    date: '2023.10'
  }
];

export const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#ffffff',
  accentColor: '#ec4899', 
  headingFont: 'serif',
  siteName: 'J.Park Studio',
  heroTitle: 'Sensory Visual Archive',
  heroSubtitle: 'Professional Designer & Artist Portfolio based in Seoul',
  bioContent: `J.Park은 시각 매체의 경계를 허무는 작업을 이어오고 있는 아티스트입니다.\n\n그는 현대 사회의 복잡함 속에서 '본질적인 단순함'을 발견하고, 이를 현대적인 미학으로 재해석하는 데 집중합니다. 미니멀리즘과 기술적 정교함 사이의 균형을 찾으며, 관객에게 정서적인 평온함과 시각적인 환희를 동시에 제공하는 것을 목표로 합니다.\n\n다양한 글로벌 브랜드와의 협업을 통해 독창적인 비주얼 언어를 구축해왔으며, 현재는 디지털 아트와 공간 디자인의 결합을 통한 새로운 경험 설계에 매진하고 있습니다.`,
  profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
  socialLinks: {
    instagram: 'https://instagram.com/jpark_studio',
    behance: 'https://behance.net/jpark',
    email: 'contact@jpark.studio'
  }
};

export const DEFAULT_SEO: SEOConfig = {
  metaTitle: 'J.Park Studio | Official Portfolio',
  metaDescription: '현대적이고 감각적인 J.Park의 디자인 아카이브입니다.',
  keywords: '디자인, 포트폴리오, J.Park, 브랜딩, 사진, 디지털아트',
};
