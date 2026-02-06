
import React, { useState, useRef } from 'react';
import { Project, ThemeConfig, SEOConfig } from '../types';
import { LayoutGrid, Palette, Globe, Plus, Trash2, Edit2, X, Settings, User, Upload, Loader2, Lock, ArrowRight, Instagram, Mail, Download, RefreshCw, Image as ImageIcon } from 'lucide-react';

interface AdminProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  theme: ThemeConfig;
  setTheme: React.Dispatch<React.SetStateAction<ThemeConfig>>;
  seo: SEOConfig;
  setSeo: React.Dispatch<React.SetStateAction<SEOConfig>>;
}

const Admin: React.FC<AdminProps> = ({ projects, setProjects, theme, setTheme, seo, setSeo }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => sessionStorage.getItem('jp_admin_auth') === 'true');
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'bio' | 'theme' | 'seo'>('projects');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const projectFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const bioFileRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginId === 'admin' && loginPw === 'admin1234') {
      setIsLoggedIn(true); sessionStorage.setItem('jp_admin_auth', 'true');
    } else { setLoginError(true); setTimeout(() => setLoginError(false), 2000); }
  };

  // --- Image Optimization Utility ---
  // Resizes to max 1600px and compresses to 70% JPEG quality
  const optimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1600; // Max dimension
          if (width > height) {
            if (width > maxDim) { height *= maxDim / width; width = maxDim; }
          } else {
            if (height > maxDim) { width *= maxDim / height; height = maxDim; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to 70% quality
        };
      };
    });
  };

  const handleAddProject = () => {
    const newProject: Project = { id: Date.now().toString(), title: 'New Work', category: 'Branding', description: '', imageUrl: 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=1200', gallery: [], date: '2024.01' };
    setProjects(prev => [newProject, ...prev]);
    setEditingProject(newProject);
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    setEditingProject(null);
  };

  // Fix: Explicitly cast Array.from(FileList) to File[] to ensure 'file' is correctly typed in the map function.
  const handleAddGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProject || !e.target.files) return;
    setIsUploading(true);
    const files = Array.from(e.target.files) as File[];
    const newImages = await Promise.all(files.map(file => optimizeImage(file)));
    setEditingProject({ ...editingProject, gallery: [...(editingProject.gallery || []), ...newImages] });
    setIsUploading(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
          <div className="text-center mb-8"><Lock className="mx-auto mb-4" /><h1 className="text-2xl font-bold">Studio Access</h1></div>
          <input type="text" placeholder="ID (admin)" value={loginId} onChange={e => setLoginId(e.target.value)} className="w-full p-4 bg-gray-50 border outline-none" required />
          <input type="password" placeholder="Password (admin1234)" value={loginPw} onChange={e => setLoginPw(e.target.value)} className="w-full p-4 bg-gray-50 border outline-none" required />
          {loginError && <p className="text-red-500 text-xs text-center">Auth Failed.</p>}
          <button type="submit" className="w-full py-4 bg-black text-white font-bold">Enter Dashboard</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-72 space-y-2">
          <div className="flex items-center justify-between mb-8 pb-4 border-b"><h2 className="text-xl font-black">Studio Panel</h2><button onClick={() => setIsLoggedIn(false)} className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Logout</button></div>
          {(['projects', 'bio', 'theme', 'seo'] as const).map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setEditingProject(null); }} className={`w-full text-left px-5 py-4 uppercase text-[10px] font-black tracking-[0.3em] transition-all ${activeTab === tab ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-400'}`}>{tab}</button>
          ))}
          <div className="pt-12"><button onClick={() => { indexedDB.deleteDatabase('JParkStudioDB'); localStorage.clear(); window.location.reload(); }} className="w-full text-left px-5 py-3 text-gray-400 text-[9px] font-black uppercase tracking-widest border">Factory Reset</button></div>
        </div>

        <div className="flex-grow bg-white border border-black/5 p-10 shadow-sm">
          {activeTab === 'projects' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center border-b pb-6"><h3 className="text-3xl font-black">Collections</h3>{!editingProject && <button onClick={handleAddProject} className="bg-pink-500 text-white px-6 py-3 rounded-full flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl"><Plus size={16} /> New Project</button>}</div>
              {editingProject ? (
                <div className="space-y-10 animate-in slide-in-from-right-4">
                  <div className="flex justify-between items-center"><h4 className="font-black text-[10px] text-gray-400 uppercase">Editor</h4><button onClick={() => setEditingProject(null)}><X size={24} /></button></div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <input type="text" value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="w-full p-4 border-b font-bold text-lg outline-none" placeholder="Title" />
                      <div className="grid grid-cols-2 gap-4"><input type="text" value={editingProject.category} onChange={e => setEditingProject({...editingProject, category: e.target.value})} className="w-full p-4 border-b outline-none" placeholder="Category" /><input type="text" value={editingProject.date} onChange={e => setEditingProject({...editingProject, date: e.target.value})} className="w-full p-4 border-b outline-none" placeholder="YYYY.MM" /></div>
                      <textarea rows={6} value={editingProject.description} onChange={e => setEditingProject({...editingProject, description: e.target.value})} className="w-full p-4 border-b outline-none resize-none" placeholder="Description" />
                    </div>
                    <div className="space-y-8">
                      <div className="relative group aspect-video bg-gray-50 border overflow-hidden">
                        <img src={editingProject.imageUrl} className="w-full h-full object-cover" />
                        <button onClick={() => projectFileRef.current?.click()} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white"><Upload size={24} /><span className="text-[10px] font-black uppercase tracking-widest">Replace Cover</span></button>
                        <input type="file" ref={projectFileRef} className="hidden" accept="image/*" onChange={async e => { if(e.target.files?.[0]) setEditingProject({...editingProject, imageUrl: await optimizeImage(e.target.files[0])})}} />
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center"><label className="text-[9px] font-black uppercase text-gray-400">Gallery (Large Capacity Support)</label><button onClick={() => galleryFileRef.current?.click()} className="text-pink-500 text-[10px] font-black uppercase tracking-widest"><Plus size={14} /> Add Gallery</button><input type="file" ref={galleryFileRef} className="hidden" multiple accept="image/*" onChange={handleAddGalleryImage} /></div>
                        <div className="grid grid-cols-3 gap-2">
                          {editingProject.gallery?.map((img, idx) => (
                            <div key={idx} className="relative group aspect-square border overflow-hidden"><img src={img} className="w-full h-full object-cover" /><button onClick={() => { const g = [...(editingProject.gallery || [])]; g.splice(idx,1); setEditingProject({...editingProject, gallery: g}); }} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"><Trash2 size={12} /></button></div>
                          ))}
                          {isUploading && <div className="aspect-square bg-gray-50 flex items-center justify-center"><Loader2 className="animate-spin" /></div>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-10 border-t"><button onClick={() => handleUpdateProject(editingProject)} className="px-12 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest shadow-2xl">Save Project</button></div>
                </div>
              ) : (
                <div className="grid gap-4">{projects.map(p => (
                  <div key={p.id} className="group flex items-center justify-between p-5 border border-gray-100 hover:border-black transition-all">
                    <div className="flex items-center gap-6 cursor-pointer" onClick={() => setEditingProject(p)}><img src={p.imageUrl} className="w-24 h-16 object-cover grayscale group-hover:grayscale-0 transition-all" /><div><h4 className="font-bold text-lg">{p.title}</h4><p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{p.category} • {p.date}</p></div></div>
                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all"><button onClick={() => setEditingProject(p)} className="p-3 border rounded-full"><Edit2 size={16}/></button><button onClick={() => { if(window.confirm('Delete?')) setProjects(prev => prev.filter(item => item.id !== p.id)) }} className="p-3 border rounded-full text-red-400"><Trash2 size={16}/></button></div>
                  </div>
                ))}</div>
              )}
            </div>
          )}
          {activeTab === 'bio' && (
            <div className="space-y-10">
              <h3 className="text-3xl font-black border-b pb-6">Artist Biography</h3>
              <div className="grid md:grid-cols-12 gap-12">
                <div className="md:col-span-4 space-y-6">
                  <div className="aspect-[3/4] border overflow-hidden relative group shadow-xl">
                    <img src={theme.profileImageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    <button onClick={() => bioFileRef.current?.click()} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white"><Upload size={24} /></button>
                    <input type="file" ref={bioFileRef} className="hidden" accept="image/*" onChange={async e => { if(e.target.files?.[0]) setTheme({...theme, profileImageUrl: await optimizeImage(e.target.files[0])})}} />
                  </div>
                  <div className="space-y-4">
                    <p className="text-[9px] font-black uppercase text-gray-400">Socials</p>
                    <div className="space-y-2"><input type="text" value={theme.socialLinks.instagram} onChange={e => setTheme({...theme, socialLinks: {...theme.socialLinks, instagram: e.target.value}})} className="w-full text-xs p-2 border-b outline-none" placeholder="Instagram" /><input type="email" value={theme.socialLinks.email} onChange={e => setTheme({...theme, socialLinks: {...theme.socialLinks, email: e.target.value}})} className="w-full text-xs p-2 border-b outline-none" placeholder="Email" /></div>
                  </div>
                </div>
                <div className="md:col-span-8"><textarea rows={18} value={theme.bioContent} onChange={e => setTheme({...theme, bioContent: e.target.value})} className="w-full p-8 border bg-gray-50/30 outline-none leading-loose text-sm font-light resize-none" /></div>
              </div>
            </div>
          )}
          {activeTab === 'theme' && (
            <div className="space-y-12">
              <h3 className="text-3xl font-black border-b pb-6">Visual Identity</h3>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4"><label className="text-[9px] font-black uppercase text-gray-400">Hero Main Title</label><input type="text" value={theme.heroTitle} onChange={e => setTheme({...theme, heroTitle: e.target.value})} className="w-full p-5 border-b outline-none font-black text-4xl" /></div>
                <div className="space-y-4"><label className="text-[9px] font-black uppercase text-gray-400">Accent Experience Color</label><div className="flex items-center gap-6 p-5 border bg-gray-50/50"><input type="color" value={theme.accentColor} onChange={e => setTheme({...theme, accentColor: e.target.value})} className="w-16 h-16 cursor-pointer" /><span className="font-mono text-sm font-bold uppercase">{theme.accentColor}</span></div></div>
              </div>
            </div>
          )}
          {activeTab === 'seo' && (
            <div className="space-y-10">
              <h3 className="text-3xl font-black border-b pb-6">SEO</h3>
              <div className="space-y-6 max-w-2xl"><input type="text" value={seo.metaTitle} onChange={e => setSeo({...seo, metaTitle: e.target.value})} className="w-full p-5 border-b outline-none font-bold" placeholder="Meta Title" /><textarea rows={4} value={seo.metaDescription} onChange={e => setSeo({...seo, metaDescription: e.target.value})} className="w-full p-5 border-b outline-none" placeholder="Meta Description" /></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
