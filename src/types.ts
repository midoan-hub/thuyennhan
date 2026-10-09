export interface UserProfileData {
  userId: string;
  displayName: string;
  email: string;
  photoURL: string;
  devCoins: number;
  streak: number;
  lastActiveDate: string;
  learnedWords: string[];
  badges: string[];
  highScore: number;
  unlockedTitles?: string[];
  currentTitle?: string;
  updatedAt?: string;
}

export type ActiveTab = 'learn' | 'pitch' | 'library' | 'profile';
