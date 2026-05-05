import { create } from 'zustand';
import { FirebaseError } from 'firebase/app';
import { signInEmail, registerEmail, signOut, onAuthStateChange } from '../firebase';

import type { User } from 'firebase/auth';

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  initAuthListener: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

let unsubscribeAuthListener: (() => void) | null = null;

function mapFirebaseError(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return 'РќРµРёР·РІРµСЃС‚РЅР°СЏ РѕС€РёР±РєР°. РџРѕРїСЂРѕР±СѓР№С‚Рµ РµС‰Рµ СЂР°Р·.';
  }

  switch (error.code) {
    case 'auth/invalid-email':
      return 'РќРµРєРѕСЂСЂРµРєС‚РЅС‹Р№ С„РѕСЂРјР°С‚ email.';
    case 'auth/missing-password':
      return 'Р’РІРµРґРёС‚Рµ РїР°СЂРѕР»СЊ.';
    case 'auth/weak-password':
      return 'РЎР»РёС€РєРѕРј РїСЂРѕСЃС‚РѕР№ РїР°СЂРѕР»СЊ. РњРёРЅРёРјСѓРј 6 СЃРёРјРІРѕР»РѕРІ.';
    case 'auth/email-already-in-use':
      return 'РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ СЃ С‚Р°РєРёРј email СѓР¶Рµ СЃСѓС‰РµСЃС‚РІСѓРµС‚.';
    case 'auth/invalid-credential':
      return 'РќРµРІРµСЂРЅС‹Р№ email РёР»Рё РїР°СЂРѕР»СЊ.';
    case 'auth/user-disabled':
      return 'РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ Р·Р°Р±Р»РѕРєРёСЂРѕРІР°РЅ.';
    case 'auth/too-many-requests':
      return 'РЎР»РёС€РєРѕРј РјРЅРѕРіРѕ РїРѕРїС‹С‚РѕРє. РџРѕРїСЂРѕР±СѓР№С‚Рµ РїРѕР·Р¶Рµ.';
    default:
      return `РћС€РёР±РєР° Р°РІС‚РѕСЂРёР·Р°С†РёРё: ${error.code}`;
  }
}

function toAuthUser(user: User): AuthUser {
  if (!user) {
    throw new Error('User is null');
  }

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  };
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  initAuthListener: () => {
    if (unsubscribeAuthListener) {
      return;
    }

    set({ isLoading: true });

    unsubscribeAuthListener = onAuthStateChange((firebaseUser) => {
      if (firebaseUser) {
        set({
          user: toAuthUser(firebaseUser),
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
        return;
      }

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const user = await signInEmail(email, password);
      set({
        user: toAuthUser(user),
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({ isLoading: false, error: mapFirebaseError(error) });
      throw error;
    }
  },

  register: async (email, password, nickname) => {
    set({ isLoading: true, error: null });

    try {
      const user = await registerEmail(email, password, nickname);
      set({
        user: toAuthUser(user),
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({ isLoading: false, error: mapFirebaseError(error) });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      await signOut();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false, error: mapFirebaseError(error) });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
