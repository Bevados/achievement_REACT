import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

const storeMocks = vi.hoisted(() => ({
  login: vi.fn(),
  clearError: vi.fn(),
  probeProtectedApi: vi.fn(),
  error: null as string | null,
}));

vi.mock('../../store/auth.store', () => ({
  // Имитируем поведение useAuthStore(selector).
  // Компонент просит кусок стора через selector,
  // а мы возвращаем данные из контролируемого мок-объекта.
  useAuthStore: (selector: (state: typeof storeMocks) => unknown) => selector(storeMocks),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storeMocks.error = null;
    storeMocks.login.mockResolvedValue(undefined);
    storeMocks.probeProtectedApi.mockResolvedValue(undefined);
  });

  it('показывает ошибку валидации для короткого пароля и не вызывает login', async () => {
    const user = userEvent.setup();

    render(<LoginForm onSuccess={vi.fn()} onSwitchToRegister={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('you@example.com'), 'alex@example.com');
    await user.type(screen.getByPlaceholderText('********'), '123');

    await user.click(screen.getByRole('button', { name: 'Войти' }));

    // Проверяем ключевое поведение формы:
    // при невалидном вводе submit-логика в store запускаться не должна.
    expect(await screen.findByText('Пароль должен быть не короче 6 символов')).toBeInTheDocument();
    expect(storeMocks.login).not.toHaveBeenCalled();
  });

  it('успешно отправляет email/password и вызывает onSuccess', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    render(<LoginForm onSuccess={onSuccess} onSwitchToRegister={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('you@example.com'), 'alex@example.com');
    await user.type(screen.getByPlaceholderText('********'), 'secret123');

    await user.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      // Проверяем, что форма передала в store те же значения,
      // которые пользователь ввел в поля.
      expect(storeMocks.login).toHaveBeenCalledWith('alex@example.com', 'secret123');
    });

    // После login + probe форма должна вызвать callback успешного завершения,
    // который в приложении закрывает модалку.
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

    // Это важный UX-момент:
    // перед сменой формы очищаем старую ошибку,
    // чтобы пользователь не видел неактуальное сообщение в другой форме.
    expect(storeMocks.clearError).toHaveBeenCalledTimes(1);
    expect(onSwitchToRegister).toHaveBeenCalledTimes(1);
  });
});
