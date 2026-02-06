
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
    <div className="animate-in fade-in duration-700 bg-white min-h-screen">
      {/* Desktop Navigation Buttons - Improved responsiveness */}
      <div className="hidden xl:block">
        <button 
          onClick={goToPrev}
          className="fixed left-4 2xl:left-[calc(50%-42rem)] top-1/2 -translate-y-1/2 p-2 text-gray-200 hover:text-black transition-all hover:scale-110 active:scale-95 z-40 group"
          aria-label="Previous Project"
        >
          <div className="bg-white/50 backdrop-blur-sm border border-gray-100 p-5 rounded-full shadow-sm group-hover:bg-white group-hover:shadow-xl group-hover:border-gray-200 transition-all">
            <ChevronLeft size={32} strokeWidth={1} />
          </div>
          <span className="absolute top-full left-1/2 -translate-x-1/2 mt-4 text-[9px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-black">Previous</span>
        </button>

        <button 
          onClick={goToNext}
          className="fixed right-4 2xl:right-[calc(50%-42rem)] top-1/2 -translate-y-1/2 p-2 text-gray-200 hover:text-black transition-all hover:scale-110 active:scale-95 z-40 group"
          aria-label="Next Project"
        >
          <div className="bg-white/50 backdrop-blur-sm border border-gray-100 p-5 rounded-full shadow-sm group-hover:bg-white group-hover:shadow-xl group-hover:border-gray-200 transition-all">
            <ChevronRight size={32} strokeWidth={1} />
          </div>
          <span className="absolute top-full left-1/2 -translate-x-1/2 mt-4 text-[9px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-black">Next Project</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative">
        
        {/* Fixed Back Button */}
        <Link to="/" className="fixed top-28 left-6 md:left-10 z-30 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold py-2.5 px-4 bg-white/70 backdrop-blur-md border border-gray-100 rounded-full hover:bg-black hover:text-white transition-all group shadow-sm">
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back
        </Link>
        
        <div className="max-w-5xl mx-auto relative">
          {/* Project Header */}
          <div className="mb-20 mt-10 md:mt-0 text-center md:text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-6 block" style={{ color: theme.accentColor }}>
              {project.category} — {project.date}
            </span>
            <h1 className={`text-5xl md:text-8xl font-black mb-12 leading-none tracking-tighter ${theme.headingFont === 'serif' ? 'font-serif' : ''}`}>
              {project.title}
            </h1>
            
            <div className="grid md:grid-cols-4 gap-12 py-10 border-y border-gray-100">
              <div className="md:col-span-3">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300 mb-4">Project Narrative</h2>
                <p className="text-gray-600 text-lg leading-relaxed font-light whitespace-pre-wrap max-w-2xl">{project.description}</p>
              </div>
              <div className="space-y-6">
                <div>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300 mb-2">Released</h2>
                  <p className="text-sm font-medium">{project.date}</p>
                </div>
                {project.link && (
                  <div>
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300 mb-2">Platform</h2>
                    <a href={project.link} target="_blank" className="text-sm underline hover:opacity-50 transition-opacity break-all">{project.link}</a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Project Gallery */}
          <div className="relative space-y-24 mb-40">
            {/* Mobile Navigation */}
            <div className="lg:hidden flex justify-between items-center mb-8 py-4 border-b">
               <button onClick={goToPrev} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><ChevronLeft size={20} /> Prev</button>
               <button onClick={goToNext} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">Next <ChevronRight size={20} /></button>
            </div>

            {/* Main Cover Image */}
            <div className="bg-gray-50/30 rounded-[2rem] overflow-hidden shadow-2xl">
              <img 
                src={project.imageUrl} 
                alt={`${project.title} - Main`} 
                className="w-full h-auto" 
              />
            </div>

            {/* Gallery Images */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="space-y-24">
                {project.gallery.map((img, idx) => (
                  <div key={idx} className="bg-gray-50/30 rounded-[2rem] overflow-hidden shadow-xl">
                    <img 
                      src={img} 
                      alt={`${project.title} - Work ${idx + 1}`} 
                      className="w-full h-auto" 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Bottom Link */}
          <div className="text-center py-20 border-t border-gray-50">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-300 mb-4">End of Collection</p>
            <Link to="/" className="text-sm font-bold border-b border-black pb-1 hover:opacity-50 transition-opacity">Back to Work Index</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
