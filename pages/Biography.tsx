
import React from 'react';
import { ThemeConfig } from '../types';

interface BiographyProps {
  theme: ThemeConfig;
}

const Biography: React.FC<BiographyProps> = ({ theme }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-40">
        <div className="grid md:grid-cols-2 gap-20 items-start">
          {/* Profile Image - Maintain Original Aspect Ratio */}
          <div className="w-full bg-gray-50 overflow-hidden order-2 md:order-1 border border-black/5 shadow-2xl">
            <img 
              src={theme.profileImageUrl} 
              alt={theme.siteName} 
              className="w-full h-auto block grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>

          {/* Text Content */}
          <div className="order-1 md:order-2 space-y-10">
            <div>
              <p className="text-[10px] font-black tracking-[0.4em] uppercase mb-4" style={{ color: theme.accentColor }}>
                Biography
              </p>
              <h1 className={`text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tighter ${theme.headingFont === 'serif' ? 'font-serif italic' : ''}`}>
                About<br />
                {theme.siteName}
              </h1>
            </div>

            {/* Smaller, delicate biography text */}
            <div className="prose prose-sm text-gray-500 leading-relaxed font-light whitespace-pre-wrap max-w-md">
              {theme.bioContent}
            </div>

            <div className="pt-10 border-t border-black/5">
              <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 mb-6">Digital Presence</h3>
              <div className="flex flex-col space-y-3">
                <a href={theme.socialLinks.instagram} className="text-sm font-bold hover:opacity-50 transition-opacity">Instagram —</a>
                <a href={theme.socialLinks.behance} className="text-sm font-bold hover:opacity-50 transition-opacity">Behance —</a>
                <a href={`mailto:${theme.socialLinks.email}`} className="text-sm font-bold hover:opacity-50 transition-opacity">Email —</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Biography;
