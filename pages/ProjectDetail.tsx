
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Project, ThemeConfig } from '../types';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectDetailProps {
  projects: Project[];
  theme: ThemeConfig;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projects, theme }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find current project and its index
  const currentIndex = projects.findIndex(p => p.id === id);
  const project = projects[currentIndex];

  // Scroll to top when project changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!project) {
    return (
      <div className="py-40 text-center">
        <h2 className="text-2xl">프로젝트를 찾을 수 없습니다.</h2>
        <Link to="/" className="mt-4 inline-block underline">홈으로 돌아가기</Link>
      </div>
    );
  }

  // Navigation Logic
  const prevProject = projects[currentIndex > 0 ? currentIndex - 1 : projects.length - 1];
  const nextProject = projects[currentIndex < projects.length - 1 ? currentIndex + 1 : 0];

  const goToPrev = () => navigate(`/project/${prevProject.id}`);
  const goToNext = () => navigate(`/project/${nextProject.id}`);

  return (
    <div className="animate-in fade-in duration-700 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-20">
        
        {/* Back Button */}
        <Link to="/" className="fixed top-28 left-6 md:left-10 z-30 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold py-2 px-3 bg-white/50 backdrop-blur-sm border border-gray-100 rounded-full hover:bg-black hover:text-white transition-all group shadow-sm">
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back
        </Link>
        
        <div className="max-w-5xl mx-auto">
          {/* Header Info */}
          <div className="mb-16 mt-10 md:mt-0">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 block" style={{ color: theme.accentColor }}>
              {project.category} — {project.date}
            </span>
            <h1 className={`text-4xl md:text-7xl font-black mb-10 leading-tight tracking-tighter ${theme.headingFont === 'serif' ? 'font-serif' : ''}`}>
              {project.title}
            </h1>
            
            {/* Metadata Grid */}
            <div className="grid md:grid-cols-4 gap-8 py-8 border-y border-gray-100">
              <div className="md:col-span-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">The Narrative</h2>
                <p className="text-gray-600 leading-relaxed font-light whitespace-pre-wrap max-w-2xl">{project.description}</p>
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Timeline</h2>
                <p className="text-sm">{project.date}</p>
                {project.link && (
                  <div className="mt-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Live View</h2>
                    <a href={project.link} target="_blank" className="text-sm underline hover:opacity-50 break-all">{project.link}</a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Main Image with Side Navigation */}
          <div className="relative group mb-32">
            {/* Image Container */}
            <div className="flex justify-center bg-gray-50/50 p-4 md:p-12 rounded-3xl transition-all">
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-auto shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)] rounded-lg transition-transform duration-700" 
              />
            </div>

            {/* Side Navigation Buttons - Left */}
            <button 
              onClick={goToPrev}
              className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 p-4 md:p-6 text-gray-400 hover:text-black transition-all hover:scale-110 active:scale-95 z-20"
              aria-label="Previous Project"
            >
              <div className="bg-white/80 backdrop-blur-md border border-gray-100 p-4 rounded-full shadow-lg group-hover:bg-white transition-all">
                <ChevronLeft size={24} />
              </div>
            </button>

            {/* Side Navigation Buttons - Right */}
            <button 
              onClick={goToNext}
              className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 p-4 md:p-6 text-gray-400 hover:text-black transition-all hover:scale-110 active:scale-95 z-20"
              aria-label="Next Project"
            >
              <div className="bg-white/80 backdrop-blur-md border border-gray-100 p-4 rounded-full shadow-lg group-hover:bg-white transition-all">
                <ChevronRight size={24} />
              </div>
            </button>

            {/* Hint for Next/Prev (Desktop) */}
            <div className="hidden md:block absolute -bottom-10 left-0 right-0 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
              Use side arrows to browse gallery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
