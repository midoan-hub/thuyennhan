import React, { useState } from 'react';
import { 
  User, 
  Coins, 
  Flame, 
  Trophy, 
  Award, 
  Lock, 
  LogIn, 
  LogOut, 
  Cloud, 
  CloudOff, 
  ShieldCheck, 
  Sparkles,
  Building,
  Briefcase,
  Check
} from 'lucide-react';
import { BADGES_LIST, TITLE_REWARDS, VOCAB_DATA } from '../data/vocabData';
import { UserProfileData } from '../types';

interface ProfileSectionProps {
  userData: UserProfileData;
  isFirebaseUser: boolean;
  onGoogleSignIn: () => void;
  onSignOut: () => void;
  onUnlockTitle: (titleId: string, cost: number) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  userData,
  isFirebaseUser,
  onGoogleSignIn,
  onSignOut,
  onUnlockTitle
}) => {
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const unlockedBadgeCount = userData.badges.length;
  const currentTitleObj = TITLE_REWARDS.find(t => t.id === userData.currentTitle) || TITLE_REWARDS[0];

  const filteredBadges = BADGES_LIST.filter(badge => {
    const isUnlocked = userData.badges.includes(badge.id);
    if (selectedBadgeFilter === 'unlocked') return isUnlocked;
    if (selectedBadgeFilter === 'locked') return !isUnlocked;
    return true;
  });

  const categoryStats = {
    'Planning & Design': { total: 0, learned: 0 },
    'Sales & Commercial': { total: 0, learned: 0 },
    'Investment & Finance': { total: 0, learned: 0 },
    'Legal & Milestone': { total: 0, learned: 0 },
  };

  VOCAB_DATA.forEach(word => {
    if (categoryStats[word.category]) {
      categoryStats[word.category].total += 1;
      if (userData.learnedWords.includes(word.id)) {
        categoryStats[word.category].learned += 1;
      }
    }
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Executive Profile Header Card - Hand-drawn Planner Style */}
      <div className="bg-[#fffdfa] border-2 border-stone-850 rounded-3xl p-6 sm:p-7 shadow-[5px_5px_0px_0px_#292524] relative overflow-hidden">
        {/* Top Washi Tape */}
        <div className="absolute -top-1 left-12 w-24 h-5 washi-tape rounded-sm rotate-[-2deg]" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            {userData.photoURL ? (
              <img
                src={userData.photoURL}
                alt={userData.displayName}
                className="w-18 h-18 rounded-2xl border-2 border-stone-850 object-cover shadow-[2px_2px_0px_0px_#292524]"
              />
            ) : (
              <div className="w-18 h-18 rounded-2xl bg-amber-100 border-2 border-stone-850 flex items-center justify-center text-stone-800 shadow-[2px_2px_0px_0px_#292524]">
                <User className="w-8 h-8 stroke-[2.2]" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-sketch font-bold text-stone-900">
                  {userData.displayName || 'Nhà Phát Triển Bất Động Sản'}
                </h2>
                {isFirebaseUser && (
                  <span title="Tài khoản Firebase đã đồng bộ đám mây">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 stroke-[2.2]" />
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-sketch font-bold px-2.5 py-0.5 rounded-md bg-yellow-200 text-stone-900 border border-stone-800">
                  {currentTitleObj.name}
                </span>
                <span className="text-xs text-stone-500 font-sans hidden sm:inline">
                  {userData.email || 'Chế độ khách (Lưu trên máy)'}
                </span>
              </div>

              {/* Cloud Sync Status */}
              <div className="flex items-center gap-1.5 text-xs font-sketch text-stone-500 mt-1.5">
                {isFirebaseUser ? (
                  <>
                    <Cloud className="w-3.5 h-3.5 text-emerald-600 stroke-[2.2]" />
                    <span className="text-emerald-700 font-bold">Đồng bộ Firebase Firestore đám mây</span>
                  </>
                ) : (
                  <>
                    <CloudOff className="w-3.5 h-3.5 text-stone-400 stroke-[2.2]" />
                    <span>Lưu tạm trên trình duyệt cục bộ</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Auth Action Button */}
          <div className="flex items-center gap-2">
            {isFirebaseUser ? (
              <button
                onClick={onSignOut}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border-2 border-stone-800 shadow-[2px_2px_0px_0px_#292524] text-xs font-sketch font-bold flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5"
              >
                <LogOut className="w-4 h-4 stroke-[2.2]" /> Đăng xuất
              </button>
            ) : (
              <button
                onClick={onGoogleSignIn}
                className="px-4 py-2.5 rounded-xl bg-amber-300 hover:bg-amber-200 text-stone-900 border-2 border-stone-800 shadow-[3px_3px_0px_0px_#292524] font-sketch text-sm font-bold flex items-center gap-2 active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <LogIn className="w-4 h-4 stroke-[2.2]" /> Đăng nhập Google để đồng bộ
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gamification Sticky Notes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-yellow-100 border-2 border-stone-850 p-4 rounded-2xl shadow-[3px_3px_0px_0px_#292524]">
          <div className="flex items-center gap-1.5 text-stone-700 text-xs font-sketch mb-1">
            <Coins className="w-4 h-4 text-amber-600 fill-amber-300 stroke-[2.2]" /> Kho DevCoins
          </div>
          <div className="text-3xl font-sketch font-bold text-stone-900">
            {userData.devCoins}
          </div>
          <span className="text-[11px] font-sketch text-stone-600 block mt-0.5">Xu tích lũy qua học & game</span>
        </div>

        <div className="bg-orange-100 border-2 border-stone-850 p-4 rounded-2xl shadow-[3px_3px_0px_0px_#292524]">
          <div className="flex items-center gap-1.5 text-stone-700 text-xs font-sketch mb-1">
            <Flame className="w-4 h-4 text-orange-600 fill-orange-400 stroke-[2.2]" /> Chuỗi học tập
          </div>
          <div className="text-3xl font-sketch font-bold text-stone-900">
            {userData.streak} <span className="text-sm font-normal">ngày</span>
          </div>
          <span className="text-[11px] font-sketch text-stone-600 block mt-0.5">Giữ vững phong độ hàng ngày</span>
        </div>

        <div className="bg-emerald-100 border-2 border-stone-850 p-4 rounded-2xl shadow-[3px_3px_0px_0px_#292524]">
          <div className="flex items-center gap-1.5 text-stone-700 text-xs font-sketch mb-1">
            <Trophy className="w-4 h-4 text-emerald-700 stroke-[2.2]" /> Từ vựng đã thuộc
          </div>
          <div className="text-3xl font-sketch font-bold text-stone-900">
            {userData.learnedWords.length} <span className="text-sm font-normal text-stone-500">/{VOCAB_DATA.length}</span>
          </div>
          <span className="text-[11px] font-sketch text-stone-600 block mt-0.5">
            {Math.round((userData.learnedWords.length / VOCAB_DATA.length) * 100)}% toàn bộ sổ tay
          </span>
        </div>

        <div className="bg-purple-100 border-2 border-stone-850 p-4 rounded-2xl shadow-[3px_3px_0px_0px_#292524]">
          <div className="flex items-center gap-1.5 text-stone-700 text-xs font-sketch mb-1">
            <Award className="w-4 h-4 text-purple-700 stroke-[2.2]" /> Huy hiệu đạt được
          </div>
          <div className="text-3xl font-sketch font-bold text-stone-900">
            {unlockedBadgeCount} <span className="text-sm font-normal text-stone-500">/{BADGES_LIST.length}</span>
          </div>
          <span className="text-[11px] font-sketch text-stone-600 block mt-0.5">Chiến tích marketing</span>
        </div>
      </div>

      {/* Real Estate Categories Breakdown */}
      <div className="bg-[#fffdfa] border-2 border-stone-850 p-5 rounded-3xl shadow-[4px_4px_0px_0px_#292524] space-y-3.5">
        <h3 className="text-base font-sketch font-bold text-stone-900 flex items-center gap-1.5">
          <Building className="w-4 h-4 text-stone-800 stroke-[2.2]" /> Tiến độ theo từng mảng chuyên môn BĐS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(categoryStats).map(([catName, stat]) => {
            const pct = stat.total > 0 ? Math.round((stat.learned / stat.total) * 100) : 0;
            return (
              <div key={catName} className="bg-white border-2 border-stone-800 p-3 rounded-2xl shadow-[2px_2px_0px_0px_#292524]">
                <div className="flex justify-between items-center text-xs font-sketch mb-1.5">
                  <span className="font-bold text-stone-800 text-sm">{catName}</span>
                  <span className="font-bold text-stone-900 bg-yellow-100 border border-stone-400 px-1.5 py-0.2 rounded">
                    {stat.learned}/{stat.total} ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Executive Title Ranks (DevCoins Store) */}
      <div className="bg-[#fffdfa] border-2 border-stone-850 p-5 rounded-3xl shadow-[4px_4px_0px_0px_#292524] space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-sketch font-bold text-stone-900 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-stone-800 stroke-[2.2]" /> Thăng tiến chức danh trong ngành (Cửa hàng DevCoins)
          </h3>
          <span className="text-xs font-sketch font-bold text-stone-800 bg-yellow-200 border border-stone-800 px-2 py-0.5 rounded-lg flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-amber-600 fill-amber-300 stroke-[2.2]" /> Số dư: {userData.devCoins} xu
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TITLE_REWARDS.map(title => {
            const isUnlocked = (userData.unlockedTitles || ['title_intern']).includes(title.id);
            const isEquipped = (userData.currentTitle || 'title_intern') === title.id;
            const canAfford = userData.devCoins >= title.cost;

            return (
              <div
                key={title.id}
                className={`p-3.5 rounded-2xl border-2 border-stone-800 transition-all flex flex-col justify-between ${
                  isEquipped
                    ? 'bg-yellow-100 shadow-[3px_3px_0px_0px_#292524]'
                    : isUnlocked
                    ? 'bg-white shadow-[2px_2px_0px_0px_#292524]'
                    : 'bg-stone-50 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-sketch font-bold text-stone-900 text-base">{title.name}</h4>
                    {isEquipped && (
                      <span className="text-[10px] font-sketch px-1.5 py-0.5 rounded bg-stone-900 text-white font-bold uppercase">
                        Đang chọn
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-sans text-stone-600 mt-1">{title.perk}</p>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-dashed border-stone-300 flex items-center justify-between">
                  {isUnlocked ? (
                    isEquipped ? (
                      <span className="text-xs font-sketch font-bold text-emerald-800 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Đã kích hoạt
                      </span>
                    ) : (
                      <button
                        onClick={() => onUnlockTitle(title.id, 0)}
                        className="text-xs font-sketch text-stone-800 hover:text-black font-bold underline decoration-stone-600"
                      >
                        Đặt làm chức danh
                      </button>
                    )
                  ) : (
                    <button
                      disabled={!canAfford}
                      onClick={() => onUnlockTitle(title.id, title.cost)}
                      className={`px-3 py-1 rounded-xl text-xs font-sketch font-bold flex items-center gap-1 border-2 border-stone-800 transition-all ${
                        canAfford
                          ? 'bg-amber-300 hover:bg-amber-200 text-stone-900 shadow-[2px_2px_0px_0px_#292524] active:translate-x-0.5 active:translate-y-0.5'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5 stroke-[2.2]" />
                      {title.cost} Xu
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Showcase Gallery */}
      <div className="bg-[#fffdfa] border-2 border-stone-850 p-5 rounded-3xl shadow-[4px_4px_0px_0px_#292524] space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base font-sketch font-bold text-stone-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-stone-800 stroke-[2.2]" /> Bộ sưu tập Huy hiệu Marketing ({unlockedBadgeCount}/{BADGES_LIST.length})
          </h3>

          <div className="flex bg-stone-100 p-0.5 rounded-xl border-2 border-stone-800 text-xs font-sketch">
            {(['all', 'unlocked', 'locked'] as const).map(f => (
              <button
                key={f}
                onClick={() => setSelectedBadgeFilter(f)}
                className={`px-2.5 py-0.5 rounded-lg font-bold transition-colors ${
                  selectedBadgeFilter === f
                    ? 'bg-amber-300 text-stone-900 border border-stone-800'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {f === 'all' ? 'Tất cả' : f === 'unlocked' ? 'Đã đạt' : 'Chưa đạt'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredBadges.map(badge => {
            const isUnlocked = userData.badges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border-2 border-stone-800 text-center transition-all flex flex-col items-center justify-between ${
                  isUnlocked
                    ? 'bg-white shadow-[2px_2px_0px_0px_#292524]'
                    : 'bg-stone-100 opacity-60 grayscale'
                }`}
              >
                <div>
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 border-2 border-stone-800 flex items-center justify-center text-2xl mb-1.5 shadow-inner">
                    {badge.icon}
                  </div>
                  <h4 className="font-sketch font-bold text-stone-900 text-sm leading-tight mb-0.5">
                    {badge.name}
                  </h4>
                  <p className="text-[11px] font-sans text-stone-600 leading-tight line-clamp-2">
                    {badge.description}
                  </p>
                </div>

                <div className="mt-2.5">
                  {isUnlocked ? (
                    <span className="text-[11px] font-sketch font-bold text-emerald-800 bg-emerald-100 border border-emerald-400 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" /> Đã đạt
                    </span>
                  ) : (
                    <span className="text-[11px] font-sketch text-stone-500 bg-stone-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Lock className="w-3 h-3 stroke-[2.2]" /> Chưa mở
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
