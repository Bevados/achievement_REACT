# src/App.tsx

## Что делает файл

Это корневой UI-компонент приложения.
Файл связывает layout (Header), модалку авторизации (AuthModal), маршруты приложения и состояния из Zustand-store (auth, modal, theme, auth-intent).
Также именно здесь запускается инициализация темы и подписка на Firebase auth listener.

## Импорты и зависимости

1. `react` (`useEffect`) - запуск побочных эффектов на старте приложения.
2. `react-router-dom` (`Navigate`, `Route`, `Routes`) - объявление маршрутов и redirect-правил.
3. `src/components/Header/Header.tsx` - верхняя панель навигации и авторизации.
4. `src/components/Auth/AuthModal.tsx` - контейнер модального окна login/register.
5. `src/pages/HomePage/HomePage.tsx` - гостевая главная с Hero CTA.
6. `src/pages/CollectionsPage/CollectionsPage.tsx` - private-раздел коллекций.
7. `src/pages/ExamplesPage/ExamplesPage.tsx` - публичный раздел примеров.
8. `src/store/theme.store.tsx` (`useThemeStore`) - инициализация темы при первом рендере.
9. `src/store/auth.store.ts` (`useAuthStore`) - состояние пользователя и auth-действия.
10. `src/store/modal.store.ts` (`useModalStore`) - открытие модалки по кликам из Header/CTA.
11. `src/store/auth-intent.store.ts` (`useAuthIntentStore`) - хранение отложенного пользовательского намерения после авторизации.

## Экспорты и контракты

1. Экспортируется default-компонент `App`.
2. Компонент не принимает пропсы.
3. Возвращает структуру из `Header`, route-content и `AuthModal`.
4. Инварианты:
5. `initAuthListener` запускается при маунте (через `useEffect`) и не должен вызываться вручную из дочерних компонентов.
6. `Header` получает `isAuthResolving={!isInitialized}`, чтобы показывать loading-состояние до завершения первой auth-проверки.
7. `userForHeader` всегда имеет одинаковую форму (`login`, `isAuthenticated`), даже для гостя.
8. Route-политика:
9. `/` и `/examples` доступны только гостю.
10. Авторизованный пользователь на guest-route получает redirect на `/collections`.
11. `/collections` доступен только авторизованному пользователю.
12. Неавторизованный пользователь на private-route получает redirect на `/`.

## Нетривиальная логика

1. В `userForHeader` используется fallback-цепочка `displayName || email || 'User'`. Это защищает Header от пустого имени, если `displayName` не заполнен в Firebase профиле.
2. Колбэки `onOpenLogin` и `onOpenRegister` сначала очищают `pendingIntent`, затем открывают модалку. Это предотвращает случайный перенос старого intent из Hero CTA в обычный flow входа.
3. Hero CTA на HomePage ставит `setIntent('create-collection')` и открывает login modal. Фактический redirect по intent будет подключен на следующих шагах, когда появится реальный экран создания коллекции.
4. Пока auth-состояние не инициализировано, route-content рендерит skeleton-секцию `AuthResolvingState`, чтобы избежать визуальных скачков и ложных redirect.

## Где используется

1. `src/main.tsx` - импортирует `App` и рендерит его внутри `BrowserRouter`.
2. `src/App.test.tsx` - проверяет redirect-политику и wiring Hero CTA / Header login.
