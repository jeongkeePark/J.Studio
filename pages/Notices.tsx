
import React from 'react';
import { Notice, ThemeConfig } from '../types';

interface NoticesPageProps {
  notices: Notice[];
  theme: ThemeConfig;
}

const NoticesPage: React.FC<NoticesPageProps> = ({ notices, theme }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="max-w-5xl mx-auto px-6 py-40 md:py-60">
        <header className="mb-24 text-center md:text-left">
          <p className="text-[10px] font-black tracking-[0.6em] uppercase mb-8" style={{ color: theme.accentColor }}>
            Studio Archive
          </p>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none mb-4">
            Notices<span style={{ color: theme.accentColor }}>.</span>
          </h1>
        </header>

        <div className="space-y-12">
          {notices.length === 0 ? (
            <p className="text-gray-300 font-light text-center py-20">No announcements yet.</p>
          ) : (
            notices.map((notice) => (
              <div 
                key={notice.id} 
                className="group p-10 bg-white/30 backdrop-blur-md border border-black/5 hover:border-black transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight">{notice.title}</h2>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 border border-black/5 px-4 py-2 rounded-full">
                    {notice.date}
                  </span>
                </div>
                <div className="prose prose-sm text-gray-500 font-light leading-relaxed whitespace-pre-wrap max-w-3xl">
                  {notice.content}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticesPage;
