/*
  ========================================
  FIREBASE ADMIN ИНИЦИАЛИЗАЦИЯ (СЕРВЕРНАЯ)
  ========================================

  - инициализирует Firebase Admin SDK (для серверной части приложения);
  - предоставляет единый экземпляр `admin` для использования в API функциях;
  - помогает верифицировать ID-токены, приходящие от клиента;

  Разница между Firebase SDK и Firebase Admin SDK:
  - `firebase` SDK (клиентский) — безопасен для фронтенда, использует публичные API ключи;
  - `firebase-admin` SDK (серверный) — для бэкенда, требует приватные учетные данные
    (сервис-аккаунта), имеет большие привилегии и прямой доступ к базе данных.

  БЕЗОПАСНОСТЬ:
  - Никогда не импортируйте этот файл на клиенте!!!
  - Приватные ключи сервис-аккаунта хранятся ТОЛЬКО в переменных окружения.
  - На локальной машине: файл `.env.local` (в .gitignore).
  - На Vercel: добавьте переменные в Settings > Environment Variables.

  ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ (нужны на сервере):
  FIREBASE_PROJECT_ID          — ID проекта Firebase
  FIREBASE_PRIVATE_KEY         — приватный ключ (из JSON сервис-аккаунта)
  FIREBASE_CLIENT_EMAIL        — email сервис-аккаунта
*/

import * as admin from 'firebase-admin';

// --- Инициализация Admin SDK ---
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// --- Экспортируем готовую инстанцию Admin SDK ---
// Используется в других API функциях для верификации токенов и работы с БД.
export default admin;

/**
 * ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: Верификация ID-токена.
 *
 * ПРОЦЕСС АУТЕНТИФИКАЦИИ:
 * 1. Пользователь логинится на клиенте (firebase.ts -> signInEmail)
 * 2. Google отправляет ID-токен клиенту
 * 3. Клиент делает запрос к серверу с этим токеном (в заголовке Authorization: Bearer <token>)
 * 4. Сервер вызывает эту функцию, чтобы ВЕРИФИЦИРОВАТЬ что токен подлинный и не истек
 * 5. Если валиден — возвращаем данные пользователя, иначе — ошибка
 */
export async function verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
  try {
    // admin.auth().verifyIdToken() проверяет подпись токена и срок действия
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error(`Token verification failed: ${(error as Error).message}`);
  }
}

/**
 * ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: Получение данных пользователя по UID.
 *
 * UID — уникальный идентификатор пользователя в Firebase.
 * Используется для получения доп. информации о пользователе (email, displayName и т.д.)
 */
export async function getUserRecord(uid: string): Promise<admin.auth.UserRecord> {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return userRecord;
  } catch (error) {
    throw new Error(`Failed to get user: ${(error as Error).message}`);
  }
}
