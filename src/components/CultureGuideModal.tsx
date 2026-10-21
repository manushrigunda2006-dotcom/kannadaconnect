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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-[#FDFBF7] rounded-3xl border border-stone-300 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 text-emerald-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="survival-guide-title" className="text-xl font-bold text-emerald-950">
                Quick Kannada Survival Tips
              </h2>
              <p className="text-xs text-stone-500">
                Core cultural codes and words that instantly unlock friendly conversations.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
            aria-label="Close survival guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-stone-700">
          {/* Card 1: The Magic 'Ri' */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-base">
              <Sparkles className="w-4 h-4 text-lime-600" />
              <h3>The Golden Suffix: "ರೀ" (Ri)</h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Adding <strong>"ri"</strong> (ರೀ) to greetings or verbs adds an instant layer of warmth,
              politeness, and respect. It is widely used when speaking to auto drivers, shopkeepers,
              and elders.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <p className="font-kannada font-bold text-sm text-emerald-950">ನಮಸ್ಕಾರ ರೀ</p>
                <p className="font-mono text-emerald-800">Namaskāra ri</p>
                <p className="text-stone-500">"Warm greetings, sir / ma'am"</p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <p className="font-kannada font-bold text-sm text-emerald-950">ಬನ್ನಿ ರೀ</p>
                <p className="font-mono text-emerald-800">Banni ri</p>
                <p className="text-stone-500">"Please do come in"</p>
              </div>
            </div>
          </div>

          {/* Card 2: Bēku vs Bēḍa */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="text-base font-bold text-emerald-950">
              Want vs Don't Want: "ಬೇಕು" (Bēku) & "ಬೇಡ" (Bēḍa)
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Two of the most useful functional words in all of Karnataka:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <p className="font-kannada font-bold text-base text-amber-950">ಬೇಕು (Bēku)</p>
                <p className="font-semibold text-amber-900 mt-0.5">I want / Need</p>
                <p className="text-stone-500 mt-1">
                  Example: <em>"Nanage coffee bēku"</em> (I want coffee).
                </p>
              </div>
              <div className="p-3 rounded-xl bg-stone-100 border border-stone-200">
                <p className="font-kannada font-bold text-base text-stone-950">ಬೇಡ (Bēḍa)</p>
                <p className="font-semibold text-stone-800 mt-0.5">I don't want / No need</p>
                <p className="text-stone-500 mt-1">
                  Example: <em>"Nanage bēḍa, svalpa sāku"</em> (I don't need, this is enough).
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Numbers 1-10 */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-emerald-950">
                Numbers 1 to 10 (ಅಂಕಿಗಳು - Fares & Counting)
              </h3>
              <span className="text-[11px] text-stone-500">Crucial for auto fares & kilos</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              {numbers.map((item) => (
                <div
                  key={item.num}
                  className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col items-center"
                >
                  <span className="text-stone-400 font-mono text-[10px] font-bold">
                    {item.num}
                  </span>
                  <span className="font-kannada font-bold text-base text-emerald-950 my-0.5">
                    {item.kn}
                  </span>
                  <span className="font-mono font-semibold text-emerald-800 text-[11px]">
                    {item.phon}
                  </span>
                  <span className="text-stone-500 text-[10px]">{item.en}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Respectful Pronouns */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="text-base font-bold text-emerald-950">
              Respectful Addressing: "ನೀವು" (Nīvu) vs "ನೀನು" (Nīnu)
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Always address strangers, shopkeepers, service workers, and professionals using{' '}
              <strong>"Nīvu"</strong> (polite/formal you) rather than <em>"Nīnu"</em> (which is only
              used for close friends or small kids).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Spoken with warmth in Namma Karnataka</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-xl text-xs transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};
