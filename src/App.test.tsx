import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const authStoreMock = vi.hoisted(() => ({
  user: null as { uid: string; email: string | null; displayName: string | null } | null,
  logout: vi.fn(),
  initAuthListener: vi.fn(),
  isInitialized: true,
}));

const modalStoreMock = vi.hoisted(() => ({
  openModal: vi.fn(),
}));

const authIntentStoreMock = vi.hoisted(() => ({
  setIntent: vi.fn(),
  clearIntent: vi.fn(),
}));

const initThemeMock = vi.hoisted(() => vi.fn());

vi.mock('./store/auth.store', () => ({
  useAuthStore: (selector: (state: typeof authStoreMock) => unknown) => selector(authStoreMock),
}));

vi.mock('./store/modal.store', () => ({
  useModalStore: (selector: (state: typeof modalStoreMock) => unknown) => selector(modalStoreMock),
}));

vi.mock('./store/auth-intent.store', () => ({
  useAuthIntentStore: (selector: (state: typeof authIntentStoreMock) => unknown) =>
    selector(authIntentStoreMock),
}));

vi.mock('./store/theme.store', () => ({
  useThemeStore: {
    getState: () => ({
      initTheme: initThemeMock,
    }),
  },
}));

vi.mock('./components/Header/Header', () => ({
  default: ({
    onOpenLogin,
    onOpenRegister,
  }: {
    onOpenLogin?: () => void;
    onOpenRegister?: () => void;
  }) => (
    <header>
      <button type="button" onClick={onOpenLogin}>
        HEADER_LOGIN
      </button>
      <button type="button" onClick={onOpenRegister}>
        HEADER_REGISTER
      </button>
    </header>
  ),
}));

vi.mock('./components/Auth/AuthModal', () => ({
  default: () => <div data-testid="auth-modal" />,
}));

vi.mock('./pages/CollectionDetailPage/CollectionDetailPage', () => ({
  default: () => <h1>COLLECTION_DETAIL_PAGE</h1>,
}));

vi.mock('./pages/PublicCollectionDetailPage/PublicCollectionDetailPage', () => ({
  default: () => <h1>PUBLIC_COLLECTION_DETAIL_PAGE</h1>,
}));

function renderApp(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>,
  );
}

describe('App routing and CTA flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authStoreMock.user = null;
    authStoreMock.isInitialized = true;
  });

  it('redirects authenticated user from root to collections', () => {
    authStoreMock.user = {
      uid: 'u-1',
      email: 'alex@example.com',
      displayName: 'Alex',
    };

    renderApp('/');

    expect(screen.getByRole('heading', { name: 'Мои коллекции' })).toBeInTheDocument();
  });

  it('guest CTA stores create intent and opens login modal', async () => {
    const user = userEvent.setup();

    renderApp('/');

    await user.click(screen.getByRole('button', { name: 'Создать коллекцию' }));

    expect(authIntentStoreMock.setIntent).toHaveBeenCalledWith('create-collection');
    expect(modalStoreMock.openModal).toHaveBeenCalledWith('login');
  });

  it('renders profile placeholder for authenticated user', () => {
    authStoreMock.user = {
      uid: 'u-1',
      email: 'alex@example.com',
      displayName: 'Alex',
    };

    renderApp('/profile');

    expect(screen.getByRole('heading', { name: 'Профиль' })).toBeInTheDocument();
  });

  it('renders collection detail route for authenticated user', () => {
    authStoreMock.user = {
      uid: 'u-1',
      email: 'alex@example.com',
      displayName: 'Alex',
    };

    renderApp('/collections/collection-1');

    expect(screen.getByRole('heading', { name: 'COLLECTION_DETAIL_PAGE' })).toBeInTheDocument();
  });

  it('redirects guest from collection detail route to home page', () => {
    renderApp('/collections/collection-1');

    expect(screen.getByRole('button', { name: 'Создать коллекцию' })).toBeInTheDocument();
  });

  it('renders public collection detail route for guest', () => {
    renderApp('/examples/collection-1');

    expect(screen.getByRole('heading', { name: 'PUBLIC_COLLECTION_DETAIL_PAGE' })).toBeInTheDocument();
  });

  it('redirects authenticated user from public example detail to collections', () => {
    authStoreMock.user = {
      uid: 'u-1',
      email: 'alex@example.com',
      displayName: 'Alex',
    };

    renderApp('/examples/collection-1');

    expect(screen.getByRole('heading', { name: 'Мои коллекции' })).toBeInTheDocument();
  });

  it('header login clears intent and opens login modal', async () => {
    const user = userEvent.setup();

    renderApp('/');

    await user.click(screen.getByRole('button', { name: 'HEADER_LOGIN' }));

    expect(authIntentStoreMock.clearIntent).toHaveBeenCalledTimes(1);
    expect(modalStoreMock.openModal).toHaveBeenCalledWith('login');
  });
});
