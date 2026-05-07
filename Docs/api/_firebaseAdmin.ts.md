# api/_firebaseAdmin.ts

## Что делает файл

Это серверный модуль инициализации Firebase Admin SDK.
Файл создает единый экземпляр Admin SDK, который используется для проверки ID-токенов и серверной работы с пользователями Firebase.
Модуль предназначен только для backend/serverless-кода.

## Импорты и зависимости

1. `firebase-admin` (`admin`) — серверный SDK с привилегированным доступом.
2. `./_loadEnv` (`ensureServerEnvLoaded`) — локально подгружает `.env.local` до чтения `process.env`.
3. Переменные окружения `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` содержат данные сервис-аккаунта.

## Экспорты и контракты

1. Default export: `admin` (инициализированный Firebase Admin SDK).
2. Named export: `verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken>`.
3. Named export: `getUserRecord(uid: string): Promise<admin.auth.UserRecord>`.
4. Инициализация происходит только если `admin.apps.length === 0`.
5. `FIREBASE_PRIVATE_KEY` нормализуется через replace `\\n -> \n`.

## Нетривиальная логика

1. Используется default import `firebase-admin`, потому что он устойчиво работает и в Vercel entrypoints, и в отдельном локальном Node/tsx dev-server.
2. Singleton-подход предотвращает повторную инициализацию SDK в теплых serverless-инстансах и в long-running локальном backend-процессе.
3. Явный вызов `ensureServerEnvLoaded()` гарантирует одинаковое чтение `.env.local` для serverless-функций, seed-скриптов и локального backend-runner.
4. Ошибки верификации токена и lookup пользователя оборачиваются в читаемые сообщения без утечки приватных деталей конфигурации.

## Где используется

1. `lib/middleware/auth.ts` — импорт `admin` для `admin.auth().verifyIdToken(token)`.
2. Все private `/api/*` маршруты, которые проходят через `verifyAuth`.
3. Новый `scripts/dev-backend.ts`, который поднимает те же private handlers в обычном Node-процессе.
