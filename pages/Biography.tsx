
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
          {/* Profile Image */}
          <div className="aspect-[4/5] bg-gray-100 overflow-hidden order-2 md:order-1">
            <img 
              src={theme.profileImageUrl} 
              alt={theme.siteName} 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>

          {/* Text Content */}
          <div className="order-1 md:order-2 space-y-10">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: theme.accentColor }}>
                Biography
              </p>
              <h1 className={`text-5xl md:text-7xl font-black mb-8 leading-tight ${theme.headingFont === 'serif' ? 'font-serif' : ''}`}>
                About<br />
                {theme.siteName}
              </h1>
            </div>

            <div className="prose prose-lg text-gray-600 leading-relaxed font-light whitespace-pre-wrap">
              {theme.bioContent}
            </div>

            <div className="pt-10 border-t border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Connect</h3>
              <div className="flex flex-col space-y-3">
                <a href={theme.socialLinks.instagram} className="text-lg hover:opacity-50 transition-opacity">Instagram —</a>
                <a href={theme.socialLinks.behance} className="text-lg hover:opacity-50 transition-opacity">Behance —</a>
                <a href={`mailto:${theme.socialLinks.email}`} className="text-lg hover:opacity-50 transition-opacity">Email —</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Biography;
