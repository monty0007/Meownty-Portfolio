
import React, { useState, useEffect } from 'react';
import { getAchievements } from '../services/dataService';
import { Achievement } from '../types';

const TrophyIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
    <path d="M20 6h24v18c0 8-5.4 14-12 14S20 32 20 24V6z" fill="#fff" stroke="#000" strokeWidth="3.5" strokeLinejoin="round"/>
    <path d="M20 12H10a4 4 0 0 0 4 4h6M44 12h10a4 4 0 0 1-4 4h-6" stroke="#000" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M32 38v8" stroke="#000" strokeWidth="3.5" strokeLinecap="round"/>
    <rect x="22" y="46" width="20" height="6" rx="1" fill="#fff" stroke="#000" strokeWidth="3.5" strokeLinejoin="round"/>
    <path d="M27 24l2.5 2.5L37 19" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MedalIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
    <path d="M24 6l4 10h-8L24 6z" fill="#fff" stroke="#000" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M40 6l-4 10h8L40 6z" fill="#fff" stroke="#000" strokeWidth="3" strokeLinejoin="round"/>
    <circle cx="32" cy="40" r="16" fill="#fff" stroke="#000" strokeWidth="3.5"/>
    <path d="M32 32v5l3 2" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M26 16h12" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const StarBadgeIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
    <path d="M32 4l5.5 11.5L50 17.5l-9 8.5 2 12.5L32 32.5 21 38.5l2-12.5-9-8.5 12.5-2z" fill="#fff" stroke="#000" strokeWidth="3.5" strokeLinejoin="round"/>
    <path d="M24 46l2 6h12l2-6" fill="#fff" stroke="#000" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M26 52h12" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const ACHIEVEMENT_ICONS = [TrophyIcon, MedalIcon, StarBadgeIcon];

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    setAchievements(getAchievements());
  }, []);

  return (
    <section id="achievements" className="relative overflow-hidden bg-[#FFF9E6]">
      {/* Dark Admin-style Header */}
      <div className="bg-black border-b-8 border-[#FFD600] px-6 py-16 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 text-[18vw] font-black text-white/[0.03] select-none pointer-events-none uppercase leading-none italic">
          HALL
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div>
            <p className="text-[#FFD600]/70 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Earned &amp; Certified</p>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none text-white">
              Badges of <span className="text-[#FFD600]">Honor</span>
            </h2>
          </div>

        </div>
      </div>

      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.id}
                className={`relative group ach-card ${index % 2 === 0 ? 'ach-tilt-l' : 'ach-tilt-r'}`}
              >
                {/* Rank Badge */}
                <div className="absolute -top-5 -left-5 z-20 w-12 h-12 flex items-center justify-center text-3xl drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </div>

                <div className="bg-white border-[6px] border-black p-8 shadow-[10px_10px_0px_#000] group-hover:shadow-[15px_15px_0px_#000] transition-all duration-300 flex flex-col items-center text-center">
                  {/* Corner accent */}
                  <div className="absolute -top-1 -right-1 w-12 h-12 bg-[#000] clip-path-sticker group-hover:w-14 group-hover:h-14 transition-all"></div>

                  <div
                    className="w-24 h-24 rounded-full border-[5px] border-black flex items-center justify-center mb-6 shadow-[5px_5px_0px_#000] group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: achievement.color }}
                  >
                    {React.createElement(ACHIEVEMENT_ICONS[index % ACHIEVEMENT_ICONS.length])}
                  </div>

                  <h3 className="text-xl font-black uppercase mb-2 leading-tight tracking-tight">
                    {achievement.title}
                  </h3>

                  <p className="text-sm font-black text-gray-500 uppercase tracking-widest mb-5">
                    {achievement.issuer}
                  </p>

                  <div className="mt-auto px-4 py-1.5 bg-black text-white font-black text-[10px] uppercase tracking-widest border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
                    Issued {achievement.date}
                  </div>
                </div>

                {/* Hover accent outline */}
                <div
                  className="absolute -inset-4 border-4 border-dashed opacity-0 group-hover:opacity-30 transition-opacity -z-10 rounded-xl"
                  style={{ borderColor: achievement.color }}
                ></div>
              </div>
            ))}
          </div>

          {achievements.length === 0 && (
            <div className="py-32 text-center border-8 border-dashed border-black/10">
              <div className="flex justify-center mb-4 opacity-20"><TrophyIcon /></div>
              <h3 className="text-4xl font-black uppercase opacity-20 text-black">No Badges Yet</h3>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .clip-path-sticker {
          clip-path: polygon(100% 0, 0 0, 100% 100%);
        }
        .ach-card { transition: transform 0.3s ease; }
        .ach-tilt-l { transform: rotate(-1deg); }
        .ach-tilt-r { transform: rotate(1deg); }
        @media (hover: hover) and (pointer: fine) {
          .ach-card:hover { transform: rotate(0deg) translateY(-8px); }
        }
      `}</style>
    </section>
  );
};

export default Achievements;
