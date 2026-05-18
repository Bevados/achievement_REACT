# api/_mongodb.ts

## Что делает файл

Это серверный helper для подключения к MongoDB и доступа к коллекциям.
Модуль:

1. создаёт соединение по `MONGODB_URI`;
2. кеширует `client` и `db` для serverless warm-start;
3. инициализирует индексы для `collections` и `entries`;
4. предоставляет `connectToDatabase`, `getDatabase`, `getCollection`, `closeConnection`.

## Импорты и зависимости

1. `mongodb` (`MongoClient`, `Db`, `Document`) — клиент БД и типы.
2. `./_loadEnv` (`ensureServerEnvLoaded`) — локально подгружает `.env.local`.
3. `process.env.MONGODB_URI` — строка подключения к MongoDB.
4. `global.mongoCache` — кеш соединения между вызовами.

## Экспорты и контракты

1. `connectToDatabase(): Promise<{ client: MongoClient; db: Db }>`
2. `getDatabase(): Promise<Db>`
3. `getCollection<T>(collectionName: string)`
4. `closeConnection(): Promise<void>`
5. `MONGODB_URI` обязателен; без него модуль бросает ошибку.

## Нетривиальная логика

1. Кеш в `global.mongoCache` критичен для serverless и локального backend-runner.
2. Индексы инициализируются lazy при первом успешном подключении.
3. Модуль обслуживает только актуальный доменный слой `collections` и `entries`; legacy `items`-цепочка больше не используется.

## Где используется

1. `lib/repositories/collection.repository.ts` — использует коллекции `collections` и `entries`.
2. Косвенно участвует во всех запросах к `/api/collections` и `/api/examples/collections`.
