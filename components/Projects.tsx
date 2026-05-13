import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '../services/projectService';
import { Project } from '../types';
import { PROJECTS } from '../constants';
import {
  ProjectCardSkeleton,
  ProjectMobileCardSkeleton,
  ProjectDesktopCardSkeleton,
} from './Skeleton';

// ────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ────────────────────────────────────────────────────────────────────────────
type ProjectsHomeView = 'cinematic' | 'shelf';
const HOME_VIEW_STORAGE_KEY = 'portfolio_home_projects_view';

const hasLiveLink = (project: Project) =>
  Boolean(project.link && project.link !== 'na' && !project.disabled);

const getProjectInitials = (title: string) =>
  title.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();

// ────────────────────────────────────────────────────────────────────────────
// Icons
// ────────────────────────────────────────────────────────────────────────────
const ExternalLinkIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const ArrowRightIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const LockIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const FilmIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </svg>
);

const LayoutIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);

// ────────────────────────────────────────────────────────────────────────────
// View Toggle (floating, fixed) — only shown when #projects is in viewport
// ────────────────────────────────────────────────────────────────────────────
const HomeViewToggle: React.FC<{
  view: ProjectsHomeView;
  setView: (v: ProjectsHomeView) => void;
  visible: boolean;
}> = ({ view, setView, visible }) => {
  const handleSetView = (v: ProjectsHomeView) => {
    setView(v);
    if (v === 'shelf') {
      setTimeout(() => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  return (
    <div
      className={`fixed bottom-6 left-6 z-[260] flex flex-col items-start gap-1.5 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <span className="font-black uppercase text-[9px] tracking-[0.3em] bg-black text-white px-2.5 py-1 border-2 border-black">
        Projects View
      </span>
      <div className="inline-flex border-[3px] border-black bg-white shadow-[4px_4px_0px_#FFD600]" role="group" aria-label="Switch projects view">
        <button
          type="button"
          onClick={() => handleSetView('cinematic')}
          aria-pressed={view === 'cinematic'}
          title="Cinematic horizontal scroll"
          className={`flex items-center gap-1.5 px-3 py-2 font-black uppercase text-[10px] tracking-widest transition-colors ${view === 'cinematic' ? 'bg-black text-[#FFD600]' : 'bg-white text-black hover:bg-gray-100'}`}
        >
          <FilmIcon className="w-3.5 h-3.5" />
          Cinema
        </button>
        <button
          type="button"
          onClick={() => handleSetView('shelf')}
          aria-pressed={view === 'shelf'}
          title="Wide editorial shelf"
          className={`flex items-center gap-1.5 px-3 py-2 font-black uppercase text-[10px] tracking-widest border-l-[3px] border-black transition-colors ${view === 'shelf' ? 'bg-black text-[#FFD600]' : 'bg-white text-black hover:bg-gray-100'}`}
        >
          <LayoutIcon className="w-3.5 h-3.5" />
          Shelf
        </button>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// VIEW 1 — CINEMATIC (original horizontal-scroll experience)
// ════════════════════════════════════════════════════════════════════════════
const Scribble: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 20" className={`absolute fill-none stroke-current ${className}`} style={{ strokeWidth: 3, strokeLinecap: 'round' }}>
    <path d="M5,15 Q25,5 45,15 T85,10" />
  </svg>
);

const CinematicProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="flex-shrink-0 w-[90vw] h-[75vh] md:h-[80vh] flex items-center justify-center px-4 md:px-12 relative group"
    >
      <div
        className="relative w-full h-full flex flex-col md:flex-row items-center gap-8 md:gap-0"
        style={{
          transform: isDesktop ? `rotateX(${mousePos.y * -3}deg) rotateY(${mousePos.x * 5}deg)` : 'none',
          willChange: isDesktop ? 'transform' : 'auto',
        }}>
        <div className="absolute -top-10 left-0 text-[12rem] md:text-[25rem] font-black text-black opacity-[0.03] select-none pointer-events-none leading-none z-0">
          0{index + 1}
        </div>

        <div className="relative w-full md:w-[65%] h-[45%] md:h-[85%] z-20 group/img">
          <div className="absolute -top-4 md:-top-6 left-6 md:left-10 bg-black text-[#FFD600] px-4 md:px-6 py-1 font-black uppercase text-[10px] md:text-xs skew-x-[-15deg] border-t-2 border-x-2 border-black z-30">
            SCHEMA_DATA_{index + 1}
          </div>

          <div className="absolute inset-0 bg-white border-[4px] md:border-[10px] border-black shadow-[10px_10px_0px_#000] md:shadow-[15px_15px_0px_#000] overflow-hidden lg:group-hover/img:shadow-[5px_5px_0px_#000] transition-all">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover grayscale-0 lg:grayscale lg:group-hover/img:grayscale-0 transition-all duration-700 scale-100 lg:scale-105 lg:group-hover/img:scale-100"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-black text-7xl text-black/15" style={{ backgroundColor: project.color + '22' }}>
                {getProjectInitials(project.title) || '?'}
              </div>
            )}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]"></div>
          </div>
        </div>

        <div className="w-full md:w-[45%] bg-white border-[4px] md:border-[6px] border-black p-6 md:p-12 shadow-[10px_10px_0px_#00A1FF] md:shadow-[15px_15px_0px_#00A1FF] z-40 md:-ml-20 transform -rotate-1 lg:group-hover:rotate-0 transition-all">
          <h3 className="text-3xl md:text-7xl font-black uppercase leading-[0.85] mb-4 md:mb-6 tracking-tighter text-black">
            {project.title}
          </h3>
          <div className="bg-yellow-50 border-2 border-dashed border-black/20 p-3 md:p-4 mb-6 md:mb-8 relative">
            <Scribble className="w-10 md:w-12 text-[#FF4B4B] -top-3 -right-1" />
            <p className="font-bold text-gray-800 italic leading-tight text-base md:text-xl line-clamp-4">
              "{project.description}"
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mb-6 md:mb-10">
            {project.tags.map(tag => (
              <span key={tag} className="bg-black text-white px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-black uppercase tracking-tighter border-2 border-black">
                {tag}
              </span>
            ))}
          </div>
          <a
            href={project.disabled ? undefined : project.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => { if (project.disabled) e.preventDefault(); }}
            className={`cartoon-btn w-full group/btn flex flex-col items-center justify-center gap-1 md:gap-2 py-3 md:py-5 font-black uppercase border-4 border-black transition-all
              ${project.disabled
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed shadow-[6px_6px_0px_#000]'
                : 'bg-[#FFD600] text-black shadow-[6px_6px_0px_#000] md:shadow-[10px_10px_0px_#000] hover:bg-black hover:text-[#FFD600] active:translate-y-1 active:shadow-none'
              }`}
          >
            <div className="flex items-center gap-2 text-lg md:text-2xl">
              {project.disabled ? 'ENTERPRISE ONLY ⭐' : 'VIEW PROJECT'}
              {!project.disabled && (
                <span className="text-2xl md:text-4xl group-hover/btn:translate-x-3 transition-transform">→</span>
              )}
            </div>
            {project.disabled && (
              <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider opacity-80">
                Contact me for more information
              </span>
            )}
          </a>
        </div>
      </div>
    </div>
  );
};

const CinematicProjects: React.FC<{ projects: Project[]; loading: boolean }> = ({ projects, loading }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener?.('change', update);
    return () => mql.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current) { ticking = false; return; }
          const rect = sectionRef.current.getBoundingClientRect();
          const totalDist = rect.height - window.innerHeight;
          const progress = Math.min(Math.max(-rect.top / totalDist, 0), 1);
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  if (isMobile) {
    return (
      <section id="projects" className="relative bg-[#FFF9E6] border-y-8 border-black py-16 px-4">
        <div className="text-center mb-10">
          <div className="inline-block bg-[#FFD600] border-4 border-black px-5 py-2 font-black uppercase text-xs tracking-widest -rotate-1 shadow-[4px_4px_0px_#000] mb-4">
            Featured Works
          </div>
          <h2 className="text-6xl sm:text-7xl font-black uppercase tracking-tighter leading-none italic">
            W<span className="text-white" style={{ WebkitTextStroke: '2px black', textShadow: '4px 4px 0px #FF4B4B' }}>OR</span>KS
          </h2>
        </div>

        <div className="space-y-10 max-w-xl mx-auto">
          {loading
            ? [0, 1, 2].map(i => <ProjectMobileCardSkeleton key={i} />)
            : projects.slice(0, 3).map((project, index) => (
              <article key={project.id} className="bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] overflow-hidden">
                <div className="relative">
                  <div className="absolute top-3 left-3 bg-black text-[#FFD600] px-3 py-1 font-black uppercase text-[10px] z-10 border-2 border-black">
                    SCHEMA_DATA_{index + 1}
                  </div>
                  {project.image ? (
                    <img src={project.image} alt={project.title} loading="lazy" decoding="async" className="w-full aspect-[16/10] object-cover border-b-4 border-black" />
                  ) : (
                    <div className="w-full aspect-[16/10] flex items-center justify-center font-black text-5xl text-black/20 border-b-4 border-black" style={{ backgroundColor: project.color + '22' }}>
                      {getProjectInitials(project.title) || '?'}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-2xl font-black uppercase leading-tight mb-3 tracking-tighter text-black">{project.title}</h3>
                  <p className="font-bold text-gray-800 italic text-sm mb-4 leading-snug line-clamp-3">"{project.description}"</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="bg-black text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter border-2 border-black">{tag}</span>
                    ))}
                  </div>
                  <a
                    href={project.disabled ? undefined : project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => { if (project.disabled) e.preventDefault(); }}
                    className={`block w-full text-center py-3 font-black uppercase border-4 border-black ${project.disabled ? 'bg-gray-300 text-gray-600 cursor-not-allowed shadow-[4px_4px_0px_#000]' : 'bg-[#FFD600] text-black shadow-[6px_6px_0px_#000] active:translate-y-1 active:shadow-none'}`}
                  >
                    {project.disabled ? 'ENTERPRISE ONLY ⭐' : 'VIEW PROJECT →'}
                  </a>
                </div>
              </article>
            ))}
        </div>

        <div className="mt-10 text-center">
          <button onClick={() => navigate('/projects')} className="bg-black text-[#FFD600] border-4 border-black px-8 py-3 font-black uppercase tracking-widest shadow-[6px_6px_0px_#FFD600] active:translate-y-1 active:shadow-none">
            View All Projects →
          </button>
        </div>
      </section>
    );
  }

  let pinProgress = 0;
  if (scrollProgress > 0.20) pinProgress = Math.min((scrollProgress - 0.20) / 0.25, 1);
  let galleryProgress = 0;
  if (scrollProgress > 0.30) galleryProgress = Math.min((scrollProgress - 0.30) / 0.60, 1);

  const titleX = 50 - (pinProgress * 44);
  const titleScale = 1 - (pinProgress * 0.55);
  const titleRotation = pinProgress * -90;
  const translationDistance = 330;
  const currentTranslate = 100 - (galleryProgress * translationDistance);

  return (
    <section ref={sectionRef} id="projects" className="relative h-[450vh] bg-[#FFF9E6] border-y-8 border-black">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none top-0 h-screen"
        style={{
          backgroundImage: `linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)`,
          backgroundSize: '80px 80px',
        }}>
      </div>

      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        <div
          className="absolute z-[60] pointer-events-none flex items-center justify-center whitespace-nowrap"
          style={{
            left: `${titleX}%`,
            top: '50%',
            transform: `translate(-50%, -50%) scale(${titleScale}) rotate(${titleRotation}deg)`,
            width: '100vw',
          }}
        >
          <div className="relative">
            <h2 className="text-[5.5rem] sm:text-[10rem] md:text-[15rem] lg:text-[18rem] xl:text-[22rem] font-black uppercase tracking-tighter leading-none italic">
              W<span className="text-white" style={{ WebkitTextStroke: 'clamp(2px, 0.5vw, 5px) black', textShadow: 'clamp(6px, 1vw, 12px) clamp(6px, 1vw, 12px) 0px #FF4B4B' }}>OR</span>KS
            </h2>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[45%] bg-[#FFD600] border-y-4 md:border-y-8 border-black -rotate-1 -z-10 shadow-[10px_10px_0px_#000] md:shadow-[25px_25px_0px_#000]"></div>
          </div>
        </div>

        <div
          className="flex items-center h-full"
          style={{
            transform: `translateX(${currentTranslate}vw)`,
            opacity: Math.min(pinProgress * 3, 1),
          }}
        >
          {loading
            ? [0, 1, 2].map(i => <ProjectDesktopCardSkeleton key={i} index={i} />)
            : projects.slice(0, 3).map((project, index) => (
              <CinematicProjectCard key={project.id} project={project} index={index} />
            ))}

          {!loading && (
            <div className="flex-shrink-0 w-[50vw] flex items-center justify-center ml-10">
              <div className="bg-white border-[8px] md:border-[12px] border-black p-8 md:p-16 rotate-3 shadow-[15px_15px_0px_#FFD600] md:shadow-[30px_30px_0px_#FFD600] text-center">
                <h4 className="text-4xl md:text-8xl font-black uppercase tracking-tighter italic mb-2 md:mb-4">FIN_DATA</h4>
                <p className="font-bold text-sm md:text-2xl uppercase tracking-widest text-[#FF4B4B] mb-6 md:mb-10">Sequence Complete!</p>
                <button
                  onClick={() => navigate('/projects')}
                  className="bg-black text-[#FFD600] border-4 border-black px-6 md:px-10 py-3 md:py-4 font-black uppercase text-sm md:text-lg tracking-widest shadow-[6px_6px_0px_#FFD600] hover:bg-[#FFD600] hover:text-black hover:shadow-none transition-all active:translate-y-1"
                >
                  View All Projects →
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-12 left-12 flex flex-col items-start gap-2 z-[70] pointer-events-none">
          <span className="font-black uppercase text-[10px] tracking-widest bg-black text-white px-3 py-1">
            {scrollProgress < 0.2 ? 'System Ready' : scrollProgress < 0.45 ? 'Syncing...' : `Intel: ${Math.round(galleryProgress * 100)}%`}
          </span>
          <div className="w-48 h-3 border-[3px] border-black bg-white shadow-[4px_4px_0px_#000] overflow-hidden">
            <div className="h-full bg-[#00A1FF] transition-all duration-100 ease-out" style={{ width: `${scrollProgress * 100}%` }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// VIEW 2 — SHELF (wide editorial layout)
// ════════════════════════════════════════════════════════════════════════════
const ProjectImage: React.FC<{ project: Project; className?: string }> = ({ project, className = '' }) => {
  if (project.image) {
    return <img src={project.image} alt={project.title} loading="lazy" decoding="async" className={`w-full h-full object-cover ${className}`} />;
  }
  return (
    <div className={`w-full h-full flex items-center justify-center font-black text-5xl text-black/20 ${className}`} style={{ backgroundColor: `${project.color}24` }} aria-label={project.title}>
      {getProjectInitials(project.title) || '?'}
    </div>
  );
};

const ProjectAction: React.FC<{ project: Project; compact?: boolean }> = ({ project, compact = false }) => {
  if (!hasLiveLink(project)) {
    return (
      <div className="inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-500 border-[3px] border-black px-4 py-2.5 font-black uppercase text-[11px] tracking-wide cursor-not-allowed min-h-11">
        <LockIcon />
        <span>{project.disabled ? 'Private Build' : 'Link Pending'}</span>
      </div>
    );
  }
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-black text-white border-[3px] border-black font-black uppercase tracking-wide shadow-[4px_4px_0px_#FFD600] hover:bg-[#FFD600] hover:text-black hover:shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all min-h-11 ${compact ? 'px-4 py-2.5 text-[11px]' : 'px-6 py-3 text-sm'}`}
    >
      <ExternalLinkIcon />
      <span>Live Demo</span>
    </a>
  );
};

const FeaturedProject: React.FC<{ project: Project }> = ({ project }) => (
  <article className="group bg-white border-[5px] border-black shadow-[10px_10px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-all overflow-hidden lg:col-span-7">
    <div className="grid min-h-full lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
      <div className="relative min-h-[260px] lg:min-h-full bg-black border-b-[5px] border-black lg:border-b-0 lg:border-r-[5px] overflow-hidden">
        <ProjectImage project={project} className="group-hover:scale-[1.03] transition-transform duration-500" />
        <div className="absolute left-4 top-4 bg-[#FFD600] text-black border-[3px] border-black px-4 py-1.5 font-black uppercase text-[11px] tracking-[0.18em] shadow-[3px_3px_0px_#000]">
          Featured
        </div>
      </div>
      <div className="flex flex-col gap-5 p-6 sm:p-8 lg:p-10">
        <div>
          <p className="font-black uppercase text-[10px] tracking-[0.32em] text-black/45 mb-3">Primary Build</p>
          <h3 className="text-4xl sm:text-5xl xl:text-6xl font-black uppercase tracking-tighter leading-none text-black">{project.title}</h3>
        </div>
        <p className="text-base sm:text-lg font-bold text-gray-700 leading-relaxed">{project.description}</p>
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 5).map(tag => (
              <span key={tag} className="px-3 py-1 text-[11px] font-black uppercase tracking-tight border-[2px] border-black shadow-[2px_2px_0px_#000]" style={{ backgroundColor: `${project.color}33`, color: '#000' }}>{tag}</span>
            ))}
          </div>
        )}
        <div className="mt-auto flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
          <ProjectAction project={project} />
          <span className="font-black uppercase text-[10px] tracking-[0.22em] text-black/40">Built for real workflows</span>
        </div>
      </div>
    </div>
  </article>
);

