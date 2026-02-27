/*
  =========================================
  MONGODB CONNECTION HELPER (СЕРВЕРНАЯ)
  =========================================

  ЧТО ДЕЛАЕТ ЭТОТ ФАЙЛ:
  - управляет подключением к MongoDB Atlas;
  - кеширует соединение между вызовами функций (критично для serverless);
  - экспортирует готовый клиент и функции-помощники для работы с базой данных;
  - предоставляет безопасный способ выполнения запросов без утечки данных.

  ВАЖНО — SERVERLESS И КЕШИРОВАНИЕ СОЕДИНЕНИЯ:

  На Vercel функции запускаются в "холодном" (холодный старт) или "теплом" состоянии:
  - Холодный старт: функция инициализируется с нуля (первый вызов, требует инициа-
    лизации всех импортов и подключений);
  - Теплый старт: функция уже загружена в памяти, переменные уже инициализированы.

  Каждый раз создавать новое подключение к MongoDB — дорого (100+ мс). Поэтому мы
  кешируем connection в глобальной переменной, которая сохраняется между вызовами
  в теплом состоянии. Это ускоряет отклик в 10+ раз.

  ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ (нужны на сервере):
  MONGODB_URI — строка подключения MongoDB Atlas (формат: mongodb+srv://user:pass@cluster.mongodb.net)

  Формат строки подключения MongoDB:
  mongodb+srv://[username]:[password]@[cluster].mongodb.net/[database]?[options]

  На локальной машине: .env.local (в .gitignore)
  На Vercel: Settings > Environment Variables
*/

import { MongoClient, Db } from 'mongodb';
import type { Document } from 'mongodb';

// ============================================
// ГЛОБАЛЬНОЕ КЕШИРОВАНИЕ ПОДКЛЮЧЕНИЯ
// ============================================

interface CachedConnection {
  client: MongoClient | null;
  db: Db | null;
}

// Глобальная переменная для кеша. Будет сохранена между вызовами в теплом состоянии.
// В холодном старте = undefined, потом инициализируется и переиспользуется.
declare global {
  var mongoCache: CachedConnection | undefined;
}

// Инициализируем кеш, если его еще нет
if (!global.mongoCache) {
  global.mongoCache = { client: null, db: null };
}

// ============================================
// ОСНОВНАЯ ФУНКЦИЯ: ПОДКЛЮЧЕНИЕ К MONGODB
// ============================================

/**
 * connectToDatabase() — подключает к MongoDB или берет из кеша
 *
 * ЛОГИКА:
 * 1. Если соединение уже есть в кеше и клиент подключен → возвращаем из кеша (быстро)
 * 2. Если кеша нет или клиент отключен → создаем новое соединение
 * 3. Сохраняем соединение в глобальный кеш для следующих вызовов функции
 *
 * ВОЗВРАЩАЕТ: объект с { client, db }
 * - client: MongoClient — полноценный клиент для прямой работы с БД (если нужно)
 * - db: Db — ссылка на конкретную БД (берется название из MONGODB_URI)
 */
export async function connectToDatabase(): Promise<{
  client: MongoClient;
  db: Db;
}> {
  if (global.mongoCache?.client && global.mongoCache.db) {
    // Быстрый путь: берем из кеша (на теплом старте)
    return {
      client: global.mongoCache.client,
      db: global.mongoCache.db,
    };
  }

  // Если кеша нет или он мертв, создаем новое соединение
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  // Создаем новый MongoClient
  const client = new MongoClient(uri);

  try {
    // Подключаемся к серверу MongoDB (при необходимости проверяет соединение)
    await client.connect();

    // Получаем ссылку на БД. По умолчанию берем название из URI (например, "achievements")
    // Если нужна конкретная БД, можно передать параметр client.db('my_database')
    const db = client.db();

    // Сохраняем в глобальный кеш для следующих вызовов
    if (!global.mongoCache) {
      global.mongoCache = { client, db };
    } else {
      global.mongoCache.client = client;
      global.mongoCache.db = db;
    }

    return { client, db };
  } catch (error) {
    // Если ошибка при подключении — выбрасываем с понятным сообщением
    throw new Error(`Failed to connect to MongoDB: ${(error as Error).message}`);
  }
}

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

/**
 * getDatabase() — получить БД (использует внутренне connectToDatabase)
 */
export async function getDatabase(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}

/**
 * getCollection() — получить конкретную коллекцию из БД
 * Поддерживает типизацию через generic параметр T:
 * const collection = await getCollection<MyType>('items');
 */
export async function getCollection<T extends Document = Document>(collectionName: string) {
  const db = await getDatabase();
  return db.collection<T>(collectionName);
}

/**
 * closeConnection() — закрыть соединение (при необходимости)
 *
 * КОГДА ИСПОЛЬЗОВАТЬ:
 * - При остановке сервера (нормально завершить работу)
 * - При перезагрузке приложения
 * - Обычно НЕ вызывается в serverless функциях (они завершаются автоматически)
 */
export async function closeConnection(): Promise<void> {
  if (global.mongoCache?.client) {
    await global.mongoCache.client.close();
    global.mongoCache.client = null;
    global.mongoCache.db = null;
  }
}

// ============================================
// ПРИМЕР ИСПОЛЬЗОВАНИЯ (для документа)
// ============================================

/*
  ПРИМЕР 1: Получить все документы из коллекции 'items'
  --------------------------------------------------------
  const collection = await getCollection('items');
  const items = await collection.find({}).toArray();

  ПРИМЕР 2: Вставить новый документ
  ----------------------------------
  const collection = await getCollection('items');
  const result = await collection.insertOne({ name: 'Item 1', owner: 'user123' });
  console.log('Inserted ID:', result.insertedId);

  ПРИМЕР 3: Обновить документ по ID
  -----------------------------------
  import { ObjectId } from 'mongodb';
  const collection = await getCollection('items');
  await collection.updateOne(
    { _id: new ObjectId('...') },
    { $set: { name: 'Updated Name' } }
  );

  ПРИМЕР 4: Удалить документ
  ---------------------------
  import { ObjectId } from 'mongodb';
  const collection = await getCollection('items');
  await collection.deleteOne({ _id: new ObjectId('...') });
*/
