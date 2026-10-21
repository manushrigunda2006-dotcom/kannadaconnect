import React from 'react';
import { Home, Compass, MessageSquare, Mic, AlertTriangle, Award } from 'lucide-react';

export type NavTab = 'home' | 'learn' | 'simulator' | 'pronounce' | 'quizzes' | 'quickhelp' | 'progress';

interface MobileBottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  savedCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'learn' as NavTab, label: 'Learn', icon: Compass },
    { id: 'simulator' as NavTab, label: 'Role-Play', icon: MessageSquare },
    { id: 'pronounce' as NavTab, label: 'Studio', icon: Mic },
    { id: 'quickhelp' as NavTab, label: 'Help', icon: AlertTriangle, isAlert: true },
    { id: 'progress' as NavTab, label: 'Progress', icon: Award },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                isActive
                  ? tab.isAlert
                    ? 'text-rose-600 font-bold'
                    : 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
              {isActive && (
                <div
                  className={`w-1 h-1 rounded-full absolute -bottom-0.5 ${
                    tab.isAlert ? 'bg-rose-600' : 'bg-blue-600'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
