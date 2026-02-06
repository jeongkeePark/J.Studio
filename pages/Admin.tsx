
import React, { useState, useRef } from 'react';
import { Project, ThemeConfig, SEOConfig } from '../types';
import { LayoutGrid, Palette, Globe, Plus, Trash2, Edit2, Check, X, Sparkles, Settings, User, Upload, Image as ImageIcon, Calendar, Loader2 } from 'lucide-react';
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
  const bioFileRef = useRef<HTMLInputElement>(null);

  const getTodayDate = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  };

  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '새로운 프로젝트',
      category: '카테고리',
      description: '프로젝트에 대한 설명을 입력하세요.',
      imageUrl: 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=1200',
      date: getTodayDate()
    };
    setProjects([newProject, ...projects]);
    setEditingProject(newProject);
  };

  const handleUpdateProject = (updated: Project) => {
    try {
      setProjects(projects.map(p => p.id === updated.id ? updated : p));
      setEditingProject(null);
    } catch (e) {
      alert('저장 용량이 부족합니다. 오래된 작품을 삭제하거나 더 작은 이미지를 사용해주세요.');
    }
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('이 프로젝트를 삭제하시겠습니까?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  // Image Optimization Logic (Resizing & Compression)
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

          // Calculate new dimensions
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

          // Export as compressed JPEG
          const optimizedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(optimizedBase64);
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
        const optimizedBase64 = await optimizeImage(file);
        setEditingProject({ 
          ...editingProject, 
          imageUrl: optimizedBase64,
          date: getTodayDate() 
        });
      } catch (err) {
        alert('이미지 최적화 중 오류가 발생했습니다.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleBioImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const optimizedBase64 = await optimizeImage(file, 800, 800, 0.7);
        setTheme({ ...theme, profileImageUrl: optimizedBase64 });
      } catch (err) {
        alert('이미지 처리 중 오류가 발생했습니다.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const generateBio = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${theme.siteName}라는 이름으로 활동하는 시각 예술가/디자이너를 위한 전문적이고 품격 있는 바이오그래피(자기소개)를 한국어로 작성해줘. 2-3문단 정도로 구성하고 미니멀리즘과 감각적인 스타일을 강조해줘.`,
      });
      setTheme({ ...theme, bioContent: response.text || '' });
    } catch (error) {
      console.error(error);
      alert('AI 생성에 실패했습니다.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const generateProjectDescription = async (title: string) => {
    if (!title) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${title}라는 제목의 디자인 프로젝트를 위한 짧고 고급스러운 감각의 한국어 설명을 2-3문장 작성해줘.`,
      });
      if (editingProject) {
        setEditingProject({ ...editingProject, description: response.text || '' });
      }
    } catch (error) {
      console.error(error);
      alert('AI 생성에 실패했습니다.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 space-y-2">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2">
            <Settings size={20} /> Dashboard
          </h2>
          <button 
            onClick={() => setActiveTab('projects')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'projects' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          >
            <LayoutGrid size={18} /> 프로젝트 관리
          </button>
          <button 
            onClick={() => setActiveTab('bio')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'bio' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          >
            <User size={18} /> 바이오그래피 관리
          </button>
          <button 
            onClick={() => setActiveTab('theme')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'theme' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          >
            <Palette size={18} /> 테마 커스텀
          </button>
          <button 
            onClick={() => setActiveTab('seo')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'seo' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          >
            <Globe size={18} /> SEO & 설정
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow bg-white border border-gray-100 rounded-2xl p-8 shadow-sm min-h-[600px]">
          
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">포트폴리오 리스트</h3>
                <button 
                  onClick={handleAddProject}
                  className="bg-pink-500 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold hover:bg-pink-600 transition-transform active:scale-95"
                >
                  <Plus size={16} /> 프로젝트 추가
                </button>
              </div>

              {editingProject ? (
                <div className="bg-gray-50 p-6 rounded-xl space-y-4 border-2 border-pink-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-pink-500">프로젝트 편집 중</h4>
                    <button onClick={() => setEditingProject(null)} className="text-gray-400 hover:text-black">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-gray-400">제목</label>
                      <input 
                        type="text" 
                        value={editingProject.title} 
                        onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                        className="w-full p-2 border rounded focus:ring-1 focus:ring-pink-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-gray-400">카테고리</label>
                      <input 
                        type="text" 
                        value={editingProject.category} 
                        onChange={e => setEditingProject({...editingProject, category: e.target.value})}
                        className="w-full p-2 border rounded focus:ring-1 focus:ring-pink-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-gray-400">날짜 (Timeline)</label>
                      <input 
                        type="text" 
                        value={editingProject.date} 
                        onChange={e => setEditingProject({...editingProject, date: e.target.value})}
                        className="w-full p-2 border rounded font-mono text-sm focus:ring-1 focus:ring-pink-500 outline-none"
                        placeholder="YYYY.MM.DD"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <label className="text-xs font-bold uppercase text-gray-400">설명</label>
                      <button 
                        onClick={() => generateProjectDescription(editingProject.title)}
                        disabled={isAiLoading}
                        className="text-pink-500 text-xs flex items-center gap-1 hover:opacity-70 disabled:opacity-30"
                      >
                        <Sparkles size={12} /> {isAiLoading ? '생성 중...' : 'AI로 설명 생성'}
                      </button>
                    </div>
                    <textarea 
                      rows={4}
                      value={editingProject.description} 
                      onChange={e => setEditingProject({...editingProject, description: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-1 focus:ring-pink-500 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400 block">프로젝트 이미지</label>
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="w-full md:w-48 bg-gray-200 rounded overflow-hidden relative group border border-gray-100 min-h-[120px] flex items-center justify-center">
                        {isUploading ? (
                          <Loader2 className="animate-spin text-pink-500" size={24} />
                        ) : (
                          <>
                            <img src={editingProject.imageUrl} className="w-full h-auto max-h-48 object-contain" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => projectFileRef.current?.click()}>
                               <ImageIcon className="text-white" size={24} />
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex-grow space-y-3 w-full">
                        <input 
                          type="file" 
                          ref={projectFileRef}
                          onChange={handleProjectImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <button 
                          onClick={() => projectFileRef.current?.click()}
                          disabled={isUploading}
                          className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm flex items-center justify-center gap-2 hover:border-pink-500 hover:text-pink-500 transition-all disabled:opacity-50"
                        >
                          {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                          용량 최적화 업로드 (대용량 사진 가능)
                        </button>
                        <div className="space-y-1">
                          <p className="text-[10px] text-gray-400 uppercase font-bold">또는 이미지 URL 입력</p>
                          <input 
                            type="text" 
                            value={editingProject.imageUrl} 
                            onChange={e => setEditingProject({...editingProject, imageUrl: e.target.value})}
                            className="w-full p-2 text-xs border rounded"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <button onClick={() => setEditingProject(null)} className="px-4 py-2 border rounded text-sm font-medium hover:bg-gray-100 transition-colors">취소</button>
                    <button onClick={() => handleUpdateProject(editingProject)} className="px-6 py-2 bg-black text-white rounded text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg active:scale-95">저장하기</button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {projects.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <img src={p.imageUrl} className="w-16 h-12 object-cover rounded shadow-sm border border-gray-100" />
                        <div>
                          <h4 className="font-bold">{p.title}</h4>
                          <p className="text-xs text-gray-400">{p.category} • {p.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingProject(p)} className="p-2 text-gray-400 hover:text-black"><Edit2 size={18} /></button>
                        <button onClick={() => handleDeleteProject(p.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="py-20 text-center text-gray-400">
                      등록된 프로젝트가 없습니다.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'bio' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">바이오그래피 관리</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400">프로필 이미지</label>
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-40 bg-gray-100 overflow-hidden rounded-lg shadow-inner flex items-center justify-center">
                      {isUploading ? (
                        <Loader2 className="animate-spin text-pink-500" />
                      ) : (
                        <img src={theme.profileImageUrl} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="space-y-3 flex-grow max-w-sm">
                      <input 
                        type="file" 
                        ref={bioFileRef}
                        onChange={handleBioImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button 
                        onClick={() => bioFileRef.current?.click()}
                        disabled={isUploading}
                        className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm flex items-center justify-center gap-2 hover:border-pink-500 hover:text-pink-500 transition-all"
                      >
                        {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                        프로필 사진 업로드
                      </button>
                      <input 
                        type="text" 
                        value={theme.profileImageUrl} 
                        onChange={e => setTheme({...theme, profileImageUrl: e.target.value})}
                        className="w-full p-2 text-xs border rounded"
                        placeholder="이미지 URL 직접 입력"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase text-gray-400">작가 소개글 (Bio)</label>
                    <button 
                      onClick={generateBio}
                      disabled={isAiLoading}
                      className="text-pink-500 text-xs flex items-center gap-1 hover:opacity-70 disabled:opacity-30"
                    >
                      <Sparkles size={12} /> {isAiLoading ? '생성 중...' : 'AI로 소개글 자동 생성'}
                    </button>
                  </div>
                  <textarea 
                    rows={12}
                    value={theme.bioContent} 
                    onChange={e => setTheme({...theme, bioContent: e.target.value})}
                    className="w-full p-4 border rounded text-sm leading-relaxed focus:ring-1 focus:ring-pink-500 outline-none"
                    placeholder="작가님의 철학과 경력을 적어주세요."
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold">테마 및 스타일 설정</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-bold text-sm border-b pb-2 text-gray-400 uppercase tracking-widest">기본 정보</h4>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase font-bold">사이트 이름</label>
                    <input 
                      type="text" 
                      value={theme.siteName} 
                      onChange={e => setTheme({...theme, siteName: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase font-bold">헤드라인 폰트 스타일</label>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setTheme({...theme, headingFont: 'serif'})}
                        className={`flex-1 p-3 border rounded text-center transition-all ${theme.headingFont === 'serif' ? 'border-pink-500 bg-pink-50 font-serif' : 'hover:bg-gray-50'}`}
                      >
                        Serif
                      </button>
                      <button 
                        onClick={() => setTheme({...theme, headingFont: 'sans'})}
                        className={`flex-1 p-3 border rounded text-center transition-all ${theme.headingFont === 'sans' ? 'border-pink-500 bg-pink-50 font-sans' : 'hover:bg-gray-50'}`}
                      >
                        Sans-Serif
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase font-bold">포인트 컬러</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="color" 
                        value={theme.accentColor} 
                        onChange={e => setTheme({...theme, accentColor: e.target.value})}
                        className="w-12 h-12 border-none p-0 bg-transparent rounded cursor-pointer"
                      />
                      <span className="text-sm font-mono text-gray-400 uppercase tracking-tighter">{theme.accentColor}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-sm border-b pb-2 text-gray-400 uppercase tracking-widest">Hero 섹션</h4>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase font-bold">메인 타이틀</label>
                    <input 
                      type="text" 
                      value={theme.heroTitle} 
                      onChange={e => setTheme({...theme, heroTitle: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase font-bold">서브 타이틀</label>
                    <textarea 
                      value={theme.heroSubtitle} 
                      onChange={e => setTheme({...theme, heroSubtitle: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="font-bold text-sm border-b pb-2 text-gray-400 uppercase tracking-widest">소셜 미디어 & 연락처</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-300">INSTAGRAM</label>
                    <input placeholder="URL" value={theme.socialLinks.instagram} onChange={e => setTheme({...theme, socialLinks: {...theme.socialLinks, instagram: e.target.value}})} className="w-full p-2 border rounded text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-300">BEHANCE</label>
                    <input placeholder="URL" value={theme.socialLinks.behance} onChange={e => setTheme({...theme, socialLinks: {...theme.socialLinks, behance: e.target.value}})} className="w-full p-2 border rounded text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-300">EMAIL</label>
                    <input placeholder="Email" value={theme.socialLinks.email} onChange={e => setTheme({...theme, socialLinks: {...theme.socialLinks, email: e.target.value}})} className="w-full p-2 border rounded text-sm" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold">검색 엔진 최적화 (SEO)</h3>
              <p className="text-gray-500 text-sm">검색 결과에 사이트가 노출되는 방식을 제어합니다.</p>
              
              <div className="space-y-4 max-w-xl">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase font-bold">Meta Title (페이지 제목)</label>
                  <input 
                    type="text" 
                    value={seo.metaTitle} 
                    onChange={e => setSeo({...seo, metaTitle: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="J.Park Studio | 디자인 포트폴리오"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase font-bold">Meta Description (검색 설명)</label>
                  <textarea 
                    rows={3}
                    value={seo.metaDescription} 
                    onChange={e => setSeo({...seo, metaDescription: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase font-bold">Keywords (키워드, 쉼표로 구분)</label>
                  <input 
                    type="text" 
                    value={seo.keywords} 
                    onChange={e => setSeo({...seo, keywords: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="디자인, 포트폴리오, 사진, 아트"
                  />
                </div>
              </div>

              <div className="pt-8 border-t">
                <h4 className="font-bold mb-4">사이트 프리뷰</h4>
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm space-y-1">
                  <p className="text-[#1a0dab] text-xl font-medium hover:underline cursor-pointer">{seo.metaTitle}</p>
                  <p className="text-[#006621] text-sm font-sans">https://jpark.studio/</p>
                  <p className="text-[#545454] text-sm line-clamp-2">{seo.metaDescription}</p>
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
