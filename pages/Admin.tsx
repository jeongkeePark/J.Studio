
import React, { useState, useRef } from 'react';
import { Project, ThemeConfig, SEOConfig } from '../types';
import { LayoutGrid, Palette, Globe, Plus, Trash2, Edit2, X, Settings, User, Upload, Loader2, Lock, ArrowRight, Instagram, Mail, Video, Phone, Link as LinkIcon, ShieldCheck } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'projects' | 'bio' | 'theme' | 'seo' | 'account'>('projects');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const projectFileRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const bioFileRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Compare against customizable theme credentials
    if (loginId === theme.adminId && loginPw === theme.adminPw) {
      setIsLoggedIn(true); 
      sessionStorage.setItem('jp_admin_auth', 'true');
    } else { 
      setLoginError(true); 
      setTimeout(() => setLoginError(false), 2000); 
    }
  };

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
          const maxDim = 1600;
          if (width > height) {
            if (width > maxDim) { height *= maxDim / width; width = maxDim; }
          } else {
            if (height > maxDim) { width *= maxDim / height; height = maxDim; }
          }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProject || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setEditingProject({ ...editingProject, videoUrl: event.target?.result as string });
    };
  };

  const handleAddProject = () => {
    const newProject: Project = { id: Date.now().toString(), title: 'New Work', category: 'Category', description: '', imageUrl: 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=1200', gallery: [], date: '2024.01' };
    setProjects(prev => [newProject, ...prev]);
    setEditingProject(newProject);
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    setEditingProject(null);
  };

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
          <div className="text-center mb-8">
            <Lock className="mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Studio Access</h1>
            {loginError && <p className="text-red-500 text-[10px] font-black uppercase mt-2">Invalid Credentials</p>}
          </div>
          <input type="text" placeholder="ID" value={loginId} onChange={e => setLoginId(e.target.value)} className="w-full p-4 bg-gray-50 border outline-none focus:border-black transition-all" required />
          <input type="password" placeholder="Password" value={loginPw} onChange={e => setLoginPw(e.target.value)} className="w-full p-4 bg-gray-50 border outline-none focus:border-black transition-all" required />
          <button type="submit" className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest text-[10px]">Verify Authority</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-72 space-y-2">
          <div className="flex items-center justify-between mb-8 pb-4 border-b">
            <h2 className="text-xl font-black">Admin Panel</h2>
            <button onClick={() => { setIsLoggedIn(false); sessionStorage.removeItem('jp_admin_auth'); }} className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Logout</button>
          </div>
          {(['projects', 'bio', 'theme', 'seo', 'account'] as const).map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setEditingProject(null); }} className={`w-full text-left px-5 py-4 uppercase text-[10px] font-black tracking-[0.3em] transition-all ${activeTab === tab ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-400'}`}>
              {tab === 'account' ? 'Security' : tab}
            </button>
          ))}
          <div className="pt-12">
            <button onClick={() => { if(window.confirm('Delete all data and reset?')) { indexedDB.deleteDatabase('JParkStudioDB'); localStorage.clear(); window.location.reload(); } }} className="w-full text-left px-5 py-3 text-gray-400 text-[9px] font-black uppercase tracking-widest border border-dashed">Factory Reset</button>
          </div>
        </div>

        <div className="flex-grow bg-white border border-black/5 p-10 shadow-sm min-h-[600px]">
          {activeTab === 'projects' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center border-b pb-6"><h3 className="text-3xl font-black">Archive</h3>{!editingProject && <button onClick={handleAddProject} className="bg-pink-500 text-white px-6 py-3 rounded-full flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl"><Plus size={16} /> Add Work</button>}</div>
              {editingProject ? (
                <div className="space-y-10 animate-in slide-in-from-right-4">
                  <div className="flex justify-between items-center"><h4 className="font-black text-[10px] text-gray-400 uppercase">Entry Details</h4><button onClick={() => setEditingProject(null)}><X size={24} /></button></div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <input type="text" value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="w-full p-4 border-b font-bold text-lg outline-none" placeholder="Project Title" />
                      <div className="grid grid-cols-2 gap-4"><input type="text" value={editingProject.category} onChange={e => setEditingProject({...editingProject, category: e.target.value})} className="w-full p-4 border-b outline-none" placeholder="Category" /><input type="text" value={editingProject.date} onChange={e => setEditingProject({...editingProject, date: e.target.value})} className="w-full p-4 border-b outline-none" placeholder="YYYY.MM" /></div>
                      <textarea rows={4} value={editingProject.description} onChange={e => setEditingProject({...editingProject, description: e.target.value})} className="w-full p-4 border-b outline-none resize-none" placeholder="Project Description" />
                      <div className="space-y-4 pt-4 border-t">
                        <label className="text-[9px] font-black uppercase text-gray-400">Video Integration</label>
                        <input type="text" value={editingProject.videoUrl || ''} onChange={e => setEditingProject({...editingProject, videoUrl: e.target.value})} className="w-full p-4 border rounded bg-gray-50 text-xs" placeholder="YouTube/Vimeo or Direct URL" />
                        <button onClick={() => videoFileRef.current?.click()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500"><Video size={14} /> Upload Video File</button>
                        <input type="file" ref={videoFileRef} className="hidden" accept="video/*" onChange={handleVideoUpload} />
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div className="relative group aspect-video bg-gray-50 border overflow-hidden">
                        <img src={editingProject.imageUrl} className="w-full h-full object-cover" />
                        <button onClick={() => projectFileRef.current?.click()} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white"><Upload size={24} /><span className="text-[10px] font-black uppercase tracking-widest">Replace Cover</span></button>
                        <input type="file" ref={projectFileRef} className="hidden" accept="image/*" onChange={async e => { if(e.target.files?.[0]) setEditingProject({...editingProject, imageUrl: await optimizeImage(e.target.files[0])})}} />
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center"><label className="text-[9px] font-black uppercase text-gray-400">Content Gallery</label><button onClick={() => galleryFileRef.current?.click()} className="text-pink-500 text-[10px] font-black uppercase tracking-widest"><Plus size={14} /> Add Assets</button><input type="file" ref={galleryFileRef} className="hidden" multiple accept="image/*" onChange={handleAddGalleryImage} /></div>
                        <div className="grid grid-cols-3 gap-2">
                          {editingProject.gallery?.map((img, idx) => (
                            <div key={idx} className="relative group aspect-square border overflow-hidden"><img src={img} className="w-full h-full object-cover" /><button onClick={() => { const g = [...(editingProject.gallery || [])]; g.splice(idx,1); setEditingProject({...editingProject, gallery: g}); }} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"><Trash2 size={12} /></button></div>
                          ))}
                          {isUploading && <div className="aspect-square bg-gray-50 flex items-center justify-center"><Loader2 className="animate-spin" /></div>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-10 border-t"><button onClick={() => handleUpdateProject(editingProject)} className="px-12 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">Publish Update</button></div>
                </div>
              ) : (
                <div className="grid gap-4">{projects.map(p => (
                  <div key={p.id} className="group flex items-center justify-between p-5 border border-gray-100 hover:border-black transition-all">
                    <div className="flex items-center gap-6 cursor-pointer" onClick={() => setEditingProject(p)}><img src={p.imageUrl} className="w-24 h-16 object-cover grayscale group-hover:grayscale-0 transition-all" /><div><h4 className="font-bold text-lg">{p.title}</h4><p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{p.category} • {p.date}</p></div></div>
                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all"><button onClick={() => setEditingProject(p)} className="p-3 border rounded-full hover:bg-black hover:text-white transition-colors"><Edit2 size={16}/></button><button onClick={() => { if(window.confirm('Remove from collection?')) setProjects(prev => prev.filter(item => item.id !== p.id)) }} className="p-3 border rounded-full text-red-400 hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={16}/></button></div>
                  </div>
                ))}</div>
              )}
            </div>
          )}

          {activeTab === 'bio' && (
            <div className="space-y-10">
              <h3 className="text-3xl font-black border-b pb-6">Creator Identity</h3>
              <div className="grid md:grid-cols-12 gap-12">
                <div className="md:col-span-4 space-y-6">
                  <div className="aspect-square border overflow-hidden relative group shadow-xl rounded-full">
                    <img src={theme.profileImageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    <button onClick={() => bioFileRef.current?.click()} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white"><Upload size={24} /></button>
                    <input type="file" ref={bioFileRef} className="hidden" accept="image/*" onChange={async e => { if(e.target.files?.[0]) setTheme({...theme, profileImageUrl: await optimizeImage(e.target.files[0])})}} />
                  </div>
                  <div className="space-y-4">
                    <p className="text-[9px] font-black uppercase text-gray-400">Communication Channels</p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 border-b focus-within:border-black transition-colors"><Instagram size={14}/><input type="text" value={theme.socialLinks.instagram} onChange={e => setTheme({...theme, socialLinks: {...theme.socialLinks, instagram: e.target.value}})} className="w-full text-xs outline-none" placeholder="Instagram URL" /></div>
                        <div className="flex items-center gap-3 p-3 border-b focus-within:border-black transition-colors"><LinkIcon size={14}/><input type="text" value={theme.socialLinks.blog} onChange={e => setTheme({...theme, socialLinks: {...theme.socialLinks, blog: e.target.value}})} className="w-full text-xs outline-none" placeholder="Studio Blog URL" /></div>
                        <div className="flex items-center gap-3 p-3 border-b focus-within:border-black transition-colors"><Mail size={14}/><input type="email" value={theme.socialLinks.email} onChange={e => setTheme({...theme, socialLinks: {...theme.socialLinks, email: e.target.value}})} className="w-full text-xs outline-none" placeholder="Public Email" /></div>
                        <div className="flex items-center gap-3 p-3 border-b focus-within:border-black transition-colors"><Phone size={14}/><input type="text" value={theme.socialLinks.phone} onChange={e => setTheme({...theme, socialLinks: {...theme.socialLinks, phone: e.target.value}})} className="w-full text-xs outline-none" placeholder="Contact Number" /></div>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-8 space-y-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-400">Narrative Bio</label>
                    <textarea rows={12} value={theme.bioContent} onChange={e => setTheme({...theme, bioContent: e.target.value})} className="w-full p-8 border bg-gray-50/30 outline-none focus:border-black transition-colors leading-loose text-sm font-light resize-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-400">Physical Studio Location</label>
                    <textarea rows={4} value={theme.contactAddress} onChange={e => setTheme({...theme, contactAddress: e.target.value})} className="w-full p-8 border bg-gray-50/30 outline-none focus:border-black transition-colors leading-loose text-sm font-bold resize-none" placeholder="Studio address..." />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-12">
              <h3 className="text-3xl font-black border-b pb-6">Interface Configuration</h3>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="space-y-4"><label className="text-[9px] font-black uppercase text-gray-400">Studio Name (Navbar)</label><input type="text" value={theme.siteName} onChange={e => setTheme({...theme, siteName: e.target.value})} className="w-full p-5 border-b outline-none font-black text-2xl focus:border-black transition-colors" /></div>
                  <div className="space-y-4 border p-6 rounded-lg bg-gray-50/50"><label className="text-[9px] font-black uppercase text-gray-400">Primary Headline (Main Landing)</label><textarea rows={3} value={theme.heroTitle} onChange={e => setTheme({...theme, heroTitle: e.target.value})} className="w-full p-5 border-b outline-none font-black text-4xl bg-transparent focus:border-black transition-colors resize-none" /></div>
                  <div className="space-y-4"><label className="text-[9px] font-black uppercase text-gray-400">Headline Scale: {theme.heroTitleSize}rem</label><input type="range" min="4" max="20" step="0.5" value={theme.heroTitleSize} onChange={e => setTheme({...theme, heroTitleSize: parseFloat(e.target.value)})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" /></div>
                </div>
                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-[9px] font-black uppercase text-gray-400">Visual Aesthetic (Typography)</label>
                        <div className="flex gap-4"><button onClick={() => setTheme({...theme, headingFont: 'serif'})} className={`flex-grow py-4 border ${theme.headingFont === 'serif' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'}`}>Modern Serif</button><button onClick={() => setTheme({...theme, headingFont: 'sans'})} className={`flex-grow py-4 border ${theme.headingFont === 'sans' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'}`}>Clean Sans</button></div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[9px] font-black uppercase text-gray-400">Primary Branding Colors</label>
                        <div className="flex gap-6 items-center">
                            <div className="flex flex-col gap-2">
                                <span className="text-[8px] uppercase font-bold text-gray-400">Canvas</span>
                                <input type="color" value={theme.primaryColor} onChange={e => setTheme({...theme, primaryColor: e.target.value})} className="w-16 h-16 border-none cursor-pointer" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[8px] uppercase font-bold text-gray-400">Highlight</span>
                                <input type="color" value={theme.accentColor} onChange={e => setTheme({...theme, accentColor: e.target.value})} className="w-16 h-16 border-none cursor-pointer" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4"><label className="text-[9px] font-black uppercase text-gray-400">Hero Mission Statement</label><input type="text" value={theme.heroSubtitle} onChange={e => setTheme({...theme, heroSubtitle: e.target.value})} className="w-full p-5 border-b outline-none focus:border-black transition-colors" /></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-10">
              <h3 className="text-3xl font-black border-b pb-6">Global Search Indexing</h3>
              <div className="space-y-6 max-w-2xl">
                <div className="space-y-2"><label className="text-[9px] font-black uppercase text-gray-400">Page Title</label><input type="text" value={seo.metaTitle} onChange={e => setSeo({...seo, metaTitle: e.target.value})} className="w-full p-5 border-b outline-none font-bold focus:border-black transition-colors" /></div>
                <div className="space-y-2"><label className="text-[9px] font-black uppercase text-gray-400">Platform Description</label><textarea rows={6} value={seo.metaDescription} onChange={e => setSeo({...seo, metaDescription: e.target.value})} className="w-full p-5 border outline-none focus:border-black transition-colors" /></div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-12">
              <h3 className="text-3xl font-black border-b pb-6 flex items-center gap-4">
                <ShieldCheck size={32} /> Security Settings
              </h3>
              <div className="max-w-md space-y-8 bg-gray-50/50 p-8 rounded-xl border border-dashed border-gray-200">
                <p className="text-xs text-gray-500 font-light leading-relaxed">Customize your administrative access. These credentials will be required for future logins to this panel.</p>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-400">Admin User ID</label>
                    <input type="text" value={theme.adminId} onChange={e => setTheme({...theme, adminId: e.target.value})} className="w-full p-4 border rounded bg-white outline-none focus:border-black transition-colors font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-400">Security Password</label>
                    <input type="text" value={theme.adminPw} onChange={e => setTheme({...theme, adminPw: e.target.value})} className="w-full p-4 border rounded bg-white outline-none focus:border-black transition-colors font-mono" />
                  </div>
                </div>
                <div className="pt-4">
                  <p className="text-[8px] text-gray-400 italic">* Changes are saved automatically to your local storage.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
