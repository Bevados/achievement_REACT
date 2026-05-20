# api/_mongodb.ts

## Что делает файл

Создаёт и кэширует серверное подключение к MongoDB для Vercel API routes и локального backend-runner.

## Импорты и зависимости

1. `mongodb` — `MongoClient`, `Db` и базовые типы документов.
2. `./_loadEnv.js` — локально подгружает `.env.local` перед чтением `MONGODB_URI`.
3. Переменная окружения `MONGODB_URI`.

## Экспорты и контракты

1. `connectToDatabase(): Promise<Db>`.
2. `getCollection<TDocument>(name: string)`.
3. Подключение к MongoDB кэшируется на уровне модуля, чтобы не открывать новый клиент на каждый запрос.

## Нетривиальная логика

1. Модуль поддерживает повторное использование одного MongoDB клиента.
2. Ошибка по отсутствующему `MONGODB_URI` возникает рано и явно.
3. Относительный импорт переведён на `./_loadEnv.js`, чтобы серверный ESM build на Vercel не падал из-за отсутствия явного расширения.
4. При проблемах подключения модуль пишет диагностический `console.error`, чтобы Vercel runtime logs показывали причину неуспешного Mongo handshake или сбоя инициализации индексов.

## Где используется

1. `lib/repositories/collection.repository.ts`.
2. `lib/services/collection.service.ts`.
3. Любые serverless handlers, работающие с коллекциями и карточками через repository/service layer.
