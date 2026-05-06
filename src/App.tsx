import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import { useThemeStore } from './store/theme.store';
import { useAuthStore } from './store/auth.store';
import { useModalStore } from './store/modal.store';
import { useAuthIntentStore } from './store/auth-intent.store';
import AuthModal from './components/Auth/AuthModal';
import HomePage from './pages/HomePage/HomePage';
import CollectionsPage from './pages/CollectionsPage/CollectionsPage';
import CollectionDetailPage from './pages/CollectionDetailPage/CollectionDetailPage';
import ExamplesPage from './pages/ExamplesPage/ExamplesPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';

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
    <>
      <Header
        user={userForHeader}
        isAuthResolving={!isInitialized}
        onLogout={logout}
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
      />

      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
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
            path="/collections/:collectionId"
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
      </main>

      <AuthModal />
    </>
  );
}

export default App;
