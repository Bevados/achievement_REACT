import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FirebaseError } from 'firebase/app';

const firebaseMocks = vi.hoisted(() => ({
  signInEmail: vi.fn(),
  registerEmail: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChange: vi.fn(),
}));

vi.mock('../firebase', () => ({
  signInEmail: firebaseMocks.signInEmail,
  registerEmail: firebaseMocks.registerEmail,
  signOut: firebaseMocks.signOut,
  onAuthStateChange: firebaseMocks.onAuthStateChange,
}));

import { useAuthStore } from './auth.store';

function resetStore() {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false,
    error: null,
  });
}

describe('auth.store', () => {
  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
  });

  it('login stores authenticated user on success', async () => {
    firebaseMocks.signInEmail.mockResolvedValue({
      uid: 'uid-1',
      email: 'user@example.com',
      displayName: 'Alex',
    });

    await useAuthStore.getState().login('user@example.com', 'secret123');

    const state = useAuthStore.getState();
    expect(firebaseMocks.signInEmail).toHaveBeenCalledWith('user@example.com', 'secret123');
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.displayName).toBe('Alex');
    expect(state.error).toBeNull();
  });

  it('register forwards nickname to Firebase registration', async () => {
    firebaseMocks.registerEmail.mockResolvedValue({
      uid: 'uid-2',
      email: 'new@example.com',
      displayName: 'boromir',
    });

    await useAuthStore.getState().register('new@example.com', 'secret123', 'boromir');

    expect(firebaseMocks.registerEmail).toHaveBeenCalledWith(
      'new@example.com',
      'secret123',
      'boromir',
    );
    expect(useAuthStore.getState().user?.displayName).toBe('boromir');
  });

  it('maps Firebase login error to readable text', async () => {
    firebaseMocks.signInEmail.mockRejectedValue(
      new FirebaseError('auth/invalid-credential', 'Invalid credential'),
    );

    await expect(useAuthStore.getState().login('x@y.z', 'bad')).rejects.toBeTruthy();
    expect(useAuthStore.getState().error).toBe('Неверный email или пароль.');
  });
});
