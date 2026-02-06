
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { INITIAL_PROJECTS, DEFAULT_THEME, DEFAULT_SEO } from './constants';
import { Project, ThemeConfig, SEOConfig } from './types';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Admin from './pages/Admin';
import Biography from './pages/Biography';
import { Menu, X, Settings, VolumeX } from 'lucide-react';

// --- IndexedDB Utility ---
const DB_NAME = 'JParkStudioDB';
const STORE_NAME = 'projects';

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveProjectsToDB = async (projects: Project[]) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  // Clear and rewrite
  store.clear();
  projects.forEach(p => store.put(p));
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

const getProjectsFromDB = async (): Promise<Project[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const results = request.result;
      resolve(results.length > 0 ? results : INITIAL_PROJECTS);
    };
    request.onerror = () => reject(request.error);
  });
};
// -------------------------

const AestheticBackground: React.FC<{ theme: ThemeConfig }> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 100;
    const mouse = { x: -1000, y: -1000 };
    class Particle {
      x: number; y: number; size: number; vx: number; vy: number; opacity: number; glowSize: number;
      constructor() { this.init(); }
      init() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 4 + 2.5;
        this.vx = (Math.random() - 0.5) * 0.15;
        this.vy = (Math.random() - 0.5) * 0.15;
        this.opacity = Math.random() * 0.5 + 0.4;
        this.glowSize = Math.random() * 25 + 15;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        const dx = mouse.x - this.x; const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300) {
          const force = (300 - dist) / 300;
          this.x -= (dy / dist) * force * 2;
          this.y += (dx / dist) * force * 2;
        }
        if (this.x < 0) this.x = canvas!.width;
        if (this.x > canvas!.width) this.x = 0;
        if (this.y < 0) this.y = canvas!.height;
        if (this.y > canvas!.height) this.y = 0;
      }
      draw() {
        if (!ctx) return;
        ctx.save(); ctx.shadowBlur = this.glowSize; ctx.shadowColor = theme.accentColor;
        ctx.globalAlpha = this.opacity; ctx.fillStyle = theme.accentColor;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }
    const init = () => {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      particles = Array.from({ length: particleCount }, () => new Particle());
    };
    const animate = () => {
      ctx.fillStyle = theme.primaryColor === '#ffffff' ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animationFrameId = requestAnimationFrame(animate);
    };
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('resize', init);
    init(); animate();
    return () => { cancelAnimationFrame(animationFrameId); };
  }, [theme.accentColor, theme.primaryColor]);
  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

const AudioController: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSource = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";
  useEffect(() => {
    const unlock = () => {
      if (!isActivated && audioRef.current) {
        audioRef.current.play().then(() => { setIsPlaying(true); setIsActivated(true); }).catch(() => {});
        window.removeEventListener('click', unlock);
      }
    };
    window.addEventListener('click', unlock);
    return () => window.removeEventListener('click', unlock);
  }, [isActivated]);
  return (
    <div className="fixed bottom-10 right-10 z-[100]">
      <audio ref={audioRef} loop src={audioSource} />
      <div className="flex flex-col items-end gap-3">
        {!isActivated && <div className="bg-black text-white text-[7px] font-black uppercase tracking-[0.4em] px-4 py-2 animate-pulse">Activate Sound</div>}
        <button onClick={() => { if (audioRef.current) { if (isPlaying) audioRef.current.pause(); else audioRef.current.play(); setIsPlaying(!isPlaying); setIsActivated(true); } }} className={`w-14 h-14 flex items-center justify-center rounded-full transition-all border ${isPlaying ? 'bg-black text-white' : 'bg-white/40 text-black border-black/5'}`}>
          {isPlaying ? <div className="flex gap-[4px] items-end h-4"><div className="w-[2.5px] bg-white animate-[music-bar_3s_infinite] h-full" /><div className="w-[2.5px] bg-white animate-[music-bar_1.8s_infinite] h-2" /><div className="w-[2.5px] bg-white animate-[music-bar_4s_infinite] h-4" /></div> : <VolumeX size={18} />}
        </button>
      </div>
      <style>{`@keyframes music-bar { 0%, 100% { height: 4px; } 50% { height: 16px; } }`}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('jp_theme');
    return saved ? JSON.parse(saved) : DEFAULT_THEME;
  });
  const [seo, setSeo] = useState<SEOConfig>(() => {
    const saved = localStorage.getItem('jp_seo');
    return saved ? JSON.parse(saved) : DEFAULT_SEO;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Load projects from IndexedDB on start
  useEffect(() => {
    getProjectsFromDB().then(setProjects);
  }, []);

  // Save projects to IndexedDB whenever they change
  useEffect(() => {
    if (projects.length > 0) saveProjectsToDB(projects);
  }, [projects]);

  useEffect(() => localStorage.setItem('jp_theme', JSON.stringify(theme)), [theme]);
  useEffect(() => localStorage.setItem('jp_seo', JSON.stringify(seo)), [seo]);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col transition-colors duration-1000 font-sans" style={{ backgroundColor: theme.primaryColor }}>
        <AestheticBackground theme={theme} />
        <AudioController />
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-md border-b border-black/5">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className={`text-2xl font-black tracking-tighter ${theme.headingFont === 'serif' ? 'font-serif' : 'font-sans'}`}>{theme.siteName}<span style={{ color: theme.accentColor }}>.</span></Link>
            <div className="hidden md:flex items-center space-x-12 text-[10px] font-black uppercase tracking-[0.4em]">
              <Link to="/">Work</Link><Link to="/bio">Biography</Link><Link to="/admin" className="flex items-center gap-2"><Settings size={12} /> Dashboard</Link>
              <a href={`mailto:${theme.socialLinks.email}`} className="px-5 py-2.5 bg-black text-white">Contact</a>
            </div>
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </nav>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center space-y-12 text-4xl font-black bg-white">
            <button className="absolute top-6 right-6" onClick={() => setIsMenuOpen(false)}><X size={40} /></button>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Work</Link><Link to="/bio" onClick={() => setIsMenuOpen(false)}>Biography</Link><Link to="/admin" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
          </div>
        )}
        <main className="flex-grow relative z-10">
          <Routes>
            <Route path="/" element={<Home projects={projects} theme={theme} />} />
            <Route path="/bio" element={<Biography theme={theme} />} />
            <Route path="/project/:id" element={<ProjectDetail projects={projects} theme={theme} />} />
            <Route path="/admin/*" element={<Admin projects={projects} setProjects={setProjects} theme={theme} setTheme={setTheme} seo={seo} setSeo={setSeo} />} />
          </Routes>
        </main>
        <footer className="py-32 px-6 border-t border-black/5 relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-16">
            <div className="max-w-md">
              <h2 className={`text-4xl md:text-6xl font-black mb-8 leading-[1.1] ${theme.headingFont === 'serif' ? 'font-serif italic' : ''}`}>Designing for<br />the <span style={{ color: theme.accentColor }}>future</span>.</h2>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">© 2024 {theme.siteName}</p>
            </div>
            <div className="flex flex-col gap-4 text-[11px] font-black uppercase tracking-[0.4em]">
              <a href={theme.socialLinks.instagram} target="_blank">Instagram</a><a href={theme.socialLinks.behance} target="_blank">Behance</a><a href={`mailto:${theme.socialLinks.email}`}>Email</a>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
