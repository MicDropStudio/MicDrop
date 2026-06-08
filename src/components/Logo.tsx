import { useState, useEffect } from 'react';

interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
}

export default function Logo({ className = '', showSubtitle = true }: LogoProps) {
  const [useFallback, setUseFallback] = useState(true);
  const [logoSrc, setLogoSrc] = useState('/assets/logo.png');

  useEffect(() => {
    // Check if the logo image exists in assets. Since it runs client-side dynamically,
    // we can test-load potential paths:
    // 1. /assets/logo/logo.png
    // 2. /assets/logo.png
    // 3. /logo.png
    const paths = ['/assets/logo/logo.png', '/assets/logo.png', '/logo.png'];
    let currentIndex = 0;

    const tryLoad = () => {
      if (currentIndex >= paths.length) {
        setUseFallback(true);
        return;
      }
      const img = new Image();
      img.src = paths[currentIndex];
      img.onload = () => {
        setLogoSrc(paths[currentIndex]);
        setUseFallback(false);
      };
      img.onerror = () => {
        currentIndex++;
        tryLoad();
      };
    };

    tryLoad();
  }, []);

  if (!useFallback) {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`} id="micdrop-img-logo-container">
        <img 
          src={logoSrc} 
          alt="MicDrop Studio" 
          className="h-16 md:h-22 w-auto object-contain"
          onError={() => setUseFallback(true)}
          referrerPolicy="no-referrer"
          id="micdrop-img-logo"
        />
      </div>
    );
  }

  // Exact CSS/SVG replica of the user's logo.
  // "MICDROP" in bold stylized italic orange with waveform icon sliced in 'O' and "STUDIO" below.
  return (
    <div className={`flex flex-col items-start font-display select-none ${className}`} id="micdrop-svg-logo-container">
      <div className="flex items-center gap-1 leading-none" id="micdrop-logo-title-group">
        <span className="text-3xl md:text-5xl font-black italic tracking-tight text-white flex items-center">
          <span className="text-gradient-orange mr-0.5">MIC</span>
          <span className="text-gradient-orange flex items-center">
            DR
            {/* The Custom "O" with Waveform waveform element */}
            <span className="relative inline-flex items-center justify-center mx-1 w-[26px] h-[26px] md:w-[38px] md:h-[38px] rounded-full border-2 border-brand-orange bg-dark-bg overflow-hidden align-middle">
              {/* Waveform line inside the O */}
              <svg className="w-full h-full stroke-brand-orange stroke-2 fill-none" viewBox="0 0 24 24">
                <path d="M2 12h3l3-7 4 14 3-10 3 5h4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            P
          </span>
        </span>
      </div>
      <div className="flex items-center leading-none mt-2 pl-1" id="micdrop-logo-studio-subtitle">
        <span className="text-base md:text-xl font-bold tracking-[0.55em] text-white">
          S T U D I O
        </span>
      </div>
    </div>
  );
}
