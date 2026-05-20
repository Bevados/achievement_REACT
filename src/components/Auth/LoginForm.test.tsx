import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

const storeMocks = vi.hoisted(() => ({
  login: vi.fn(),
  clearError: vi.fn(),
  error: null as string | null,
}));

vi.mock('../../store/auth.store', () => ({
  useAuthStore: (selector: (state: typeof storeMocks) => unknown) => selector(storeMocks),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storeMocks.error = null;
    storeMocks.login.mockResolvedValue(undefined);
  });

  it('показывает ошибку валидации для короткого пароля и не вызывает login', async () => {
    const user = userEvent.setup();

    render(<LoginForm onSuccess={vi.fn()} onSwitchToRegister={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('you@example.com'), 'alex@example.com');
    await user.type(screen.getByPlaceholderText('********'), '123');

    await user.click(screen.getByRole('button', { name: 'Войти' }));

    expect(await screen.findByText('Пароль должен быть не короче 6 символов')).toBeInTheDocument();
    expect(storeMocks.login).not.toHaveBeenCalled();
  });

  it('успешно отправляет email и password и вызывает onSuccess', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    render(<LoginForm onSuccess={onSuccess} onSwitchToRegister={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('you@example.com'), 'alex@example.com');
    await user.type(screen.getByPlaceholderText('********'), 'secret123');

    await user.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(storeMocks.login).toHaveBeenCalledWith('alex@example.com', 'secret123');
    });

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('показывает ошибку из auth.store', () => {
    storeMocks.error = 'Неверный email или пароль.';

    render(<LoginForm onSuccess={vi.fn()} onSwitchToRegister={vi.fn()} />);

    expect(screen.getByText('Неверный email или пароль.')).toBeInTheDocument();
  });

  it('по кнопке перехода в регистрацию вызывает clearError и onSwitchToRegister', async () => {
    const user = userEvent.setup();
    const onSwitchToRegister = vi.fn();

    render(<LoginForm onSuccess={vi.fn()} onSwitchToRegister={onSwitchToRegister} />);

    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

    expect(storeMocks.clearError).toHaveBeenCalledTimes(1);
    expect(onSwitchToRegister).toHaveBeenCalledTimes(1);
  });
});
