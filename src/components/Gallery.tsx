import React from 'react';

// Import our custom images
// @ts-ignore
import podcastStudioImg from '../assets/images/podcast_studio_1780658975307.png';
// @ts-ignore
import agencyBrandingImg from '../assets/images/agency_branding_1780658992801.png';
// @ts-ignore
import socialContentImg from '../assets/images/social_content_1780659010673.png';

export default function Gallery() {
  const images = [
    podcastStudioImg,
    agencyBrandingImg,
    socialContentImg,
    'https://picsum.photos/seed/insidepod/800/600',
    'https://picsum.photos/seed/neontypo/800/600',
    'https://picsum.photos/seed/streetsocial/800/600'
  ];

  return (
    <section className="py-20 bg-dark-bg" id="gallery">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-16" id="gallery-header">
          <div className="inline-flex items-center gap-1 bg-brand-orange-dark/20 border border-brand-orange/20 px-3 py-1 rounded-full text-xs font-mono text-brand-orange tracking-wider" id="gallery-badge">
            <span>SHOWCASE</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight leading-none" id="gallery-main-heading">
            Gallery
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {images.map((img, index) => (
            <div 
              key={index} 
              className="relative aspect-video sm:aspect-4/3 overflow-hidden rounded-2xl border border-dark-border/80 shadow-lg bg-dark-card transition-all duration-300 hover:border-brand-orange/30 group"
              id={`gallery-item-${index}`}
            >
              <img
                src={img}
                alt={`Progetto ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
