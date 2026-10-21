import React, { useState } from 'react';
import type { AppSettings, InterfaceLanguage, DifficultyLevel } from '../types';
import { X, Globe, Gauge, Eye, RotateCcw, Sparkles, Check, AlertTriangle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onResetAllData: () => void;
  onLoadJudgeDemo: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetAllData,
  onLoadJudgeDemo,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleLanguageChange = (lang: InterfaceLanguage) => {
    onUpdateSettings({ ...settings, language: lang });
  };

  const handleDifficultyChange = (diff: 'all' | DifficultyLevel) => {
    onUpdateSettings({ ...settings, difficultyFilter: diff });
  };

  const handleSpeedChange = (rate: number) => {
    onUpdateSettings({ ...settings, speechRate: rate });
  };

  const toggleReducedMotion = () => {
    onUpdateSettings({ ...settings, reducedMotion: !settings.reducedMotion });
  };

  const toggleHighContrast = () => {
    onUpdateSettings({ ...settings, highContrast: !settings.highContrast });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              ⚙️
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-sans">Settings & Preferences</h3>
              <p className="text-xs text-slate-500">Interface language, audio speed & accessibility</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* 1. Interface Language */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Interface Language (UI Labels)</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { code: 'en', label: 'English', sub: 'Default' },
                { code: 'kn', label: 'ಕನ್ನಡ', sub: 'Kannada' },
                { code: 'hi', label: 'हिंदी', sub: 'Hindi' },
                { code: 'te', label: 'తెలుగు', sub: 'Telugu' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code as InterfaceLanguage)}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    settings.language === lang.code
                      ? 'border-blue-600 bg-blue-50/70 text-blue-950 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold">{lang.label}</p>
                    <p className="text-[11px] text-slate-500">{lang.sub}</p>
                  </div>
                  {settings.language === lang.code && <Check className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
            </div>
            {settings.language !== 'en' && (
              <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                Notice: Primary navigation and UI headings are translated into your chosen language. The learning phrases preserve native Kannada script with Romanised syllables.
              </p>
            )}
          </div>

          {/* 2. Audio Playback Speed */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              <Gauge className="w-4 h-4 text-blue-600" />
              <span>Text-to-Speech Pace</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 0.7, label: 'Slow (0.7x)', desc: 'Learner' },
                { val: 0.85, label: 'Natural (0.85x)', desc: 'Balanced' },
                { val: 1.0, label: 'Normal (1.0x)', desc: 'Fluent' },
              ].map((s) => (
                <button
                  key={s.val}
                  onClick={() => handleSpeedChange(s.val)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    settings.speechRate === s.val
                      ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-xs font-bold">{s.label}</p>
                  <p className="text-[10px] text-slate-500">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Difficulty Level Filter */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              <span>Default Phrase Difficulty Filter</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 'all', label: 'All Levels' },
                { val: 'beginner', label: 'Beginner' },
                { val: 'essential', label: 'Essential Only' },
              ].map((d) => (
                <button
                  key={d.val}
                  onClick={() => handleDifficultyChange(d.val as any)}
                  className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                    settings.difficultyFilter === d.val
                      ? 'border-blue-600 bg-blue-50 text-blue-950'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Accessibility Toggles */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Accessibility</span>
            </label>
            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                <div>
                  <p className="text-xs font-bold text-slate-800">Reduced Motion</p>
                  <p className="text-[11px] text-slate-500">Disable celebratory confetti and spring animations</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={toggleReducedMotion}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                <div>
                  <p className="text-xs font-bold text-slate-800">High Contrast Mode</p>
                  <p className="text-[11px] text-slate-500">Sharpen font contrast and card borders</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={toggleHighContrast}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* 5. Judge Demo & Data Reset */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
              Hackathon Demo & Data
            </span>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  onLoadJudgeDemo();
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Load Demo Profile</span>
              </button>

              <button
                onClick={() => setShowConfirmReset(true)}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-700 text-xs font-bold transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs"
          >
            Done
          </button>
        </div>
      </div>

      {/* Safety Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center border border-slate-200 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Clear All Stored Data?</h4>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              This will remove all saved phrases in your pocketbook and reset all practice progress back to 0.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetAllData();
                  setShowConfirmReset(false);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
