import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
  default: () => <header>HEADER</header>,
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

describe('App smoke routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authStoreMock.user = null;
    authStoreMock.isInitialized = true;
  });

  it('allows guest public flow', () => {
    renderApp('/examples/collection-1');
    expect(screen.getByRole('heading', { name: 'PUBLIC_COLLECTION_DETAIL_PAGE' })).toBeInTheDocument();
  });

  it('blocks guest from private detail', () => {
    renderApp('/collections/collection-1');
    expect(screen.getByRole('button', { name: 'Создать коллекцию' })).toBeInTheDocument();
  });

  it('redirects authenticated user from root into private flow', () => {
    authStoreMock.user = {
      uid: 'u-1',
      email: 'alex@example.com',
      displayName: 'Alex',
    };

    renderApp('/');
    expect(screen.getByRole('heading', { name: 'Мои коллекции' })).toBeInTheDocument();
  });

  it('redirects authenticated user away from public example detail', () => {
    authStoreMock.user = {
      uid: 'u-1',
      email: 'alex@example.com',
      displayName: 'Alex',
    };

    renderApp('/examples/collection-1');
    expect(screen.getByRole('heading', { name: 'Мои коллекции' })).toBeInTheDocument();
  });
});
