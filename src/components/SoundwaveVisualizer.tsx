import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Radio, RefreshCw } from 'lucide-react';

export default function SoundwaveVisualizer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [mood, setMood] = useState<'podcast' | 'beat' | 'ambient'>('podcast');
  const [barHeights, setBarHeights] = useState<number[]>(new Array(36).fill(15));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Animate the bar heights based on modern sound dynamics
  useEffect(() => {
    if (!isPlaying) {
      // Return slowly to resting state
      const interval = setInterval(() => {
        setBarHeights(prev => prev.map(val => Math.max(val - 3, 6)));
      }, 50);
      return () => clearInterval(interval);
    }

    const updateBars = () => {
      setBarHeights(prev => {
        return prev.map((_, index) => {
          // Create symmetrical wave or high frequency noise depending on mood
          const centerFactor = 1 - Math.abs(index - 18) / 18; // 0 near edges, 1 in center
          
          let random = Math.sin(Date.now() * 0.005 + index * 0.3) * 20 + 30;
          if (mood === 'beat') {
            const beatOccurs = Math.sin(Date.now() * 0.01) > 0.6;
            random = beatOccurs 
              ? Math.random() * 50 + 25 
              : Math.random() * 15 + 5;
          } else if (mood === 'ambient') {
            random = Math.sin(Date.now() * 0.002 + index * 0.1) * 12 + 15;
          } else {
            // Podcast settings (human speech rhythm - quick bursts/quiet moments)
            const sentencePause = Math.sin(Date.now() * 0.001) > 0.85;
            random = sentencePause 
              ? Math.random() * 8 + 5
              : Math.random() * 32 + 10;
          }

          // Bound bar heights between 5px and 62px
          return Math.max(5, Math.min(62, random * (0.4 + centerFactor * 0.6)));
        });
      });
    };

    intervalRef.current = setInterval(updateBars, 85);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, mood]);

  const cycleMood = () => {
    if (mood === 'podcast') setMood('beat');
    else if (mood === 'beat') setMood('ambient');
    else setMood('podcast');
  };

  const currentLabel = {
    podcast: 'Podcast Intervista (Speech Dynamic)',
    beat: 'Social Drum Beat (High Impact)',
    ambient: 'Studio Room Noise (Low Ambient)',
  }[mood];

  return (
    <div 
      className="p-5 md:p-6 bg-dark-card border border-dark-border rounded-2xl flex flex-col gap-4 border-glow-orange transition-all duration-300 relative overflow-hidden" 
      id="soundwave-container"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-violet/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between" id="visualizer-header">
        <div className="flex items-center gap-2" id="visualizer-status">
          <span className="relative flex h-2.5 w-2.5" id="visualizer-pulse-dot">
            {isPlaying && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isPlaying ? 'bg-brand-orange' : 'bg-gray-600'}`} />
          </span>
          <span className="text-xs font-mono font-medium text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
            LIVE FEED: {currentLabel}
          </span>
        </div>
        
        <button 
          onClick={cycleMood}
          className="text-xs font-medium text-brand-violet-light hover:text-white transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-violet-dark/25 border border-brand-violet-dark/40 hover:border-brand-violet/40 cursor-pointer"
          title="Cambia frequenza"
          id="btn-cycle-frequency"
        >
          <RefreshCw className="w-3 h-3 text-brand-violet-light" />
          <span className="hidden sm:inline">Modula Ritmo</span>
        </button>
      </div>

      {/* Visual Bounding Bars Area */}
      <div 
        className="h-20 flex items-end justify-center gap-1 bg-dark-bg/60 border border-dark-border/50 rounded-xl px-4 md:px-8 transition-colors duration-300 relative"
        id="visualizer-screen"
      >
        <div className="absolute inset-x-0 bottom-0 top-0 bg-linear-to-t from-dark-bg/20 via-transparent to-transparent pointer-events-none" />
        
        {barHeights.map((height, i) => {
          // Color mapping representing the dual logo brand identity
          // Starts with intense deep orange, central parts glow vivid orange, fading into purple/violet extremes
          const isCentral = i >= 10 && i <= 26;
          const bgClassName = isCentral 
            ? 'bg-linear-to-t from-brand-orange-dark via-brand-orange to-brand-orange-light' 
            : 'bg-linear-to-t from-brand-violet-dark via-brand-violet to-brand-violet-light';

          return (
            <div
              key={i}
              className={`w-1 sm:w-1.5 rounded-t-full transition-all duration-75 ${bgClassName}`}
              style={{ 
                height: `${height}%`,
                opacity: isPlaying ? 0.9 : 0.4
              }}
              id={`soundwave-bar-${i}`}
            />
          );
        })}
      </div>

      {/* Audio Controls Mock */}
      <div className="flex items-center justify-between" id="visualizer-controls">
        <div className="text-[10px] md:text-xs font-mono text-gray-500 uppercase tracking-wider" id="mic-studio-channel-info">
          CH-01: MICDROP_MAIN_STATION | GAIN: +12.4dB
        </div>
        
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer tracking-wider transition-all duration-300 ${
            isPlaying 
              ? 'bg-brand-orange hover:bg-brand-orange-light text-white shadow-lg shadow-brand-orange/20' 
              : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
          }`}
          id="btn-play-pause-visualizer"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>PAUSA</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>PRODUCI RITMO</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
