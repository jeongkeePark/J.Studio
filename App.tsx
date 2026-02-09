
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { INITIAL_PROJECTS, DEFAULT_THEME, DEFAULT_SEO } from './constants';
import { Project, ThemeConfig, SEOConfig } from './types';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Admin from './pages/Admin';
import Biography from './pages/Biography';
import Contact from './pages/Contact';
import { Menu, X, Settings, VolumeX } from 'lucide-react';

// --- IndexedDB Utility ---
const DB_NAME = 'JParkStudioDB';
const STORE_PROJECTS = 'projects';

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 5);
    request.onupgradeneeded = (event: any) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
        db.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveToDB = async (storeName: string, data: any[]) => {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  store.clear();
  data.forEach(item => store.put(item));
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

const getFromDB = async (storeName: string, initialData: any[]): Promise<any[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => {
      const results = request.result;
      resolve(results.length > 0 ? results : initialData);
    };
    request.onerror = () => reject(request.error);
  });
};

// Dreamy Pink Particle Background (Dots & Lines reacting to mouse)
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
    const mouse = { x: -2000, y: -2000 };

    class Particle {
      x: number; y: number; vx: number; vy: number; size: number;
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2 + 0.5;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300) {
          const force = (300 - dist) / 300;
          this.x += dx * force * 0.015;
          this.y += dy * force * 0.015;
        }

        if (this.x < 0) this.x = canvas!.width;
        if (this.x > canvas!.width) this.x = 0;
        if (this.y < 0) this.y = canvas!.height;
        if (this.y > canvas!.height) this.y = 0;
      }
      draw() {
        if (!ctx) return;
        ctx.fillStyle = theme.accentColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: particleCount }, () => new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.update();
        p.draw();
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = theme.accentColor;
            ctx.lineWidth = 0.3;
            ctx.globalAlpha = (1 - dist / 120) * 0.3;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distM = Math.sqrt(dx * dx + dy * dy);
        if (distM < 250) {
          ctx.strokeStyle = theme.accentColor;
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = (1 - distM / 250) * 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      });
      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', init);
    init(); animate();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', init);
    };
  }, [theme.accentColor]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

const AudioController: React.FC<{ isVideoPlaying: boolean }> = ({ isVideoPlaying }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSource = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";
  
  useEffect(() => {
    const unlock = () => {
      if (!isActivated && audioRef.current) {
        audioRef.current.play().then(() => { 
          setIsPlaying(true); 
          setIsActivated(true); 
          if (audioRef.current) audioRef.current.volume = 0.2;
        }).catch(() => {});
        window.removeEventListener('click', unlock);
      }
    };
    window.addEventListener('click', unlock);
    return () => window.removeEventListener('click', unlock);
  }, [isActivated]);

  useEffect(() => {
    if (audioRef.current && isActivated) {
      audioRef.current.volume = isVideoPlaying ? 0 : 0.2;
    }
  }, [isVideoPlaying, isActivated]);

  return (
    <div className="fixed bottom-10 right-10 z-[100]">
      <audio ref={audioRef} loop src={audioSource} />
      <div className="flex flex-col items-end gap-3">
        {!isActivated && <div className="bg-black text-white text-[7px] font-black uppercase tracking-[0.4em] px-4 py-2 animate-pulse shadow-2xl">Activate Calm</div>}
        <button onClick={() => { if (audioRef.current) { if (isPlaying) audioRef.current.pause(); else audioRef.current.play(); setIsPlaying(!isPlaying); setIsActivated(true); } }} className={`w-14 h-14 flex items-center justify-center rounded-full transition-all border ${isPlaying ? 'bg-black text-white' : 'bg-white/40 text-black border-black/5 backdrop-blur-sm shadow-sm hover:scale-110'}`}>
          {isPlaying ? <div className="flex gap-[4px] items-end h-4"><div className="w-[2.5px] bg-white animate-[music-bar_4s_infinite] h-full" /><div className="w-[2.5px] bg-white animate-[music-bar_3s_infinite] h-2" /><div className="w-[2.5px] bg-white animate-[music-bar_5s_infinite] h-4" /></div> : <VolumeX size={18} />}
        </button>
      </div>
      <style>{`@keyframes music-bar { 0%, 100% { height: 4px; } 50% { height: 16px; } }`}</style>
    </div>
  );
};

