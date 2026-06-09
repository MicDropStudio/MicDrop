import React, { useState, useEffect } from 'react';
import { Mail, Phone, Send, CheckCircle2, Instagram, HelpCircle, History, MessageSquare, Briefcase, Plus, MessageCircle, Copy, ExternalLink, AlertTriangle } from 'lucide-react';
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
  const [lastMailtoUrl, setLastMailtoUrl] = useState('');
  const [lastGmailWebUrl, setLastGmailWebUrl] = useState('');
  const [lastSubmittedDetails, setLastSubmittedDetails] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  
  const [smtpStatus, setSmtpStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [smtpErrorMsg, setSmtpErrorMsg] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

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
    setSmtpErrorMsg('');

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

    // Salva nel database locale per sicurezza
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
      // Chiamata diretta a Web3Forms usando l'access key generata nei tuoi screenshot
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: "359175a9-796c-4a21-a92f-4bbc8d341c6f",
          from_name: "Sito MicDrop Studio",
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
        setSmtpErrorMsg(data.message || 'Invio non riuscito.');
      }
    } catch (err: any) {
      console.error('Errore durante l\'invio:', err);
      setSmtpStatus('ERROR');
      setSmtpErrorMsg('Errore di connessione alla rete.');
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset dei campi del form
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
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand-orange-dark/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-violet-dark/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10" id="contact-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="contact-grid">
          
          {/* Info Sinistra */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-12" id="contact-info-block">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-brand-violet-dark/20 border border-brand-violet/20 px-3 py-1 rounded-full text-xs font-mono text-brand-violet-light tracking-wider mb-4">
                <Briefcase className="w-3.5 h-3.5" />
                <span>PARTIAMO DA QUI</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight leading-none mb-6">
                Mettiamoci in <span className="text-gradient-orange">Contatto</span>.
              </h2>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8">
                Hai in mente un format rivoluzionario, un rebranding strategico o vuoi semplicemente far esplodere 
                i tuoi canali social? Compila il form: rispondiamo sempre in meno di 24 ore!
              </p>

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-dark-card border border-dark-border group-hover:border-brand-orange/40 flex items-center justify-center transition-colors">
                    <Mail className="w-5 h-5 text-brand-orange" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none mb-1">PROPOSTE ED INFO</span>
                    <a href="mailto:agencymicdrop@gmail.com" className="text-sm font-bold text-gray-200 hover:text-white transition-colors">agencymicdrop@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-dark-card border border-dark-border group-hover:border-brand-violet/40 flex items-center justify-center transition-colors">
                    <Phone className="w-5 h-5 text-brand-violet-light" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none mb-1">TELEFONO</span>
                    <a href="tel:+393317712292" className="text-sm font-bold text-gray-200 hover:text-white transition-colors">+39 331 7712292</a>
                  </div>
                </div>

                <div className="flex flex-row gap-4 mt-2">
                  <a href="https://wa.me/393317712292" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-xs font-bold tracking-wider uppercase transition-all">
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                  <a href="https://instagram.com/micdrop.studio" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#833AB4]/10 via-[#F56040]/10 to-[#FCAF45]/10 hover:from-[#833AB4]/20 hover:via-[#F56040]/20 hover:to-[#FCAF45]/20 border border-[#F56040]/30 text-[#F56040] text-xs font-bold tracking-wider uppercase transition-all">
                    <Instagram className="w-4 h-4" /> Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form Destra */}
          <div className="lg:col-span-7" id="contact-form-block">
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6 md:p-8 border-glow-orange relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-orange via-brand-violet to-brand-orange-light" />

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-xl font-bold text-white flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-brand-orange" />
                      Inizia il tuo Progetto
                    </h3>
                    <p className="text-xs text-gray-400">Specifica gli aspetti fondamentali del tuo progetto per metterci in contatto.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider">Nome Completo *</label>
                      <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Es: Mario Rossi" className="bg-dark-bg border border-dark-border/80 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-hidden transition-all duration-300 w-full" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider">Email di Lavoro *</label>
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Es: mario@azienda.com" className="bg-dark-bg border border-dark-border/80 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-hidden transition-all duration-300 w-full" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider">Servizio Principale</label>
                      <select value={service} onChange={(e) => setService(e.target.value)} className="bg-dark-bg border border-dark-border/80 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-hidden transition-all duration-300 w-full cursor-pointer">
                        <option value="ALL">Pacchetto Completo (Tutto)</option>
                        <option value="PODCAST">Podcast Production Only</option>
                        <option value="CREATIVE">Creative Agency Branding</option>
                        <option value="SOCIAL">Social Media Shorts & Reels</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider">Telefono (Opzionale)</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Es: +39 333 123456" className="bg-dark-bg border border-dark-border/80 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-hidden transition-all duration-300 w-full" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider">Dettagli del Progetto *</label>
                    <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Parlaci del tuo brand..." className="bg-dark-bg border border-dark-border/80 focus:border-brand-orange rounded-xl p-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-hidden transition-all duration-300 resize-none w-full" />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full relative py-4 bg-brand-orange hover:bg-brand-orange-light disabled:bg-gray-800 text-white font-bold tracking-widest uppercase rounded-xl transition-all duration-300 shadow-xl shadow-brand-orange/15 flex items-center justify-center gap-2 cursor-pointer">
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                        <span>Invio in corso...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Invia Messaggio</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Vista di successo pulita */
                <div className="text-center py-6 flex flex-col items-center gap-6" id="form-success-container">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${smtpStatus === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
                    {smtpStatus === 'SUCCESS' ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                  </div>

                  <div>
                    <h3 className="text-2xl font-black font-display text-white mb-2">
                      {smtpStatus === 'SUCCESS' ? 'Richiesta Inviata!' : 'Invio Diretto Non Riuscito'}
                    </h3>
                    <p className="text-sm text-gray-300 max-w-md mx-auto">
                      {smtpStatus === 'SUCCESS' 
                        ? "Perfetto! Abbiamo ricevuto la tua richiesta direttamente nei nostri sistemi. Ti risponderemo entro 24 ore." 
                        : "C'è stato un problema di rete temporaneo. Puoi usare i metodi veloci qui sotto per completare l'invio manuale:"
                      }
                    </p>
                  </div>

                  {/* Mostra i pulsanti di backup SOLO se Web3Forms fallisce */}
                  {smtpStatus !== 'SUCCESS' && (
                    <div className="flex flex-col gap-3 w-full max-w-md">
                      <a href={lastGmailWebUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-white transition-all group">
                        <div className="flex items-center gap-3 text-left">
                          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500"><Mail className="w-4 h-4" /></div>
                          <div>
                            <span className="block text-xs font-bold text-white mb-1">Apri in Gmail Web</span>
                            <span className="text-[11px] text-gray-400">Invia la mail precompilata con un click</span>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white" />
                      </a>

                      <button onClick={() => {
                        const text = `Nome: ${lastSubmittedDetails.name}\nEmail: ${lastSubmittedDetails.email}\nMessaggio: ${lastSubmittedDetails.message}`;
                        handleCopyToClipboard(text);
                      }} className="flex items-center justify-between p-3.5 rounded-xl bg-brand-violet-dark/10 hover:bg-brand-violet-dark/20 border border-brand-violet/30 text-white transition-all text-left cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-brand-violet-light/10 flex items-center justify-center text-brand-violet-light"><Copy className="w-4 h-4" /></div>
                          <div>
                            <span className="block text-xs font-bold text-white mb-1">Copia i dati negli appunti</span>
                            <span className="text-[11px] text-gray-400">{copySuccess ? 'Copiato!' : 'Salva il testo per incollarlo dove vuoi'}</span>
                          </div>
                        </div>
                      </button>
                    </div>
                  )}

                  <div className="w-full text-left p-4 bg-dark-bg/60 border border-dark-border/60 rounded-xl max-w-md mx-auto">
                    <span className="block text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-2 pb-2 border-b border-dark-border/30">RICEVUTA LOGICO-STRUTTURALE</span>
                    <div className="flex flex-col gap-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-gray-500">Stato Consegna:</span>
                        <span className={`font-bold ${smtpStatus === 'SUCCESS' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {smtpStatus === 'SUCCESS' ? 'CONSEGNATO (WEB3FORMS)' : 'REGISTRATO LOCALE'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-gray-500">Destinatario:</span>
                        <span className="font-semibold text-brand-orange">agencymicdrop@gmail.com</span>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => setIsSubmitted(false)} className="px-6 py-2.5 rounded-lg border border-dark-border hover:border-brand-orange text-xs font-bold uppercase text-gray-400 hover:text-white transition-colors cursor-pointer">
                    Invia un altro messaggio
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}