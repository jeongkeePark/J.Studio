
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Project, ThemeConfig } from '../types';
import { ArrowLeft } from 'lucide-react';

interface ProjectDetailProps {
  projects: Project[];
  theme: ThemeConfig;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projects, theme }) => {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="py-40 text-center">
        <h2 className="text-2xl">프로젝트를 찾을 수 없습니다.</h2>
        <Link to="/" className="mt-4 inline-block underline">홈으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link to="/" className="flex items-center gap-2 text-sm uppercase tracking-widest font-bold mb-12 hover:opacity-60">
          <ArrowLeft size={16} /> Back to Works
        </Link>
        
        <span className="text-xs font-bold uppercase tracking-widest mb-4 block" style={{ color: theme.accentColor }}>
          {project.category}
        </span>
        <h1 className={`text-4xl md:text-6xl font-black mb-8 ${theme.headingFont === 'serif' ? 'font-serif' : ''}`}>
          {project.title}
        </h1>
        
        <div className="aspect-video overflow-hidden mb-12">
          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tighter">About Project</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{project.description}</p>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Date</h3>
              <p>{project.date}</p>
            </div>
            {project.link && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Live Site</h3>
                <a href={project.link} target="_blank" className="underline hover:opacity-60">{project.link}</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