const NavLink: React.FC<{ to: string, children: React.ReactNode, accentColor: string }> = ({ to, children, accentColor }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link 
      to={to} 
      className="relative group py-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative z-10 transition-colors duration-300" style={{ color: isHovered ? accentColor : 'inherit' }}>{children}</span>
      <span 
        className={`absolute bottom-0 left-0 h-[1.5px] transition-all duration-500 ease-out ${isHovered ? 'w-full' : 'w-0'}`} 
        style={{ backgroundColor: accentColor }}
      ></span>
    </Link>
  );
};

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  // MERGE LOGIC: Ensures new default fields (like adminId/Pw) exist even if user has an old saved theme
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('jp_theme');
    const parsed = saved ? JSON.parse(saved) : {};
    return { ...DEFAULT_THEME, ...parsed };
  });

  const [seo, setSeo] = useState<SEOConfig>(() => {
    const saved = localStorage.getItem('jp_seo');
    const parsed = saved ? JSON.parse(saved) : {};
    return { ...DEFAULT_SEO, ...parsed };
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => { 
    getFromDB(STORE_PROJECTS, INITIAL_PROJECTS).then(setProjects); 
  }, []);

  useEffect(() => { if (projects.length > 0) saveToDB(STORE_PROJECTS, projects); }, [projects]);
  useEffect(() => localStorage.setItem('jp_theme', JSON.stringify(theme)), [theme]);
  useEffect(() => localStorage.setItem('jp_seo', JSON.stringify(seo)), [seo]);

  return (
    <HashRouter>
      <div className={`min-h-screen flex flex-col transition-colors duration-1000 ${theme.headingFont === 'serif' ? 'font-serif' : 'font-sans'}`} style={{ backgroundColor: theme.primaryColor }}>
        <AestheticBackground theme={theme} />
        <AudioController isVideoPlaying={isVideoPlaying} />
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-md border-b border-black/5">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="text-2xl font-black tracking-tighter">{theme.siteName}<span style={{ color: theme.accentColor }}>.</span></Link>
            <div className="hidden md:flex items-center space-x-12 text-[10px] font-black uppercase tracking-[0.4em]">
              <NavLink to="/" accentColor={theme.accentColor}>Work</NavLink>
              <NavLink to="/bio" accentColor={theme.accentColor}>Biography</NavLink>
              <NavLink to="/contact" accentColor={theme.accentColor}>Contact</NavLink>
              <Link to="/admin" className="flex items-center gap-2 hover:opacity-50 transition-opacity"><Settings size={12} /> Admin</Link>
            </div>
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </nav>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center space-y-12 text-4xl font-black bg-white">
            <button className="absolute top-6 right-6" onClick={() => setIsMenuOpen(false)}><X size={40} /></button>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Work</Link>
            <Link to="/bio" onClick={() => setIsMenuOpen(false)}>Biography</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin</Link>
          </div>
        )}
        <main className="flex-grow relative z-10">
          <Routes>
            <Route path="/" element={<Home projects={projects} theme={theme} setGlobalVideoPlaying={setIsVideoPlaying} />} />
            <Route path="/bio" element={<Biography theme={theme} />} />
            <Route path="/contact" element={<Contact theme={theme} />} />
            <Route path="/project/:id" element={<ProjectDetail projects={projects} theme={theme} setGlobalVideoPlaying={setIsVideoPlaying} />} />
            <Route path="/admin/*" element={<Admin projects={projects} setProjects={setProjects} theme={theme} setTheme={setTheme} seo={seo} setSeo={setSeo} />} />
          </Routes>
        </main>
        <footer className="py-32 px-6 border-t border-black/5 relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-16">
            <div className="max-w-md">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1]">Designing for<br />the <span style={{ color: theme.accentColor }}>future</span>.</h2>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">© 2025 JayKayPark_Design Lab.</p>
            </div>
            <div className="flex flex-col gap-4 text-[11px] font-black uppercase tracking-[0.4em]">
              <a href={theme.socialLinks.instagram} target="_blank" className="hover:opacity-50">Instagram</a>
              <a href={theme.socialLinks.blog} target="_blank" className="hover:opacity-50">Blog</a>
              <Link to="/contact" className="hover:opacity-50">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
