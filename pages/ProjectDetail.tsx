
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Project, ThemeConfig } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectDetailProps {
  projects: Project[];
  theme: ThemeConfig;
  setGlobalVideoPlaying: (playing: boolean) => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projects, theme, setGlobalVideoPlaying }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentIndex = projects.findIndex(p => p.id === id);
  const project = projects[currentIndex];

  useEffect(() => { 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
    return () => setGlobalVideoPlaying(false);
  }, [id, setGlobalVideoPlaying]);

  if (!project) return <div className="py-40 text-center">Not Found</div>;

  const prevProject = projects[currentIndex > 0 ? currentIndex - 1 : projects.length - 1];
  const nextProject = projects[currentIndex < projects.length - 1 ? currentIndex + 1 : 0];

  return (
    <div className="animate-in fade-in duration-1000 min-h-screen relative pb-40">
      <div className="hidden xl:block">
        <button onClick={() => navigate(`/project/${prevProject.id}`)} className="fixed left-8 top-1/2 -translate-y-1/2 z-50 group hover:-translate-x-2 transition-all"><div className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all"><ChevronLeft size={18} /></div></button>
        <button onClick={() => navigate(`/project/${nextProject.id}`)} className="fixed right-8 top-1/2 -translate-y-1/2 z-50 group hover:translate-x-2 transition-all"><div className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all"><ChevronRight size={18} /></div></button>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 pt-32">
        <Link to="/" className="inline-flex items-center gap-4 group mb-20"><div className="w-6 h-[1px] bg-black transition-all group-hover:w-10"></div><span className="text-[8px] font-black uppercase tracking-widest">Archive</span></Link>
        <header className="mb-32">
          <p className="text-[8px] font-black uppercase tracking-[0.5em] mb-4" style={{ color: theme.accentColor }}>{project.category} / {project.date}</p>
          <h1 className={`text-6xl md:text-[10rem] font-black leading-[0.8] tracking-tighter mb-20 ${theme.headingFont === 'serif' ? 'italic' : ''}`}>{project.title}</h1>
          <div className="grid md:grid-cols-12 gap-12 pt-12 border-t border-black/5"><div className="md:col-span-8"><p className="text-sm md:text-base text-gray-400 font-light leading-relaxed whitespace-pre-wrap max-w-xl">{project.description}</p></div><div className="md:col-span-4"><p className="text-[7px] font-black uppercase text-gray-300 mb-1">Timeline</p><p className="text-[10px] font-bold">{project.date}</p></div></div>
        </header>

        <div className="space-y-40">
          {/* Support for video rendering */}
          {project.videoUrl && (
            <div className="bg-black/5 backdrop-blur-lg p-0.5 shadow-2xl border border-black/5">
                {project.videoUrl.includes('youtube.com') || project.videoUrl.includes('vimeo.com') ? (
                    <iframe 
                        src={`${project.videoUrl}${project.videoUrl.includes('?') ? '&' : '?'}autoplay=0&mute=0`} 
                        className="w-full aspect-video" 
                        frameBorder="0" 
                        allowFullScreen
                        onLoad={() => {
                            // YouTube/Vimeo iframes don't easily trigger standard play/pause on the parent without postMessage
                            // but we can assume if the user is here, we might want to mute BGM if they interact
                            // For simplicity, we trigger based on standard HTML5 events where possible
                        }}
                    ></iframe>
                ) : (
                    <video 
                        src={project.videoUrl} 
                        controls 
                        className="w-full h-auto" 
                        onPlay={() => setGlobalVideoPlaying(true)}
                        onPause={() => setGlobalVideoPlaying(false)}
                        onEnded={() => setGlobalVideoPlaying(false)}
                    />
                )}
            </div>
          )}
          
          <div className="bg-white/20 backdrop-blur-lg p-0.5 shadow-2xl border border-black/5"><img src={project.imageUrl} className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-[1.5s]" /></div>
          {project.gallery?.map((img, idx) => (<div key={idx} className="bg-white/20 backdrop-blur-lg p-0.5 shadow-2xl border border-black/5"><img src={img} className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-[1.5s]" /></div>))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
