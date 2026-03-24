import { useEffect } from 'react';
import Header from './components/Header/Header';
import { useThemeStore } from './store/theme.store';
import { useAuthStore } from './store/auth.store';
import { useModalStore } from './store/modal.store';
import AuthModal from './components/Auth/AuthModal';

function App() {
  const authUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const initAuthListener = useAuthStore((state) => state.initAuthListener);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  const openModal = useModalStore((state) => state.openModal);

  // Инициализируем тему при загрузке приложения
  useEffect(() => {
    useThemeStore.getState().initTheme();
  }, []);

  // Инициализируем listener Firebase Auth.
  // Он отслеживает вход/выход и синхронизирует состояние с Zustand store.
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

  return (
    <>
      <Header
        user={userForHeader}
        isAuthResolving={!isInitialized}
        onLogout={logout}
        onOpenLogin={() => openModal('login')}
        onOpenRegister={() => openModal('register')}
      />
      <AuthModal />
    </>
  );
}

export default App;
