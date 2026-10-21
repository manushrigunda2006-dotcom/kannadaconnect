import React from 'react';
import { BookOpen, X, Sparkles, Heart } from 'lucide-react';

interface CultureGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CultureGuideModal: React.FC<CultureGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const numbers = [
    { num: '1', kn: 'ಒಂದು', phon: 'Ondu', en: 'One' },
    { num: '2', kn: 'ಎರಡು', phon: 'Eraḍu', en: 'Two' },
    { num: '3', kn: 'ಮೂರು', phon: 'Mūru', en: 'Three' },
    { num: '4', kn: 'ನಾಲ್ಕು', phon: 'Nālku', en: 'Four' },
    { num: '5', kn: 'ಐದು', phon: 'Aidu', en: 'Five' },
    { num: '6', kn: 'ಆರು', phon: 'Āru', en: 'Six' },
    { num: '7', kn: 'ಏಳು', phon: 'Ēḷu', en: 'Seven' },
    { num: '8', kn: 'ಎಂಟು', phon: 'Eṇṭu', en: 'Eight' },
    { num: '9', kn: 'ಒಂಬತ್ತು', phon: 'Ombattu', en: 'Nine' },
    { num: '10', kn: 'ಹತ್ತು', phon: 'Hattu', en: 'Ten' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="survival-guide-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div className="bg-[#FDFBF7] rounded-3xl border border-slate-300 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-blue-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="survival-guide-title" className="text-xl font-bold text-slate-950 font-sans">
                Everyday Kannada Cultural & Survival Guide
              </h2>
              <p className="text-xs text-slate-500">
                Core cultural etiquettes, respectful suffixes, and numbers that unlock genuine goodwill.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Close survival guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
          {/* Card 1: The Magic 'Ri' */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-2 text-blue-900 font-bold">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h3>The Golden Suffix: "ರೀ" (Ri)</h3>
            </div>
            <p className="leading-relaxed mb-3 text-xs sm:text-sm">
              In Karnataka, adding <strong>"ರೀ" (Ri)</strong> to greetings and questions instantly softens the tone and expresses genuine warmth and respect. It turns a functional transaction into a cordial human connection.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 font-mono text-[11px] block">Instead of plain "Hello":</span>
                <span className="font-kannada font-bold text-slate-900 text-sm">ನಮಸ್ಕಾರ ರೀ</span>
                <span className="text-blue-800 font-mono block">Namaskāra ri</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 font-mono text-[11px] block">Instead of blunt "Will you come?":</span>
                <span className="font-kannada font-bold text-slate-900 text-sm">ಬರ್ತೀರಾ ರೀ?</span>
                <span className="text-blue-800 font-mono block">Barthīrā ri?</span>
              </div>
            </div>
          </div>

          {/* Card 2: Essential Functional Verbs */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-2 text-blue-900 font-bold">
              <Heart className="w-4 h-4 text-rose-600" />
              <h3>Super-Verbs: "ಬೇಕು" (Bēku) vs "ಬೇಡ" (Bēḍa)</h3>
            </div>
            <p className="leading-relaxed mb-3 text-xs sm:text-sm">
              You can survive almost any market or restaurant interaction with these two powerhouse words:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="font-bold text-emerald-900 text-sm block">ಬೇಕು (Bēku) = I want / Need</span>
                <p className="text-emerald-800 mt-1">
                  Example: <em>"Nīru bēku"</em> (I need water), <em>"Ticket bēku"</em> (I need a ticket).
                </p>
              </div>
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
                <span className="font-bold text-rose-900 text-sm block">ಬೇಡ (Bēḍa) = Don't want / No thanks</span>
                <p className="text-rose-800 mt-1">
                  Example: <em>"Kāsu bēḍa"</em> (Don't need extra cost), <em>"Carry bag bēḍa"</em> (No bag needed).
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Numbers 1 through 10 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <h3 className="font-bold text-blue-900 mb-2">Everyday Numbers (ಅಂಕಿಗಳು - 1 to 10)</h3>
            <p className="text-xs text-slate-500 mb-3">
              Essential for checking auto meters, vegetable weights, and bus platform numbers.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {numbers.map((n) => (
                <div
                  key={n.num}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center"
                >
                  <span className="text-base font-extrabold text-blue-900 font-mono block">
                    {n.num}
                  </span>
                  <span className="font-kannada font-bold text-slate-900 text-sm block">
                    {n.kn}
                  </span>
                  <span className="text-xs font-mono text-slate-600 block">{n.phon}</span>
                  <span className="text-[10px] text-slate-400 block">{n.en}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Respectful Addressing */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <h3 className="font-bold text-blue-900 mb-2">Respectful Addressing: ನೀವು (Nīvu) vs ನೀನು (Nīnu)</h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Always use <strong>ನೀವು (Nīvu)</strong> when talking to elders, bus conductors, auto drivers, doctors, and coworkers. <strong>ನೀನು (Nīnu)</strong> is only used among close childhood friends or younger siblings. When in doubt, always default to <em>Nīvu</em>!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
