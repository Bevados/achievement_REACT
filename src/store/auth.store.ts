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

const AUTH_ERROR_TEXT = {
  unknown: '\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u0430\u044f \u043e\u0448\u0438\u0431\u043a\u0430. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0435 \u0440\u0430\u0437.',
  invalidEmail: '\u041d\u0435\u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u044b\u0439 \u0444\u043e\u0440\u043c\u0430\u0442 email.',
  missingPassword: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u0430\u0440\u043e\u043b\u044c.',
  weakPassword:
    '\u0421\u043b\u0438\u0448\u043a\u043e\u043c \u043f\u0440\u043e\u0441\u0442\u043e\u0439 \u043f\u0430\u0440\u043e\u043b\u044c. \u041c\u0438\u043d\u0438\u043c\u0443\u043c 6 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432.',
  emailAlreadyInUse:
    '\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c \u0441 \u0442\u0430\u043a\u0438\u043c email \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442.',
  invalidCredential:
    '\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 email \u0438\u043b\u0438 \u043f\u0430\u0440\u043e\u043b\u044c.',
  userDisabled: '\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c \u0437\u0430\u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u043d.',
  tooManyRequests:
    '\u0421\u043b\u0438\u0448\u043a\u043e\u043c \u043c\u043d\u043e\u0433\u043e \u043f\u043e\u043f\u044b\u0442\u043e\u043a. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u043f\u043e\u0437\u0436\u0435.',
  authPrefix: '\u041e\u0448\u0438\u0431\u043a\u0430 \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u0430\u0446\u0438\u0438',
} as const;

let unsubscribeAuthListener: (() => void) | null = null;

function mapFirebaseError(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return AUTH_ERROR_TEXT.unknown;
  }

  switch (error.code) {
    case 'auth/invalid-email':
      return AUTH_ERROR_TEXT.invalidEmail;
    case 'auth/missing-password':
      return AUTH_ERROR_TEXT.missingPassword;
    case 'auth/weak-password':
      return AUTH_ERROR_TEXT.weakPassword;
    case 'auth/email-already-in-use':
      return AUTH_ERROR_TEXT.emailAlreadyInUse;
    case 'auth/invalid-credential':
      return AUTH_ERROR_TEXT.invalidCredential;
    case 'auth/user-disabled':
      return AUTH_ERROR_TEXT.userDisabled;
    case 'auth/too-many-requests':
      return AUTH_ERROR_TEXT.tooManyRequests;
    default:
      return `${AUTH_ERROR_TEXT.authPrefix}: ${error.code}`;
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
