
import React, { useState, useRef } from 'react';
import { Project, ThemeConfig, SEOConfig } from '../types';
import { LayoutGrid, Palette, Globe, Plus, Trash2, Edit2, Check, X, Sparkles, Settings, User, Upload, Image as ImageIcon, Calendar, Loader2, PlusSquare, Type } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AdminProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  theme: ThemeConfig;
  setTheme: React.Dispatch<React.SetStateAction<ThemeConfig>>;
  seo: SEOConfig;
  setSeo: React.Dispatch<React.SetStateAction<SEOConfig>>;
}

const Admin: React.FC<AdminProps> = ({ projects, setProjects, theme, setTheme, seo, setSeo }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'bio' | 'theme' | 'seo'>('projects');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const projectFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const bioFileRef = useRef<HTMLInputElement>(null);

  const getTodayDate = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  };

  const handleAddProject = () => {
    const newId = Date.now().toString();
    const newProject: Project = {
      id: newId,
      title: '새로운 프로젝트',
      category: '카테고리',
      description: '프로젝트에 대한 설명을 입력하세요.',
      imageUrl: 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=1200',
      gallery: [],
      date: getTodayDate()
    };
    setProjects(prev => [newProject, ...prev]);
    setEditingProject(newProject);
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('이 프로젝트를 영구적으로 삭제하시겠습니까?')) {
      setProjects(prev => {
        const filtered = prev.filter(p => p.id !== id);
        return [...filtered]; 
      });
      if (editingProject?.id === id) {
        setEditingProject(null);
      }
    }
  };

  const optimizeImage = (file: File, maxWidth = 1600, maxHeight = 1600, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProject) {
      setIsUploading(true);
      try {
        const optimized = await optimizeImage(file);
        setEditingProject({ ...editingProject, imageUrl: optimized });
      } catch (err) {
        alert('이미지 업로드 실패');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProject) {
      setIsUploading(true);
      try {
        const optimized = await optimizeImage(file);
        const updatedGallery = [...(editingProject.gallery || []), optimized];
        setEditingProject({ ...editingProject, gallery: updatedGallery });
      } catch (err) {
        alert('이미지 업로드 실패');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeGalleryImage = (index: number) => {
    if (editingProject && editingProject.gallery) {
      const updatedGallery = editingProject.gallery.filter((_, i) => i !== index);
      setEditingProject({ ...editingProject, gallery: updatedGallery });
    }
  };

  const generateBio = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${theme.siteName} 작가를 위한 소개글을 한국어로 작성해줘.`,
      });
      setTheme({ ...theme, bioContent: response.text || '' });
    } catch (error) { alert('AI 실패'); } finally { setIsAiLoading(false); }
  };

  const generateProjectDescription = async (title: string) => {
    if (!title) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${title} 프로젝트 설명을 한국어로 작성해줘.`,
      });
      if (editingProject) setEditingProject({ ...editingProject, description: response.text || '' });
    } catch (error) { alert('AI 실패'); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-gray-800"><Settings size={20} /> Dashboard</h2>
          {(['projects', 'bio', 'theme', 'seo'] as const).map((tab) => (
            <button 
              key={tab} 
              onClick={() => { setActiveTab(tab); setEditingProject(null); }} 
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === tab ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-500 font-medium'}`}
            >
              {tab === 'projects' && <LayoutGrid size={18} />}
              {tab === 'bio' && <User size={18} />}
              {tab === 'theme' && <Palette size={18} />}
              {tab === 'seo' && <Globe size={18} />}
              {tab === 'projects' ? '프로젝트 관리' : tab === 'bio' ? '바이오그래피' : tab === 'theme' ? '테마 및 홈 설정' : 'SEO 설정'}
            </button>
          ))}
        </div>

        {/* Main Panel */}
        <div className="flex-grow bg-white border border-gray-100 rounded-2xl p-8 shadow-sm min-h-[600px]">
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">작품 컬렉션</h3>
                {!editingProject && (
                  <button onClick={handleAddProject} className="bg-pink-500 text-white px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-bold hover:bg-pink-600 transition-all shadow-lg shadow-pink-100">
                    <Plus size={18} /> 새 프로젝트 추가
                  </button>
                )}
              </div>

              {editingProject ? (
                <div className="bg-gray-50 p-6 rounded-2xl space-y-6 border border-gray-100">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs">Project Editor</h4>
                    <button onClick={() => setEditingProject(null)} className="text-gray-400 hover:text-black transition-colors"><X size={24} /></button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">제목</label>
                      <input type="text" placeholder="제목" value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-pink-100" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">카테고리</label>
                      <input type="text" placeholder="카테고리" value={editingProject.category} onChange={e => setEditingProject({...editingProject, category: e.target.value})} className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-pink-100" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">날짜</label>
                      <input type="text" placeholder="2024.05" value={editingProject.date} onChange={e => setEditingProject({...editingProject, date: e.target.value})} className="w-full p-3 border rounded-lg font-mono outline-none focus:ring-2 focus:ring-pink-100" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">프로젝트 설명</label>
                      <button onClick={() => generateProjectDescription(editingProject.title)} className="text-pink-500 text-xs flex items-center gap-1 hover:underline"><Sparkles size={12} /> AI 생성</button>
                    </div>
                    <textarea rows={4} value={editingProject.description} onChange={e => setEditingProject({...editingProject, description: e.target.value})} className="w-full p-4 border rounded-lg outline-none focus:ring-2 focus:ring-pink-100" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">커버 이미지</label>
                      <div className="relative group rounded-lg overflow-hidden">
                        <img src={editingProject.imageUrl} className="w-full h-48 object-cover" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <button onClick={() => projectFileRef.current?.click()} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm hover:border-pink-300 transition-all flex items-center justify-center gap-2 bg-white">
                        {isUploading ? <Loader2 className="animate-spin" /> : <Upload size={16} />} 커버 이미지 변경
                      </button>
                      <input type="file" ref={projectFileRef} onChange={handleProjectImageUpload} className="hidden" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">갤러리</label>
                      <div className="grid grid-cols-3 gap-3">
                        {editingProject.gallery?.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded overflow-hidden shadow-sm border">
                            <img src={img} className="w-full h-full object-cover" />
                            <button onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"><X size={10} /></button>
                          </div>
                        ))}
                        <button onClick={() => galleryFileRef.current?.click()} className="aspect-square border-2 border-dashed border-gray-200 rounded flex flex-col items-center justify-center text-gray-300 hover:text-pink-500 hover:border-pink-200 bg-white transition-all">
                          <Plus size={20} />
                          <span className="text-[10px] font-bold mt-1">추가</span>
                        </button>
                      </div>
                      <input type="file" ref={galleryFileRef} onChange={handleGalleryUpload} className="hidden" />
                    </div>
                  </div>

                  <div className="flex justify-end items-center pt-6 border-t gap-3">
                    <button onClick={() => setEditingProject(null)} className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-black transition-colors">취소</button>
                    <button onClick={() => handleUpdateProject(editingProject)} className="px-10 py-2.5 bg-black text-white text-sm font-bold rounded-lg shadow-xl active:scale-95 transition-all">설정 저장하기</button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {projects.map(p => (
                    <div key={p.id} className="group flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-all border-gray-100">
                      <div className="flex items-center gap-4 cursor-pointer flex-grow" onClick={() => setEditingProject(p)}>
                        <img src={p.imageUrl} className="w-20 h-14 object-cover rounded shadow-sm" />
                        <div>
                          <h4 className="font-bold text-gray-800">{p.title}</h4>
                          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{p.category} • {p.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => setEditingProject(p)} className="p-3 text-gray-400 hover:text-black hover:bg-white rounded-full transition-all shadow-sm" title="편집"><Edit2 size={18} /></button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation(); 
                            handleDeleteProject(p.id);
                          }} 
                          className="p-3 text-red-400 hover:text-red-600 hover:bg-white rounded-full transition-all shadow-sm" 
                          title="삭제"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="text-center py-32">
                      <div className="inline-block p-4 bg-gray-50 rounded-full mb-4"><LayoutGrid className="text-gray-300" size={40} /></div>
                      <p className="text-gray-300 font-medium">등록된 작품이 없습니다.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'bio' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Biography</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="relative group aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
                  <img src={theme.profileImageUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => bioFileRef.current?.click()} className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30"><Upload size={24} /></button>
                  </div>
                  <input type="file" ref={bioFileRef} onChange={async e => {
                    const file = e.target.files?.[0];
                    if(file) setTheme({...theme, profileImageUrl: await optimizeImage(file, 800, 1000)});
                  }} className="hidden" />
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">소개글 내용</label>
                    <button onClick={generateBio} className="text-pink-500 text-xs flex items-center gap-1 hover:underline"><Sparkles size={12} /> AI 재생성</button>
                  </div>
                  <textarea rows={12} value={theme.bioContent} onChange={e => setTheme({...theme, bioContent: e.target.value})} className="w-full p-6 border rounded-2xl bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-pink-100 leading-relaxed text-gray-600" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-10">
              <h3 className="text-2xl font-bold">Home & Theme Settings</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl">
                {/* Text Content Settings */}
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">메인 히어로 타이틀</label>
                    <input 
                      type="text" 
                      value={theme.heroTitle} 
                      onChange={e => setTheme({...theme, heroTitle: e.target.value})} 
                      className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-pink-100 text-xl font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">메인 히어로 서브타이틀</label>
                    <input 
                      type="text" 
                      value={theme.heroSubtitle} 
                      onChange={e => setTheme({...theme, heroSubtitle: e.target.value})} 
                      className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-pink-100" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">사이트 이름</label>
                    <input 
                      type="text" 
                      value={theme.siteName} 
                      onChange={e => setTheme({...theme, siteName: e.target.value})} 
                      className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-pink-100 font-bold" 
                    />
                  </div>
                </div>

                {/* Visual Settings */}
                <div className="space-y-10 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  {/* Font Selection */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Type size={14} /> 메인 서체 스타일
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setTheme({...theme, headingFont: 'serif'})}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${theme.headingFont === 'serif' ? 'border-pink-500 bg-white shadow-md' : 'border-transparent bg-gray-100 hover:bg-gray-200 opacity-60'}`}
                      >
                        <span className="text-2xl font-serif font-black">Aa</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Serif Style</span>
                      </button>
                      <button 
                        onClick={() => setTheme({...theme, headingFont: 'sans'})}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${theme.headingFont === 'sans' ? 'border-pink-500 bg-white shadow-md' : 'border-transparent bg-gray-100 hover:bg-gray-200 opacity-60'}`}
                      >
                        <span className="text-2xl font-sans font-black">Aa</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Sans Style</span>
                      </button>
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">포인트 색상</label>
                      <div className="flex items-center gap-3 p-2 bg-white rounded-xl border">
                        <input 
                          type="color" 
                          value={theme.accentColor} 
                          onChange={e => setTheme({...theme, accentColor: e.target.value})} 
                          className="w-12 h-12 rounded cursor-pointer border-none shadow-sm" 
                        />
                        <span className="font-mono text-xs text-gray-500 uppercase">{theme.accentColor}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">전체 배경 색상</label>
                      <div className="flex items-center gap-3 p-2 bg-white rounded-xl border">
                        <input 
                          type="color" 
                          value={theme.primaryColor} 
                          onChange={e => setTheme({...theme, primaryColor: e.target.value})} 
                          className="w-12 h-12 rounded cursor-pointer border-none shadow-sm border border-gray-100" 
                        />
                        <span className="font-mono text-xs text-gray-500 uppercase">{theme.primaryColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">SEO Settings</h3>
              <div className="max-w-xl space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">메타 타이틀 (검색 제목)</label>
                  <input type="text" value={seo.metaTitle} onChange={e => setSeo({...seo, metaTitle: e.target.value})} className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-pink-100" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">메타 설명 (검색 설명)</label>
                  <textarea rows={3} value={seo.metaDescription} onChange={e => setSeo({...seo, metaDescription: e.target.value})} className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-pink-100" />
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
