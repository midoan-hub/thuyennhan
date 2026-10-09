/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  auth, 
  db, 
  googleProvider, 
  handleFirestoreError, 
  OperationType 
} from './firebase';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { FlashcardsSection } from './components/FlashcardsSection';
import { PitchDeckGame } from './components/PitchDeckGame';
import { ProfileSection } from './components/ProfileSection';
import { ToastNotification, ToastInfo } from './components/ToastNotification';
import { UserProfileData, ActiveTab } from './types';
import { VOCAB_DATA, BADGES_LIST } from './data/vocabData';
import { Sparkles, PenTool } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'estatelex_local_user_data_v1';

const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

const getYesterdayString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

const createInitialUserData = (uid: string = 'guest_user'): UserProfileData => ({
  userId: uid,
  displayName: 'Nhà Phát Triển BĐS',
  email: '',
  photoURL: '',
  devCoins: 25,
  streak: 1,
  lastActiveDate: getTodayString(),
  learnedWords: [],
  badges: [],
  highScore: 0,
  unlockedTitles: ['title_intern'],
  currentTitle: 'title_intern',
  updatedAt: new Date().toISOString()
});

export default function App() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserProfileData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    return createInitialUserData();
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('learn');
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [, startTransition] = useTransition();

  const addToast = useCallback((message: string, type: ToastInfo['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev.slice(-3), { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [userData]);

  // Auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);

      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);

        try {
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const cloudData = docSnap.data() as UserProfileData;
            const today = getTodayString();
            const yesterday = getYesterdayString();
            let newStreak = cloudData.streak || 1;

            if (cloudData.lastActiveDate === yesterday) {
              newStreak += 1;
            } else if (cloudData.lastActiveDate !== today) {
              newStreak = 1;
            }

            const mergedData: UserProfileData = {
              ...cloudData,
              userId: currentUser.uid,
              displayName: currentUser.displayName || cloudData.displayName || 'Nhà Phát Triển BĐS',
              email: currentUser.email || cloudData.email || '',
              photoURL: currentUser.photoURL || cloudData.photoURL || '',
              streak: newStreak,
              lastActiveDate: today,
              updatedAt: new Date().toISOString()
            };

            setUserData(mergedData);
            await setDoc(userDocRef, mergedData, { merge: true });
          } else {
            const initial: UserProfileData = {
              ...userData,
              userId: currentUser.uid,
              displayName: currentUser.displayName || 'Nhà Phát Triển BĐS',
              email: currentUser.email || '',
              photoURL: currentUser.photoURL || '',
              lastActiveDate: getTodayString(),
              updatedAt: new Date().toISOString()
            };

            setUserData(initial);
            await setDoc(userDocRef, initial);
            addToast('Chào mừng bạn! Đã kích hoạt lưu trữ đám mây Firebase.', 'success');
          }
        } catch (error) {
          console.error('Error fetching/setting user document:', error);
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
        }
      }
    });

    return () => unsubscribe();
  }, [addToast]);

  // Real-time snapshot listener when signed in with Firebase
  useEffect(() => {
    if (!firebaseUser) return;

    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfileData;
        setUserData(prev => ({
          ...prev,
          ...data
        }));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
    });

    return () => unsubscribe();
  }, [firebaseUser]);

  // Central persistence updater
  const updateUserData = useCallback(async (updates: Partial<UserProfileData>) => {
    setUserData(prev => {
      const next: UserProfileData = {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      const currentBadges = new Set(next.badges || []);
      const newlyEarnedBadges: string[] = [];

      if (next.learnedWords.length >= 1 && !currentBadges.has('b_first_blood')) {
        newlyEarnedBadges.push('b_first_blood');
      }
      if (next.learnedWords.length >= 5 && !currentBadges.has('b_scholar')) {
        newlyEarnedBadges.push('b_scholar');
      }
      if (next.learnedWords.length >= 10 && !currentBadges.has('b_cmo')) {
        newlyEarnedBadges.push('b_cmo');
      }
      if (next.learnedWords.length >= VOCAB_DATA.length && !currentBadges.has('b_master')) {
        newlyEarnedBadges.push('b_master');
      }
      if (next.highScore > 0 && !currentBadges.has('b_first_pitch')) {
        newlyEarnedBadges.push('b_first_pitch');
      }
      if (next.highScore >= 8 && !currentBadges.has('b_pitch_sharp')) {
        newlyEarnedBadges.push('b_pitch_sharp');
      }
      if (next.highScore === 10 && !currentBadges.has('b_pitch_perfect')) {
        newlyEarnedBadges.push('b_pitch_perfect');
      }
      if (next.devCoins >= 100 && !currentBadges.has('b_wealth_100')) {
        newlyEarnedBadges.push('b_wealth_100');
      }
      if (next.devCoins >= 300 && !currentBadges.has('b_wealth_300')) {
        newlyEarnedBadges.push('b_wealth_300');
      }
      if (next.devCoins >= 500 && !currentBadges.has('b_wealth_500')) {
        newlyEarnedBadges.push('b_wealth_500');
      }
      if (next.streak >= 2 && !currentBadges.has('b_streak_hero')) {
        newlyEarnedBadges.push('b_streak_hero');
      }

      if (newlyEarnedBadges.length > 0) {
        newlyEarnedBadges.forEach(bId => {
          currentBadges.add(bId);
          const badgeMeta = BADGES_LIST.find(b => b.id === bId);
          addToast(`Mở khóa danh hiệu: ${badgeMeta ? badgeMeta.name : bId}`, 'badge');
        });
        next.badges = Array.from(currentBadges);
      }

      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        const ref = doc(db, 'users', uid);
        setDoc(ref, next, { merge: true }).catch((err) => {
          handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
        });
      }

      return next;
    });
  }, [addToast]);

  const handleAwardCoins = useCallback((amount: number, reason: string) => {
    updateUserData({
      devCoins: Math.max(0, (userData.devCoins || 0) + amount)
    });
    addToast(`+${amount} Xu DevCoins (${reason})`, 'coins');
  }, [userData.devCoins, updateUserData, addToast]);

  const handleToggleLearned = useCallback((wordId: string) => {
    const isAlreadyLearned = userData.learnedWords.includes(wordId);
    let nextLearned: string[];

    if (isAlreadyLearned) {
      nextLearned = userData.learnedWords.filter(id => id !== wordId);
      updateUserData({ learnedWords: nextLearned });
      addToast('Đã bỏ đánh dấu từ này', 'info');
    } else {
      nextLearned = [...userData.learnedWords, wordId];
      updateUserData({ 
        learnedWords: nextLearned,
        devCoins: (userData.devCoins || 0) + 15
      });
      addToast('+15 DevCoins! Đã ghi nhớ thành công từ mới.', 'coins');
    }
  }, [userData.learnedWords, userData.devCoins, updateUserData, addToast]);

  const handleUpdateHighScore = useCallback((newScore: number) => {
    if (newScore > (userData.highScore || 0)) {
      updateUserData({ highScore: newScore });
      addToast(`Kỷ lục Pitch Deck mới: ${newScore}/10 điểm!`, 'success');
    }
  }, [userData.highScore, updateUserData, addToast]);

  const handleUnlockTitle = useCallback((titleId: string, cost: number) => {
    if (cost > 0 && userData.devCoins < cost) {
      addToast('Bạn chưa đủ DevCoins trong kho xu!', 'info');
      return;
    }

    const currentUnlocked = new Set(userData.unlockedTitles || ['title_intern']);
    currentUnlocked.add(titleId);

    const newCoins = Math.max(0, userData.devCoins - cost);
    updateUserData({
      devCoins: newCoins,
      unlockedTitles: Array.from(currentUnlocked),
      currentTitle: titleId
    });

    addToast('Chúc mừng bạn đã thăng cấp chức danh mới!', 'success');
  }, [userData.devCoins, userData.unlockedTitles, updateUserData, addToast]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      addToast('Đăng nhập Google thành công! Tiến độ đã được đồng bộ.', 'success');
    } catch (error) {
      console.error('Google Sign-In error:', error);
      addToast('Chưa hoàn tất đăng nhập. Tiếp tục ở chế độ khách.', 'info');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setFirebaseUser(null);
      addToast('Đã đăng xuất tài khoản. Đang ở chế độ khách.', 'info');
    } catch (error) {
      console.error('Sign Out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] bg-grid-paper text-stone-800 flex flex-col selection:bg-amber-200 selection:text-stone-900">
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => startTransition(() => setActiveTab(tab))}
        userData={userData}
        isFirebaseUser={!!firebaseUser}
        onGoogleSignIn={handleGoogleSignIn}
      />

      <ToastNotification toasts={toasts} onDismiss={removeToast} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8 pb-24 md:pb-12">
        {/* Playful Hand-Drawn Notebook Header Banner */}
        <div className="text-center max-w-2xl mx-auto mb-6 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 border-2 border-stone-800 text-stone-800 text-xs font-sketch font-bold shadow-[2px_2px_0px_0px_#292524] rotate-[-1deg]">
            <PenTool className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Sổ tay Phác họa Từ vựng Bất Động Sản</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-sketch font-bold text-stone-900 tracking-wide mt-1">
            {activeTab === 'learn' && 'Sổ Tay Từ Vựng & Thẻ Học Lật 3D'}
            {activeTab === 'pitch' && 'Bàn Thuyết Trình Pitch Deck Thực Chiến'}
            {activeTab === 'profile' && 'Hồ Sơ Nhà Phát Triển & Kho Huy Hiệu'}
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 font-sans max-w-xl mx-auto">
            {activeTab === 'learn' && 'Học và ghi nhớ các thuật ngữ tiếng Anh đắt giá trong quy hoạch dự án, chiến dịch mở bán và bản tin nhà đầu tư.'}
            {activeTab === 'pitch' && 'Hóa thân thành Trưởng ban Marketing và giải quyết các câu hỏi hóc búa trước Hội đồng Đầu tư.'}
            {activeTab === 'profile' && 'Theo dõi kho DevCoins, chuỗi ngày rèn luyện liên tục và mở khóa các chức danh thăng tiến.'}
          </p>
        </div>

        {/* Tab Views */}
        {activeTab === 'learn' && (
          <FlashcardsSection
            learnedWords={userData.learnedWords}
            onToggleLearned={handleToggleLearned}
            onAwardCoins={handleAwardCoins}
          />
        )}

        {activeTab === 'pitch' && (
          <PitchDeckGame
            onAwardCoins={handleAwardCoins}
            onUpdateHighScore={handleUpdateHighScore}
            currentHighScore={userData.highScore || 0}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileSection
            userData={userData}
            isFirebaseUser={!!firebaseUser}
            onGoogleSignIn={handleGoogleSignIn}
            onSignOut={handleSignOut}
            onUnlockTitle={handleUnlockTitle}
          />
        )}
      </main>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
