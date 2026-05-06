# src/App.tsx

## Что делает файл

Это корневой UI-компонент приложения.
Файл связывает layout, модалку авторизации, маршрутизацию и Zustand-store для темы, авторизации, модалки и auth-intent.
Именно здесь запускаются инициализация темы и подписка на Firebase auth listener.

## Импорты и зависимости

1. `react` (`useEffect`) нужен для стартовых побочных эффектов.
2. `react-router-dom` (`Navigate`, `Route`, `Routes`) задает маршруты и redirect-правила.
3. `src/components/Header/Header.tsx` рендерит верхнюю навигацию.
4. `src/components/Auth/AuthModal.tsx` рендерит login/register модалку.
5. `src/pages/HomePage/HomePage.tsx` дает гостевую главную страницу.
6. `src/pages/CollectionsPage/CollectionsPage.tsx` дает приватный список коллекций.
7. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx` рендерит detail-экран одной коллекции.
8. `src/pages/ExamplesPage/ExamplesPage.tsx` рендерит публичные примеры.
9. `src/pages/ProfilePage/ProfilePage.tsx` содержит временную заглушку профиля.
10. `src/store/theme.store.tsx`, `src/store/auth.store.ts`, `src/store/modal.store.ts`, `src/store/auth-intent.store.ts` дают глобальные состояния и действия.

## Экспорты и контракты

1. Экспортируется default-компонент `App`.
2. Компонент не принимает пропсы.
3. `App` возвращает `Header`, маршрутный контент и `AuthModal`.
4. Инварианты маршрутизации:
4.1. `/` и `/examples` доступны только гостю.
4.2. Авторизованный пользователь на гостевых маршрутах перенаправляется на `/collections`.
4.3. `/collections`, `/collections/:collectionId` и `/profile` доступны только авторизованному пользователю.
4.4. Неавторизованный пользователь на приватном маршруте получает redirect на `/`.

## Нетривиальная логика

1. `initAuthListener` вызывается на маунте и не должен запускаться вручную из дочерних компонентов.
2. `Header` получает `isAuthResolving={!isInitialized}`, чтобы показывать loading-состояние до первого ответа Firebase.
3. `userForHeader` всегда имеет одинаковую форму `{ login, isAuthenticated }`, даже когда пользователь еще не авторизован.
4. `handleOpenLogin` и `handleOpenRegister` сначала очищают `pendingIntent`, а затем открывают модалку, чтобы не переносить старое намерение в обычный flow входа.
5. Hero CTA на главной странице ставит `setIntent('create-collection')` и открывает login modal.
6. Пока auth-состояние не инициализировано, route-content рендерит `AuthResolvingState`, чтобы избежать ложных redirect и визуальных скачков.
7. Новый private-route `/collections/:collectionId` расширяет CRUD-поток: из списка коллекций пользователь попадает на read-only detail-страницу одной коллекции.

## Где используется

1. `src/main.tsx` импортирует `App` и рендерит его внутри `BrowserRouter`.
2. `src/App.test.tsx` проверяет route-guards, Hero CTA flow, Header login flow и приватный detail-route коллекции.
