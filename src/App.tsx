import { useEffect } from 'react';
import Header from './components/Header/Header';
import { useThemeStore } from './store/theme.store';

function App() {
  // Инициализируем тему при загрузке приложения
  useEffect(() => {
    useThemeStore.getState().initTheme();
  }, []);

  return (
    <>
      <Header />
    </>
  );
}

export default App;
