import { create } from 'zustand';

export type AuthIntent = 'create-collection' | null;

interface AuthIntentStore {
  pendingIntent: AuthIntent;
  setIntent: (intent: Exclude<AuthIntent, null>) => void;
  consumeIntent: () => AuthIntent;
  clearIntent: () => void;
}

export const useAuthIntentStore = create<AuthIntentStore>((set, get) => ({
  pendingIntent: null,

  setIntent: (intent) => set({ pendingIntent: intent }),

  consumeIntent: () => {
    const intent = get().pendingIntent;
    set({ pendingIntent: null });
    return intent;
  },

  clearIntent: () => set({ pendingIntent: null }),
}));
