import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthModal from './AuthModal';

const modalStoreMock = vi.hoisted(() => ({
  isOpen: false,
  activeModal: null as 'login' | 'register' | null,
  closeModal: vi.fn(),
  switchModal: vi.fn(),
}));

const authStoreMock = vi.hoisted(() => ({
  clearError: vi.fn(),
}));

vi.mock('../../store/modal.store', () => ({
  useModalStore: (selector: (state: typeof modalStoreMock) => unknown) => selector(modalStoreMock),
}));

vi.mock('../../store/auth.store', () => ({
  useAuthStore: (selector: (state: typeof authStoreMock) => unknown) => selector(authStoreMock),
}));

// Для тестов AuthModal не нужна реальная реализация форм.
// Мы подставляем простые заглушки, чтобы изолированно проверить логику контейнера.
vi.mock('./LoginForm', () => ({
  default: ({
    onSuccess,
    onSwitchToRegister,
  }: {
    onSuccess: () => void;
    onSwitchToRegister: () => void;
  }) => (
    <div>
      <p>LOGIN_FORM_CONTENT</p>
      <button type="button" onClick={onSwitchToRegister}>
        SWITCH_TO_REGISTER
      </button>
      <button type="button" onClick={onSuccess}>
        LOGIN_SUCCESS
      </button>
    </div>
  ),
}));

vi.mock('./RegisterForm', () => ({
  default: ({
    onSuccess,
    onSwitchToLogin,
  }: {
    onSuccess: () => void;
    onSwitchToLogin: () => void;
  }) => (
    <div>
      <p>REGISTER_FORM_CONTENT</p>
      <button type="button" onClick={onSwitchToLogin}>
        SWITCH_TO_LOGIN
      </button>
      <button type="button" onClick={onSuccess}>
        REGISTER_SUCCESS
      </button>
    </div>
  ),
}));

describe('AuthModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    modalStoreMock.isOpen = false;
    modalStoreMock.activeModal = null;
  });

  it('не рендерится, если модалка закрыта', () => {
    modalStoreMock.isOpen = false;

    render(<AuthModal />);

    // Если isOpen=false, компонент BaseModal возвращает null.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('в режиме login показывает заголовок "Вход" и контент LoginForm', () => {
    modalStoreMock.isOpen = true;
    modalStoreMock.activeModal = 'login';

    render(<AuthModal />);

    expect(screen.getByRole('dialog', { name: 'Вход' })).toBeInTheDocument();
    expect(screen.getByText('LOGIN_FORM_CONTENT')).toBeInTheDocument();
    expect(screen.queryByText('REGISTER_FORM_CONTENT')).not.toBeInTheDocument();
  });

  it('в режиме register показывает заголовок "Регистрация" и контент RegisterForm', () => {
    modalStoreMock.isOpen = true;
    modalStoreMock.activeModal = 'register';

    render(<AuthModal />);

    expect(screen.getByRole('dialog', { name: 'Регистрация' })).toBeInTheDocument();
    expect(screen.getByText('REGISTER_FORM_CONTENT')).toBeInTheDocument();
    expect(screen.queryByText('LOGIN_FORM_CONTENT')).not.toBeInTheDocument();
  });

  it('переключает форму login -> register через switchModal', async () => {
    const user = userEvent.setup();
    modalStoreMock.isOpen = true;
    modalStoreMock.activeModal = 'login';

    render(<AuthModal />);

    await user.click(screen.getByRole('button', { name: 'SWITCH_TO_REGISTER' }));

    // Ключевая проверка контейнера AuthModal:
    // он не знает деталей формы, только переключает режим через store.
    expect(modalStoreMock.switchModal).toHaveBeenCalledWith('register');
  });

  it('при onSuccess вызывает clearError и closeModal', async () => {
    const user = userEvent.setup();
    modalStoreMock.isOpen = true;
    modalStoreMock.activeModal = 'login';

    render(<AuthModal />);

    await user.click(screen.getByRole('button', { name: 'LOGIN_SUCCESS' }));

    // handleClose внутри AuthModal обязан сделать две вещи:
    // 1) очистить возможную auth-ошибку,
    // 2) закрыть окно.
    expect(authStoreMock.clearError).toHaveBeenCalledTimes(1);
    expect(modalStoreMock.closeModal).toHaveBeenCalledTimes(1);
  });

  it('кнопка закрытия в BaseModal вызывает clearError и closeModal', async () => {
    const user = userEvent.setup();
    modalStoreMock.isOpen = true;
    modalStoreMock.activeModal = 'register';

    render(<AuthModal />);

    await user.click(screen.getByRole('button', { name: 'Закрыть окно' }));

    expect(authStoreMock.clearError).toHaveBeenCalledTimes(1);
    expect(modalStoreMock.closeModal).toHaveBeenCalledTimes(1);
  });
});
