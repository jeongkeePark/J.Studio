
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Project, ThemeConfig } from '../types';
import { ArrowLeft, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface ProjectDetailProps {
  projects: Project[];
  theme: ThemeConfig;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projects, theme }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const currentIndex = projects.findIndex(p => p.id === id);
  const project = projects[currentIndex];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!project) {
    return (
      <div className="py-40 text-center">
        <h2 className="text-2xl font-bold">프로젝트를 찾을 수 없습니다.</h2>
        <Link to="/" className="mt-4 inline-block underline text-gray-400 hover:text-black">홈으로 돌아가기</Link>
      </div>
    );
  }

  const prevProject = projects[currentIndex > 0 ? currentIndex - 1 : projects.length - 1];
  const nextProject = projects[currentIndex < projects.length - 1 ? currentIndex + 1 : 0];

  const goToPrev = () => navigate(`/project/${prevProject.id}`);
  const goToNext = () => navigate(`/project/${nextProject.id}`);

  return (
    <div className="animate-in fade-in duration-1000 min-h-screen relative">
      
      {/* Desktop Navigation - Sensible & Stylish */}
      <div className="hidden xl:block">
        <button 
          onClick={goToPrev}
          className="fixed left-8 top-1/2 -translate-y-1/2 z-50 group flex flex-col items-center gap-4 transition-all hover:-translate-x-2"
        >
          <div className="w-12 h-12 rounded-full border border-black/5 bg-white/30 backdrop-blur-lg flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-xl">
            <ChevronLeft size={18} />
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 text-center">
             <p className="text-[6px] font-black uppercase tracking-[0.4em] text-gray-400">Prev</p>
             <p className="text-[8px] font-serif italic text-black whitespace-nowrap">{prevProject.title}</p>
          </div>
        </button>

        <button 
          onClick={goToNext}
          className="fixed right-8 top-1/2 -translate-y-1/2 z-50 group flex flex-col items-center gap-4 transition-all hover:translate-x-2"
        >
          <div className="w-12 h-12 rounded-full border border-black/5 bg-white/30 backdrop-blur-lg flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-xl">
            <ChevronRight size={18} />
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 text-center">
             <p className="text-[6px] font-black uppercase tracking-[0.4em] text-gray-400">Next</p>
             <p className="text-[8px] font-serif italic text-black whitespace-nowrap">{nextProject.title}</p>
          </div>
        </button>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 pt-32 relative z-10">
        
        {/* Back link */}
        <div className="mb-20">
          <Link to="/" className="inline-flex items-center gap-4 group">
            <div className="w-6 h-[1px] bg-black transition-all group-hover:w-10"></div>
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Back to Archive</span>
          </Link>
        </div>
        
        <div className="w-full">
          {/* Project Header */}
          <header className="mb-32">
            <p className="text-[8px] font-black uppercase tracking-[0.5em] mb-4" style={{ color: theme.accentColor }}>
              {project.category} / {project.date}
            </p>
            <h1 className={`text-6xl md:text-[11rem] font-black leading-[0.8] tracking-tighter mb-20 ${theme.headingFont === 'serif' ? 'font-serif italic' : ''}`}>
              {project.title}
            </h1>
            
            <div className="grid md:grid-cols-12 gap-12 pt-12 border-t border-black/5">
              <div className="md:col-span-8">
                {/* Even smaller, more delicate description text */}
                <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed whitespace-pre-wrap max-w-xl">
                  {project.description}
                </p>
              </div>
              <div className="md:col-span-4 space-y-6">
                <div>
                  <h3 className="text-[7px] font-black uppercase tracking-[0.3em] text-gray-300 mb-1">Timeline</h3>
                  <p className="text-[10px] font-bold">{project.date}</p>
                </div>
                {project.link && (
                  <div>
                    <h3 className="text-[7px] font-black uppercase tracking-[0.3em] text-gray-300 mb-1">Resource</h3>
                    <a href={project.link} target="_blank" className="text-[10px] font-bold border-b border-black/10 hover:border-black transition-all">Visit Project Site</a>
                  </div>
                )}
              </div>
            </div>
          </header>
          
          {/* Massive Visual Showcase */}
          <div className="space-y-40">
            <div className="bg-white/20 backdrop-blur-lg p-0.5 shadow-2xl border border-black/5">
              <img src={project.imageUrl} className="w-full h-auto block grayscale hover:grayscale-0 transition-all duration-[1.5s]" />
            </div>

            {project.gallery?.map((img, idx) => (
              <div key={idx} className="bg-white/20 backdrop-blur-lg p-0.5 shadow-2xl border border-black/5">
                <img src={img} className="w-full h-auto block grayscale hover:grayscale-0 transition-all duration-[1.5s]" />
              </div>
            ))}
          </div>
          
          {/* Mobile Navigation */}
          <div className="xl:hidden mt-32 grid grid-cols-2 gap-1">
             <button onClick={goToPrev} className="p-8 bg-white/40 backdrop-blur-md text-left border border-black/5">
                <span className="text-[6px] font-black uppercase tracking-widest text-gray-400 block mb-1">Prev</span>
                <span className="font-bold text-[10px] truncate block">{prevProject.title}</span>
             </button>
             <button onClick={goToNext} className="p-8 bg-black text-white text-right">
                <span className="text-[6px] font-black uppercase tracking-widest text-gray-400 block mb-1">Next</span>
                <span className="font-bold text-[10px] truncate block">{nextProject.title}</span>
             </button>
          </div>

          <div className="mt-40 text-center pb-40">
            <Link to="/" className="text-[8px] font-black uppercase tracking-[0.5em] opacity-30 hover:opacity-100 transition-opacity">
              Close View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
