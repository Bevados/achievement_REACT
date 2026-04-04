# api/\_firebaseAdmin.ts

## Что делает файл

Это серверный модуль инициализации Firebase Admin SDK.
Файл создает единый экземпляр Admin SDK (singleton), который используется для проверки ID-токенов и серверной работы с пользователями Firebase.
Модуль предназначен только для backend/serverless-кода.

## Импорты и зависимости

1. `firebase-admin` (`admin`) - серверный SDK с привилегированным доступом.
2. Переменные окружения:
3. `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` - учетные данные сервис-аккаунта.

## Экспорты и контракты

1. Default export: `admin` (инициализированный Firebase Admin SDK).
2. Named export: `verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken>`.
3. Named export: `getUserRecord(uid: string): Promise<admin.auth.UserRecord>`.
4. Инварианты:
5. Инициализация происходит только если `admin.apps.length === 0`.
6. `FIREBASE_PRIVATE_KEY` нормализуется через replace `\\n -> \n`, чтобы корректно работать с env-строкой.
7. Ошибки токена и user lookup оборачиваются в читаемые сообщения.

## Нетривиальная логика

1. Singleton-подход предотвращает повторную инициализацию SDK в теплых serverless-инстансах.
2. Модуль отделен от клиентского `src/firebase.ts`: это важная граница безопасности между frontend SDK и admin-правами.
3. Ошибка верификации токена не должна раскрывать приватные детали конфигурации, поэтому наружу идет общее сообщение об ошибке.

## Где используется

1. `lib/middleware/auth.ts` - импорт `admin` для `admin.auth().verifyIdToken(token)`.
2. Косвенно участвует в защите endpoint `api/items/index.ts` через middleware `verifyAuth`.
3. В текущем коде helper-функции `verifyIdToken` и `getUserRecord` пока не используются напрямую другими модулями.
