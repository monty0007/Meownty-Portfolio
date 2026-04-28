import React, { useState, useEffect, lazy, Suspense } from 'react';
import { getTopScores, saveScore as saveScoreToDb } from '../services/scoreService';

// Each game is heavy and only one can be active at a time, so load them on demand.
const NinjaGame = lazy(() => import('./NinjaGame'));
const RacingGame = lazy(() => import('./RacingGame'));
const FlappyGame = lazy(() => import('./FlappyGame'));

const GameLoader: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-black text-[#FFD600] font-black uppercase tracking-widest text-sm">
    <div className="flex items-center gap-3">
      <span className="w-4 h-4 border-2 border-[#FFD600] border-t-transparent rounded-full animate-spin" />
      Booting cabinet...
    </div>
  </div>
);

interface LeaderboardEntry {
  name: string;
  score: number;
}

const Arcade: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'ninja' | 'racing' | 'flappy'>('ninja');
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      const scores = await getTopScores();
      setLeaderboard(scores);
    };
    fetchScores();
  }, []);

  const saveScore = async (score: number) => {
    if (!playerName.trim()) return;

    setLeaderboard(prev => {
      const existingIndex = prev.findIndex(e => e.name === playerName);
      let updated = [...prev];

      if (existingIndex !== -1) {
        if (score > updated[existingIndex].score) {
          updated[existingIndex] = { name: playerName, score };
        }
      } else {
        updated.push({ name: playerName, score });
      }

      return updated.sort((a, b) => b.score - a.score).slice(0, 5);
    });

    await saveScoreToDb(playerName, score);
  };

  return (
    <section id="arcade" className="py-24 px-4 bg-[#FFD600] border-y-8 border-black flex flex-col items-center overflow-hidden relative">
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none"></div>

      <div className="max-w-6xl w-full flex flex-col items-center justify-center relative z-10">
        <header className="text-center mb-8">
          <div className="inline-block bg-black text-white px-4 sm:px-6 py-2 font-black uppercase text-sm sm:text-xl mb-4 rotate-[-1deg] shadow-[6px_6px_0px_#00A1FF]">
            NEURAL ARCADE V5.4
          </div>
          <h2 className="text-4xl sm:text-7xl md:text-[8rem] font-black uppercase tracking-tighter leading-none">
            ACTION <span className="text-white" style={{ WebkitTextStroke: '2px black', textShadow: '4px 4px 0px #FF4B4B' }}>BASTION</span>
          </h2>
        </header>

        {/* Game Selector */}
        <div className="flex border-4 border-black overflow-hidden shadow-[6px_6px_0px_#000] mb-6">
          <button
            onClick={() => setActiveGame('ninja')}
            className={`flex-1 px-4 sm:px-6 py-3 font-black uppercase text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${activeGame === 'ninja'
              ? 'bg-[#00A1FF] text-white'
              : 'bg-black/20 hover:bg-black/30 text-black'
              }`}
          >
            🥷 <span className="hidden sm:inline">Ninja</span>
          </button>
          <div className="w-[3px] bg-black flex-shrink-0" />
          <button
            onClick={() => setActiveGame('racing')}
            className={`flex-1 px-4 sm:px-6 py-3 font-black uppercase text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${activeGame === 'racing'
              ? 'bg-[#FF4B4B] text-white'
              : 'bg-black/20 hover:bg-black/30 text-black'
              }`}
          >
            🏎️ <span className="hidden sm:inline">Racing</span>
          </button>
          <div className="w-[3px] bg-black flex-shrink-0" />
          <button
            onClick={() => setActiveGame('flappy')}
            className={`flex-1 px-4 sm:px-6 py-3 font-black uppercase text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${activeGame === 'flappy'
              ? 'bg-[#73BF2E] text-white'
              : 'bg-black/20 hover:bg-black/30 text-black'
              }`}
          >
            🐦 <span className="hidden sm:inline">Flappy</span>
          </button>
        </div>

        {/* Game Cabinet */}
        <div className="w-full max-w-[900px] aspect-[16/10] bg-[#111] border-[6px] sm:border-[12px] border-black rounded-2xl sm:rounded-[3rem] shadow-[10px_10px_0px_#000] sm:shadow-[30px_30px_0px_#000] relative overflow-hidden flex flex-col p-2 sm:p-3 mb-12">
          <div className="flex-1 rounded-xl sm:rounded-[2rem] overflow-hidden relative border-2 sm:border-4 border-black/40">
            <Suspense fallback={<GameLoader />}>
              {activeGame === 'ninja' && (
                <NinjaGame
                  key="ninja"
                  playerName={playerName}
                  onGameOver={saveScore}
                  onScoreChange={() => { }}
                  onNameChange={(name) => setPlayerName(name)}
                />
              )}
              {activeGame === 'racing' && (
                <RacingGame
                  key="racing"
                  playerName={playerName}
                  onGameOver={saveScore}
                  onNameChange={(name) => setPlayerName(name)}
                />
              )}
              {activeGame === 'flappy' && (
                <FlappyGame
                  key="flappy"
                  playerName={playerName}
                  onGameOver={saveScore}
                  onNameChange={(name) => setPlayerName(name)}
                />
              )}
            </Suspense>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="w-full max-w-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-black text-[#FFD600] px-6 py-2.5 font-black uppercase text-sm inline-block rotate-1 shadow-[6px_6px_0px_rgba(0,0,0,0.2)] border-2 border-black">
              🏆 TOP 5 PLAYERS
            </div>
            <div className="h-1 flex-1 bg-black/20 rounded-full"></div>
          </div>
          <div className="bg-white border-[6px] border-black p-6 shadow-[12px_12px_0px_#000] -rotate-1">
            {leaderboard.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-3 opacity-30">🎮</div>
                <div className="text-gray-400 font-black uppercase text-sm">No scores yet — be the first!</div>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry, i) => {
                  const medals = ['🥇', '🥈', '🥉'];
                  const isCurrentPlayer = entry.name === playerName;
                  const bgColor = i === 0 ? 'bg-[#FFD600]/20 border-l-4 border-[#FFD600]' : i === 1 ? 'bg-gray-100 border-l-4 border-gray-400' : i === 2 ? 'bg-orange-50 border-l-4 border-orange-400' : '';
                  return (
                    <div key={i} className={`flex items-center justify-between py-2 px-3 ${bgColor} ${isCurrentPlayer ? 'ring-2 ring-[#00A1FF] ring-offset-1' : ''} transition-all`}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl sm:text-3xl w-9 text-center">{medals[i] || <span className="text-xl font-black text-gray-400">#{i + 1}</span>}</span>
                        <div>
                          <span className="text-base sm:text-lg font-black uppercase">{entry.name}</span>
                          {isCurrentPlayer && (
                            <span className="ml-2 bg-[#00A1FF] text-white text-[9px] font-black px-1.5 py-0.5 uppercase border border-[#00A1FF]">You</span>
                          )}
                        </div>
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-[#00A1FF]">{entry.score.toLocaleString()}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Arcade;
