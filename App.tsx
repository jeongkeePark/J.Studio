
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { INITIAL_PROJECTS, DEFAULT_THEME, DEFAULT_SEO } from './constants';
import { Project, ThemeConfig, SEOConfig } from './types';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Admin from './pages/Admin';
import Biography from './pages/Biography';
import { Menu, X, Settings, VolumeX } from 'lucide-react';

// Enhanced Background: Vivid Pink Glow Constellation
const AestheticBackground: React.FC<{ theme: ThemeConfig }> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 100; // 품질 유지를 위해 적정 수 유지
    const mouse = { x: -1000, y: -1000 };

    class Particle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      opacity: number;
      glowSize: number;

      constructor() {
        this.init();
      }

      init() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 4 + 2; // 더 확실하게 보이도록 크기 대폭 증가
        this.vx = (Math.random() - 0.5) * 0.2; // 더 느린 속도
        this.vy = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.5 + 0.5; // 더 높은 기본 투명도
        this.glowSize = Math.random() * 20 + 10; // 빛나는 반경
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Mouse interaction: Soft pull and swirl
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250) {
          const force = (250 - dist) / 250;
          this.x -= (dy / dist) * force * 1.5;
          this.y += (dx / dist) * force * 1.5;
        }

        if (this.x < 0) this.x = canvas!.width;
        if (this.x > canvas!.width) this.x = 0;
        if (this.y < 0) this.y = canvas!.height;
        if (this.y > canvas!.height) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.shadowBlur = this.glowSize;
        ctx.shadowColor = theme.accentColor;
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = theme.accentColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      // 투명도를 조절하여 잔상 효과 부여
      ctx.fillStyle = theme.primaryColor === '#ffffff' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      init();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    init();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme.accentColor, theme.primaryColor]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
};

// Deep, Slow, Emotional Audio Controller
const AudioController: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Mysterious & Slow Cinematic Ambient Track
  const audioSource = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";

  useEffect(() => {
    const unlockAudio = () => {
      if (!isActivated && audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setIsActivated(true);
        }).catch(() => {
          console.log("Waiting for user interaction for audio...");
        });
        window.removeEventListener('click', unlockAudio);
      }
    };

    window.addEventListener('click', unlockAudio);
    return () => window.removeEventListener('click', unlockAudio);
  }, [isActivated]);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Playback error"));
      }
      setIsPlaying(!isPlaying);
      setIsActivated(true);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100]">
      <audio ref={audioRef} loop src={audioSource} preload="auto" />
      <div className="flex flex-col items-end gap-3">
        {!isActivated && (
          <div className="bg-black text-white text-[7px] font-black uppercase tracking-[0.4em] px-4 py-2 animate-pulse shadow-2xl">
            Click to activate deep dream ambient
          </div>
        )}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-gray-400">Cinematic Void</span>
            <span className="text-[8px] font-serif italic text-black">IMMERSIVE SOUNDSCAPE</span>
          </div>
          <button 
            onClick={toggleAudio}
            className={`w-14 h-14 flex items-center justify-center rounded-full transition-all duration-1000 backdrop-blur-3xl border ${isPlaying ? 'bg-black text-white border-black shadow-2xl scale-110' : 'bg-white/40 text-black border-black/5 hover:bg-white/80'}`}
          >
            {isPlaying ? (
              <div className="flex gap-[4px] items-end h-4">
                <div className="w-[2.5px] bg-white animate-[music-bar_3s_ease-in-out_infinite] h-full"></div>
                <div className="w-[2.5px] bg-white animate-[music-bar_1.8s_ease-in-out_infinite] h-2"></div>
                <div className="w-[2.5px] bg-white animate-[music-bar_4s_ease-in-out_infinite] h-4"></div>
                <div className="w-[2.5px] bg-white animate-[music-bar_2.2s_ease-in-out_infinite] h-1"></div>
              </div>
            ) : (
              <VolumeX size={18} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes music-bar {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  // Load initial states from localStorage with better reliability
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('jp_projects');
    try {
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch (e) {
      return INITIAL_PROJECTS;
    }
  });

  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('jp_theme');
    try {
      return saved ? JSON.parse(saved) : DEFAULT_THEME;
    } catch (e) {
      return DEFAULT_THEME;
    }
  });

  const [seo, setSeo] = useState<SEOConfig>(() => {
    const saved = localStorage.getItem('jp_seo');
    try {
      return saved ? JSON.parse(saved) : DEFAULT_SEO;
    } catch (e) {
      return DEFAULT_SEO;
    }
  });

  // Persist changes immediately when state updates
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
              <Link to="/bio" className="hover:opacity-40 transition-opacity">Biography</Link>
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
            <Link to="/bio" onClick={() => setIsMenuOpen(false)}>Biography</Link>
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
              <a href={theme.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:opacity-40 transition-opacity">Instagram</a>
              <a href={theme.socialLinks.behance} target="_blank" rel="noopener noreferrer" className="hover:opacity-40 transition-opacity">Behance</a>
              <a href={`mailto:${theme.socialLinks.email}`} className="hover:opacity-40 transition-opacity">Email Portfolio</a>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
