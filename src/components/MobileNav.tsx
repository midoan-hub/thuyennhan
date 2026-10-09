import React from 'react';
import { BookOpen, Gamepad2, User } from 'lucide-react';
import { ActiveTab } from '../types';

interface MobileNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#fffdf9]/98 backdrop-blur-md border-t-2 border-stone-800 md:hidden px-3 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        <button
          onClick={() => setActiveTab('learn')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'learn'
              ? 'text-stone-900 bg-amber-200 border-2 border-stone-800 shadow-[2px_2px_0px_0px_#292524] -translate-y-0.5'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <BookOpen className="w-4 h-4 stroke-[2.2]" />
          <span className="font-sketch text-xs font-bold">Thẻ học</span>
        </button>

        <button
          onClick={() => setActiveTab('pitch')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'pitch'
              ? 'text-stone-900 bg-amber-200 border-2 border-stone-800 shadow-[2px_2px_0px_0px_#292524] -translate-y-0.5'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Gamepad2 className="w-4 h-4 stroke-[2.2]" />
          <span className="font-sketch text-xs font-bold">Pitch Deck</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'profile'
              ? 'text-stone-900 bg-amber-200 border-2 border-stone-800 shadow-[2px_2px_0px_0px_#292524] -translate-y-0.5'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <User className="w-4 h-4 stroke-[2.2]" />
          <span className="font-sketch text-xs font-bold">Hồ sơ</span>
        </button>
      </div>
    </nav>
  );
};
