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
    return 'Неизвестная ошибка. Попробуйте еще раз.';
  }

  switch (error.code) {
    case 'auth/invalid-email':
      return 'Некорректный формат email.';
    case 'auth/missing-password':
      return 'Введите пароль.';
    case 'auth/weak-password':
      return 'Слишком простой пароль. Минимум 6 символов.';
    case 'auth/email-already-in-use':
      return 'Пользователь с таким email уже существует.';
    case 'auth/invalid-credential':
      return 'Неверный email или пароль.';
    case 'auth/user-disabled':
      return 'Пользователь заблокирован.';
    case 'auth/too-many-requests':
      return 'Слишком много попыток. Попробуйте позже.';
    default:
      return `Ошибка авторизации: ${error.code}`;
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
