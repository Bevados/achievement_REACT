# api/\_loadEnv.ts

## Что делает файл

Это маленький server-only helper для локальной загрузки env-переменных перед работой Vercel API-функций.
Файл нужен, чтобы `vercel dev` видел те же значения из `.env.local`, что и seed-скрипты и backend helpers.

## Импорты и зависимости

1. `dotenv` (`config as loadEnv`) - читает `.env.local` и стандартные `.env*` файлы.

## Экспорты и контракты

1. `ensureServerEnvLoaded(): void` - один раз загружает `.env.local`, затем обычный `dotenv` fallback.
2. Инвариант: повторные вызовы безопасны, потому что загрузка защищена флагом `isEnvLoaded`.

## Нетривиальная логика

1. Helper intentionally идемпотентный, чтобы его можно было импортировать и из Mongo bootstrap, и из Firebase Admin bootstrap без двойной инициализации.
2. Это решение влияет только на локальный runtime; на проде Vercel по-прежнему может использовать штатные `process.env`.

## Где используется

1. `api/_mongodb.ts` - перед чтением `MONGODB_URI`.
2. `api/_firebaseAdmin.ts` - перед инициализацией Firebase Admin SDK.
