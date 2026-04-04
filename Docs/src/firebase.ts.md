# src/firebase.ts

## Что делает файл

Это клиентский модуль интеграции с Firebase Authentication.
Файл инициализирует Firebase App (с защитой от повторной инициализации при HMR), экспортирует `auth` и набор функций для login/register/logout, подписки на auth-state и получения ID-токена.

## Импорты и зависимости

1. `firebase/app` (`initializeApp`, `getApps`, `FirebaseApp`) - создание/получение экземпляра приложения Firebase.
2. `firebase/auth` - операции аутентификации пользователя (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signOut`, `onAuthStateChanged`, `updateProfile`).
3. `import.meta.env` (Vite env) - получение клиентских Firebase-конфигов.

## Экспорты и контракты

1. Экспортируется `auth` (`getAuth(firebaseApp)`).
2. Экспортируемые функции:
3. `signInEmail(email, password)` -> `Promise<User>`.
4. `registerEmail(email, password, nickname)` -> `Promise<User>`.
5. `signOut()` -> `Promise<void>`.
6. `onAuthStateChange(callback)` -> функция отписки.
7. `getIdToken()` -> `Promise<string | null>`.
8. Инварианты:
9. Без `VITE_FIREBASE_API_KEY` и `VITE_FIREBASE_PROJECT_ID` модуль бросает ошибку на инициализации.
10. `registerEmail` после `updateProfile` вызывает `reload`, чтобы в UI сразу появился свежий `displayName`.
11. `getIdToken` возвращает `null`, если пользователь не авторизован.

## Нетривиальная логика

1. Инициализация через `getApps()` предотвращает повторный `initializeApp` во время hot reload.
2. `registerEmail` делает `nickname.trim()` перед сохранением в профиле, чтобы не хранить пробелы по краям.
3. После регистрации выполняется `user.reload()`, иначе store может получить устаревший `displayName`.
4. Модуль специально разделяет операции auth и получение токена, чтобы API-клиент мог переиспользовать `getIdToken` независимо от UI-форм.

## Где используется

1. `src/store/auth.store.ts` - использует `signInEmail`, `registerEmail`, `signOut`, `onAuthStateChange`.
2. `src/api/items.api.ts` - использует `getIdToken` для Bearer-запроса к `/api/items`.
3. Тестовое покрытие auth-поведения реализовано в `src/store/auth.store.test.ts` (через mock этого модуля).
