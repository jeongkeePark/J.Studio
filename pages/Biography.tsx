
import React from 'react';
import { ThemeConfig } from '../types';

interface BiographyProps { theme: ThemeConfig; }

const Biography: React.FC<BiographyProps> = ({ theme }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-40">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          
          <div className="w-full aspect-square bg-gray-50 overflow-hidden order-2 md:order-1 border border-black/5 shadow-2xl rounded-full">
            <img 
              src={theme.profileImageUrl} 
              alt={theme.siteName} 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </div>

          <div className="order-1 md:order-2 space-y-16">
            <div>
              <p className="text-[10px] font-black tracking-[0.6em] uppercase mb-6" style={{ color: theme.accentColor }}>
                Biography
              </p>
              <h1 className="text-6xl md:text-8xl font-black mb-12 leading-tight tracking-tighter">
                {theme.bioHeadline}
              </h1>
            </div>

            <div className="prose prose-sm text-gray-500 leading-[1.8] font-light whitespace-pre-wrap max-w-lg">
              {theme.bioContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Biography;
