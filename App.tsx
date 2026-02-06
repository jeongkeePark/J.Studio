
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { INITIAL_PROJECTS, DEFAULT_THEME, DEFAULT_SEO } from './constants';
import { Project, ThemeConfig, SEOConfig } from './types';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Admin from './pages/Admin';
import { Menu, X, Instagram, Mail, LayoutGrid, Settings, Edit3 } from 'lucide-react';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('jp_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('jp_theme');
    return saved ? JSON.parse(saved) : DEFAULT_THEME;
  });

  const [seo, setSeo] = useState<SEOConfig>(() => {
    const saved = localStorage.getItem('jp_seo');
    return saved ? JSON.parse(saved) : DEFAULT_SEO;
  });

  useEffect(() => {
    localStorage.setItem('jp_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('jp_theme', JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('jp_seo', JSON.stringify(seo));
  }, [seo]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.primaryColor }}>
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className={`text-2xl font-bold tracking-tighter ${theme.headingFont === 'serif' ? 'font-serif' : 'font-sans'}`}>
              {theme.siteName}<span style={{ color: theme.accentColor }}>.</span>
            </Link>

            <div className="hidden md:flex items-center space-x-10 text-sm font-medium tracking-widest uppercase">
              <Link to="/" className="hover:opacity-60 transition-opacity">Work</Link>
              <Link to="/admin" className="hover:opacity-60 transition-opacity flex items-center gap-2">
                <Settings size={14} /> Admin
              </Link>
              <a href={`mailto:${theme.socialLinks.email}`} className="px-4 py-2 border border-gray-900 hover:bg-black hover:text-white transition-all">
                Contact
              </a>
            </div>

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-8 text-2xl font-serif">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Work</Link>
            <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin</Link>
            <div className="flex space-x-6 pt-10">
              <a href={theme.socialLinks.instagram} target="_blank"><Instagram size={24} /></a>
              <a href={`mailto:${theme.socialLinks.email}`}><Mail size={24} /></a>
            </div>
          </div>
        )}

        {/* Content */}
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home projects={projects} theme={theme} />} />
            <Route path="/project/:id" element={<ProjectDetail projects={projects} theme={theme} />} />
            <Route path="/admin/*" element={
              <Admin 
                projects={projects} 
                setProjects={setProjects} 
                theme={theme} 
                setTheme={setTheme} 
                seo={seo} 
                setSeo={setSeo} 
              />
            } />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="py-20 px-6 border-t border-gray-100">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <div>
              <h2 className={`text-3xl font-bold mb-4 ${theme.headingFont === 'serif' ? 'font-serif' : ''}`}>
                Let's create something<br />
                <span style={{ color: theme.accentColor }}>remarkable</span> together.
              </h2>
              <p className="text-gray-400 text-sm">© 2024 {theme.siteName}. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href={theme.socialLinks.instagram} className="hover:opacity-60 transition-opacity">Instagram</a>
              <a href={theme.socialLinks.behance} className="hover:opacity-60 transition-opacity">Behance</a>
              <a href={`mailto:${theme.socialLinks.email}`} className="hover:opacity-60 transition-opacity">Email</a>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
