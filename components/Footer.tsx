
import React, { useState, useEffect } from 'react';

interface FooterProps {
  onNavigate?: (view: 'home' | 'blog' | 'admin', sectionId?: string) => void;
}

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-black text-white pt-20 pb-10 px-6 relative overflow-hidden border-t-8 border-black">
      {/* Background oversized name */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-black text-white/5 uppercase select-none pointer-events-none whitespace-nowrap">
        Manish Yadav
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          {/* Main Hook */}
          <div className="md:col-span-1">
            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-6 leading-tight">
              Build <br /> <span className="text-[#FFD600]">Future</span> <br /> Today.
            </h2>
            <div className="flex gap-3 items-center mb-6">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="font-bold uppercase tracking-widest text-[10px] text-gray-400">Available for projects</span>
            </div>
            {/* Social icon buttons */}
            <div className="flex gap-3">
              <a
                href="https://github.com/monty0007"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-white/10 border-2 border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-white transition-all hover:shadow-[3px_3px_0px_#FFD600] active:translate-x-0.5 active:translate-y-0.5"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </a>
              <a
                href="https://www.linkedin.com/in/manish-yadav-8a5667202/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-white/10 border-2 border-white/20 flex items-center justify-center text-white hover:bg-[#0077B5] hover:border-[#0077B5] transition-all hover:shadow-[3px_3px_0px_#FFD600] active:translate-x-0.5 active:translate-y-0.5"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
              <a
                href="mailto:monty.my1234@gmail.com"
                className="w-11 h-11 bg-white/10 border-2 border-white/20 flex items-center justify-center text-white hover:bg-[#FF4B4B] hover:border-[#FF4B4B] transition-all hover:shadow-[3px_3px_0px_#FFD600] text-lg active:translate-x-0.5 active:translate-y-0.5"
                aria-label="Email"
              >
                ✉
              </a>
            </div>
          </div>

          {/* Sitemaps */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <h4 className="text-xs font-black uppercase mb-6 text-gray-500 tracking-[0.2em]">Sitemap</h4>
              <ul className="space-y-3 text-lg font-bold">
                <li>
                  <button
                    onClick={() => onNavigate?.('home', 'about')}
                    className="hover:text-[#FFD600] transition-all uppercase text-left w-full group flex items-center gap-2"
                  >
                    <span className="text-gray-600 group-hover:text-[#FFD600] transition-colors">→</span> Mission
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate?.('home', 'projects')}
                    className="hover:text-[#FFD600] transition-all uppercase text-left w-full group flex items-center gap-2"
                  >
                    <span className="text-gray-600 group-hover:text-[#FFD600] transition-colors">→</span> Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate?.('blog')}
                    className="hover:text-[#FFD600] transition-all uppercase text-left w-full group flex items-center gap-2"
                  >
                    <span className="text-gray-600 group-hover:text-[#FFD600] transition-colors">→</span> Blog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate?.('home', 'skills')}
                    className="hover:text-[#FFD600] transition-all uppercase text-left w-full group flex items-center gap-2"
                  >
                    <span className="text-gray-600 group-hover:text-[#FFD600] transition-colors">→</span> Skills
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase mb-6 text-gray-500 tracking-[0.2em]">Connect</h4>
              <ul className="space-y-3 text-lg font-bold">
                <li>
                  <a href="https://github.com/monty0007" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFD600] transition-all flex items-center gap-2 group">
                    <GitHubIcon />
                    <span className="group-hover:underline group-hover:decoration-[#FF4B4B]">GitHub</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/manish-yadav-8a5667202/" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFD600] transition-all flex items-center gap-2 group">
                    <LinkedInIcon />
                    <span className="group-hover:underline group-hover:decoration-[#00A1FF]">LinkedIn</span>
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate?.('admin')}
                    className="lg:hidden text-white/40 hover:text-[#FFD600] transition-all text-sm uppercase font-black border-b-2 border-white/20 hover:border-[#FFD600]"
                  >
                    Admin Access
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="w-full h-px bg-white/20 mb-8"></div>
        <div className="overflow-hidden whitespace-nowrap mb-8 select-none">
          <div className="inline-block animate-[marquee_20s_linear_infinite] text-sm font-black uppercase tracking-[0.3em] text-gray-400">
            GENAI • AGENTIC WORKFLOWS • POWER PLATFORM • REACT • PROMPT ENGINEER • BUSINESS AUTOMATION • &nbsp;
          </div>
          <div className="inline-block animate-[marquee_20s_linear_infinite] text-sm font-black uppercase tracking-[0.3em] text-gray-400">
            GENAI • AGENTIC WORKFLOWS • POWER PLATFORM • REACT • PROMPT ENGINEER • BUSINESS AUTOMATION • &nbsp;
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/10 pt-10">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-gray-500 font-black uppercase tracking-[0.2em] text-[9px] mb-1">Local Time</span>
            <div className="text-xl font-black font-mono">{time}</div>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="text-xl font-black uppercase tracking-tight">© {new Date().getFullYear()} MEOWNTY😸</div>
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 mt-1">Built with high-frequency energy</div>
          </div>

          <button
            onClick={scrollToTop}
            className="cartoon-btn w-14 h-14 bg-[#00A1FF] text-white flex items-center justify-center hover:bg-[#FFD600] hover:text-black transition-all group border-4 border-black shadow-[4px_4px_0px_#FFD600] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
            aria-label="Scroll to top"
          >
            <span className="text-2xl group-hover:-translate-y-1 transition-transform">↑</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
