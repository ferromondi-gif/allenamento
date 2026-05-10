/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Send, 
  Dumbbell, 
  Activity, 
  Trophy, 
  CheckCircle2, 
  User, 
  Clock, 
  Flame, 
  Zap,
  LayoutDashboard,
  Timer,
  Hash
} from 'lucide-react';
import { ActivityCategory, WorkoutData } from './types';
import { RpeScale } from './components/RpeScale';
import { ClockDial } from './components/ClockDial';
import { cn } from './lib/utils';

const INITIAL_DATA: WorkoutData = {
  athleteName: '',
  category: null,
  rpe: 10,
  timestamp: new Date().toISOString(),
};

export default function App() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<WorkoutData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const next = () => setPage(p => p + 1);
  const back = () => setPage(p => p - 1);

  const updateData = (updates: Partial<WorkoutData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const handleSend = async () => {
    setIsSubmitting(true);
    try {
      // Logic to send data to Google Sheets via server endpoint
      const response = await fetch('/api/submit-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitted(true);
        next();
      } else {
        alert('Errore durante l\'invio dei dati. Riprova più tardi.');
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Si è verificato un errore di rete.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-zinc-100 flex flex-col items-center justify-start sm:justify-center p-4 sm:p-6 overflow-x-hidden pt-6 sm:pt-0">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-xl relative z-10 py-4">
        <AnimatePresence mode="wait">
          {page === 1 && (
            <PageWrapper key="p1">
              <div className="text-center space-y-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-brand/10 border border-brand/20 mb-4">
                  <Flame className="w-10 h-10 text-brand" />
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase italic">
                    Allenamento
                  </h1>
                  <p className="text-xl text-zinc-400 font-medium leading-relaxed px-4">
                    Grande, hai concluso la sessione. <br />
                    Adesso facciamo un piccolo resoconto così capiamo insieme come modularci.
                  </p>
                </div>
                <div className="pt-4 px-4">
                  <button 
                    onClick={next}
                    className="w-full h-16 bg-brand hover:bg-brand-dark text-zinc-950 font-black rounded-2xl flex items-center justify-center gap-2 group transition-all"
                  >
                    INIZIAMO
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </PageWrapper>
          )}

          {page === 2 && (
            <PageWrapper key="p2">
              <div className="space-y-8">
                <div className="space-y-2">
                  <span className="text-brand font-mono text-sm uppercase tracking-widest">Identità</span>
                  <h2 className="text-4xl font-black text-white italic uppercase">Chi sei?</h2>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={data.athleteName}
                    onChange={(e) => updateData({ athleteName: e.target.value })}
                    placeholder="Il tuo nome..."
                    className="w-full h-16 bg-zinc-900 border-2 border-zinc-800 rounded-2xl px-6 text-xl text-white placeholder:text-zinc-600 focus:border-brand focus:outline-none transition-colors"
                    autoFocus
                  />
                  <User className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-700 pointer-events-none" />
                </div>
                <div className="flex gap-4">
                  <button onClick={back} className="w-16 h-16 bg-zinc-900 border-2 border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={next}
                    disabled={!data.athleteName.trim()}
                    className="flex-1 h-16 bg-brand disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-dark text-zinc-950 font-black rounded-2xl flex items-center justify-center gap-2 transition-all"
                  >
                    AVANTI
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </PageWrapper>
          )}

          {page === 3 && (
            <PageWrapper key="p3">
              <div className="space-y-8">
                <div className="space-y-2">
                  <span className="text-brand font-mono text-sm uppercase tracking-widest">Categoria e Sforzo</span>
                  <h2 className="text-4xl font-black text-white italic uppercase">Cos'hai fatto?</h2>
                </div>
                
                <div className="grid gap-3">
                  {(['Sport Specifico', 'Altro Sport', 'Preparazione Atletica'] as ActivityCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateData({ category: cat })}
                      className={cn(
                        "h-16 rounded-2xl text-lg font-bold border-2 transition-all flex items-center px-6 gap-4",
                        data.category === cat 
                          ? "bg-brand border-brand text-zinc-950" 
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                      )}
                    >
                      {cat === 'Sport Specifico' && <Trophy className="w-6 h-6" />}
                      {cat === 'Altro Sport' && <Activity className="w-6 h-6" />}
                      {cat === 'Preparazione Atletica' && <Dumbbell className="w-6 h-6" />}
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="space-y-4 pt-4">
                  <label className="text-zinc-500 font-bold uppercase tracking-tighter text-sm flex items-center gap-2">
                    Percezione Sforzo (RPE)
                  </label>
                  <RpeScale value={data.rpe} onChange={(v) => updateData({ rpe: v })} />
                </div>

                <div className="flex gap-4">
                  <button onClick={back} className="w-16 h-16 bg-zinc-900 border-2 border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={next}
                    disabled={!data.category}
                    className="flex-1 h-16 bg-brand disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-dark text-zinc-950 font-black rounded-2xl flex items-center justify-center gap-2 transition-all"
                  >
                    AVANTI
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </PageWrapper>
          )}

          {page === 4 && (
            <PageWrapper key="p4">
              {data.category === 'Sport Specifico' && <SpecificoForm data={data} updateData={updateData} back={back} next={next} />}
              {data.category === 'Altro Sport' && <AltroForm data={data} updateData={updateData} back={back} next={next} />}
              {data.category === 'Preparazione Atletica' && <PreparazioneForm data={data} updateData={updateData} back={back} next={next} />}
            </PageWrapper>
          )}

          {page === 5 && (
            <PageWrapper key="p5">
              <div className="text-center space-y-8">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 border-4 border-green-500/20 mb-4"
                >
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </motion.div>
                <div className="space-y-4">
                  <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">
                    Ottimo lavoro!
                  </h1>
                  <p className="text-lg text-zinc-400 leading-relaxed px-4">
                    Il tuo riassunto è pronto. Inviando i dati aggiornerai il tuo storico e potrai monitorare i tuoi progressi.
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  <button 
                    onClick={handleSend}
                    disabled={isSubmitting}
                    className="w-full h-16 bg-brand hover:bg-brand-dark text-zinc-950 font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_-5px_rgba(189,255,0,0.3)]"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                    ) : (
                      <>
                        INVIA A GOOGLE SHEETS
                        <Send className="w-6 h-6" />
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => setPage(4)}
                    disabled={isSubmitting}
                    className="w-full h-14 bg-zinc-900 border-2 border-zinc-800 text-zinc-400 font-bold rounded-2xl flex items-center justify-center gap-2 hover:text-white transition-colors"
                  >
                    MODIFICA
                  </button>
                </div>
              </div>
            </PageWrapper>
          )}

          {page === 6 && submitted && (
            <PageWrapper key="p6">
              <div className="text-center space-y-12">
                <div className="space-y-4">
                  <h2 className="text-5xl font-black text-brand italic uppercase">Inviato!</h2>
                  <p className="text-xl text-zinc-400">I dati sono stati salvati correttamente.</p>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 text-left space-y-6">
                  <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
                    <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center">
                      <LayoutDashboard className="text-brand w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest">Atleta</div>
                      <div className="text-xl font-bold">{data.athleteName}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest">Sforzo</div>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-black text-white">{data.rpe}</span>
                        <div className="w-2 h-8 rounded-full bg-gradient-to-t from-green-500 to-red-500" style={{ 
                          height: '24px',
                          background: `linear-gradient(to top, #4ade80, ${data.rpe > 13 ? '#facc15' : '#4ade80'}, ${data.rpe > 17 ? '#ef4444' : '#facc15'})`
                        }} />
                      </div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest">Categoria</div>
                      <div className="text-lg font-bold">{data.category}</div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setData(INITIAL_DATA);
                    setSubmitted(false);
                    setPage(1);
                  }}
                  className="w-full h-16 bg-zinc-100 hover:bg-white text-zinc-950 font-black rounded-2xl transition-all"
                >
                  NUOVA SESSIONE
                </button>
              </div>
            </PageWrapper>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PageWrapper(props: { children: React.ReactNode, key?: string }) {
  const { children } = props;
  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

// --- Specific Forms ---

interface FormProps {
  data: WorkoutData;
  updateData: (updates: Partial<WorkoutData>) => void;
  back: () => void;
  next: () => void;
}

function SpecificoForm({ data, updateData, back, next }: FormProps) {
  return (
    <div className="flex flex-col max-h-[85vh]">
      <div className="flex-1 overflow-y-auto px-1 space-y-4 pb-16 custom-scrollbar overscroll-contain">
        <div className="text-center space-y-0.5 mb-2">
          <span className="text-brand font-mono text-[9px] uppercase tracking-widest opacity-80">Dettaglio Sessione</span>
          <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Sport Specifico</h3>
        </div>

        <div className="space-y-6">
          {/* Disciplina */}
          <div className="space-y-2">
            <label className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider block text-center">
              Disciplina
            </label>
            <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto px-1">
              {['Slalom', 'Gigante', 'Velocità', 'Altro'].map(d => (
                <button
                  key={d}
                  onClick={() => updateData({ discipline: d as any })}
                  className={cn(
                    "h-11 rounded-xl text-[11px] font-black border-2 transition-all active:scale-95",
                    data.discipline === d ? "bg-brand text-zinc-950 border-brand" : "bg-zinc-900 border-zinc-800 text-zinc-400"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Tipo */}
          <div className="space-y-2">
            <label className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider block text-center">Tipo Attività</label>
            <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto px-1">
              {['Libero', 'Addestram.', 'Specif.', 'Gara'].map(t => (
                <button
                  key={t}
                  onClick={() => updateData({ type: t as any })}
                  className={cn(
                    "h-11 rounded-xl text-[11px] font-black border-2 transition-all active:scale-95",
                    data.type === t ? "bg-brand text-zinc-950 border-brand" : "bg-zinc-900 border-zinc-800 text-zinc-400"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Rounds */}
          <div className="space-y-2 bg-zinc-900/40 p-4 rounded-3xl border border-zinc-800/50 max-w-xs mx-auto">
            <label className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-2">
               <Hash className="w-3 h-3 text-brand" /> Numero di Giri
            </label>
            <input 
              type="range" min="1" max="22" value={data.rounds || 1}
              onChange={e => updateData({ rounds: parseInt(e.target.value) })}
              className="w-full accent-brand h-6 cursor-pointer"
            />
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] text-zinc-600 font-mono">1</span>
              <div className="text-3xl font-black text-brand italic">{data.rounds || 1}</div>
              <span className="text-[10px] text-zinc-600 font-mono">22</span>
            </div>
          </div>

          {/* Manche Duration (ClockDial) */}
          <div className="space-y-2 flex flex-col items-center">
            <label className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider flex items-center gap-2 mb-1">
              <Timer className="w-3 h-3 text-brand" /> Durata Manche
            </label>
            <ClockDial 
              value={data.mancheDuration || 25} 
              min={25} 
              max={80} 
              onChange={v => updateData({ mancheDuration: v })} 
            />
          </div>

          {/* Session Duration */}
          <div className="space-y-2 max-w-xs mx-auto">
            <label className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-2">
              <Clock className="w-3 h-3 text-brand" /> Durata Seduta
            </label>
            <div className="flex flex-col items-center gap-2 bg-zinc-900/40 p-4 rounded-3xl border border-zinc-800/50 mx-2">
              <input 
                type="range" min="1" max="8" step="0.5" value={data.sessionDuration || 2}
                onChange={e => updateData({ sessionDuration: parseFloat(e.target.value) })}
                className="w-full accent-brand h-6 cursor-pointer"
              />
              <div className="text-2xl font-black text-zinc-100 italic">
                {data.sessionDuration || 2}<span className="text-brand text-xs ml-1">h</span>
              </div>
            </div>
          </div>

          {/* Richiesta */}
          <div className="space-y-2 max-w-xs mx-auto px-2">
            <label className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider block text-center">Focus</label>
            <div className="flex flex-wrap justify-center gap-1.5">
              {['Tecnica', 'Tattica', 'Perf.', 'Svago'].map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    const current = data.requests || [];
                    updateData({ requests: current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag] });
                  }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[9px] font-black border-2 transition-all active:scale-95",
                    data.requests?.includes(tag) ? "bg-brand text-zinc-950 border-brand" : "bg-zinc-900 border-zinc-800 text-zinc-400"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Riassunto */}
          <div className="space-y-2 max-w-xs mx-auto px-2">
            <label className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider block text-center">Note</label>
            <textarea
              value={data.summary || ''}
              onChange={e => updateData({ summary: e.target.value })}
              placeholder="Com'è andata?"
              className="w-full h-20 bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-4 text-[11px] focus:border-brand focus:outline-none transition-colors resize-none shadow-inner"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4 bg-zinc-950/80 backdrop-blur-md border-t border-zinc-900 mt-auto px-2 pb-2">
        <button onClick={back} className="w-14 h-14 bg-zinc-900 border-2 border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={next} className="flex-1 h-14 bg-brand hover:bg-brand-dark text-zinc-950 font-black rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(189,255,0,0.3)] transition-all uppercase italic text-sm">
          RIEPILOGO <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function AltroForm({ data, updateData, back, next }: FormProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <span className="text-brand font-mono text-xs uppercase tracking-widest">Dettaglio</span>
        <h3 className="text-3xl font-black text-white italic uppercase">Altro Sport</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Cosa hai fatto?</label>
          <input
            type="text"
            value={data.description || ''}
            onChange={e => updateData({ description: e.target.value })}
            placeholder="Esempio: Bici, Corsa, Nuoto..."
            className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-white focus:border-brand focus:outline-none"
          />
        </div>

        <div className="space-y-4">
          <label className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Quanto è stato divertente?</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { v: 0, l: 'Brutto', e: '😞' },
              { v: 1, l: 'Neutro', e: '😐' },
              { v: 2, l: 'Bello', e: '😊' },
              { v: 3, l: 'Top', e: '🤩' }
            ].map(f => (
              <button
                key={f.v}
                onClick={() => updateData({ funFactor: f.v })}
                className={cn(
                  "flex flex-col items-center justify-center py-3 rounded-2xl border transition-all gap-1",
                  data.funFactor === f.v ? "bg-brand text-zinc-950 border-brand" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                )}
              >
                <span className="text-2xl">{f.e}</span>
                <span className="text-[10px] font-black uppercase">{f.l}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-zinc-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-3 h-3" /> Durata Seduta (h)
          </label>
          <div className="flex items-center gap-4">
            <input 
              type="range" min="2" max="8" step="0.5" value={data.sessionDuration || 2}
              onChange={e => updateData({ sessionDuration: parseFloat(e.target.value) })}
              className="flex-1 accent-brand"
            />
            <div className="w-16 text-center font-black text-zinc-100 bg-zinc-900 p-2 rounded-lg border border-zinc-800">
              {data.sessionDuration || 2}h
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={back} className="w-16 h-16 bg-zinc-900 border-2 border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={next} disabled={!data.description} className="flex-1 h-16 bg-brand disabled:opacity-50 text-zinc-950 font-black rounded-2xl flex items-center justify-center gap-2">
          RIEPILOGO <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

function PreparazioneForm({ data, updateData, back, next }: FormProps) {
  const levels = ['Assente', 'Basso', 'Normale', 'Alto', 'Estremo'];
  const types = ['Forza', 'Pliometria', 'Esplosività', 'Parte Alta', 'Addome', 'Coordinazione', 'Equilibrio', 'Resistenza'];

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto px-1 custom-scrollbar">
      <div className="space-y-1">
        <span className="text-brand font-mono text-xs uppercase tracking-widest">Dettaglio</span>
        <h3 className="text-3xl font-black text-white italic uppercase">Prep. Atletica</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Tipologia (Seleziona 1 o 2)</label>
          <div className="grid grid-cols-2 gap-2">
            {types.map(t => (
              <button
                key={t}
                onClick={() => {
                  const current = data.prepTypes || [];
                  if (current.includes(t)) {
                    updateData({ prepTypes: current.filter(x => x !== t) });
                  } else if (current.length < 2) {
                    updateData({ prepTypes: [...current, t] });
                  }
                }}
                className={cn(
                  "h-12 rounded-xl text-xs font-bold border transition-all px-2 text-center",
                  data.prepTypes?.includes(t) ? "bg-brand text-zinc-950 border-brand" : "bg-zinc-900 border-zinc-800 text-zinc-400"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-zinc-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3" /> Intensità
            </label>
            <div className="space-y-1">
            {levels.map((l, i) => {
              const bgColors = ['bg-zinc-900', 'bg-green-950/40', 'bg-yellow-950/40', 'bg-orange-950/40', 'bg-red-950/40'];
              const activeColors = ['bg-zinc-700', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500'];
              return (
                <button
                  key={l}
                  onClick={() => updateData({ intensity: i })}
                  className={cn(
                    "w-full py-2.5 rounded-lg text-[10px] font-black uppercase text-center border transition-all",
                    data.intensity === i 
                      ? `${activeColors[i]} text-zinc-950 border-white/20` 
                      : `${bgColors[i]} border-zinc-800 text-zinc-500`
                  )}
                >
                  {i} - {l}
                </button>
              );
            })}
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-zinc-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3" /> Volume
            </label>
            <div className="space-y-1">
            {levels.map((l, i) => {
              const bgColors = ['bg-zinc-900', 'bg-blue-950/40', 'bg-indigo-950/40', 'bg-violet-950/40', 'bg-fuchsia-950/40'];
              const activeColors = ['bg-zinc-700', 'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-fuchsia-500'];
              return (
                <button
                  key={l}
                  onClick={() => updateData({ volume: i })}
                  className={cn(
                    "w-full py-2.5 rounded-lg text-[10px] font-black uppercase text-center border transition-all",
                    data.volume === i 
                      ? `${activeColors[i]} text-zinc-950 border-white/20` 
                      : `${bgColors[i]} border-zinc-800 text-zinc-500`
                  )}
                >
                  {i} - {l}
                </button>
              );
            })}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-zinc-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-3 h-3" /> Durata Seduta (min)
          </label>
          <div className="flex items-center gap-4">
            <input 
              type="range" min="30" max="180" step="10" value={data.sessionDuration || 60}
              onChange={e => updateData({ sessionDuration: parseInt(e.target.value) })}
              className="flex-1 accent-brand"
            />
            <div className="w-20 text-center font-black text-zinc-100 bg-zinc-900 p-2 rounded-lg border border-zinc-800">
              {data.sessionDuration || 60} min
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4 sticky bottom-0 bg-zinc-950 pb-2">
        <button onClick={back} className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={next} disabled={!data.prepTypes?.length} className="flex-1 h-14 bg-brand disabled:opacity-50 text-zinc-950 font-black rounded-xl flex items-center justify-center gap-2">
          RIEPILOGO <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
