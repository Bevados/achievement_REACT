# api/_firebaseAdmin.ts

## Что делает файл

Это серверный модуль инициализации Firebase Admin SDK.
Файл создаёт единый экземпляр Admin SDK для проверки ID-токенов и серверной работы с пользователями Firebase.

## Импорты и зависимости

1. `firebase-admin` (`admin`) — серверный SDK с привилегированным доступом.
2. `./_loadEnv` (`ensureServerEnvLoaded`) — локально подгружает `.env.local` до чтения `process.env`.
3. Переменные окружения `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.

## Экспорты и контракты

1. Default export: `admin` (инициализированный Firebase Admin SDK).
2. Named export: `verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken>`.
3. Named export: `getUserRecord(uid: string): Promise<admin.auth.UserRecord>`.
4. Инициализация происходит только если `admin.apps.length === 0`.
5. Перед инициализацией обязательные server env проверяются через fail-fast helper; при отсутствии переменной модуль бросает явную ошибку.

## Нетривиальная логика

1. `FIREBASE_PRIVATE_KEY` нормализуется через replace `\\n -> \n`.
2. Singleton-подход предотвращает повторную инициализацию SDK в тёплых serverless-инстансах и в long-running локальном backend-процессе.
3. Fail-fast проверка env упрощает диагностику проблем на Vercel и локально: backend падает с понятной причиной, а не с неочевидной ошибкой глубже в SDK.

## Где используется

1. `lib/middleware/auth.ts` — импорт `admin` для `admin.auth().verifyIdToken(token)`.
2. Все private `/api/*` маршруты, которые проходят через `verifyAuth`.
3. Локальный backend-runner, который поднимает те же private handlers в обычном Node-процессе.
