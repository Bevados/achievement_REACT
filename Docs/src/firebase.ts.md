# src/firebase.ts

## Что делает файл

Это клиентский модуль интеграции с Firebase Authentication.
Файл инициализирует Firebase App, экспортирует `auth` и функции для login/register/logout, подписки на auth-state и получения ID-токена.

## Импорты и зависимости

1. `firebase/app` — создание/получение экземпляра приложения Firebase.
2. `firebase/auth` — операции аутентификации пользователя.
3. `import.meta.env` — получение клиентских Firebase-конфигов.

## Экспорты и контракты

1. `auth`
2. `signInEmail(email, password): Promise<User>`
3. `registerEmail(email, password, nickname): Promise<User>`
4. `signOut(): Promise<void>`
5. `onAuthStateChange(callback)`
6. `getIdToken(): Promise<string | null>`

## Нетривиальная логика

1. Инициализация через `getApps()` предотвращает повторный `initializeApp` во время HMR.
2. `registerEmail` делает `nickname.trim()` и после `updateProfile` вызывает `reload`, чтобы UI сразу увидел свежий `displayName`.
3. `getIdToken` нужен клиентскому API-слою для Bearer-запросов к private endpoints `/api/collections/*`.

## Где используется

1. `src/store/auth.store.ts` — использует auth-функции и подписку на auth-state.
2. `src/api/collections.api.ts` — использует `getIdToken` для Bearer-запросов к private API.
3. Тестовое покрытие auth-поведения реализовано в `src/store/auth.store.test.ts`.
