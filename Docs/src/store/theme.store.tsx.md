# src/store/theme.store.tsx

## Что делает файл

Файл реализует Zustand-store для переключения темы приложения (light/dark).
Store хранит текущее значение `isDark`, умеет переключать тему и инициализировать ее из `localStorage` при старте приложения.
Также store синхронизирует состояние с DOM через класс `dark` на `document.documentElement`.

## Импорты и зависимости

1. `zustand` (`create`) - создание глобального store.
2. Browser API:
3. `document.documentElement.classList` - управление классом `dark`.
4. `localStorage` - сохранение и чтение выбранной темы.

## Экспорты и контракты

1. Экспортируется `useThemeStore`.
2. Контракт состояния:
3. `isDark: boolean`.
4. Контракт действий:
5. `toggleTheme(): void` - инвертирует тему, обновляет класс `dark`, пишет значение в `localStorage`.
6. `initTheme(): void` - читает `localStorage` и синхронизирует store/DOM при загрузке.
7. Инварианты:
8. Источник истины для визуальной темы - наличие класса `dark` на html-элементе.
9. Значение в `localStorage` должно быть `dark` или `light`.

## Нетривиальная логика

1. `toggleTheme` выполняет три действия атомарно: обновляет store, DOM-класс и `localStorage`.
2. `initTheme` имеет fallback-ветку: если в `localStorage` нет валидного значения, состояние берется из фактического класса на html.
3. Такой fallback предотвращает рассинхрон при ручном изменении класса темы или неполном состоянии storage.

## Где используется

1. `src/App.tsx` - вызов `useThemeStore.getState().initTheme()` при старте приложения.
2. `src/components/ThemeToggle/ThemeToggle.tsx` - чтение `isDark` и вызов `toggleTheme`.
