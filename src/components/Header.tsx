import React from 'react';
import type { NavTab } from './MobileBottomNav';
import type { InterfaceLanguage, UserAccount } from '../types';
import { TRANSLATIONS } from '../data/translations';
import {
  Bookmark,
  Sparkles,
  BookOpen,
  Award,
  Settings,
  AlertTriangle,
  Briefcase,
  Compass,
  MessageSquare,
  Mic,
  HelpCircle,
  Home,
  User,
} from 'lucide-react';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  savedCount: number;
  practicedCount: number;
  dailyGoal: number;
  xp: number;
  language: InterfaceLanguage;
  user?: UserAccount | null;
  onOpenAuthModal?: () => void;
  onOpenPocketbook: () => void;
  onOpenBackpack: () => void;
  onOpenSurprise: () => void;
  onOpenCultureGuide: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
  practicedCount,
  dailyGoal,
  xp,
  language,
  user,
  onOpenAuthModal,
  onOpenPocketbook,
  onOpenBackpack,
  onOpenSurprise,
  onOpenCultureGuide,
  onOpenSettings,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const goalAchieved = practicedCount >= dailyGoal;

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Row: Brand & Global Actions */}
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand Name */}
          <button
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 text-left focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-950 text-amber-400 flex items-center justify-center shadow-xs border border-blue-800">
              <span className="font-kannada font-bold text-2xl leading-none">ಕ</span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 font-sans">
                  {t.appName}
                </span>
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 uppercase tracking-wider font-mono">
                  Beta
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </button>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* XP Pill */}
            <div className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-bold shadow-2xs">
              <span>🏆</span>
              <span>{xp} XP</span>
            </div>

            {/* Daily Practice Count */}
            <button
              onClick={() => onSelectTab('progress')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-2xs ${
                goalAchieved
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Daily practice progress"
            >
              <Award className="w-4 h-4 text-emerald-700" />
              <span className="font-mono font-bold">
                {practicedCount}/{dailyGoal}
              </span>
              <span className="hidden xl:inline text-[11px] text-slate-500 font-normal">
                today
              </span>
            </button>

            {/* Surprise Me Phrase */}
            <button
              onClick={onOpenSurprise}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all shadow-2xs"
              title="Random phrase to practice"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{t.surpriseMe}</span>
            </button>

            {/* Survival Tips */}
            <button
              onClick={onOpenCultureGuide}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs"
              title="Survival grammar, numbers and etiquette"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-600" />
              <span>{t.survivalTips}</span>
            </button>

            {/* Trip Backpack */}
            <button
              onClick={onOpenBackpack}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs"
              title="Custom Trip Backpack"
            >
              <Briefcase className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Backpack</span>
            </button>

            {/* Pocketbook (Saved) */}
            <button
              onClick={onOpenPocketbook}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-950 hover:bg-blue-900 rounded-xl transition-all shadow-2xs"
              aria-label={`Open pocketbook with ${savedCount} saved phrases`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span className="hidden sm:inline">{t.pocketbook}</span>
              <span className="bg-blue-800 text-white text-[11px] font-mono px-1.5 py-0.2 rounded-full font-bold">
                {savedCount}
              </span>
            </button>

            {/* Profile / Sign In Action Button */}
            {user && !user.isGuest ? (
              <button
                onClick={() => onSelectTab('profile')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
                  user.isDemo
                    ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-950 ring-1 ring-amber-400'
                    : activeTab === 'profile'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                }`}
                title={user.isDemo ? "Judge Demo Profile Active" : "View your profile"}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  user.isDemo ? 'bg-amber-500 text-slate-950 font-black' : 'bg-blue-900 text-amber-300'
                }`}>
                  {user.isDemo ? '⚖️' : user.displayName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">
                  {user.isDemo ? 'Judge Demo' : user.displayName.split(' ')[0]}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-extrabold shadow-2xs transition-all cursor-pointer"
                  title="Open Judge Demo Account login"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Demo Login</span>
                </button>
                <button
                  onClick={onOpenAuthModal}
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  title="Sign in or create account to back up progress"
                >
                  <User className="w-3.5 h-3.5 text-blue-700" />
                  <span>Sign In</span>
                </button>
              </div>
            )}

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
              title="Settings & Accessibility"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Row: Navigation Tabs (Desktop) */}
        <div className="hidden md:flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          {[
            { id: 'home' as NavTab, label: t.navHome, icon: Home },
            { id: 'learn' as NavTab, label: t.navLearn, icon: Compass },
            { id: 'simulator' as NavTab, label: t.navSimulator, icon: MessageSquare },
            { id: 'pronounce' as NavTab, label: t.navPronounce, icon: Mic },
            { id: 'quizzes' as NavTab, label: t.navQuizzes, icon: HelpCircle },
            { id: 'quickhelp' as NavTab, label: t.navQuickHelp, icon: AlertTriangle, isAlert: true },
            { id: 'progress' as NavTab, label: t.navProgress, icon: Award },
            {
              id: 'profile' as NavTab,
              label: user && !user.isGuest ? user.displayName.split(' ')[0] : 'Profile',
              icon: User,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? tab.isAlert
                      ? 'bg-rose-900 text-white shadow-xs'
                      : 'bg-blue-600 text-white shadow-xs'
                    : tab.isAlert
                    ? 'text-rose-700 hover:bg-rose-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
