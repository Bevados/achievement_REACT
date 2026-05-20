# api/_firebaseAdmin.ts

## Что делает файл

Инициализирует Firebase Admin SDK для серверной части проекта и отдаёт единый экземпляр Admin-клиента для проверки Firebase ID token и доступа к данным пользователя.

## Импорты и зависимости

1. `firebase-admin` — серверный SDK Firebase.
2. `./_loadEnv.js` — локально подгружает `.env.local` до чтения `process.env`.
3. Переменные окружения `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.

## Экспорты и контракты

1. Default export: `admin`.
2. Named export: `verifyIdToken(idToken)`.
3. Named export: `getUserRecord(uid)`.
4. Модуль делает fail-fast проверку обязательных server env до инициализации SDK.

## Нетривиальная логика

1. `FIREBASE_PRIVATE_KEY` нормализуется через замену `\\n` на реальные переводы строк.
2. Инициализация выполняется как singleton через `admin.apps.length === 0`.
3. Относительный импорт переведён на `./_loadEnv.js`, чтобы Vercel Node ESM builder корректно собирал серверный код в production.

## Где используется

1. `lib/middleware/auth.ts`.
2. Все private `/api/collections*` маршруты.
3. Локальный backend-runner, который поднимает те же private handlers вне Vercel.
