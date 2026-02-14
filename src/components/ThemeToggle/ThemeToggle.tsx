import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/theme.store';

/**
 * Компонент ThemeToggle - переключатель между светлой и тёмной темой

 * Как работает:
 * 1. При загрузке компонента вызывает initTheme() для восстановления темы
 * 2. При клике на кнопку вызывает toggleTheme()
 * 3. Store автоматически обновляет HTML класс 'dark' и localStorage
 * 4. Все компоненты которые используют useThemeStore обновляются
 */

interface ThemeToggleProps {
  rotate?: boolean;
}

export default function ThemeToggle({ rotate = false }: ThemeToggleProps) {
  // STATE: Компонент загружен (для избежания hydration mismatch)
  const [isLoaded, setIsLoaded] = useState(false);

  // ZUSTAND STORE: Получаем состояние и функции из store
  const isDark = useThemeStore((state) => state.isDark);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  // Снимаем флаг загрузки для избежания hydration mismatch
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Не рендерим пока компонент не загружен (hydration safety)
  if (!isLoaded) return null;

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-14 h-7 rounded-full transition-all duration-300
        ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
        hover:shadow-md focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2
        dark:focus:ring-offset-gray-200 ease-in-out
        ${rotate ? 'rotate-90' : ''}
      `}
      aria-label={isDark ? 'Перейти на светлую тему' : 'Перейти на тёмную тему'}
      title={isDark ? 'Светлая тема' : 'Тёмная тема'}
    >
      <div
        className={`
          absolute top-1 w-5 h-5 bg-white rounded-full
          flex items-center justify-center
          transition-transform duration-300 ease-in-out
          shadow-md
          ${isDark ? 'translate-x-8' : 'translate-x-1'}
          ${rotate ? '-rotate-90' : ''}
        `}
      >
        {isDark ? (
          <Moon size={16} className="text-secondary flex-shrink-0" aria-hidden="true" />
        ) : (
          <Sun size={16} className="text-yellow-500 flex-shrink-0" aria-hidden="true" />
        )}
      </div>

      {/* Скрытый текст для screen readers (доступность) */}
      <span className="sr-only">{isDark ? 'Текущая тема: Тёмная' : 'Текущая тема: Светлая'}</span>
    </button>
  );
}
