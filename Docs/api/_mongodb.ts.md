# api/\_mongodb.ts

## Что делает файл

Это серверный helper для подключения к MongoDB и доступа к коллекциям.
Модуль решает три задачи:

1. Создает соединение с MongoDB по `MONGODB_URI`.
2. Кеширует `client` и `db` в глобальной переменной для serverless warm-start.
3. Инициализирует MongoDB-индексы один раз при первом подключении (lazy runtime init).
4. Предоставляет функции `getDatabase` и `getCollection` для остального backend-кода.

## Импорты и зависимости

1. `mongodb` (`MongoClient`, `Db`, `Document`) - клиент БД и типы.
2. `process.env.MONGODB_URI` - строка подключения к MongoDB Atlas.
3. Глобальная область (`global.mongoCache`) - кеш соединения между вызовами в serverless-окружении.
4. Коллекции `collections` и `entries` - целевые коллекции для индексов шага 2.2.7.

## Экспорты и контракты

1. `connectToDatabase(): Promise<{ client: MongoClient; db: Db }>` - возвращает активное подключение (из кеша или новое).
2. `getDatabase(): Promise<Db>` - возвращает объект текущей БД.
3. `getCollection<T>(collectionName: string)` - возвращает типизированную коллекцию.
4. `closeConnection(): Promise<void>` - закрывает соединение и очищает кеш.
5. Инварианты:
 `MONGODB_URI` обязателен; без него модуль бросает ошибку.
 В warm-сценарии повторные вызовы должны переиспользовать кеш.
 `getCollection` всегда вызывает `getDatabase`, а не создает отдельный клиент.
 Индексы создаются lazy при первом успешном подключении и не переинициализируются на warm-start.

6. Набор создаваемых индексов:
 `collections`: `{ ownerId: 1, updatedAt: -1 }`.
 `collections`: `{ ownerId: 1, category: 1, updatedAt: -1 }`.
 `collections`: `{ ownerId: 1, isPublic: 1, updatedAt: -1 }`.
 `entries`: `{ ownerId: 1, collectionId: 1, updatedAt: -1 }`.
 `entries`: `{ ownerId: 1, collectionId: 1, status: 1, updatedAt: -1 }`.

## Нетривиальная логика

1. Кеш в `global.mongoCache` критичен для serverless: без него каждый запрос мог бы поднимать новое дорогое соединение.
2. Дополнительный флаг `indexesInitialized` в кеше гарантирует, что index-init выполняется один раз на экземпляр runtime.
3. Инициализация индексов выполняется внутри connect-потока: это позволяет иметь self-healing подход без ручного init-скрипта.
4. При ошибке подключения формируется человекочитаемая ошибка с причиной (`Failed to connect to MongoDB: ...`).
5. `closeConnection` обычно не нужен в типичном Vercel runtime, но полезен для контролируемого завершения в отдельных сценариях.

## Где используется

1. `lib/repositories/item.repository.ts` - использует `getCollection<Item>('items')` для CRUD.
2. `lib/repositories/collection.repository.ts` - использует `getCollection<CollectionDocument>('collections')` и `getCollection<EntryDocument>('entries')`.
3. Косвенно участвует во всех запросах к `/api/items`, `/api/collections` и `/api/examples/collections` через соответствующие controller/service/repository цепочки.