const ProjectListItem: React.FC<{ project: Project; index: number }> = ({ project, index }) => (
  <article className="group bg-white border-[4px] border-black shadow-[6px_6px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-all overflow-hidden">
    <div className="grid grid-cols-[116px_minmax(0,1fr)] sm:grid-cols-[156px_minmax(0,1fr)] min-h-[156px]">
      <div className="relative bg-gray-100 border-r-[4px] border-black overflow-hidden">
        <ProjectImage project={project} className="group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute left-0 top-0 border-r-[3px] border-b-[3px] border-black px-2.5 py-1 font-black text-[10px]" style={{ backgroundColor: project.color }}>
          {String(index + 2).padStart(2, '0')}
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-3 p-4 sm:p-5">
        <div>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter leading-none text-black">{project.title}</h3>
          <p className="mt-2 text-sm font-semibold text-gray-700 leading-snug line-clamp-2">{project.description}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="bg-black text-white border border-black px-2 py-0.5 text-[10px] font-black uppercase tracking-tight">{tag}</span>
          ))}
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-2">
          <ProjectAction project={project} compact />
          <span className="font-black uppercase text-[10px] tracking-widest text-black/35">{hasLiveLink(project) ? 'Public' : 'Private'}</span>
        </div>
      </div>
    </div>
  </article>
);

const ProjectMiniCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => (
  <article className="group bg-white border-[4px] border-black shadow-[6px_6px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-all overflow-hidden flex flex-col">
    <div className="relative aspect-[16/10] bg-gray-100 border-b-[4px] border-black overflow-hidden">
      <ProjectImage project={project} className="group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute left-0 top-0 border-r-[3px] border-b-[3px] border-black px-3 py-1 font-black text-[10px]" style={{ backgroundColor: project.color }}>
        {String(index + 5).padStart(2, '0')}
      </div>
    </div>
    <div className="flex flex-1 flex-col gap-3 p-5">
      <h3 className="text-2xl font-black uppercase tracking-tighter leading-none text-black">{project.title}</h3>
      <p className="text-sm font-semibold text-gray-700 leading-relaxed line-clamp-3">{project.description}</p>
      <div className="mt-auto flex flex-wrap gap-1.5">
        {project.tags.slice(0, 3).map(tag => (
          <span key={tag} className="bg-black text-white border border-black px-2 py-0.5 text-[10px] font-black uppercase tracking-tight">{tag}</span>
        ))}
      </div>
    </div>
  </article>
);

const ShelfProjects: React.FC<{ projects: Project[]; loading: boolean }> = ({ projects, loading }) => {
  const navigate = useNavigate();
  const publicProjectCount = useMemo(() => projects.filter(hasLiveLink).length, [projects]);
  const featuredProject = projects[0];
  const sideProjects = projects.slice(1, 4);
  const moreProjects = projects.slice(4, 8);
  const stackHighlights = useMemo(
    () => Array.from(new Set(projects.flatMap(p => p.tags))).slice(0, 7),
    [projects]
  );

  return (
    <section id="projects" className="relative bg-[#FFF9E6] border-y-8 border-black overflow-hidden px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)',
          backgroundSize: '72px 72px',
        }}
      />
      <div className="relative z-10 mx-auto w-full max-w-[1680px]">
        <div className="grid gap-8 xl:grid-cols-[minmax(280px,0.35fr)_minmax(0,1fr)] xl:items-end mb-10 lg:mb-12">
          <div>
            <div className="inline-flex bg-[#FFD600] text-black border-[4px] border-black px-5 py-2 font-black uppercase text-xs tracking-[0.26em] shadow-[5px_5px_0px_#000] -rotate-1 mb-5">Featured Works</div>
            <h2 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tighter leading-none text-black">Project<br />Shelf</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <p className="max-w-4xl text-xl sm:text-2xl lg:text-3xl font-black leading-tight text-black">
              Real builds, readable at a glance: what each project does, what it uses, and whether you can open it right now.
            </p>
            <button
              onClick={() => navigate('/projects')}
              className="inline-flex min-h-12 items-center justify-center gap-3 bg-black text-[#FFD600] border-[4px] border-black px-6 py-3 font-black uppercase text-sm tracking-widest shadow-[6px_6px_0px_#FFD600] hover:bg-[#FFD600] hover:text-black hover:shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              View All Projects
              <ArrowRightIcon />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 border-[4px] border-black bg-black shadow-[8px_8px_0px_#00A1FF] mb-10 lg:mb-12">
          <div className="bg-white p-4 sm:p-5 border-r-[4px] border-b-[4px] md:border-b-0 border-black">
            <p className="text-3xl sm:text-4xl font-black leading-none">{projects.length}</p>
            <p className="mt-1 font-black uppercase text-[10px] tracking-widest text-black/45">Total Projects</p>
          </div>
          <div className="bg-[#FFD600] p-4 sm:p-5 md:border-r-[4px] border-b-[4px] md:border-b-0 border-black">
            <p className="text-3xl sm:text-4xl font-black leading-none">{publicProjectCount}</p>
            <p className="mt-1 font-black uppercase text-[10px] tracking-widest text-black/55">Live Builds</p>
          </div>
          <div className="bg-white p-4 sm:p-5 border-r-[4px] border-black">
            <p className="text-3xl sm:text-4xl font-black leading-none">{Math.max(projects.length - publicProjectCount, 0)}</p>
            <p className="mt-1 font-black uppercase text-[10px] tracking-widest text-black/45">Private Work</p>
          </div>
          <div className="bg-[#FF4B4B] text-white p-4 sm:p-5">
            <p className="text-3xl sm:text-4xl font-black leading-none">{stackHighlights.length}</p>
            <p className="mt-1 font-black uppercase text-[10px] tracking-widest text-white/75">Core Stacks</p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-7 lg:grid-cols-3 xl:grid-cols-4">
            <div className="lg:col-span-2 xl:col-span-2"><ProjectCardSkeleton /></div>
            <ProjectMobileCardSkeleton />
            <ProjectMobileCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </div>
        ) : featuredProject ? (
          <>
            <div className="grid gap-7 lg:grid-cols-12 mb-7">
              <FeaturedProject project={featuredProject} />
              <div className="grid gap-5 lg:col-span-5">
                {sideProjects.map((project, index) => (
                  <ProjectListItem key={project.id} project={project} index={index} />
                ))}
              </div>
            </div>
            {moreProjects.length > 0 && (
              <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
                {moreProjects.map((project, index) => (
                  <ProjectMiniCard key={project.id} project={project} index={index} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white border-[5px] border-black shadow-[8px_8px_0px_#000] p-10 text-center">
            <h3 className="text-4xl font-black uppercase tracking-tighter">No Projects Yet</h3>
            <p className="mt-3 font-bold text-gray-600">Projects will show up here once they are added.</p>
          </div>
        )}

        {!loading && stackHighlights.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-2 border-t-[4px] border-black pt-6">
            <span className="mr-2 font-black uppercase text-[10px] tracking-[0.24em] text-black/45">Stack range</span>
            {stackHighlights.map(tag => (
              <span key={tag} className="bg-black text-white border-[2px] border-black px-3 py-1 text-[11px] font-black uppercase tracking-tight">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN — switches between the two views with a persistent toggle
// ════════════════════════════════════════════════════════════════════════════
const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<ProjectsHomeView>(() => {
    if (typeof window === 'undefined') return 'cinematic';
    const stored = localStorage.getItem(HOME_VIEW_STORAGE_KEY);
    return stored === 'shelf' ? 'shelf' : 'cinematic';
  });
  const [toggleVisible, setToggleVisible] = useState(false);

  useEffect(() => {
    let mounted = true;
    getProjects()
      .then(data => { if (mounted) setProjects(data); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem(HOME_VIEW_STORAGE_KEY, view);
  }, [view]);

  // Show toggle only when GeminiBot broadcasts that it is hidden
  useEffect(() => {
    const handler = (e: Event) => {
      setToggleVisible((e as CustomEvent<boolean>).detail);
    };
    window.addEventListener('geminibot-hidden', handler);
    return () => window.removeEventListener('geminibot-hidden', handler);
  }, []);

  return (
    <>
      {view === 'cinematic'
        ? <CinematicProjects projects={projects} loading={loading} />
        : <ShelfProjects projects={projects} loading={loading} />}
      <HomeViewToggle view={view} setView={setView} visible={toggleVisible} />
    </>
  );
};

export default Projects;
