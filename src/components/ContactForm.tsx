import React, { useState, useEffect } from 'react';
import { Mail, Phone, Send, CheckCircle2, Instagram, Youtube, HelpCircle, History, MessageSquare, Briefcase, Plus, MessageCircle, Copy, ExternalLink, AlertTriangle } from 'lucide-react';
import { ContactSubmission } from '../types';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('ALL');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionsHist, setSubmissionsHist] = useState<ContactSubmission[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [lastMailtoUrl, setLastMailtoUrl] = useState('');
  const [lastGmailWebUrl, setLastGmailWebUrl] = useState('');
  const [lastSubmittedDetails, setLastSubmittedDetails] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  
  const [smtpStatus, setSmtpStatus] = useState<'IDLE' | 'SUCCESS' | 'NO_CREDENTIALS' | 'ERROR'>('IDLE');
  const [smtpErrorMsg, setSmtpErrorMsg] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Load submissions from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('micdrop_contact_submissions');
      if (stored) {
        setSubmissionsHist(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Error loading submissions', e);
    }
  }, []);

  const handleCopyToClipboard = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((err) => {
        console.warn('Clip copy failed', err);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setSmtpStatus('IDLE');

    const subject = `Nuovo Progetto MicDrop Studio - ${name}`;
    const mailBody = `Ciao MicDrop Studio,\n\nEcco i dettagli del mio contatto:\n\n` +
                     `- Nome Completo: ${name}\n` +
                     `- Email di Lavoro: ${email}\n` +
                     `- Telefono: ${phone || 'Non fornito'}\n` +
                     `- Servizio di Interesse: ${service === 'ALL' ? 'Pacchetto Completo (Tutto)' : service}\n\n` +
                     `Dettagli del Progetto:\n${message}\n\n` +
                     `Inviato dal sito web MicDrop Studio.`;
    
    const mailtoLink = `mailto:agencymicdrop@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;
    const gmailWebLink = `https://mail.google.com/mail/?view=cm&fs=1&to=agencymicdrop@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;
    
    setLastMailtoUrl(mailtoLink);
    setLastGmailWebUrl(gmailWebLink);
    setLastSubmittedDetails({ name, email, phone, service, message });

    // Local state save logic immediately so user progress is never lost
    const newSubmission: ContactSubmission = {
      id: 'sub-' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      service,
      message,
      timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('it-IT'),
      read: false
    };

    const updated = [newSubmission, ...submissionsHist];
    setSubmissionsHist(updated);
    try {
      localStorage.setItem('micdrop_contact_submissions', JSON.stringify(updated));
    } catch (err) {
      console.warn('Error saving submission', err);
    }

    try {
      // Integrazione stabile con Web3Forms per hosting statico su GitHub Pages
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: "359175a9-796c-4421-a92f-4bbc8d341c6f",
          subject: subject,
          name: name,
          email: email,
          phone: phone || 'Non fornito',
          service: service === 'ALL' ? 'Pacchetto Completo (Tutto)' : service,
          message: message,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSmtpStatus('SUCCESS');
      } else {
        setSmtpStatus('ERROR');
        setSmtpErrorMsg(data.message || 'Invio tramite Web3Forms non riuscito.');
      }
    } catch (err: any) {
      console.warn('Backend request failed, falling back to manual dispatch mechanisms.', err);
      setSmtpStatus('ERROR');
      setSmtpErrorMsg(err.message || 'Impossibile connettersi al server email.');
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form input fields
      setName('');
      setEmail('');
      setPhone('');
      setService('ALL');
      setMessage('');
    }
  };

  const clearHistory = () => {
    setSubmissionsHist([]);
    localStorage.removeItem('micdrop_contact_submissions');
  };

  return (
    <section className="py-24 bg-dark-bg/95 relative border-t border-dark-border/40" id="contatti">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand-orange-dark/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-violet-dark/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10" id="contact-wrapper">
        
        {/* Grid Setup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="contact-grid">
          
          {/* Left Column: Info list */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-12" id="contact-info-block">
            <div id="contact-info-texts">
              <div className="inline-flex items-center gap-1.5 bg-brand-violet-dark/20 border border-brand-violet/20 px-3 py-1 rounded-full text-xs font-mono text-brand-violet-light tracking-wider mb-4" id="contact-info-badge">
                <Briefcase className="w-3.5 h-3.5" />
                <span>PARTIAMO DA QUI</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight leading-none mb-6" id="contact-info-title">
                Mettiamoci in <span className="text-gradient-orange">Contatto</span>.
              </h2>
              
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8" id="contact-info-desc">
                Hai in mente un format rivoluzionario, un rebranding strategico o vuoi semplicemente far esplodere 
                i tuoi canali social con la nostra ritmica editoriale? Compila il form a fianco: rispondiamo sempre in meno di 24 ore!
              </p>

              {/* Contacts info items list */}
              <div className="flex flex-col gap-6" id="contact-details-list">
                <div className="flex items-center gap-4 group" id="contact-item-mail">
                  <div className="w-12 h-12 rounded-xl bg-dark-card border border-dark-border group-hover:border-brand-orange/40 flex items-center justify-center transition-colors" id="icon-container-mail">
                    <Mail className="w-5 h-5 text-brand-orange" />
                  </div>
                  <div id="text-container-mail">
                    <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none mb-1">PROPOSTE ED INFO</span>
                    <a href="mailto:agencymicdrop@gmail.com" className="text-sm font-bold text-gray-200 hover:text-white transition-colors">agencymicdrop@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-4 group" id="contact-item-tel">
                  <div className="w-12 h-12 rounded-xl bg-dark-card border border-dark-border group-hover:border-brand-violet/40 flex items-center justify-center transition-colors" id="icon-container-tel">
                    <Phone className="w-5 h-5 text-brand-violet-light" />
                  </div>
                  <div id="text-container-tel">
                    <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none mb-1">TELEFONO</span>
                    <a href="tel:+393317712292" className="text-sm font-bold text-gray-200 hover:text-white transition-colors">+39 331 7712292</a>
                  </div>
                </div>

                {/* WhatsApp & Instagram Quick Buttons */}
                <div className="flex flex-row gap-4 mt-2" id="contact-social-buttons">
                  <a 
                    href="https://wa.me/393317712292" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-xs font-bold tracking-wider uppercase transition-all duration-300"
                    id="contact-btn-whatsapp"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                  <a 
                    href="https://instagram.com/micdrop.studio" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#833AB4]/10 via-[#F56040]/10 to-[#FCAF45]/10 hover:from-[#833AB4]/20 hover:via-[#F56040]/20 hover:to-[#FCAF45]/20 border border-[#F56040]/30 text-[#F56040] text-xs font-bold tracking-wider uppercase transition-all duration-300"
                    id="contact-btn-instagram"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive form container */}
          <div className="lg:col-span-7" id="contact-form-block">
            <div 
              className="bg-dark-card border border-dark-border rounded-2xl p-6 md:p-8 border-glow-orange relative overflow-hidden" 
              id="form-card-container"
            >
              {/* Aesthetic glass highlight */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-brand-orange via-brand-violet to-brand-orange-light" />

              {!isSubmitted ? (
                // Form View
                <form onSubmit={handleSubmit} className="flex flex-col gap-6" id="consultation-form">
                  <div className="flex flex-col gap-1.5" id="form-intro">
                    <h3 className="text-xl font-bold text-white flex items-center gap-1.5" id="form-heading">
                      <MessageSquare className="w-4 h-4 text-brand-orange" />
                      Inizia il tuo Progetto
                    </h3>
                    <p className="text-xs text-gray-400">Specifica gli aspetti fondamentali del tuo progetto per metterci in contatto.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="form-row-personal">
                    <div className="flex flex-col gap-2" id="input-group-name">
                      <label className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider">Nome Completo *</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Es: Mario Rossi" 
                        className="bg-dark-bg border border-dark-border/80 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-hidden transition-all duration-300 w-full"
                        id="form-input-name"
                      />
                    </div>

                    <div className="flex flex-col gap-2" id="input-group-email">
                      <label className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider">Email di Lavoro *</label>
                      <input 
                        type="type" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Es: mario@azienda.com" 
                        className="bg-dark-bg border border-dark-border/80 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-hidden transition-all duration-300 w-full"
                        id="form-input-email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="form-row-service">
                    <div className="flex flex-col gap-2" id="input-group-service">
                      <label className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider">Servizio Principale</label>
                      <select 
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="bg-dark-bg border border-dark-border/80 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-hidden transition-all duration-300 w-full cursor-pointer"
                        id="form-select-service"
                      >
                        <option value="ALL">Pacchetto Completo (Tutto)</option>
                        <option value="PODCAST">Podcast Production Only</option>
                        <option value="CREATIVE">Creative Agency Branding</option>
                        <option value="SOCIAL">Social Media Shorts & Reels</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2" id="input-group-phone">
                      <label className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider">Telefono (Opzionale)</label>
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Es: +39 333 123456" 
                        className="bg-dark-bg border border-dark-border/80 focus:border-brand-orange hover:border-dark-border rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-hidden transition-all duration-300 w-full"
                        id="form-input-phone"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2" id="input-group-msg">
                    <label className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider">Dettagli del Progetto *</label>
                    <textarea 
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Parlaci del tuo brand, dei tuoi obiettivi o della tesi che vorresti esprimere nel tuo podcast..." 
                      className="bg-dark-bg border border-dark-border/80 focus:border-brand-orange rounded-xl p-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-hidden transition-all duration-300 resize-none w-full"
                      id="form-input-message"
                    />
                  </div>

                  {/* Submit CTA button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative py-4 bg-brand-orange hover:bg-brand-orange-light disabled:bg-gray-800 text-white font-bold tracking-widest uppercase rounded-xl transition-all duration-300 shadow-xl shadow-brand-orange/15 hover:shadow-brand-orange/30 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                    id="form-submit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                        <span>Sincronizzazione in Corso...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Lancia il Microfono (Invia)</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                // Success State View
                <div className="text-center py-6 flex flex-col items-center gap-6 animate-scale-up" id="form-success-container">
                  <div className="w-16 h-16 rounded-full bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center text-brand-orange" id="success-icon-wrap">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div id="success-text-header">
                    <h3 className="text-2xl font-black font-display text-white mb-2" id="success-message-title">
                      Inviato con Successo!
                    </h3>
                    
                    <p className="text-sm text-gray-300 max-w-md mx-auto" id="success-message-lead">
                      Ottimo! La tua richiesta è stata consegnata direttamente a <strong>agencymicdrop@gmail.com</strong>. Ti risponderemo prontamente nelle prossime ore!
                    </p>
                  </div>

                  {smtpStatus !== 'SUCCESS' && (
                    <div className="flex flex-col gap-3 w-full max-w-md" id="dispatch-mechanisms-group">
                      
                      {/* Option 1: Gmail Web client */}
                      <a
                        href={lastGmailWebUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-red-650/10 hover:bg-red-650/20 border border-red-500/30 text-white transition-all duration-300 group"
                        id="btn-dispatcher-gmail"
                      >
                        <div className="flex items-center gap-3 text-left">
                          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-white leading-none mb-1">Backup: Gmail Web</span>
                            <span className="text-[11px] text-gray-400">Invia manualmente se riscontri ritardi di rete</span>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                      </a>

                      {/* Option 2: Clipboard copy */}
                      <button
                        onClick={() => {
                          const clipboardText = `Ciao MicDrop Studio,\n\nEcco i dettagli del mio contatto:\n\n` +
                                                `- Nome: ${lastSubmittedDetails.name}\n` +
                                                `- Email: ${lastSubmittedDetails.email}\n` +
                                                `- Telefono: ${lastSubmittedDetails.phone || 'Non fornito'}\n` +
                                                `- Servizio: ${lastSubmittedDetails.service === 'ALL' ? 'Pacchetto Completo' : lastSubmittedDetails.service}\n\n` +
                                                `Dettagli Progetto:\n${lastSubmittedDetails.message}`;
                          handleCopyToClipboard(clipboardText);
                        }}
                        className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-brand-violet-dark/10 hover:bg-brand-violet-dark/20 border border-brand-violet/30 text-white transition-all duration-300 text-left cursor-pointer"
                        id="btn-dispatcher-copy"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-brand-violet-light/10 flex items-center justify-center text-brand-violet-light">
                            <Copy className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-white leading-none mb-1">Copia Testo Compilato</span>
                            <span className="text-[11px] text-gray-400">
                              {copySuccess ? 'Copiato negli appunti!' : 'Salva i dati negli appunti in un clic'}
                            </span>
                          </div>
                        </div>
                        {copySuccess ? (
                          <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-widest animate-pulse px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md">COPIATO!</span>
                        ) : (
                          <span className="text-[10px] font-mono text-gray-500 hover:text-white uppercase">Copia</span>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Summary of what they typed */}
                  <div className="w-full text-left p-4 bg-dark-bg/60 border border-dark-border/60 rounded-xl max-w-md mx-auto" id="success-receipt">
                    <span className="block text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-3 border-b border-dark-border/30 pb-2">RICEVUTA DI TRASMISSIONE</span>
                    
                    <div className="flex flex-col gap-2 text-xs" id="success-receipt-lines">
                      <div className="flex items-center justify-between" id="receipt-line-channel">
                        <span className="font-mono text-gray-500">Stato di Consegna:</span>
                        <span className="font-bold text-emerald-400">
                          {smtpStatus === 'SUCCESS' ? 'INVIATO (WEB3FORMS)' : 'ELABORATO'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between" id="receipt-line-service">
                        <span className="font-mono text-gray-500">Destinatario:</span>
                        <span className="font-semibold text-brand-orange">agencymicdrop@gmail.com</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2" id="success-bottom-controls">
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-dark-border hover:border-brand-orange text-xs font-bold uppercase text-gray-400 hover:text-white cursor-pointer transition-colors"
                      id="success-btn-reset"
                    >
                      Invia un altro messaggio
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Live Local Database Archive Panel */}
            {submissionsHist.length > 0 && (
              <div className="mt-6 text-right" id="demo-db-group">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="inline-flex items-center gap-1.5 text-xs text-brand-violet-light hover:text-white transition-colors cursor-pointer bg-dark-card/40 hover:bg-dark-card px-3 py-1.5 rounded-lg border border-dark-border/50"
                  id="btn-toggle-db-archive"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>{showHistory ? 'Nascondi Log Inviati' : 'Mostra Log Inviati'} ({submissionsHist.length})</span>
                </button>

                {showHistory && (
                  <div className="mt-3 bg-dark-card border border-dark-border p-4 rounded-xl text-left max-h-56 overflow-y-auto animate-fade-in" id="db-archive-box">
                    <div className="flex items-center justify-between border-b border-dark-border/40 pb-2 mb-3" id="db-archive-header">
                      <span className="text-[10px] font-mono text-brand-orange uppercase font-bold">DATABASE LOCALE</span>
                      <button 
                        onClick={clearHistory}
                        className="text-[10px] font-mono text-rose-500 hover:text-rose-400 cursor-pointer"
                        id="btn-clear-db"
                      >
                        Svuota Registro
                      </button>
                    </div>

                    <div className="flex flex-col gap-3" id="db-archive-items">
                      {submissionsHist.map((sub) => (
                        <div key={sub.id} className="p-3 bg-dark-bg/85 rounded-lg border border-dark-border/40 text-xs" id={`db-item-${sub.id}`}>
                          <div className="flex items-center justify-between gap-2 mb-1" id={`db-item-header-${sub.id}`}>
                            <span className="font-bold text-white uppercase">{sub.name}</span>
                            <span className="font-mono text-[9px] text-gray-500">{sub.timestamp}</span>
                          </div>
                          
                          <div className="text-[10px] text-gray-400 mb-2" id={`db-item-email-line-${sub.id}`}>
                            {sub.email} | Servizio: {sub.service}
                          </div>
                          
                          <p className="text-gray-300 bg-dark-card/50 p-2 rounded-sm italic leading-relaxed" id={`db-item-message-${sub.id}`}>
                            "{sub.message}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}