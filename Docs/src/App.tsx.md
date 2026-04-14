# src/App.tsx

## Что делает файл

Это корневой UI-компонент приложения.
Файл связывает вместе layout (`Header`), модалку авторизации (`AuthModal`) и состояния из Zustand-store (auth, modal, theme).
Также именно здесь запускается инициализация темы и подписка на Firebase auth listener.

## Импорты и зависимости

1. `react` (`useEffect`) - запуск побочных эффектов на старте приложения.
2. `src/components/Header/Header.tsx` - верхняя панель навигации и авторизации.
3. `src/components/Auth/AuthModal.tsx` - контейнер модального окна login/register.
4. `src/store/theme.store.tsx` (`useThemeStore`) - инициализация темы при первом рендере.
5. `src/store/auth.store.ts` (`useAuthStore`) - состояние пользователя и auth-действия.
6. `src/store/modal.store.ts` (`useModalStore`) - открытие модалки по кликам из Header.

## Экспорты и контракты

1. Экспортируется default-компонент `App`.
2. Компонент не принимает пропсы.
3. Возвращает структуру из `Header` и `AuthModal`.
4. Инварианты:
5. `initAuthListener` запускается при маунте (через `useEffect`) и не должен вызываться вручную из дочерних компонентов.
6. `Header` получает `isAuthResolving={!isInitialized}`, чтобы показывать loading-состояние до завершения первой auth-проверки.
7. `userForHeader` всегда имеет одинаковую форму (`login`, `isAuthenticated`), даже для гостя.

## Нетривиальная логика

1. В `userForHeader` используется fallback-цепочка `displayName || email || 'User'`. Это защищает Header от пустого имени, если `displayName` не заполнен в Firebase профиле.
3. Колбэки `onOpenLogin`/`onOpenRegister` не открывают модалку напрямую через локальный state, а делегируют в `modal.store`. Такой подход избавляет от prop-drilling и держит один источник истины для модального окна.

## Где используется

1. `src/main.tsx` - импортирует `App` и рендерит его внутри `BrowserRouter`.
2. Явных unit-тестов для `App` в текущем проекте нет; поведение покрывается тестами дочерних компонентов и store.
