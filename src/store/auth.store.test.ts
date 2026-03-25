import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FirebaseError } from 'firebase/app';

const firebaseMocks = vi.hoisted(() => ({
  signInEmail: vi.fn(),
  registerEmail: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChange: vi.fn(),
}));

const apiMocks = vi.hoisted(() => ({
  probeItemsEndpoint: vi.fn(),
}));

vi.mock('../firebase', () => ({
  signInEmail: firebaseMocks.signInEmail,
  registerEmail: firebaseMocks.registerEmail,
  signOut: firebaseMocks.signOut,
  onAuthStateChange: firebaseMocks.onAuthStateChange,
}));

vi.mock('../api/items.api', () => ({
  probeItemsEndpoint: apiMocks.probeItemsEndpoint,
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
    // ПОДГОТОВКА:
    // Мокаем успешный ответ Firebase на логин.
    // Это позволяет проверить логику стора без реального запроса в сеть.
    firebaseMocks.signInEmail.mockResolvedValue({
      uid: 'uid-1',
      email: 'user@example.com',
      displayName: 'Alex',
    });

    // ДЕЙСТВИЕ: вызываем метод login у стора.
    await useAuthStore.getState().login('user@example.com', 'secret123');

    // ПРОВЕРКА:
    // 1) Firebase-функция вызвана с корректными аргументами,
    // 2) в сторе выставлено состояние авторизованного пользователя,
    // 3) ошибка очищена.
    const state = useAuthStore.getState();
    expect(firebaseMocks.signInEmail).toHaveBeenCalledWith('user@example.com', 'secret123');
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.displayName).toBe('Alex');
    expect(state.error).toBeNull();
  });

  it('register forwards nickname to Firebase registration', async () => {
    // ПОДГОТОВКА: мокаем успешную регистрацию в Firebase.
    firebaseMocks.registerEmail.mockResolvedValue({
      uid: 'uid-2',
      email: 'new@example.com',
      displayName: 'boromir',
    });

    // ДЕЙСТВИЕ: регистрируем пользователя через стор.
    await useAuthStore.getState().register('new@example.com', 'secret123', 'boromir');

    // ПРОВЕРКА:
    // nickname должен дойти до слоя Firebase,
    // а в сторе должен появиться пользователь с displayName.
    expect(firebaseMocks.registerEmail).toHaveBeenCalledWith(
      'new@example.com',
      'secret123',
      'boromir',
    );
    expect(useAuthStore.getState().user?.displayName).toBe('boromir');
  });

  it('maps Firebase login error to readable text', async () => {
    // ПОДГОТОВКА:
    // Моделируем типичную ошибку Firebase при неверных данных логина.
    firebaseMocks.signInEmail.mockRejectedValue(
      new FirebaseError('auth/invalid-credential', 'Invalid credential'),
    );

    // ДЕЙСТВИЕ + ПРОВЕРКА:
    // 1) login должен завершиться ошибкой,
    // 2) стор должен сохранить человекочитаемое сообщение для UI.
    await expect(useAuthStore.getState().login('x@y.z', 'bad')).rejects.toBeTruthy();
    expect(useAuthStore.getState().error).toBe('Неверный email или пароль.');
  });

  it('probeProtectedApi throws when endpoint responds with non-OK', async () => {
    // ПОДГОТОВКА: API вернул неуспешный статус.
    apiMocks.probeItemsEndpoint.mockResolvedValue({ ok: false, status: 401, data: null });

    // ДЕЙСТВИЕ + ПРОВЕРКА:
    // метод probeProtectedApi должен бросить понятную ошибку,
    // чтобы компонент мог показать пользователю корректную реакцию.
    await expect(useAuthStore.getState().probeProtectedApi()).rejects.toThrow(
      'Пробный запрос неуспешен: HTTP 401',
    );
  });
});
