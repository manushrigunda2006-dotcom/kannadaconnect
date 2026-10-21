import React, { useState } from 'react';
import { Volume2, VolumeX, PhoneCall, ShieldAlert, AlertTriangle, Compass, HeartPulse, Bus, CreditCard, HelpCircle, Copy, CheckCheck } from 'lucide-react';
import { speakKannada, stopSpeech } from '../utils/speech';

interface QuickHelpPhrase {
  id: string;
  category: 'help' | 'medical' | 'directions' | 'transit' | 'money' | 'clarify';
  kannada: string;
  romanized: string;
  english: string;
  phoneticBreakdown: string;
  context: string;
}

const QUICK_HELP_PHRASES: QuickHelpPhrase[] = [
  // 1. HELP & SAFETY
  {
    id: 'qh-01',
    category: 'help',
    kannada: 'ದಯವಿಟ್ಟು ನನಗೆ ಸಹಾಯ ಮಾಡಿ!',
    romanized: 'Dayavittu nanage sahāya māḍi!',
    english: 'Please help me!',
    phoneticBreakdown: 'Da-ya-vit-tu na-na-ge sa-haa-ya maad-i!',
    context: 'Urgent call for assistance from passersby or police',
  },
  {
    id: 'qh-02',
    category: 'help',
    kannada: 'ಪೊಲೀಸ್ ಠಾಣೆ ಎಲ್ಲಿದೆ?',
    romanized: 'Police thāṇe ellide?',
    english: 'Where is the police station?',
    phoneticBreakdown: 'Po-lice thaa-ne el-li-de?',
    context: 'Locating law enforcement or seeking safety',
  },
  // 2. MEDICAL & HOSPITAL
  {
    id: 'qh-03',
    category: 'medical',
    kannada: 'ಹತ್ತಿರದಲ್ಲಿ ಆಸ್ಪತ್ರೆ ಎಲ್ಲಿದೆ?',
    romanized: 'Hattiradalli āspatre ellide?',
    english: 'Where is the nearest hospital?',
    phoneticBreakdown: 'Hat-ti-ra-dal-li aas-pat-re el-li-de?',
    context: 'Emergency medical navigation',
  },
  {
    id: 'qh-04',
    category: 'medical',
    kannada: 'ನನಗೆ ಹುಷಾರಿಲ್ಲ, ದಯವಿಟ್ಟು ಡಾಕ್ಟರ್ ಹತ್ರ ಕರ್ಕೊಂಡು ಹೋಗಿ',
    romanized: 'Nanage hushārilla, dayavittu doctor hatra karkoṇḍu hōgi',
    english: 'I am unwell, please take me to a doctor.',
    phoneticBreakdown: 'Na-na-ge hu-shaa-ril-la, da-ya-vit-tu doc-tor hat-ra kar-kon-du hoh-gi',
    context: 'Asking a driver or bystander for urgent medical transit',
  },
  {
    id: 'qh-05',
    category: 'medical',
    kannada: 'ನನಗೆ ಕುಡಿಯಲು ನೀರು ಬೇಕು',
    romanized: 'Nanage kuḍiyalu nīru bēku',
    english: 'I need water to drink.',
    phoneticBreakdown: 'Na-na-ge ku-di-ya-lu nee-ru bay-koo',
    context: 'Dehydration, fainting, or acute thirst',
  },
  // 3. DIRECTIONS
  {
    id: 'qh-06',
    category: 'directions',
    kannada: 'ನಾನು ದಾರಿ ತಪ್ಪಿದ್ದೇನೆ, ಇದು ಯಾವ ರಸ್ತೆ?',
    romanized: 'Nānu dāri tappiddēne, idu yāva raste?',
    english: 'I am lost, which road is this?',
    phoneticBreakdown: 'Naa-nu daa-ri tap-pid-day-ne, i-du yaa-va ras-te?',
    context: 'When lost in an unfamiliar neighbourhood',
  },
  {
    id: 'qh-07',
    category: 'directions',
    kannada: 'ಮೆಟ್ರೋ ನಿಲ್ದಾಣಕ್ಕೆ ಹೇಗೆ ಹೋಗಬೇಕು?',
    romanized: 'Metro nildāṇakke hēge hōgabēku?',
    english: 'How do I go to the metro station?',
    phoneticBreakdown: 'Me-tro nil-daa-nak-ke hay-ge hoh-ga-bay-koo?',
    context: 'Rapid transit wayfinding',
  },
  // 4. TRANSIT
  {
    id: 'qh-08',
    category: 'transit',
    kannada: 'ಈ ಬಸ್ ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಹೋಗುತ್ತಾ?',
    romanized: 'Ee bas Majestic-ge hōgutthā?',
    english: 'Does this bus go to Majestic?',
    phoneticBreakdown: 'Ee bas Ma-jes-tic-ge hoh-guth-thaa?',
    context: 'Confirming central transit route',
  },
  {
    id: 'qh-09',
    category: 'transit',
    kannada: 'ದಯವಿಟ್ಟು ಇಲ್ಲೇ ನಿಲ್ಲಿಸಿ!',
    romanized: 'Dayavittu illē nillisi!',
    english: 'Please stop right here!',
    phoneticBreakdown: 'Da-ya-vit-tu il-lay nil-li-si!',
    context: 'Signaling urgent drop or stopping the vehicle',
  },
  // 5. MONEY & PAYMENTS
  {
    id: 'qh-10',
    category: 'money',
    kannada: 'ಒಟ್ಟು ಎಷ್ಟು ಆಯ್ತು? ಯುಪಿಐ ಇದೆಯಾ?',
    romanized: 'Oṭṭu eshtu āytu? UPI ideyā?',
    english: 'How much total? Do you have UPI?',
    phoneticBreakdown: 'Ot-tu esh-tu aay-thu? U-P-I i-de-yaa?',
    context: 'Quick street checkout at any shop or taxi',
  },
  // 6. UNDERSTANDING
  {
    id: 'qh-11',
    category: 'clarify',
    kannada: 'ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ನಿಧಾನವಾಗಿ ಹೇಳಿ',
    romanized: 'Dayavittu svalpa nidhānavāgi hēḷi',
    english: 'Please speak a bit slowly.',
    phoneticBreakdown: 'Da-ya-vit-tu sval-pa ni-dhaa-na-vaa-gi hay-li',
    context: 'When native speech is too rapid to comprehend',
  },
  {
    id: 'qh-12',
    category: 'clarify',
    kannada: 'ನನಗೆ ಕನ್ನಡ ಸ್ವಲ್ಪ ಮಾತ್ರ ಬರುತ್ತೆ',
    romanized: 'Nanage Kannada svalpa mātra barutte',
    english: 'I know only a little Kannada.',
    phoneticBreakdown: 'Na-na-ge Kan-na-da sval-pa maa-tra ba-rut-te',
    context: 'Setting expectation courteously with local residents',
  },
];

