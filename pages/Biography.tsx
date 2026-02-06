
import React from 'react';
import { ThemeConfig } from '../types';

interface BiographyProps { theme: ThemeConfig; }

const Biography: React.FC<BiographyProps> = ({ theme }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-40">
        <div className="grid md:grid-cols-2 gap-20 items-start">
          
          {/* Profile Image */}
          <div className="w-full bg-gray-50 overflow-hidden order-2 md:order-1 border border-black/5 shadow-2xl">
            <img 
              src={theme.profileImageUrl} 
              alt={theme.siteName} 
              className="w-full h-auto block grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </div>

          {/* Text Content */}
          <div className="order-1 md:order-2 space-y-16">
            <div>
              <p className="text-[10px] font-black tracking-[0.6em] uppercase mb-6" style={{ color: theme.accentColor }}>
                Biography
              </p>
              <h1 className={`text-6xl md:text-8xl font-black mb-12 leading-tight tracking-tighter ${theme.headingFont === 'serif' ? 'font-serif italic' : ''}`}>
                Behind the<br />
                {theme.siteName}
              </h1>
            </div>

            {/* Detailed bio text */}
            <div className="prose prose-sm text-gray-500 leading-[1.8] font-light whitespace-pre-wrap max-w-lg">
              {theme.bioContent}
            </div>

            {/* Digital Presence with explicit addresses */}
            <div className="pt-16 border-t border-black/10">
              <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 mb-10">Digital Presence</h3>
              <div className="grid grid-cols-1 gap-10">
                
                <div className="group">
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2">Instagram</p>
                  <a href={theme.socialLinks.instagram} target="_blank" className="text-sm font-bold block hover:opacity-50 transition-opacity border-b border-black/5 pb-2">
                    {theme.socialLinks.instagram.replace('https://', '').replace('www.', '')}
                  </a>
                </div>

                <div className="group">
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2">Behance</p>
                  <a href={theme.socialLinks.behance} target="_blank" className="text-sm font-bold block hover:opacity-50 transition-opacity border-b border-black/5 pb-2">
                    {theme.socialLinks.behance.replace('https://', '').replace('www.', '')}
                  </a>
                </div>

                <div className="group">
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2">Email Contact</p>
                  <a href={`mailto:${theme.socialLinks.email}`} className="text-sm font-bold block hover:opacity-50 transition-opacity border-b border-black/5 pb-2">
                    {theme.socialLinks.email}
                  </a>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Biography;
