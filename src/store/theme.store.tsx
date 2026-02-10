import { create } from 'zustand';

/**
 * Zustand Store для управления темой приложения
 *
 * Это централизованное управление состоянием темы.
 * Позволяет переключать тему из любого компонента в приложении.
 *
 * Как это работает:
 * 1. Store хранит состояние isDark (true = тёмная, false = светлая)
 * 2. При инициализации загружает тему из localStorage
 * 3. toggleTheme() функция меняет состояние и применяет класс на html
 * 4. initTheme() читает сохранённую тему при загрузке приложения
 * 5. Все компоненты подписаны на изменения и обновляются автоматически
 */

interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  isDark: false,
  toggleTheme: () => {
    set((state) => {
      const newIsDark = !state.isDark;

      // Применяем класс на html элемент
      if (newIsDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Сохраняем выбор в localStorage
      localStorage.setItem('theme', newIsDark ? 'dark' : 'light');

      return { isDark: newIsDark };
    });
  },

  /** Инициализирует тему при загрузке из localStorage */
  initTheme: () => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      // Применяем тёмную тему
      document.documentElement.classList.add('dark');
      set({ isDark: true });
    } else if (savedTheme === 'light') {
      // Применяем светлую тему
      document.documentElement.classList.remove('dark');
      set({ isDark: false });
    } else {
      // Если ничего не сохранено, проверяем текущее состояние HTML
      const currentIsDark = document.documentElement.classList.contains('dark');
      set({ isDark: currentIsDark });
    }
  },
}));
