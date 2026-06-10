import { ArrowDown, Play, Headphones, Share2, Sparkles } from 'lucide-react';
// @ts-ignore
import heroStudio from '../assets/images/podcast_studio_1780658975307.png';

export default function Hero() {
  return (
    <section 
      className="relative min-h-[100dvh] pt-24 pb-12 flex items-center justify-center overflow-hidden bg-dark-bg" 
      id="hero-section"
    >
      {/* Absolute futuristic ambient circles for backdrop glow */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-brand-orange/10 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-brand-violet/10 blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[150px] rounded-full bg-brand-orange/5 blur-3xl -translate-x-1/2 -translate-y-1/2 rotate-12 pointer-events-none" />

      {/* Grid overlay for spatial deep background effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#130f22_1px,transparent_1px),linear-gradient(to_bottom,#130f22_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full" id="hero-grid-wrapper">
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto gap-6" id="hero-layout">
          
          {/* Engaging Brand Pitch */}
          <div className="flex flex-col items-center gap-6 text-center" id="hero-text-block">

            {/* Glowing Main Heading */}
            <h1 className="text-3xl sm:text-[2.75rem] md:text-5xl lg:text-6xl font-black font-display tracking-tight leading-tight sm:leading-none text-white" id="hero-main-title">
              Fai sentire la tua voce.<br />
              <span className="text-gradient-orange">Alza il volume</span> delle tue idee.
            </h1>

            {/* Interactive buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto mt-6 mb-2" id="hero-btn-actions">
              <a
                href="#servizi"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-orange hover:bg-brand-orange-light text-white font-bold tracking-wider rounded-xl transition-all duration-300 shadow-xl shadow-brand-orange/20 text-center cursor-pointer"
                id="hero-cta-discover"
              >
                <span>SCOPRI I SERVIZI</span>
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
              </a>

              <a
                href="#contatti"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-dark-card border border-dark-border hover:border-brand-violet/50 hover:bg-brand-violet-dark/15 text-gray-200 hover:text-white font-bold tracking-wider rounded-xl transition-all duration-300 text-center cursor-pointer"
                id="hero-cta-talk"
              >
                <span>INIZIA IL TUO PROGETTO</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
