
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
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="px-6 py-24 md:py-40 max-w-7xl mx-auto">
        <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: theme.accentColor }}>
          Portfolio Showcase
        </p>
        <h1 className={`text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight ${theme.headingFont === 'serif' ? 'font-serif' : 'font-sans'}`}>
          {theme.heroTitle}
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl font-light">
          {theme.heroSubtitle}
        </p>
      </section>

      {/* Grid Section */}
      <section className="px-6 py-20" style={{ backgroundColor: `${theme.primaryColor}80` /* Add subtle opacity to primary if needed */ }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {projects.map((project, idx) => (
              <Link 
                key={project.id} 
                to={`/project/${project.id}`}
                className={`group block space-y-6 ${idx % 2 === 1 ? 'md:mt-24' : ''}`}
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-200">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">
                      {project.category} — {project.date}
                    </span>
                    <h3 className={`text-2xl font-bold group-hover:opacity-60 transition-opacity ${theme.headingFont === 'serif' ? 'font-serif' : 'font-sans'}`}>
                      {project.title}
                    </h3>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-full group-hover:bg-black group-hover:text-white transition-all">
                    <ArrowUpRight size={20} />
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
