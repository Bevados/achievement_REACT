# src/store/auth.store.ts

## Что делает файл

Файл реализует Zustand-store для авторизации через Firebase.
Store хранит состояние текущего пользователя, флаги инициализации/загрузки, текст ошибок и методы для login/register/logout.
Также в store есть вспомогательный метод `probeProtectedApi` для smoke-проверки защищенного API после входа.

## Импорты и зависимости

1. `zustand` (`create`) - создание глобального store.
2. `firebase/app` (`FirebaseError`) - распознавание кодов ошибок Firebase и перевод в человекочитаемый текст.
3. `firebase/auth` (`User`) - тип пользователя для маппинга в формат store.
4. `src/firebase.ts` - функции auth-операций (`signInEmail`, `registerEmail`, `signOut`, `onAuthStateChange`).
5. `src/api/items.api.ts` (`probeItemsEndpoint`) - проверка доступа к защищенному endpoint с токеном.

## Экспорты и контракты

1. Экспортируется `useAuthStore`.
2. Публичный контракт состояния:
2.1. `user`, `isAuthenticated`, `isLoading`, `isInitialized`, `error`.
3. Публичный контракт действий:
3.1. `initAuthListener()`, `login(email, password)`, `register(email, password, nickname)`, `logout()`, `clearError()`, `probeProtectedApi()`.
4. Внутренние helper-функции:
4.1. `mapFirebaseError` - переводит коды Firebase в сообщения для UI.
4.2. `toAuthUser` - нормализует объект Firebase User.
5. Инварианты:
5.1. `initAuthListener` должен вызываться один раз на старте приложения.
5.2. В `login/register/logout` ошибка пробрасывается дальше после записи текста ошибки в store.
5.3. `isInitialized` становится `true` только после первого события от `onAuthStateChange`.

## Нетривиальная логика

1. Глобальная переменная `unsubscribeAuthListener` защищает от повторной подписки на auth listener.
2. В `initAuthListener` сначала выставляется `isLoading`, затем listener переводит store в один из двух стабильных режимов: авторизован (`user` заполнен) или гость (`user=null`).
3. Ошибки auth-методов обрабатываются централизованно через `mapFirebaseError`.
4. `probeProtectedApi` не меняет auth-state: это диагностический smoke-запрос, который либо логирует успех, либо бросает ошибку.

## Где используется

1. `src/App.tsx` - чтение `user`, `logout`, `initAuthListener`, `isInitialized`.
2. `src/components/Auth/AuthModal.tsx` - вызов `clearError` при закрытии модалки.
3. `src/components/Auth/LoginForm.tsx` - вызов `login`, чтение `error`, `clearError`, `probeProtectedApi`.
4. `src/components/Auth/RegisterForm.tsx` - вызов `register`, чтение `error`, `clearError`, `probeProtectedApi`.
5. `src/store/auth.store.test.ts` - unit-тесты поведения store.
