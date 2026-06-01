import React, { useEffect, useRef, useState } from 'react';
import { getProjects } from '../services/projectService';
import { getPowerPlatformItems } from '../services/powerPlatformService';
import { Project, PowerPlatformItem } from '../types';
import { PROJECTS } from '../constants';
import { ProjectCardSkeleton } from './Skeleton';
import { POWER_FLOWS, POWER_FLOWS_BY_TITLE } from '../data/powerFlows';
import { PowerFlowDiagram, type PowerFlowDiagramHandle } from './PowerFlowDiagram';
import { ServiceIcon } from './ServiceIcon';
import SeoHead from './SeoHead';
import { optimizeImage } from '../utils/cloudinary';

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

// ─── Project Detail Modal ────────────────────────────────────────────────────
const ProjectModal: React.FC<{ project: Project; index: number; onClose: () => void }> = ({ project, index, onClose }) => {
  const hasLive = project.link && project.link !== 'na' && !project.disabled;
  const hasGithub = !!project.githubLink;
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    window.dispatchEvent(new CustomEvent('projectModalChange', { detail: { open: true } }));
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
      window.dispatchEvent(new CustomEvent('projectModalChange', { detail: { open: false } }));
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[999] flex items-center justify-center p-3 md:p-6 backdrop-blur-md"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="relative bg-[#FFF9E6] border-[5px] border-black shadow-[10px_10px_0px_#000] w-full max-w-5xl max-h-[92vh] overflow-y-auto flex flex-col">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 bg-black text-white w-9 h-9 flex items-center justify-center font-black text-lg border-[3px] border-black hover:bg-[#FFD600] hover:text-black transition-colors shadow-[3px_3px_0px_#FFD600] hover:shadow-none"
        >
          ✕
        </button>

        {/* Top — Hero Image (full width, uncropped) */}
        <div className="relative w-full bg-gray-950 border-b-[5px] border-black">
          {/* Project number badge */}
          <div
            className="absolute top-0 left-0 z-10 px-4 py-1.5 font-black uppercase text-[10px] tracking-widest border-r-[4px] border-b-[4px] border-black"
            style={{ backgroundColor: project.color }}
          >
            #{String(index + 1).padStart(2, '0')}
          </div>

          {project.image ? (
            <img
              src={optimizeImage(project.image, { width: 1400 })}
              alt={`${project.title} — project by Manish Yadav (GenAI Engineer)`}
              loading="lazy"
              decoding="async"
              className="w-full h-auto max-h-[55vh] object-contain mx-auto block"
            />
          ) : (
            <div
              className="w-full h-64 flex items-center justify-center text-8xl font-black opacity-20"
              style={{ backgroundColor: project.color + '33' }}
            >
              ?
            </div>
          )}

          {project.disabled && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-[#FFD600] text-black px-3 py-1 font-black uppercase text-[10px] border-2 border-black shadow-[2px_2px_0px_#000]">
                Enterprise Only ⭐
              </span>
            </div>
          )}
        </div>

        {/* Bottom — Details */}
        <div className="p-6 md:p-10 flex flex-col gap-5">
          {/* Title row */}
          <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-6">
            <div className="flex-1 min-w-0">
              <div className="inline-block bg-black text-[#FFD600] px-3 py-0.5 font-black uppercase text-[10px] tracking-widest mb-2 border-2 border-black">
                Project Overview
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-black">
                {project.title}
              </h2>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border-[3px] border-dashed border-black/30 p-4 md:p-5 relative">
            <div
              className="absolute -top-3 -left-1 px-2 py-0.5 font-black uppercase text-[9px] tracking-widest border-2 border-black text-black"
              style={{ backgroundColor: project.color }}
            >
              About
            </div>
            <p className="font-bold text-gray-800 leading-relaxed text-sm md:text-lg mt-1">
              {project.description}
            </p>
          </div>

          {/* Tags + Actions row */}
          <div className="flex flex-col md:flex-row md:items-end gap-5">
            {/* Tags */}
            {project.tags.length > 0 && (
              <div className="flex-1 min-w-0">
                <p className="font-black uppercase text-[10px] tracking-widest text-gray-500 mb-2">Tech Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs font-black uppercase tracking-tight border-[2px] border-black shadow-[2px_2px_0px_#000]"
                      style={{ backgroundColor: project.color + '33', color: '#000' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 flex-shrink-0">
              {hasLive ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-black text-white border-[3px] border-black px-6 py-3 font-black uppercase text-sm tracking-wide shadow-[5px_5px_0px_#FFD600] hover:bg-[#FFD600] hover:text-black hover:shadow-[2px_2px_0px_#000] transition-all active:translate-y-0.5"
                >
                  <ExternalLinkIcon />
                  Live Demo →
                </a>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1 bg-gray-200 text-gray-500 border-[3px] border-black px-6 py-3 font-black uppercase text-sm tracking-wide cursor-not-allowed">
                  <span className="flex items-center gap-2"><ExternalLinkIcon /> {project.disabled ? 'Private' : 'No Link'}</span>
                </div>
              )}
              {hasGithub && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white text-black border-[3px] border-black px-5 py-3 font-black uppercase text-sm tracking-wide shadow-[5px_5px_0px_#000] hover:bg-black hover:text-white hover:shadow-[2px_2px_0px_#000] transition-all active:translate-y-0.5"
                >
                  <GithubIcon />
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectCard: React.FC<{ project: Project; index: number; onClick: () => void }> = ({ project, index, onClick }) => {
  const hasLive = project.link && project.link !== 'na' && !project.disabled;
  const hasGithub = !!project.githubLink;

  return (
    <div
      onClick={onClick}
      className="group bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
    >      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden border-b-[4px] border-black bg-gray-100">
        <div
          className="absolute top-0 left-0 z-10 px-3 py-1 font-black uppercase text-[10px] tracking-widest border-r-[3px] border-b-[3px] border-black"
          style={{ backgroundColor: project.color }}
        >
          #{String(index + 1).padStart(2, '0')}
        </div>

        {project.image ? (
          <img
            src={optimizeImage(project.image, { width: 700 })}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-6xl font-black opacity-20"
            style={{ backgroundColor: project.color + '22' }}
          >
            ?
          </div>
        )}

        {project.disabled && (
          <div className="absolute bottom-2 right-2">
            <span className="bg-[#FFD600] text-black px-2 py-1 font-black uppercase text-[10px] border-2 border-black shadow-[2px_2px_0px_#000]">
              Enterprise Only ⭐
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        <h3 className="text-2xl font-black uppercase tracking-tighter leading-none text-black">
          {project.title}
        </h3>

        <p className="text-sm font-semibold text-gray-700 leading-relaxed flex-1 line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="bg-black text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-tight border border-black"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto pt-2" onClick={(e) => e.stopPropagation()}>
          {hasLive ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-black text-white border-[3px] border-black py-2.5 font-black uppercase text-xs tracking-wide shadow-[4px_4px_0px_#FFD600] hover:bg-[#FFD600] hover:text-black hover:shadow-[2px_2px_0px_#000] transition-all active:translate-y-0.5"
            >
              <ExternalLinkIcon />
              Live Demo
            </a>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-500 border-[3px] border-black py-2.5 font-black uppercase text-xs tracking-wide cursor-not-allowed">
              <ExternalLinkIcon />
              {project.disabled ? 'Private' : 'No Link'}
            </div>
          )}

          {hasGithub && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white text-black border-[3px] border-black px-4 py-2.5 font-black uppercase text-xs tracking-wide shadow-[4px_4px_0px_#000] hover:bg-black hover:text-white hover:shadow-[2px_2px_0px_#000] transition-all active:translate-y-0.5"
              title="View on GitHub"
            >
              <GithubIcon />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          )}
        </div>

        {/* Click hint */}
        <div className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Click to expand ↗
        </div>
      </div>
    </div>
  );
};

// ─── Power Platform Section ──────────────────────────────────────────────────
const PowerPlatformCard: React.FC<{ item: PowerPlatformItem; onClick: () => void }> = ({ item, onClick }) => {
  const firstImage = item.images?.[0];
  const imageCount = item.images?.length ?? 0;
  const flow = item.flow ?? POWER_FLOWS[item.id] ?? POWER_FLOWS_BY_TITLE[item.title];
  // Unique services in this flow (preview chips on card)
  const flowServices = flow ? Array.from(new Set(flow.steps.map(s => s.service))).slice(0, 6) : [];
  return (
    <div
      onClick={onClick}
      className="group bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Image (Power Apps screenshots) */}
      {firstImage ? (
        <div className="relative w-full aspect-video overflow-hidden border-b-[4px] border-black bg-gray-100">
          <img
            src={optimizeImage(firstImage, { width: 700 })}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div
            className="absolute top-0 left-0 z-10 px-3 py-1 font-black uppercase text-[10px] tracking-widest border-r-[3px] border-b-[3px] border-black"
            style={{ backgroundColor: item.color }}
          >
            <span className="text-white">{item.category}</span>
          </div>
          {imageCount > 1 && (
            <div className="absolute bottom-2 right-2 bg-black text-white text-[10px] font-black px-2 py-0.5 border-[2px] border-white">
              +{imageCount - 1} more
            </div>
          )}
        </div>
      ) : flow ? (
        // Flow preview: stacked service logos + step count
        <div
          className="relative w-full aspect-video overflow-hidden border-b-[4px] border-black flex items-center justify-center"
          style={{ backgroundColor: '#F3F2F1', backgroundImage: 'repeating-linear-gradient(0deg,transparent_0,transparent_19px,#e1dfdd_20px),repeating-linear-gradient(90deg,transparent_0,transparent_19px,#e1dfdd_20px)' }}
        >
          <div
            className="absolute top-0 left-0 z-10 px-3 py-1 font-black uppercase text-[10px] tracking-widest border-r-[3px] border-b-[3px] border-black"
            style={{ backgroundColor: item.color }}
          >
            <span className="text-white">{item.category}</span>
          </div>
          <div className="flex flex-col items-center gap-2 px-4">
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {flowServices.map((svc, i) => (
                <React.Fragment key={svc}>
                  <div className="w-9 h-9 bg-white border-[2px] border-black rounded shadow-[2px_2px_0_#000] flex items-center justify-center">
                    <ServiceIcon service={svc} size={26} />
                  </div>
                  {i < flowServices.length - 1 && (
                    <span className="text-black font-black text-xs">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="bg-black text-[#FFD600] px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border-[2px] border-black">
              {flow.steps.length} steps · click to explore
            </div>
          </div>
        </div>
      ) : (
        <div
          className="px-4 py-3 border-b-[4px] border-black flex items-center gap-3"
          style={{ backgroundColor: item.color + '18' }}
        >
          <span
            className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border-[2px] border-black shadow-[2px_2px_0px_#000]"
            style={{ backgroundColor: item.color, color: '#FFF' }}
          >
            {item.category}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        <h3 className="text-xl font-black uppercase tracking-tight leading-tight text-black">
          {item.title}
        </h3>
        <p className="text-sm font-semibold text-gray-700 leading-relaxed flex-1 line-clamp-3">
          {item.description}
        </p>

        {/* Category pill (when image is shown) */}
        {firstImage && (
          <span
            className="self-start px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border-[2px] border-black shadow-[2px_2px_0px_#000]"
            style={{ backgroundColor: item.color, color: '#FFF' }}
          >
            {item.category}
          </span>
        )}

        {/* Click hint */}
        <div className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 pt-1 opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
          Click to view details ↗
        </div>
      </div>
    </div>
  );
};

// ─── Power Platform Detail Modal ─────────────────────────────────────────────
const PowerPlatformModal: React.FC<{ item: PowerPlatformItem; onClose: () => void }> = ({ item, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const images = item.images ?? [];
  const flow = item.flow ?? POWER_FLOWS[item.id] ?? POWER_FLOWS_BY_TITLE[item.title];
  const [activeImg, setActiveImg] = useState(0);
  const flowRef = useRef<PowerFlowDiagramHandle>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (images.length > 1) {
        if (e.key === 'ArrowRight') setActiveImg(i => Math.min(i + 1, images.length - 1));
        if (e.key === 'ArrowLeft') setActiveImg(i => Math.max(i - 1, 0));
      }
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    window.dispatchEvent(new CustomEvent('projectModalChange', { detail: { open: true } }));
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
      window.dispatchEvent(new CustomEvent('projectModalChange', { detail: { open: false } }));
    };
  }, [onClose, images.length]);

  // Layout: two-column when we have a flow OR images; otherwise single column
  const hasVisual = !!flow || images.length > 0;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[999] flex items-center justify-center p-3 md:p-6 backdrop-blur-md"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="relative bg-[#FFF9E6] border-[5px] border-black shadow-[10px_10px_0px_#000] w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 bg-black text-white w-10 h-10 flex items-center justify-center font-black text-xl border-[3px] border-black hover:bg-[#FFD600] hover:text-black transition-colors"
        >
          ✕
        </button>

        <div className={`flex-1 overflow-y-auto pp-hide-scrollbar ${hasVisual ? 'grid grid-cols-1 lg:grid-cols-3 gap-0' : ''}`}>

          {/* ── LEFT: Flow diagram or Image gallery ── */}
          {flow ? (
            <div className="lg:col-span-2 bg-[#F3F2F1] border-b-[5px] lg:border-b-0 lg:border-r-[5px] border-black px-5 pb-5 md:px-7 md:pb-7 pt-16 md:pt-16 lg:pt-7 flex flex-col items-center lg:max-h-[88vh] lg:overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-3 w-full flex-wrap lg:flex-nowrap">
                <div
                  className="px-3 py-1 lg:px-4 lg:py-1.5 font-black uppercase text-xs sm:text-sm tracking-widest border-[3px] border-black text-white shadow-[3px_3px_0_#000]"
                  style={{ backgroundColor: item.color }}
                >
                  {item.category} · Flow
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                    {flow.steps.length} steps
                  </div>
                  <button
                    type="button"
                    onClick={() => flowRef.current?.reset()}
                    className="bg-white text-black px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border-[2px] border-black shadow-[2px_2px_0px_#000] hover:bg-[#FFD600] transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="flex-1 w-full min-h-0 flex items-center justify-center">
                <PowerFlowDiagram ref={flowRef} flow={flow} cardWidth={320} autoFit minScale={0.45} hideResetButton />
              </div>
            </div>
          ) : images.length > 0 ? (
            <div className="lg:col-span-2 relative bg-gray-950 border-b-[5px] lg:border-b-0 lg:border-r-[5px] border-black select-none flex items-center">
              <div
                className="absolute top-0 left-0 z-10 px-4 py-1.5 font-black uppercase text-[10px] tracking-widest border-r-[4px] border-b-[4px] border-black text-white"
                style={{ backgroundColor: item.color }}
              >
                {item.category}
              </div>
              <img
                key={activeImg}
                src={optimizeImage(images[activeImg], { width: 1400 })}
                alt={`${item.title} — screenshot ${activeImg + 1}`}
                className="w-full h-auto max-h-[70vh] object-contain mx-auto block"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg(i => Math.max(i - 1, 0))}
                    disabled={activeImg === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-black text-white flex items-center justify-center font-black border-[3px] border-white disabled:opacity-30 hover:bg-[#FFD600] hover:text-black transition-colors"
                  >‹</button>
                  <button
                    onClick={() => setActiveImg(i => Math.min(i + 1, images.length - 1))}
                    disabled={activeImg === images.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-black text-white flex items-center justify-center font-black border-[3px] border-white disabled:opacity-30 hover:bg-[#FFD600] hover:text-black transition-colors"
                  >›</button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`w-2 h-2 rounded-full border border-white transition-all ${i === activeImg ? 'bg-white scale-125' : 'bg-white/40'}`}
                      />
                    ))}
                  </div>
                  <div className="absolute bottom-2 right-10 text-[10px] font-black text-white/70">
                    {activeImg + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          ) : null}

          {/* ── RIGHT: Text content ── */}
          <div className={`${hasVisual ? 'lg:col-span-1' : ''} p-6 md:p-8 flex flex-col gap-5`}>
            <div>
              <div className="inline-block bg-black text-[#FFD600] px-3 py-0.5 font-black uppercase text-[10px] tracking-widest mb-2 border-2 border-black">
                Solution Overview
              </div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none text-black break-words">
                {item.title}
              </h2>
            </div>

            <div
              className="self-start px-3 py-1 text-[10px] font-black uppercase tracking-wider border-[2px] border-black shadow-[3px_3px_0px_#000]"
              style={{ backgroundColor: item.color, color: '#FFF' }}
            >
              {item.category}
            </div>

            <div className="bg-white border-[3px] border-dashed border-black/30 p-4 md:p-5 relative">
              <div
                className="absolute -top-3 -left-1 px-2 py-0.5 font-black uppercase text-[9px] tracking-widest border-2 border-black text-white"
                style={{ backgroundColor: item.color }}
              >
                About
              </div>
              <p className="font-semibold text-gray-800 leading-relaxed text-sm md:text-base mt-1">
                {item.description}
              </p>
            </div>

            {flow && (
              <div className="bg-white border-[3px] border-black p-4">
                <div className="font-black uppercase text-[10px] tracking-widest text-black mb-2">
                  Services used
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(flow.steps.map(s => s.sub))).map(svc => (
                    <span
                      key={svc}
                      className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border-[2px] border-black bg-[#F3F2F1]"
                    >
                      {svc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 flex-wrap mt-auto">
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-black text-white border-[3px] border-black px-5 py-2.5 font-black uppercase text-sm tracking-wide shadow-[5px_5px_0px_#FFD600] hover:bg-[#FFD600] hover:text-black hover:shadow-[2px_2px_0px_#000] transition-all active:translate-y-0.5"
                >
                  <ExternalLinkIcon />
                  View Live →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PowerPlatformSection: React.FC<{ isDark: boolean; items: PowerPlatformItem[] }> = ({ isDark, items }) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<PowerPlatformItem | null>(null);
  const categories = ['All', 'Power Automate', 'Power Apps', 'Copilot Studio'];

  const filtered = activeFilter === 'All'
    ? items
    : items.filter(item => item.category === activeFilter);

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 font-black uppercase text-xs tracking-wide border-[3px] border-black transition-all ${
              activeFilter === cat
                ? 'bg-black text-[#FFD600] shadow-none translate-x-[2px] translate-y-[2px]'
                : 'bg-white text-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(item => (
          <PowerPlatformCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="text-6xl">⚡</div>
          <p className="font-bold text-gray-500">No items in this category yet.</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <PowerPlatformModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

// ─── Main Projects Page ──────────────────────────────────────────────────────
const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [ppItems, setPpItems] = useState<PowerPlatformItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<{ project: Project; index: number } | null>(null);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('portfolio_hero_dark') !== 'false');
  const [activeTab, setActiveTab] = useState<'projects' | 'power-platform'>('projects');

  useEffect(() => {
    const handler = () => setIsDark(localStorage.getItem('portfolio_hero_dark') !== 'false');
    window.addEventListener('portfolioThemeChange', handler);
    return () => window.removeEventListener('portfolioThemeChange', handler);
  }, []);

  useEffect(() => {
    Promise.all([getProjects(), getPowerPlatformItems()]).then(([projData, ppData]) => {
      setProjects(projData);
      setPpItems(ppData);
      setLoading(false);
    });
  }, []);

  return (
    <section className="min-h-screen bg-[#FFF9E6] pb-24">
      <SeoHead
        title="Projects | Manish Yadav — GenAI Engineer Portfolio"
        description="Browse Manish Yadav's projects: AI agents, LLM systems, Power Platform automations, and full-stack web apps built by Manish Yadav (Monty), GenAI Engineer."
        canonical="https://portfolio.maoverse.xyz/projects"
        type="website"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': 'https://portfolio.maoverse.xyz/projects#collection',
          name: 'Manish Yadav Projects',
          description: "Projects by Manish Yadav: AI agents, LLM systems, Power Platform automations, and full-stack web apps.",
          url: 'https://portfolio.maoverse.xyz/projects',
          inLanguage: 'en-US',
          isPartOf: { '@id': 'https://portfolio.maoverse.xyz/#website' },
          about: { '@id': 'https://portfolio.maoverse.xyz/#person' },
          mainEntity: {
            '@type': 'ItemList',
            name: 'Manish Yadav Projects',
            numberOfItems: projects.length,
            itemListElement: projects.slice(0, 30).map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'CreativeWork',
                name: p.title,
                description: (p as any).description || undefined,
                url: (p as any).link && (p as any).link !== 'na' ? (p as any).link : 'https://portfolio.maoverse.xyz/projects',
                image: (p as any).image || undefined,
                keywords: ((p as any).tags || []).join(', ') || undefined,
                author: { '@id': 'https://portfolio.maoverse.xyz/#person' },
              },
            })),
          },
        }}
      />
      {/* Grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025] z-0"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Admin-style dark header */}
      <div className={`${isDark ? 'bg-black border-b-4 border-[#FFD600]' : 'bg-[#FFF9E6] border-b-4 border-black'} pt-36 pb-12 px-6 relative overflow-hidden`}>
        <div className={`absolute -right-10 -top-8 text-[20vw] font-black ${isDark ? 'text-white/[0.03]' : 'text-black/[0.03]'} select-none pointer-events-none uppercase leading-none italic`}>WORKS</div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div>
            <p className={`${isDark ? 'text-[#FFD600]/70' : 'text-black/50'} font-black text-[10px] uppercase tracking-[0.3em] mb-2`}>Portfolio</p>
            <h1 className={`text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none ${isDark ? 'text-white' : 'text-black'}`}>
              My{' '}
              <span
                className="relative inline-block"
                style={{
                  WebkitTextStroke: '3px #FFD600',
                  color: 'transparent',
                  textShadow: '8px 8px 0px #FF4B4B',
                }}
              >
                Works
              </span>
            </h1>
            {!loading && (
              <div className="flex items-center gap-3 mt-3">
                <div className="h-[4px] w-16 bg-[#FFD600] border border-black" />
                <p className={`font-bold ${isDark ? 'text-white/50' : 'text-black/50'} text-sm`}>
                  {activeTab === 'projects' ? `${projects.length} project${projects.length !== 1 ? 's' : ''} built` : `${ppItems.length} solution${ppItems.length !== 1 ? 's' : ''} built`}
                </p>
              </div>
            )}
          </div>

          {/* Tab Switcher */}
          <div className="flex w-full md:w-auto bg-white/10 backdrop-blur-sm border-[3px] border-black shadow-[4px_4px_0px_#000] overflow-hidden">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2.5 px-4 sm:px-6 py-3.5 font-black uppercase text-xs tracking-wide transition-all ${
                activeTab === 'projects'
                  ? 'bg-[#FFD600] text-black'
                  : isDark
                    ? 'bg-transparent text-white/70 hover:bg-white/10 hover:text-white'
                    : 'bg-transparent text-black/60 hover:bg-black/5 hover:text-black'
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              Projects
            </button>
            <div className={`w-[3px] ${isDark ? 'bg-white/20' : 'bg-black'} flex-shrink-0`} />
            <button
              onClick={() => setActiveTab('power-platform')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2.5 px-4 sm:px-6 py-3.5 font-black uppercase text-xs tracking-wide transition-all ${
                activeTab === 'power-platform'
                  ? 'bg-[#FFD600] text-black'
                  : isDark
                    ? 'bg-transparent text-white/70 hover:bg-white/10 hover:text-white'
                    : 'bg-transparent text-black/60 hover:bg-black/5 hover:text-black'
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              Power Platform
            </button>
          </div>

        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12">

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Projects Tab */}
        {!loading && activeTab === 'projects' && (
          <>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    onClick={() => setSelectedProject({ project, index })}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 gap-6">
                <div className="text-8xl">🚧</div>
                <div className="text-center">
                  <h2 className="text-4xl font-black uppercase tracking-tighter">No Projects Yet</h2>
                  <p className="font-bold text-gray-500 mt-2">Check back soon — things are being built!</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Power Platform Tab */}
        {!loading && activeTab === 'power-platform' && (
          <PowerPlatformSection isDark={isDark} items={ppItems} />
        )}
      </div>

      {/* Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject.project}
          index={selectedProject.index}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};

export default ProjectsPage;
