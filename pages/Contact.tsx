
import React from 'react';
import { ThemeConfig } from '../types';
import { Instagram, Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';

interface ContactProps { theme: ThemeConfig; }

const Contact: React.FC<ContactProps> = ({ theme }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="max-w-4xl mx-auto px-6 py-40 md:py-60">
        <div className="text-center mb-24">
            <p className="text-[10px] font-black tracking-[0.6em] uppercase mb-8" style={{ color: theme.accentColor }}>
              Get in touch
            </p>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none mb-4">
              Connect<span style={{ color: theme.accentColor }}>.</span>
            </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-12">
                <div className="group">
                    <div className="flex items-center gap-3 text-gray-400 mb-4">
                        <MapPin size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Studio Location</span>
                    </div>
                    <p className="text-lg font-bold whitespace-pre-wrap">{theme.contactAddress}</p>
                </div>

                <div className="group">
                    <div className="flex items-center gap-3 text-gray-400 mb-4">
                        <Mail size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Email Address</span>
                    </div>
                    <a href={`mailto:${theme.socialLinks.email}`} className="text-2xl font-black hover:opacity-50 transition-opacity">
                        {theme.socialLinks.email}
                    </a>
                </div>

                <div className="group">
                    <div className="flex items-center gap-3 text-gray-400 mb-4">
                        <Phone size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Phone Number</span>
                    </div>
                    <p className="text-2xl font-black">{theme.socialLinks.phone}</p>
                </div>
            </div>

            <div className="space-y-12 border-t md:border-t-0 md:border-l border-black/5 pt-12 md:pt-0 md:pl-16">
                 <div className="group">
                    <div className="flex items-center gap-3 text-gray-400 mb-4">
                        <Instagram size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Instagram</span>
                    </div>
                    <a href={theme.socialLinks.instagram} target="_blank" className="text-lg font-bold hover:opacity-50 transition-opacity block truncate">
                        @{theme.socialLinks.instagram.split('/').pop()}
                    </a>
                </div>

                <div className="group">
                    <div className="flex items-center gap-3 text-gray-400 mb-4">
                        <LinkIcon size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Studio Blog</span>
                    </div>
                    <a href={theme.socialLinks.blog} target="_blank" className="text-lg font-bold hover:opacity-50 transition-opacity block truncate">
                        {theme.socialLinks.blog.replace('https://', '')}
                    </a>
                </div>

                <div className="pt-8">
                    <p className="text-[9px] text-gray-300 font-light leading-relaxed uppercase tracking-[0.2em]">
                        Ready to start a project?<br />
                        I'm currently accepting new commissions.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
