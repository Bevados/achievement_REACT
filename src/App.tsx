import { QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthModal from './components/Auth/AuthModal';
import Header from './components/Header/Header';
import { appQueryClient } from './lib/query-client';
import { useAuthIntentStore } from './store/auth-intent.store';
import { useAuthStore } from './store/auth.store';
import { useModalStore } from './store/modal.store';
import { useThemeStore } from './store/theme.store';

const CollectionDetailPage = lazy(() => import('./pages/CollectionDetailPage/CollectionDetailPage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage/CollectionsPage'));
const ExamplesPage = lazy(() => import('./pages/ExamplesPage/ExamplesPage'));
const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage/ProfilePage'));
const PublicCollectionDetailPage = lazy(
  () => import('./pages/PublicCollectionDetailPage/PublicCollectionDetailPage'),
);

function AuthResolvingState() {
  return (
    <section
      className="rounded-2xl border border-gray-200 bg-white px-6 py-10 shadow-sm"
      aria-live="polite"
      aria-label="Проверяем сессию"
    >
      <div className="h-4 w-40 animate-pulse rounded-full bg-linear-to-r from-gray-100 via-gray-200 to-gray-100" />
      <div className="mt-3 h-4 w-72 animate-pulse rounded-full bg-linear-to-r from-gray-100 via-gray-200 to-gray-100" />
    </section>
  );
}

function App() {
  const authUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const initAuthListener = useAuthStore((state) => state.initAuthListener);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  const openModal = useModalStore((state) => state.openModal);
  const setIntent = useAuthIntentStore((state) => state.setIntent);
  const clearIntent = useAuthIntentStore((state) => state.clearIntent);

  const isAuthenticated = Boolean(authUser);

  useEffect(() => {
    useThemeStore.getState().initTheme();
  }, []);

  useEffect(() => {
    initAuthListener();
  }, [initAuthListener]);

  const userForHeader = authUser
    ? {
        login: authUser.displayName || authUser.email || 'User',
        isAuthenticated: true,
      }
    : {
        login: '',
        isAuthenticated: false,
      };

  const handleOpenLogin = () => {
    clearIntent();
    openModal('login');
  };

  const handleOpenRegister = () => {
    clearIntent();
    openModal('register');
  };

  const handleCreateCollectionFromHero = () => {
    setIntent('create-collection');
    openModal('login');
  };

  return (
    <QueryClientProvider client={appQueryClient}>
      <Header
        user={userForHeader}
        isAuthResolving={!isInitialized}
        onLogout={logout}
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
      />

      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <Suspense fallback={<AuthResolvingState />}>
          <Routes>
            <Route
              path="/"
              element={
                !isInitialized ? (
                  <AuthResolvingState />
                ) : isAuthenticated ? (
                  <Navigate to="/collections" replace />
                ) : (
                  <HomePage onCreateCollection={handleCreateCollectionFromHero} />
                )
              }
            />
            <Route
              path="/examples"
              element={
                !isInitialized ? (
                  <AuthResolvingState />
                ) : isAuthenticated ? (
                  <Navigate to="/collections" replace />
                ) : (
                  <ExamplesPage />
                )
              }
            />
            <Route
              path="/examples/:collectionId/:collectionSlug?"
              element={
                !isInitialized ? (
                  <AuthResolvingState />
                ) : isAuthenticated ? (
                  <Navigate to="/collections" replace />
                ) : (
                  <PublicCollectionDetailPage />
                )
              }
            />
            <Route
              path="/collections"
              element={
                !isInitialized ? (
                  <AuthResolvingState />
                ) : isAuthenticated ? (
                  <CollectionsPage />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/collections/:collectionId/:collectionSlug?"
              element={
                !isInitialized ? (
                  <AuthResolvingState />
                ) : isAuthenticated ? (
                  <CollectionDetailPage />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/profile"
              element={
                !isInitialized ? (
                  <AuthResolvingState />
                ) : isAuthenticated ? (
                  <ProfilePage />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? '/collections' : '/'} replace />}
            />
          </Routes>
        </Suspense>
      </main>

      <AuthModal />
    </QueryClientProvider>
  );
}

export default App;
