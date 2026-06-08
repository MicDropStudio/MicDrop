import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, MessageSquareCode } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Servizi', href: '#servizi' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contatti', href: '#contatti' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 ${
        isScrolled
          ? 'py-3 bg-dark-bg/85 backdrop-blur-md border-b border-dark-border/60 shadow-lg shadow-black/30'
          : 'py-5 bg-transparent'
      }`}
      id="main-navbar-container"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between" id="navbar-content">
        {/* Logo and Subtitle */}
        <a href="#" className="flex items-center gap-2 group transition-transform" id="navbar-brand-link">
          <Logo className="transition-all duration-300 md:group-hover:scale-102" showSubtitle={true} />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" id="desktop-nav">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold tracking-wide text-gray-300 hover:text-brand-orange transition-colors relative group py-2"
              id={`nav-link-desktop-${item.href.replace('#', '')}`}
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-350 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Action Button CTA */}
        <div className="hidden md:flex items-center gap-4" id="navbar-cta-group">
          <a
            href="#contatti"
            className="flex items-center gap-1 text-xs font-bold tracking-widest uppercase bg-linear-to-r from-brand-orange to-brand-orange-dark hover:from-brand-orange-light hover:to-brand-orange text-white px-5 py-2.5 rounded-full border border-brand-orange-light/10 hover:border-brand-orange-light/30 transition-all duration-300 shadow-lg shadow-brand-orange/15 hover:shadow-brand-orange/30 cursor-pointer"
            id="nav-cta-button"
          >
            <MessageSquareCode className="w-3.5 h-3.5" />
            <span>Inizia Ora</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-300 hover:text-white bg-dark-card border border-dark-border/80 focus:outline-hidden rounded-lg cursor-pointer"
          aria-label="Toggle Menu"
          id="mobile-menu-toggle-btn"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6 text-brand-orange" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-[65px] bg-dark-bg/95 backdrop-blur-lg z-40 md:hidden animate-fade-in flex flex-col justify-between p-6 border-t border-dark-border/40"
          id="mobile-drawer"
        >
          <div className="flex flex-col gap-6 mt-6" id="mobile-drawer-links">
            {menuItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xl font-bold font-display tracking-wider text-gray-200 hover:text-brand-orange transition-colors py-2 border-b border-dark-border/40 flex items-center justify-between"
                id={`mobile-link-${index}`}
              >
                <span>{item.label}</span>
                <ArrowUpRight className="w-5 h-5 text-brand-violet-light" />
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-4 mb-20" id="mobile-drawer-footer">
            <a
              href="#contatti"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 text-sm font-bold tracking-widest uppercase bg-brand-orange text-white py-4 rounded-xl text-center cursor-pointer hover:bg-brand-orange-light transition-all duration-300"
              id="mobile-drawer-cta-btn"
            >
              <MessageSquareCode className="w-4 h-4" />
              <span>Contattaci Subito</span>
            </a>
            
            <p className="text-[10px] text-gray-500 font-mono text-center uppercase tracking-widest">
              MICDROP STUDIO • CREATION AT HIGH WAVE
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
