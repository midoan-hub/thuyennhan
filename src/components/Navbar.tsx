import React from 'react';
import { 
  Building2, 
  Flame, 
  Coins, 
  BookOpen, 
  Gamepad2, 
  User, 
  LogIn,
  PenTool
} from 'lucide-react';
import { ActiveTab, UserProfileData } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userData: UserProfileData;
  isFirebaseUser: boolean;
  onGoogleSignIn: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userData,
  isFirebaseUser,
  onGoogleSignIn
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fffdf9]/95 backdrop-blur-md border-b-2 border-stone-800 px-4 py-2.5 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Logo - Hand-Drawn Architectural Sketch Style */}
        <div 
          onClick={() => setActiveTab('learn')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 border-2 border-stone-800 shadow-[2px_2px_0px_0px_#292524] flex items-center justify-center text-stone-800 group-hover:-translate-y-0.5 transition-transform">
            <Building2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-sketch font-bold text-2xl tracking-wide text-stone-800">
                Estate<span className="text-amber-600 underline decoration-wavy decoration-amber-400">Lex</span>
              </span>
              <span className="text-[11px] font-sketch px-1.5 py-0.2 rounded bg-amber-200/70 text-stone-800 border border-stone-800 font-bold hidden sm:inline rotate-[-2deg]">
                Sketchbook
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-hand -mt-1 hidden sm:block">
              Từ vựng Marketing Bất động sản · Phác họa chì
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs (Desktop) */}
        <div className="hidden md:flex items-center gap-2 bg-stone-100/90 p-1 rounded-2xl border-2 border-stone-800 shadow-[2px_2px_0px_0px_#292524]">
          <button
            onClick={() => setActiveTab('learn')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'learn'
                ? 'bg-amber-300 text-stone-900 border-2 border-stone-800 shadow-[2px_2px_0px_0px_#292524]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-4 h-4 stroke-[2.2]" />
            <span className="font-sketch text-sm">Thẻ từ vựng</span>
          </button>

          <button
            onClick={() => setActiveTab('pitch')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pitch'
                ? 'bg-amber-300 text-stone-900 border-2 border-stone-800 shadow-[2px_2px_0px_0px_#292524]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Gamepad2 className="w-4 h-4 stroke-[2.2]" />
            <span className="font-sketch text-sm">Pitch Deck Game</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-amber-300 text-stone-900 border-2 border-stone-800 shadow-[2px_2px_0px_0px_#292524]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <User className="w-4 h-4 stroke-[2.2]" />
            <span className="font-sketch text-sm">Hồ sơ & Huy hiệu</span>
          </button>
        </div>

        {/* Right Status Indicators (DevCoins, Streak, Auth) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Flame Pill */}
          <div 
            title={`Chuỗi học liên tục: ${userData.streak} ngày`}
            className="flex items-center gap-1.5 bg-orange-100 border-2 border-stone-800 px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_#292524] text-xs font-sketch text-stone-800"
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-400 stroke-[2.2]" />
            <span className="font-bold text-sm">{userData.streak}</span>
            <span className="text-[11px] text-stone-600 hidden sm:inline">ngày</span>
          </div>

          {/* DevCoin Pill */}
          <div 
            title={`Kho DevCoins: ${userData.devCoins} xu`}
            className="flex items-center gap-1.5 bg-yellow-100 border-2 border-stone-800 px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_#292524] text-xs font-sketch text-stone-800"
          >
            <Coins className="w-4 h-4 text-amber-500 fill-amber-300 stroke-[2.2]" />
            <span className="font-bold text-sm">{userData.devCoins}</span>
          </div>

          {/* User Profile / Login Button */}
          {isFirebaseUser ? (
            <button
              onClick={() => setActiveTab('profile')}
              className="p-1 rounded-full border-2 border-stone-800 bg-white shadow-[2px_2px_0px_0px_#292524] hover:scale-105 transition-transform"
              title="Mở hồ sơ cá nhân"
            >
              {userData.photoURL ? (
                <img
                  src={userData.photoURL}
                  alt={userData.displayName}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-amber-200 text-stone-800 flex items-center justify-center text-xs font-bold font-sketch">
                  {userData.displayName ? userData.displayName[0] : 'U'}
                </div>
              )}
            </button>
          ) : (
            <button
              onClick={onGoogleSignIn}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border-2 border-stone-800 shadow-[2px_2px_0px_0px_#292524] text-xs font-bold transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              <LogIn className="w-3.5 h-3.5 stroke-[2.2]" />
              <span className="font-sketch text-sm">Đăng nhập</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
