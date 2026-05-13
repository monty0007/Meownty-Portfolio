import React from 'react';

// ── Blog card skeleton ───────────────────────────────────────────────────────
export const BlogCardSkeleton: React.FC = () => (
  <div className="bg-white border-[6px] border-black shadow-[10px_10px_0px_#000] flex flex-col overflow-hidden animate-pulse">
    <div className="h-3 bg-gray-300 border-b-4 border-black flex-shrink-0" />
    <div className="p-7 flex flex-col flex-1 gap-3">
      <div className="flex justify-between items-center mb-1">
        <div className="h-5 w-16 bg-gray-200 border-2 border-gray-300" />
        <div className="h-4 w-24 bg-gray-100 rounded" />
      </div>
      <div className="h-7 bg-gray-200 rounded w-full" />
      <div className="h-7 bg-gray-200 rounded w-3/4" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-5/6" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
      </div>
      <div className="flex justify-between items-center pt-4 border-t-2 border-black/10">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="w-9 h-9 bg-gray-200 border-2 border-gray-300" />
      </div>
    </div>
  </div>
);

// ── ProjectsPage card skeleton ───────────────────────────────────────────────
export const ProjectCardSkeleton: React.FC = () => (
  <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] overflow-hidden animate-pulse">
    <div className="aspect-[16/10] bg-gray-200 border-b-4 border-black" />
    <div className="p-5 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-4/5" />
      <div className="h-6 bg-gray-200 rounded w-3/5" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-5/6" />
      </div>
      <div className="flex gap-2 pt-1">
        <div className="h-5 w-14 bg-gray-200 border-2 border-gray-300" />
        <div className="h-5 w-16 bg-gray-200 border-2 border-gray-300" />
        <div className="h-5 w-12 bg-gray-200 border-2 border-gray-300" />
      </div>
      <div className="h-11 bg-gray-200 border-4 border-gray-300 mt-2" />
    </div>
  </div>
);

// ── Achievement card skeleton ────────────────────────────────────────────────
export const AchievementCardSkeleton: React.FC = () => (
  <div className="flex flex-col bg-white border-[4px] border-black shadow-[6px_6px_0_#000] overflow-hidden animate-pulse">
    <div className="px-6 py-6 border-b-[3px] border-black bg-gray-200 flex items-center gap-4">
      <div className="w-12 h-12 bg-gray-300 rounded flex-shrink-0" />
      <div className="h-12 w-12 bg-gray-300 ml-auto rounded" />
    </div>
    <div className="p-6 md:p-7 flex flex-col flex-1 gap-3">
      <div className="h-6 bg-gray-200 rounded w-4/5" />
      <div className="h-5 bg-gray-200 rounded w-3/5" />
      <div className="mt-auto pt-4 space-y-2">
        <div className="h-[2px] bg-gray-200 mb-3" />
        <div className="flex justify-between">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  </div>
);

// ── Homepage projects mobile card skeleton ───────────────────────────────────
export const ProjectMobileCardSkeleton: React.FC = () => (
  <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] overflow-hidden animate-pulse">
    <div className="w-full aspect-[16/10] bg-gray-200 border-b-4 border-black" />
    <div className="p-5 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-100 rounded w-full" />
      <div className="h-4 bg-gray-100 rounded w-4/5" />
      <div className="flex gap-1.5 pt-1">
        <div className="h-5 w-14 bg-gray-200 border-2 border-gray-300" />
        <div className="h-5 w-16 bg-gray-200 border-2 border-gray-300" />
      </div>
      <div className="h-11 bg-gray-200 border-4 border-gray-300 mt-2" />
    </div>
  </div>
);

// ── Homepage projects desktop card skeleton ──────────────────────────────────
export const ProjectDesktopCardSkeleton: React.FC<{ index: number }> = ({ index }) => (
  <div className="flex-shrink-0 w-[90vw] h-[75vh] md:h-[80vh] flex items-center justify-center px-4 md:px-12">
    <div className="relative w-full h-full flex flex-col md:flex-row items-center gap-8 md:gap-0 animate-pulse">
      {/* Ghost number */}
      <div className="absolute -top-10 left-0 text-[12rem] md:text-[25rem] font-black text-black opacity-[0.03] select-none pointer-events-none leading-none z-0">
        0{index + 1}
      </div>
      {/* Image panel */}
      <div className="relative w-full md:w-[65%] h-[45%] md:h-[85%] z-20">
        <div className="absolute inset-0 bg-gray-200 border-[4px] md:border-[10px] border-black shadow-[10px_10px_0px_#000] md:shadow-[15px_15px_0px_#000]" />
      </div>
      {/* Info panel */}
      <div className="w-full md:w-[45%] bg-white border-[4px] md:border-[6px] border-black p-6 md:p-12 shadow-[10px_10px_0px_#d1d5db] z-40 md:-ml-20 transform -rotate-1 space-y-4">
        <div className="h-10 md:h-16 bg-gray-200 rounded w-full" />
        <div className="h-10 md:h-16 bg-gray-200 rounded w-3/4" />
        <div className="h-20 bg-gray-100 border-2 border-dashed border-gray-300" />
        <div className="flex gap-2">
          <div className="h-5 w-14 bg-gray-200 border-2 border-gray-300" />
          <div className="h-5 w-16 bg-gray-200 border-2 border-gray-300" />
          <div className="h-5 w-12 bg-gray-200 border-2 border-gray-300" />
        </div>
        <div className="h-14 bg-gray-200 border-4 border-gray-300" />
      </div>
    </div>
  </div>
);
