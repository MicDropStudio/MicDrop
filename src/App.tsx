/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Gallery from './components/Gallery';
import ContactForm from './components/ContactForm';
import Logo from './components/Logo';

import { 
  ArrowUp, 
  Headphones, 
  Sparkles, 
  Volume2, 
  Heart,
  Copyright
} from 'lucide-react';

export default function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScrollHeight = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', checkScrollHeight);
    return () => window.removeEventListener('scroll', checkScrollHeight);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 font-sans selection:bg-brand-orange selection:text-white relative" id="app-root-container">
      
      {/* Dynamic Ambient Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-15 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(139,92,246,0.15),transparent)]" />
      
      {/* FLOATING HEADER */}
      <Navbar />

      <main className="relative z-10" id="app-main-content">
        
        {/* HERO SECTION */}
        <Hero />

        {/* SERVICES SECTION */}
        <Services />

        {/* GALLERY PORTFOLIO */}
        <Gallery />

        {/* COMPREHENSIVE CONTACT FORM SECTION */}
        <ContactForm />

      </main>

      {/* COMPREHENSIVE FOOTER */}
      <footer className="bg-dark-bg/95 border-t border-dark-border/60 py-8 relative z-10" id="main-footer-container">
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col gap-6" id="footer-layout">
          
          {/* Top segment */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-dark-border/40" id="footer-top-row">
            
            <div className="flex flex-col items-center md:items-start gap-2" id="footer-brand-segment">
              <Logo showSubtitle={true} className="text-center md:text-left" />
            </div>

            <p className="text-xs text-gray-400 max-w-sm md:max-w-md text-center leading-relaxed" id="footer-text-centered">
              Curiamo ogni aspetto creativo e tecnico per dare valore alla tua voce.
            </p>

            {/* Quick columns navigation */}
            <div className="flex items-center gap-6 text-xs shrink-0" id="footer-links-grid">
              <a href="#servizi" className="text-gray-400 hover:text-white transition-colors" id="foo-link-servizi">Servizi</a>
              <a href="#gallery" className="text-gray-400 hover:text-white transition-colors" id="foo-link-gallery">Gallery</a>
              <a href="#contatti" className="text-gray-400 hover:text-white transition-colors" id="foo-link-contatti">Contatti & Form</a>
            </div>

          </div>

          {/* Bottom copyright statement */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-gray-500 uppercase tracking-wider" id="footer-bottom-row">
            <div className="flex items-center gap-1" id="copyright-box">
              <Copyright className="w-3.5 h-3.5 text-gray-600" />
              <span>{new Date().getFullYear()} MicDrop Studio. Tutti i diritti riservati.</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating Back to Top Handle */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 bg-brand-orange hover:bg-brand-orange-light text-white rounded-full border border-brand-orange-light/20 hover:border-brand-orange shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange/40 transition-all duration-300 transform scale-100 hover:scale-105 cursor-pointer flex items-center justify-center animate-scale-up"
          aria-label="Back to Top"
          id="btn-scroll-to-top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
}
