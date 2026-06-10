import React, { useState, useEffect } from 'react';
import { Mail, Phone, Send, CheckCircle2, Instagram, MessageSquare, Briefcase, MessageCircle, Copy, ExternalLink, AlertTriangle } from 'lucide-react';
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
  const [lastGmailWebUrl, setLastGmailWebUrl] = useState('');
  const [lastSubmittedDetails, setLastSubmittedDetails] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  
  const [smtpStatus, setSmtpStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('micdrop_contact_submissions');
      if (stored) setSubmissionsHist(JSON.parse(stored));
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
      .catch((err) => console.warn('Clip copy failed', err));
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
                     `- Servizio di Interesse: ${service === 'ALL' ? 'Pacchetto Completo' : service}\n\n` +
                     `Dettagli del Progetto:\n${message}`;
    
    const gmailWebLink = `https://mail.google.com/mail/?view=cm&fs=1&to=agencymicdrop@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;
    
    setLastGmailWebUrl(gmailWebLink);
    setLastSubmittedDetails({ name, email, phone, service, message });

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: "359175a9-796c-4a21-a92f-4bbc8d341c6f",
          from_name: "Sito MicDrop Studio",
          subject: subject,
          name,
          email,
          phone: phone || 'Non fornito',
          service,
          message,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSmtpStatus('SUCCESS');
      } else {
        setSmtpStatus('ERROR');
      }
    } catch (err) {
      setSmtpStatus('ERROR');
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setService('ALL');
      setMessage('');
    }
  };

  return (
    <section className="py-24 bg-dark-bg/95 relative border-t border-dark-border/40" id="contatti">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Info Sinistra */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-12">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-brand-violet-dark/20 border border-brand-violet/20 px-3 py-1 rounded-full text-xs font-mono text-brand-violet-light tracking-wider mb-4">
                <Briefcase className="w-3.5 h-3.5" />
                <span>PARTIAMO DA QUI</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white mb-6">
                Mettiamoci in <span className="text-gradient-orange">Contatto</span>.
              </h2>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8">
                Compila il form: rispondiamo sempre in meno di 24 ore!
              </p>

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center">
                    <Mail className="w-5 h-5 text-brand-orange" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-gray-500 uppercase mb-1">PROPOSTE ED INFO</span>
                    <a href="mailto:info.micdropstudio@gmail.com" className="text-sm font-bold text-gray-200 hover:text-white">agencymicdrop@gmail.com</a>
                  </div>
                </div>

                <div className="flex flex-row gap-4 mt-2">
                  <a href="https://wa.me/393317712292" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366]/10 text-[#25D366] text-xs font-bold uppercase border border-[#25D366]/30">
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                  <a href="https://instagram.com/micdrop.studio" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#833AB4]/10 to-[#FCAF45]/10 text-[#F56040] text-xs font-bold uppercase border border-[#F56040]/30">
                    <Instagram className="w-4 h-4" /> Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form Destra */}
          <div className="lg:col-span-7">
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-orange via-brand-violet to-brand-orange-light" />

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-xl font-bold text-white flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-brand-orange" />
                      Inizia il tuo Progetto
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-gray-400 uppercase">Nome Completo *</label>
                      <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Es: Mario Rossi" className="bg-dark-bg border border-dark-border/80 rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-hidden w-full" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-gray-400 uppercase">Email *</label>
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Es: mario@azienda.com" className="bg-dark-bg border border-dark-border/80 rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-hidden w-full" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono text-gray-400 uppercase">Dettagli del Progetto *</label>
                    <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Parlaci del tuo brand..." className="bg-dark-bg border border-dark-border/80 rounded-xl p-4 text-sm text-gray-100 focus:outline-hidden resize-none w-full" />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-brand-orange text-white font-bold uppercase rounded-xl flex items-center justify-center gap-2 cursor-pointer">
                    {isSubmitting ? 'Invio in corso...' : 'Invia Messaggio'}
                  </button>
                </form>
              ) : (
                /* Nuova Schermata di Successo Pulita */
                <div className="text-center py-6 flex flex-col items-center gap-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${smtpStatus === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {smtpStatus === 'SUCCESS' ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">
                      {smtpStatus === 'SUCCESS' ? 'Richiesta Inviata!' : 'Invio Diretto Non Riuscito'}
                    </h3>
                    <p className="text-sm text-gray-300 max-w-md mx-auto">
                      {smtpStatus === 'SUCCESS' 
                        ? "Perfetto! Abbiamo ricevuto la tua richiesta tramite i nostri sistemi Web3Forms. Ti risponderemo entro 24 ore." 
                        : "C'è stato un problema di rete. Usa questa opzione di backup rapida per inviarci la mail precompilata:"
                      }
                    </p>
                  </div>

                  {smtpStatus !== 'SUCCESS' && (
                    <div className="flex flex-col gap-3 w-full max-w-md">
                      <a href={lastGmailWebUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-white group">
                        <div className="flex items-center gap-3 text-left">
                          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500"><Mail className="w-4 h-4" /></div>
                          <div>
                            <span className="block text-xs font-bold text-white mb-1">Apri in Gmail Web</span>
                            <span className="text-[11px] text-gray-400">Invia la mail precompilata con un click</span>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                      </a>
                    </div>
                  )}

                  <button onClick={() => setIsSubmitted(false)} className="px-6 py-2.5 rounded-lg border border-dark-border text-xs font-bold uppercase text-gray-400 hover:text-white transition-colors cursor-pointer">
                    Torna al form
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