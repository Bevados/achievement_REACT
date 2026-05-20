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

  На Vercel функции запускаются в "холодном" (холодный старт) или "тёплом" состоянии:
  - Холодный старт: функция инициализируется с нуля (первый вызов, требует инициализации
    всех импортов и подключений);
  - Тёплый старт: функция уже загружена в памяти, переменные уже инициализированы.

  Каждый раз создавать новое подключение к MongoDB — дорого. Поэтому connection кешируется
  в глобальной переменной и переиспользуется между вызовами в тёплом состоянии.
*/

import { MongoClient, Db } from 'mongodb';
import type { Document } from 'mongodb';
import { ensureServerEnvLoaded } from './_loadEnv.js';

ensureServerEnvLoaded();

interface CachedConnection {
  client: MongoClient | null;
  db: Db | null;
  indexesInitialized: boolean;
}

declare global {
  var mongoCache: CachedConnection | undefined;
}

if (!global.mongoCache) {
  global.mongoCache = { client: null, db: null, indexesInitialized: false };
}

async function initializeIndexes(db: Db): Promise<void> {
  const collections = db.collection('collections');
  const entries = db.collection('entries');

  await Promise.all([
    collections.createIndex(
      { ownerId: 1, updatedAt: -1 },
      { name: 'idx_collections_owner_updatedAt' },
    ),
    collections.createIndex(
      { ownerId: 1, category: 1, updatedAt: -1 },
      { name: 'idx_collections_owner_category_updatedAt' },
    ),
    collections.createIndex(
      { ownerId: 1, isPublic: 1, updatedAt: -1 },
      { name: 'idx_collections_owner_public_updatedAt' },
    ),
    entries.createIndex(
      { ownerId: 1, collectionId: 1, updatedAt: -1 },
      { name: 'idx_entries_owner_collection_updatedAt' },
    ),
    entries.createIndex(
      { ownerId: 1, collectionId: 1, status: 1, updatedAt: -1 },
      { name: 'idx_entries_owner_collection_status_updatedAt' },
    ),
  ]);
}

export async function connectToDatabase(): Promise<{
  client: MongoClient;
  db: Db;
}> {
  if (global.mongoCache?.client && global.mongoCache.db) {
    if (!global.mongoCache.indexesInitialized) {
      await initializeIndexes(global.mongoCache.db);
      global.mongoCache.indexesInitialized = true;
    }

    return {
      client: global.mongoCache.client,
      db: global.mongoCache.db,
    };
  }

  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    const error = new Error('MONGODB_URI environment variable is not set');
    console.error('MongoDB bootstrap failed:', error.message);
    throw error;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    await initializeIndexes(db);

    if (!global.mongoCache) {
      global.mongoCache = { client, db, indexesInitialized: true };
    } else {
      global.mongoCache.client = client;
      global.mongoCache.db = db;
      global.mongoCache.indexesInitialized = true;
    }

    return { client, db };
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw new Error(`Failed to connect to MongoDB: ${(error as Error).message}`);
  }
}

export async function getDatabase(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}

export async function getCollection<T extends Document = Document>(collectionName: string) {
  const db = await getDatabase();
  return db.collection<T>(collectionName);
}

export async function closeConnection(): Promise<void> {
  if (global.mongoCache?.client) {
    await global.mongoCache.client.close();
    global.mongoCache.client = null;
    global.mongoCache.db = null;
    global.mongoCache.indexesInitialized = false;
  }
}
