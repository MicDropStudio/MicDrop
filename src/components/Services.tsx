import React, { useState } from 'react';
import { Compass, Mic, Smartphone, Check, ArrowRight, X, Headphones, Sparkles, Volume2, Palette, Mail, Send, CheckCircle2, Copy, ExternalLink, AlertTriangle } from 'lucide-react';
import { Service } from '../types';

// Import our custom images
// @ts-ignore
import podcastStudioImg from '../assets/images/podcast_studio_1780658975307.png';
// @ts-ignore
import agencyBrandingImg from '../assets/images/agency_branding_1780658992801.png';
// @ts-ignore
import socialContentImg from '../assets/images/social_content_1780659010673.png';

export default function Services() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingService, setBookingService] = useState<Service | null>(null);
  
  // Booking Form States
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingDetails, setBookingDetails] = useState('');

  const servicesData: Service[] = [
    {
      id: 'podcast-production',
      title: 'Podcast Production',
      description: 'Dall’insonorizzazione della stanza al montaggio impeccabile.',
      longDescription: 'Diamo vita alle tue idee parlate curandoci dell’intero ciclo di vita del podcast. Registriamo con microfoni industriali (Shure SM7B, Neumann), rimuoviamo le impurità acustiche, assembliamo sigle ed effetti sonori custom, e automatizziamo il caricamento tramite feed RSS per amplificare la tua rassegna editoriale su tutte le app.',
      icon: 'Mic',
      imageUrl: podcastStudioImg,
      highlights: [
        'Incisione audio in Studio o da Remoto',
        'Editing, Pulizia acustica & Montaggio',
        'Sound Design & Sigle su misura',
        'Distribuzione ed Hosting (Spotify/Apple)'
      ],
      gradientClass: 'from-brand-orange to-brand-orange-dark border-brand-orange/30 group-hover:border-brand-orange/60'
    },
    {
      id: 'social-content',
      title: 'Social Media Content',
      description: 'Creazione Reel e TikTok virali con montaggio dinamico e copy trascinante.',
      longDescription: 'Attiriamo il polline digitale convertendo argomenti complessi in clip ipnotiche da 30 secondi. Strutturiamo ganci persuasivi ("Hook"), color grading energici, transizioni fluide e caption generate per scalare gli algoritmi di Instagram, TikTok e YouTube Shorts.',
      icon: 'Smartphone',
      imageUrl: socialContentImg,
      highlights: [
        'Scrittura Script & Storytelling strategico',
        'Riprese video verticali UHD',
        'Montaggio dinamico stile virale',
        'Caption animate & Sound Effects'
      ],
      gradientClass: 'from-orange-500 to-rose-600 border-orange-500/30 group-hover:border-orange-500/60'
    },
    {
      id: 'graphic-designer',
      title: 'Graphic Designer',
      description: 'Dall\'idea all\'immagine che hai sempre desiderato.',
      longDescription: 'Disegnamo e realizziamo capolavori di graphic design per ogni contesto digitale e cartaceo. Dai mockup all\'infografica interattiva, lavoriamo su file ad altissima risoluzione con concetti creativi moderni che comunicano immediatamente il tuo valore.',
      icon: 'Palette',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800&h=600',
      highlights: [
        'Grafica editoriale e pubblicitaria',
        'Materiale promozionale e flyer',
        'Illustrazioni e infografiche personalizzate',
        'Progettazione UI/UX di base'
      ],
      gradientClass: 'from-blue-500 to-teal-500 border-blue-500/30 group-hover:border-blue-500/60'
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-6 h-6 text-brand-orange" id="service-icon-compass" />;
      case 'Mic':
        return <Mic className="w-6 h-6 text-brand-violet-light" id="service-icon-mic" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-orange-400" id="service-icon-smartphone" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-blue-400" id="service-icon-palette" />;
      default:
        return <Sparkles className="w-6 h-6 text-white" id="service-icon-fallback" />;
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingEmail || !bookingDetails || !bookingService) return;

    const serviceName = bookingService.title;
    const subject = `🔥 RICHIESTA SERVIZIO: ${serviceName} - ${bookingName}`;
    const mailBody = `👋 Ciao MicDrop Studio,\n` +
  `C'è una nuova richiesta specifica per uno dei vostri servizi.\n\n` +
  `--------------------------------------------------\n` +
  `🛠️ SERVIZIO SELEZIONATO: ${serviceName.toUpperCase()}\n` +
  `--------------------------------------------------\n\n` +
  `👤 NOME CLIENTE:\n` +
  `${bookingName}\n\n` +
  `✉️ EMAIL DI LAVORO:\n` +
  `${bookingEmail}\n\n` +
  `📝 NOTE E DETTAGLI DEL PROGETTO:\n` +
  `${bookingDetails}\n\n` +
  `--------------------------------------------------\n` +
  `✨ Richiesta generata dal catalogo servizi MicDrop Studio`;

    const gmailWebLink = `https://mail.google.com/mail/?view=cm&fs=1&to=info.micdropstudio@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;
    
    // Apre direttamente Gmail Web in una nuova scheda
    window.open(gmailWebLink, '_blank', 'noopener,noreferrer');

    // Chiude la modale e ripulisce i campi
    closeBookingModal();
  };

  const closeBookingModal = () => {
    setBookingService(null);
    setBookingName('');
    setBookingEmail('');
    setBookingDetails('');
  };

  return (
    <section className="pt-20 pb-20 bg-dark-bg/95 relative border-y border-dark-border/40" id="servizi">
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-brand-violet-dark/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-brand-orange-dark/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10" id="services-wrapper">
        <div className="flex flex-col items-center text-center gap-4 mb-16" id="services-header">
          <div className="inline-flex items-center gap-1 bg-brand-violet-dark/20 border border-brand-violet/20 px-3 py-1 rounded-full text-xs font-mono text-brand-violet-light tracking-wider" id="services-badge">
            <Volume2 className="w-3.5 h-3.5" />
            <span>I NOSTRI SERVIZI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight leading-none" id="services-main-heading">
            Dall'Idea al <span className="text-gradient-orange">Successo</span>.
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-8" id="services-grid">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="group bg-dark-card border border-dark-border/80 hover:bg-dark-card/90 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/40 relative overflow-hidden h-full"
              id={`service-card-${service.id}`}
            >
              <div id="service-card-body" className="cursor-pointer" onClick={() => setSelectedService(service)}>
                <div className="w-full aspect-video rounded-xl overflow-hidden mb-5 border border-dark-border/60 relative" id={`cover-${service.id}`}>
                  <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute bottom-3 left-3 w-10 h-10 rounded-lg bg-dark-bg/90 backdrop-blur-xs border border-dark-border/60 flex items-center justify-center shadow-md" id={`icon-wrap-${service.id}`}>
                    {getIcon(service.icon)}
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-extrabold font-display text-white mb-3 group-hover:text-brand-orange transition-colors" id={`title-${service.id}`}>
                  {service.title}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6" id={`desc-${service.id}`}>
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t border-dark-border/30 mt-auto" id={`card-footer-${service.id}`}>
                <button
                  type="button"
                  onClick={() => setBookingService(service)}
                  className="w-full py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-light text-white font-bold text-xs uppercase tracking-wider transition-colors duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-brand-orange/5 hover:shadow-brand-orange/15"
                  id={`btn-book-${service.id}`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Richiedi il servizio</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Dettaglio */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedService(null)} id="services-details-overlay">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-5 md:p-6 max-w-xl w-full relative max-h-[85vh] overflow-y-auto border-glow-orange animate-scale-up" onClick={(e) => e.stopPropagation()} id="services-details-modal">
            <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-dark-bg border border-dark-border/60 hover:border-dark-border rounded-lg cursor-pointer transition-colors" aria-label="Chiudi" id="details-close-btn">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-4" id="modal-header">
              <div className="w-10 h-10 rounded-lg bg-dark-bg border border-dark-border flex items-center justify-center" id="modal-icon-wrap">
                {getIcon(selectedService.icon)}
              </div>
              <div id="modal-title-wrap">
                <h3 className="text-xl font-black font-display text-white" id="modal-title">{selectedService.title}</h3>
                <span className="text-[9px] font-mono text-brand-orange uppercase tracking-widest" id="modal-slug">MicDrop Studio Solution</span>
              </div>
            </div>
            <div className="w-full aspect-video rounded-xl overflow-hidden mb-4 border border-dark-border/60">
              <img src={selectedService.imageUrl} alt={selectedService.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-4" id="modal-long-description">{selectedService.longDescription}</p>
            <div className="flex items-center justify-end gap-3" id="modal-actions">
              <button onClick={() => setSelectedService(null)} className="px-4 py-2 rounded-lg border border-dark-border text-xs font-bold uppercase text-gray-400 hover:text-white transition-colors cursor-pointer" id="modal-btn-close">Chiudi</button>
              <button onClick={() => { setBookingService(selectedService); setSelectedService(null); }} className="px-4 py-2 bg-brand-orange text-white text-xs font-bold uppercase tracking-wide hover:bg-brand-orange-light shadow-lg shadow-brand-orange/25 cursor-pointer flex items-center gap-2" id="modal-btn-cta">
                <Mail className="w-3.5 h-3.5" />
                <span>Richiedi Servizio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP REALE: Modale Prenotazione aggiornato per apertura diretta Gmail */}
      {bookingService && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={closeBookingModal} id="booking-form-overlay">
          <div className="bg-dark-card border border-dark-border rounded-xl p-5 md:p-6 max-w-md w-full relative border-glow-orange animate-scale-up" onClick={(e) => e.stopPropagation()} id="booking-form-modal">
            <button onClick={closeBookingModal} className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-white bg-dark-bg border border-dark-border/60 hover:border-dark-border rounded-lg cursor-pointer transition-colors" aria-label="Chiudi" id="booking-close-btn">
              <X className="w-4 h-4" />
            </button>

            <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5 border-b border-dark-border/30 pb-3 mb-1">
                <div className="w-9 h-9 rounded-lg bg-dark-bg border border-dark-border flex items-center justify-center">
                  {getIcon(bookingService.icon)}
                </div>
                <div>
                  <h3 className="text-base font-black font-display text-white">Richiedi: {bookingService.title}</h3>
                  <p className="text-[11px] text-gray-400">Genera la tua email precompilata con un click.</p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono font-bold uppercase text-gray-400 tracking-wider">Nome Completo *</label>
                <input type="text" required value={bookingName} onChange={(e) => setBookingName(e.target.value)} placeholder="Es: Mario Rossi" className="bg-dark-bg border border-dark-border/80 focus:border-brand-orange rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-hidden w-full" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono font-bold uppercase text-gray-400 tracking-wider">Email di Lavoro *</label>
                <input type="email" required value={bookingEmail} onChange={(e) => setBookingEmail(e.target.value)} placeholder="Es: mario@azienda.com" className="bg-dark-bg border border-dark-border/80 focus:border-brand-orange rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-hidden w-full" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono font-bold uppercase text-gray-400 tracking-wider">Dettagli della Richiesta *</label>
                <textarea required rows={3} value={bookingDetails} onChange={(e) => setBookingDetails(e.target.value)} placeholder="Descrivi le tue necessità..." className="bg-dark-bg border border-dark-border/80 focus:border-brand-orange rounded-lg p-3 text-xs text-gray-100 focus:outline-hidden resize-none w-full" />
              </div>

              <button type="submit" className="w-full py-2.5 mt-1 bg-brand-orange hover:bg-brand-orange-light text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer">
                Invia Richiesta
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}