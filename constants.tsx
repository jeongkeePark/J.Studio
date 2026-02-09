import { Project, ThemeConfig, SEOConfig, Notice } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    "id": "1",
    "title": "Memories",
    "category": "Photography",
    "description": "Memories",
    "imageUrl": "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?auto=format&fit=crop&q=80&w=1600",
    "date": "2025.01"
  },
  {
    "id": "2",
    "title": "Mythic Lyricism",
    "category": "Illustration",
    "description": "Mythic Lyricism",
    "imageUrl": "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200",
    "date": "2024.12"
  },
  {
    "id": "3",
    "title": "Floral Chaosmos",
    "category": "Digital Art & Video",
    "description": "Floral Chaosmos",
    "imageUrl": "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=1200",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-abstract-flowing-multi-colored-gradient-background-28682-large.mp4",
    "date": "2024.11"
  },
  {
    "id": "4",
    "title": "Geometric Flux",
    "category": "Vector Graphic",
    "description": "Geometric Flux",
    "imageUrl": "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=1200",
    "date": "2024.10"
  },
  {
    "id": "5",
    "title": "Font as Architecture",
    "category": "Typography",
    "description": "Font as Architecture",
    "imageUrl": "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200",
    "date": "2024.09"
  },
  {
    "id": "6",
    "title": "Legendary Figures",
    "category": "Brand Identity",
    "description": "Legendary Figures",
    "imageUrl": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1200",
    "date": "2024.08"
  }
];

export const INITIAL_NOTICES: Notice[] = [];

export const DEFAULT_THEME: ThemeConfig = {
  "primaryColor": "#ffffff",
  "accentColor": "#ec4899",
  "headingFont": "sans",
  "siteName": "JayKayPark_Design Lab.",
  "heroTitle": "Visual Archiving",
  "heroTitleSize": 10,
  "heroSubtitle": "Professional Designer & Artist Portfolio based in Seoul",
  "bioHeadline": "JayKayPark",
  "bioContent": `As a researcher in visual communication design, I observe the order and rhythm embedded in personal, everyday life and in nature, translating the formative principles discovered within them into a language of design. Grounded in the belief that the seemingly complex contemporary world is ultimately composed of simple structures and relationships, I pursue a mode of visual thinking that removes unnecessary ornamentation and leaves only the essential core.

In particular, I hold a deep interest in education through design, viewing design not merely as a final outcome but as a process of inquiry and thought. I believe that observations drawn from natural patterns, the flow of light, and ordinary objects in daily life cultivate in learners a renewed way of seeing and interpreting the world. My design worldview begins not with grand concepts but with small discoveries. From the veins of a leaf and the shadows swaying in the wind to the repetitive arrangements of signs and windows in the city, I learn about structure and balance, contrast and negative space.

Based on this philosophy, I move fluidly between visual design and education, seeking a creative environment where sensory experience and rational analysis are in harmony. I see design as both learning how to see and adopting an attitude toward interpreting the world. Its point of departure always lies in the closest landscapes of all—nature and everyday life.

PROFESSIONAL EXPERIENCES
2017-Present. Professor, Dept. of Art Education, Chuncheon National University of Education, Korea.
2023-2024. Visiting Scholar, Dept. of Teaching, Learning and Teacher Education, University of Nebraska, Lincoln, U.S.A. 
2019-2020. Visiting Professor, Graduate School of Education, Ewha Womans University, Korea. 
2002-2017. Associate Professor, Dept. of Visual Design, Yeonsung University, Korea. 
2000–2016. Lecturer, Dept. of Applied arts, Graduate School of Hanyang University, Korea. 


SOLO EXHIBITIONS
2017.01. 5th Individual Exhibition, "Visualizing Korea 1", Any Gallery, Seoul, Korea.
2015.05. 4th Individual Exhibition, "Chaosmos", Sowol Art Hall, Seoul, Korea.
2015.04. 3rd Individual Exhibition, "Visualizing Nature", Pyeongchon Art Hall, Gyeonggi-do, Korea.
2009.01. The 2nd Individual Exhibition, "Beyond Picture, Beyond Communication 2", Invitation to the Republic of Korea Civic Center, Tokyo Autonomous Region, Tokyo, Japan.
2008.07. The 1st Solo Exhibition, “Beyond Picture, Beyond Communication 1”, Invited by the Korean Cultural Center, Embassy of the Republic of Korea in Japan, Main Exhibition Hall, Tokyo, Japan.`,
  "profileImageUrl": "https://lh3.googleusercontent.com/d/1B6G8_965I27I853_oA1dd7228f2d",
  "contactAddress": "Seoul, Republic of Korea\nGangnam-gu, Dosan-daero 123",
  "adminId": "admin",
  "adminPw": "admin1234",
  "socialLinks": {
    "instagram": "https://instagram.com/jpark_studio",
    "blog": "https://blog.naver.com/jpark",
    "email": "jkpark@cnue.ac.kr",
    "phone": "+82 10-1234-5678"
  }
};

export const DEFAULT_SEO: SEOConfig = {
  "metaTitle": "JayKayPark_Design Lab. | Art & Design Archive",
  "metaDescription": "JayKayPark_Design Lab.",
  "keywords": "디자인, 포트폴리오, J.Park, 브랜딩, 사진, 디지털아트"
};
