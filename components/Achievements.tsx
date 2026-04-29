
import React, { useState, useEffect } from 'react';
import { getAchievements } from '../services/achievementService';
import { Achievement } from '../types';

// Bold trophy icon from Iconify CDN — matches neubrutalist black/white theme
const TROPHY_URL = 'https://api.iconify.design/solar/cup-star-bold.svg?color=%23000000';

// Curated bold palette — all visually distinct, neubrutalism-friendly.
// Cycled by index so every card gets a unique color automatically.
// If the user sets a custom color in admin it takes priority.
const PALETTE = [
  '#FF4B4B', // red
  '#FFD600', // yellow
  '#00C9A7', // teal
  '#6B4BFF', // purple
  '#FF8A00', // orange
  '#00A1FF', // blue
  '#FF5DAA', // pink
  '#3DDC84', // green
  '#B388FF', // lavender
  '#00E5FF', // cyan
];

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getAchievements();
      if (!cancelled) setAchievements(data);
    })();
    return () => { cancelled = true; };
  }, []);

  if (!achievements.length) return null;

  return (
    <section id="achievements" className="bg-[#FFF9E6]">
      {/* Header */}
      <div className="bg-black border-b-[6px] border-[#FFD600] px-6 py-14 md:py-18">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#FFD600]/50 font-black text-[10px] uppercase tracking-[0.4em] mb-3">
            Recognition
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white">
            Badges of{' '}
            <span className="text-[#FFD600]">Honor</span>
          </h2>
        </div>
      </div>

      {/* Cards */}
      <div className="px-6 py-14 md:py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {achievements.map((a, i) => {
            const color = PALETTE[i % PALETTE.length];
            return (
            <article
              key={a.id}
              className="group flex flex-col bg-white border-[4px] border-black
                shadow-[6px_6px_0_#000] hover:shadow-[10px_10px_0_#000]
                hover:-translate-y-1.5 transition-all duration-200 ease-out overflow-hidden"
            >
              {/* Color band with trophy icon + index */}
              <div
                className="relative px-6 py-6 border-b-[3px] border-black flex items-center gap-4"
                style={{ backgroundColor: color }}
              >
                <img
                  src={TROPHY_URL}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="w-12 h-12 opacity-30 flex-shrink-0"
                />
                <span className="text-[56px] leading-none font-black text-black/10 select-none ml-auto">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 md:p-7 flex flex-col flex-1 gap-4">
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-tight text-black">
                  {a.title.trim()}
                </h3>

                {/* Issuer + date footer */}
                <div className="mt-auto pt-3">
                  <div className="h-[2px] bg-black/8 mb-4" />
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    {a.issuer && (
                      <span className="text-[11px] font-black uppercase tracking-widest text-neutral-400">
                        {a.issuer}
                      </span>
                    )}
                    {a.date && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300 ml-auto">
                        {a.date}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Achievements;

