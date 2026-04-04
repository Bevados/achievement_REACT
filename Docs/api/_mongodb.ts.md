# api/\_mongodb.ts

## Что делает файл

Это серверный helper для подключения к MongoDB и доступа к коллекциям.
Модуль решает три задачи:

1. Создает соединение с MongoDB по `MONGODB_URI`.
2. Кеширует `client` и `db` в глобальной переменной для serverless warm-start.
3. Предоставляет функции `getDatabase` и `getCollection` для остального backend-кода.

## Импорты и зависимости

1. `mongodb` (`MongoClient`, `Db`, `Document`) - клиент БД и типы.
2. `process.env.MONGODB_URI` - строка подключения к MongoDB Atlas.
3. Глобальная область (`global.mongoCache`) - кеш соединения между вызовами в serverless-окружении.

## Экспорты и контракты

1. `connectToDatabase(): Promise<{ client: MongoClient; db: Db }>` - возвращает активное подключение (из кеша или новое).
2. `getDatabase(): Promise<Db>` - возвращает объект текущей БД.
3. `getCollection<T>(collectionName: string)` - возвращает типизированную коллекцию.
4. `closeConnection(): Promise<void>` - закрывает соединение и очищает кеш.
5. Инварианты:
6. `MONGODB_URI` обязателен; без него модуль бросает ошибку.
7. В warm-сценарии повторные вызовы должны переиспользовать кеш.
8. `getCollection` всегда вызывает `getDatabase`, а не создает отдельный клиент.

## Нетривиальная логика

1. Кеш в `global.mongoCache` критичен для serverless: без него каждый запрос мог бы поднимать новое дорогое соединение.
2. При ошибке подключения формируется человекочитаемая ошибка с причиной (`Failed to connect to MongoDB: ...`).
3. `closeConnection` обычно не нужен в типичном Vercel runtime, но полезен для контролируемого завершения в отдельных сценариях.

## Где используется

1. `lib/repositories/item.repository.ts` - использует `getCollection<Item>('items')` для CRUD.
2. Косвенно участвует во всех запросах к `/api/items` через цепочку `api/items/index.ts -> controller -> service -> repository`.
