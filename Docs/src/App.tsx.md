# src/App.tsx

## Что делает файл

Это корневой UI-компонент приложения.
Файл связывает layout, модалку авторизации, маршруты приложения и Zustand-store для темы, авторизации, модалки и auth-intent.
Именно здесь запускается инициализация темы и подписка на Firebase auth listener.

## Импорты и зависимости

1. `react` (`useEffect`) нужен для стартовых побочных эффектов.
2. `react-router-dom` (`Navigate`, `Route`, `Routes`) задаёт маршруты и redirect-правила.
3. `src/components/Header/Header.tsx` рендерит верхнюю навигацию.
4. `src/components/Auth/AuthModal.tsx` рендерит login/register модалку.
5. `src/pages/HomePage/HomePage.tsx` даёт гостевую главную страницу с Hero CTA.
6. `src/pages/CollectionsPage/CollectionsPage.tsx` содержит приватный раздел коллекций.
7. `src/pages/ExamplesPage/ExamplesPage.tsx` содержит публичный раздел примеров.
8. `src/pages/ProfilePage/ProfilePage.tsx` даёт временную заглушку профиля.
9. `src/store/theme.store.tsx` (`useThemeStore`) инициализирует тему.
10. `src/store/auth.store.ts` (`useAuthStore`) даёт auth-state и auth-действия.
11. `src/store/modal.store.ts` (`useModalStore`) открывает модалку авторизации.
12. `src/store/auth-intent.store.ts` (`useAuthIntentStore`) хранит отложенное пользовательское намерение.

## Экспорты и контракты

1. Экспортируется default-компонент `App`.
2. Компонент не принимает пропсы.
3. `App` возвращает `Header`, маршрутный контент и `AuthModal`.
4. Инварианты маршрутизации:
4.1. `/` и `/examples` доступны только гостю.
4.2. Авторизованный пользователь на гостевых маршрутах перенаправляется на `/collections`.
4.3. `/collections` и `/profile` доступны только авторизованному пользователю.
4.4. Неавторизованный пользователь на приватном маршруте получает redirect на `/`.

## Нетривиальная логика

1. `initAuthListener` вызывается на маунте и не должен запускаться вручную из дочерних компонентов.
2. `Header` получает `isAuthResolving={!isInitialized}`, чтобы показывать loading-состояние до первого ответа Firebase.
3. `userForHeader` всегда имеет одинаковую форму `{ login, isAuthenticated }`, даже когда пользователь ещё не авторизован.
4. `handleOpenLogin` и `handleOpenRegister` сначала очищают `pendingIntent`, а потом открывают модалку, чтобы не переносить старое намерение в обычный flow входа.
5. Hero CTA на главной странице ставит `setIntent('create-collection')` и открывает login modal.
6. Пока auth-состояние не инициализировано, route-content рендерит `AuthResolvingState`, чтобы избежать ложных redirect и визуальных скачков.
7. Путь `/profile` пока ведёт на минимальную заглушку, но уже существует как валидный маршрут.

## Где используется

1. `src/main.tsx` - импортирует `App` и рендерит его внутри `BrowserRouter`.
2. `src/App.test.tsx` - проверяет route-guards, Hero CTA flow, Header login flow и маршрут `/profile`.
