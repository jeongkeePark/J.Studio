
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { INITIAL_PROJECTS, DEFAULT_THEME, DEFAULT_SEO } from './constants';
import { Project, ThemeConfig, SEOConfig } from './types';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Admin from './pages/Admin';
import Biography from './pages/Biography';
import { Menu, X, Instagram, Mail, Settings, Volume2, VolumeX } from 'lucide-react';

// Interactive Background Component
const AestheticBackground: React.FC<{ theme: ThemeConfig }> = ({ theme }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 60,
        y: (e.clientY / window.innerHeight - 0.5) * 60,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
      {/* Soft Blobs */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[140px] mix-blend-multiply animate-pulse transition-transform duration-[3s] ease-out"
        style={{ 
          backgroundColor: theme.accentColor, 
          opacity: 0.12,
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)` 
        }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] mix-blend-multiply transition-transform duration-[4s] ease-out"
        style={{ 
          backgroundColor: theme.accentColor, 
          opacity: 0.08,
          transform: `translate(${-mousePos.x * 1.2}px, ${-mousePos.y * 1.2}px)` 
        }}
      />
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
    </div>
  );
};

// Audio Controller Component
const AudioController: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Autoplay blocked"));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex items-center gap-4 group">
      <audio 
        ref={audioRef} 
        loop 
        src="https://cdn.pixabay.com/audio/2022/03/10/audio_c976f98f6d.mp3" // Minimalist Cinematic Ambient
      />
      <div className="overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-500 ease-in-out">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] whitespace-nowrap pr-4 text-gray-400">Ambient Flow</span>
      </div>
      <button 
        onClick={toggleAudio}
        className="w-12 h-12 flex items-center justify-center bg-white/50 backdrop-blur-md border border-black/5 rounded-full hover:bg-black hover:text-white transition-all shadow-xl shadow-black/5"
      >
        {isPlaying ? (
          <div className="flex gap-[2px] items-end h-3">
            <div className="w-[2px] bg-current animate-[music-bar_0.8s_ease-in-out_infinite] h-full"></div>
            <div className="w-[2px] bg-current animate-[music-bar_1.2s_ease-in-out_infinite] h-2"></div>
            <div className="w-[2px] bg-current animate-[music-bar_0.5s_ease-in-out_infinite] h-full"></div>
            <div className="w-[2px] bg-current animate-[music-bar_1.0s_ease-in-out_infinite] h-1"></div>
          </div>
        ) : (
          <VolumeX size={16} />
        )}
      </button>
      <style>{`
        @keyframes music-bar {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }
      `}</style>
    </div>
  );
};

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
      <div className="min-h-screen flex flex-col transition-colors duration-1000 font-sans" style={{ backgroundColor: theme.primaryColor }}>
        
        <AestheticBackground theme={theme} />
        <AudioController />

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-md border-b border-black/5">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className={`text-2xl font-black tracking-tighter ${theme.headingFont === 'serif' ? 'font-serif' : 'font-sans'}`}>
              {theme.siteName}<span style={{ color: theme.accentColor }}>.</span>
            </Link>

            <div className="hidden md:flex items-center space-x-12 text-[10px] font-black tracking-[0.4em] uppercase text-gray-900">
              <Link to="/" className="hover:opacity-40 transition-opacity">Work</Link>
              <Link to="/bio" className="hover:opacity-40 transition-opacity">About</Link>
              <Link to="/admin" className="flex items-center gap-2 hover:opacity-40 transition-opacity">
                <Settings size={12} strokeWidth={3} /> Dashboard
              </Link>
              <a href={`mailto:${theme.socialLinks.email}`} className="px-5 py-2.5 bg-black text-white hover:bg-gray-800 transition-all">
                Contact
              </a>
            </div>

            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center space-y-12 text-4xl font-black" style={{ backgroundColor: theme.primaryColor }}>
            <button className="absolute top-6 right-6" onClick={() => setIsMenuOpen(false)}><X size={40} /></button>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Work</Link>
            <Link to="/bio" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
          </div>
        )}

        <main className="flex-grow relative z-10">
          <Routes>
            <Route path="/" element={<Home projects={projects} theme={theme} />} />
            <Route path="/bio" element={<Biography theme={theme} />} />
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
        <footer className="py-32 px-6 border-t border-black/5 relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-16">
            <div className="max-w-md">
              <h2 className={`text-4xl md:text-6xl font-black mb-8 leading-[1.1] ${theme.headingFont === 'serif' ? 'font-serif italic' : 'font-sans'}`}>
                Designing for<br />
                the <span style={{ color: theme.accentColor }}>future</span>.
              </h2>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">© 2024 {theme.siteName} Studio Archive</p>
            </div>
            <div className="flex flex-col gap-4 text-[11px] font-black uppercase tracking-[0.4em]">
              <a href={theme.socialLinks.instagram} className="hover:opacity-40 transition-opacity">Instagram</a>
              <a href={theme.socialLinks.behance} className="hover:opacity-40 transition-opacity">Behance</a>
              <a href={`mailto:${theme.socialLinks.email}`} className="hover:opacity-40 transition-opacity">Email Portfolio</a>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
