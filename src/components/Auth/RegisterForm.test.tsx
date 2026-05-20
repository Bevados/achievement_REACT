import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from './RegisterForm';

const storeMocks = vi.hoisted(() => ({
  register: vi.fn(),
  clearError: vi.fn(),
  error: null as string | null,
}));

vi.mock('../../store/auth.store', () => ({
  useAuthStore: (selector: (state: typeof storeMocks) => unknown) => selector(storeMocks),
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storeMocks.error = null;
    storeMocks.register.mockResolvedValue(undefined);
  });

  it('показывает ошибку при несовпадении паролей и не вызывает register', async () => {
    const user = userEvent.setup();

    render(<RegisterForm onSuccess={vi.fn()} onSwitchToLogin={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('Например, Alex'), 'alex');
    await user.type(screen.getByPlaceholderText('you@example.com'), 'alex@example.com');
    await user.type(screen.getByPlaceholderText('Минимум 6 символов'), 'secret123');
    await user.type(screen.getByPlaceholderText('Повторите пароль'), 'different123');

    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

    expect(await screen.findByText('Пароли не совпадают')).toBeInTheDocument();
    expect(storeMocks.register).not.toHaveBeenCalled();
  });

  it('успешно отправляет nickname, email и password и вызывает onSuccess', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    render(<RegisterForm onSuccess={onSuccess} onSwitchToLogin={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('Например, Alex'), 'boromir');
    await user.type(screen.getByPlaceholderText('you@example.com'), 'boromir@example.com');
    await user.type(screen.getByPlaceholderText('Минимум 6 символов'), 'secret123');
    await user.type(screen.getByPlaceholderText('Повторите пароль'), 'secret123');

    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

    await waitFor(() => {
      expect(storeMocks.register).toHaveBeenCalledWith(
        'boromir@example.com',
        'secret123',
        'boromir',
      );
    });

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('показывает ошибку из auth.store', () => {
    storeMocks.error = 'Пользователь с таким email уже существует.';

    render(<RegisterForm onSuccess={vi.fn()} onSwitchToLogin={vi.fn()} />);

    expect(screen.getByText('Пользователь с таким email уже существует.')).toBeInTheDocument();
  });
});