export const QuickHelp: React.FC = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handlePlayAudio = async (phrase: QuickHelpPhrase) => {
    if (playingId === phrase.id) {
      stopSpeech();
      setPlayingId(null);
      return;
    }

    setPlayingId(phrase.id);
    await speakKannada(phrase.kannada, {
      rate: 0.82,
      onStart: () => setPlayingId(phrase.id),
      onEnd: () => setPlayingId(null),
      onError: () => setPlayingId(null),
    });
  };

  const handleCopy = async (phrase: QuickHelpPhrase) => {
    try {
      await navigator.clipboard.writeText(`${phrase.kannada} (${phrase.romanized}) - ${phrase.english}`);
      setCopiedId(phrase.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  const filtered = activeCategory === 'all'
    ? QUICK_HELP_PHRASES
    : QUICK_HELP_PHRASES.filter((p) => p.category === activeCategory);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Emergency Helpline Banner */}
      <div className="bg-rose-900 text-white rounded-3xl p-5 sm:p-6 mb-8 shadow-md border border-rose-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-800/80 text-rose-100 text-xs font-bold mb-2">
              <ShieldAlert className="w-4 h-4 text-rose-300" />
              Official Karnataka Emergency Numbers
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight font-sans">
              Immediate Safety & Emergency Services
            </h2>
            <p className="text-xs sm:text-sm text-rose-200 mt-1 max-w-xl">
              This app is a communication reference tool only. For acute medical, fire, or police emergencies, dial these toll-free helpline numbers immediately.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto">
            <a
              href="tel:112"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-center"
            >
              <PhoneCall className="w-4 h-4 text-amber-300 mb-1" />
              <span className="text-base font-black font-mono">112</span>
              <span className="text-[10px] text-rose-200 font-semibold uppercase">Police / All</span>
            </a>
            <a
              href="tel:108"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-center"
            >
              <HeartPulse className="w-4 h-4 text-rose-300 mb-1" />
              <span className="text-base font-black font-mono">108</span>
              <span className="text-[10px] text-rose-200 font-semibold uppercase">Ambulance</span>
            </a>
            <a
              href="tel:1091"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-center"
            >
              <ShieldAlert className="w-4 h-4 text-emerald-300 mb-1" />
              <span className="text-base font-black font-mono">1091</span>
              <span className="text-[10px] text-rose-200 font-semibold uppercase">Women Safety</span>
            </a>
            <a
              href="tel:103"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-center"
            >
              <Bus className="w-4 h-4 text-sky-300 mb-1" />
              <span className="text-base font-black font-mono">103</span>
              <span className="text-[10px] text-rose-200 font-semibold uppercase">Traffic Police</span>
            </a>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {[
          { id: 'all', label: 'All Emergency Phrases', icon: AlertTriangle },
          { id: 'help', label: 'Urgent Help', icon: ShieldAlert },
          { id: 'medical', label: 'Hospital & Health', icon: HeartPulse },
          { id: 'directions', label: 'Lost / Directions', icon: Compass },
          { id: 'transit', label: 'Bus & Metro', icon: Bus },
          { id: 'money', label: 'Payments & UPI', icon: CreditCard },
          { id: 'clarify', label: 'Speak Slowly', icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border shadow-xs ${
                activeCategory === tab.id
                  ? 'bg-rose-950 text-white border-rose-950 ring-2 ring-rose-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Phrase Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const isPlaying = playingId === item.id;
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-rose-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200">
                    {item.category}
                  </span>
                  <button
                    onClick={() => handleCopy(item)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Copy phrase"
                  >
                    {isCopied ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-kannada text-slate-900 leading-snug mb-1">
                  {item.kannada}
                </h3>
                <p className="text-sm font-semibold font-mono text-rose-900 mb-1">
                  {item.romanized}
                </p>
                <p className="text-xs text-slate-400 font-sans mb-2">
                  Breakdown: {item.phoneticBreakdown}
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  "{item.english}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {item.context}
                </span>
                <button
                  onClick={() => handlePlayAudio(item)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all shadow-xs ${
                    isPlaying
                      ? 'bg-amber-600 animate-pulse'
                      : 'bg-rose-900 hover:bg-rose-800'
                  }`}
                >
                  {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Speaking' : 'Speak'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
