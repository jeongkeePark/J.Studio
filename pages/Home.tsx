
import React from 'react';
import { Link } from 'react-router-dom';
import { Project, ThemeConfig } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface HomeProps {
  projects: Project[];
  theme: ThemeConfig;
}

const Home: React.FC<HomeProps> = ({ projects, theme }) => {
  return (
    <div className="animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="px-6 py-40 md:py-60 max-w-screen-2xl mx-auto text-center md:text-left">
        <div className="inline-block px-4 py-1 border border-black/10 mb-10">
          <p className="text-[10px] font-black tracking-[0.5em] uppercase" style={{ color: theme.accentColor }}>
            Selected Works Vol. 1
          </p>
        </div>
        <h1 className={`text-6xl md:text-[14rem] font-black mb-12 leading-[0.8] tracking-tighter ${theme.headingFont === 'serif' ? 'font-serif italic' : 'font-sans'}`}>
          {theme.heroTitle}
        </h1>
        <p className="text-sm md:text-base text-gray-400 max-w-md font-light leading-relaxed">
          {theme.heroSubtitle}
        </p>
      </section>

      {/* Grid Section - Massive images */}
      <section className="px-6 pb-60">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {projects.map((project, idx) => (
              <Link 
                key={project.id} 
                to={`/project/${project.id}`}
                className={`group block space-y-6 ${idx % 2 === 1 ? 'md:mt-40' : ''}`}
              >
                <div className="relative overflow-hidden bg-white/20 backdrop-blur-lg p-0.5 shadow-2xl transition-transform duration-1000 hover:-translate-y-4">
                  <div className="overflow-hidden border border-black/5">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title}
                      className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                    />
                  </div>
                  {/* Subtle Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-12 text-center pointer-events-none">
                     <span className="text-[7px] font-black uppercase tracking-[0.4em] text-white/50 mb-2">{project.category}</span>
                     <h3 className="text-xl font-bold text-white tracking-tighter">{project.title}</h3>
                  </div>
                </div>
                
                <div className="flex justify-between items-end border-b border-black/5 pb-4 group-hover:border-black transition-colors">
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-300 mb-1 block">
                      {project.date}
                    </span>
                    <h3 className={`text-base font-bold ${theme.headingFont === 'serif' ? 'font-serif' : 'font-sans'}`}>
                      {project.title}
                    </h3>
                  </div>
                  <div className="w-8 h-8 flex items-center justify-center border border-black/5 rounded-full group-hover:bg-black group-hover:text-white transition-all transform group-hover:rotate-45">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
