/*
  Клиентская инициализация Firebase.
  - инициализирует Firebase App (без повторной инициализации при HMR);
  - экспортирует объект `auth` для использования по всему приложению;
  - предоставляет небольшие вспомогательные функции для входа/выхода и получения ID-токена.
*/

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';

// --- Чтение конфигурации из переменных окружения Vite ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error('Missing Firebase config');
}

// --- Инициализация Firebase App ---
// `getApps()` возвращает уже инициализированные приложения.
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  // Если уже инициализировано — берем существующее приложение.
  firebaseApp = getApps()[0];
}

// --- Экспортируем объект аутентификации ---
// `auth` используется в компонентах и при запросах к API (получение ID-токена).
export const auth = getAuth(firebaseApp);


// ----------------- Вспомогательные функции -----------------

/**
 * Вход по email/password.
 * Возвращает `User` при успешном входе или пробрасывает ошибку от Firebase.
 */
export async function signInEmail(email: string, password: string) {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return res.user;
}

/**
 * Выход из аккаунта.
 */
export async function signOut() {
  await firebaseSignOut(auth);
}

/**
 * Подписка на изменения состояния аутентификации (вход/выход).
 * Принимает колбэк, который будет вызван с `User | null`.
 * Возвращает функцию отписки.
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Получение актуального ID-токена для текущего пользователя.
 * ID-токен нужен, чтобы передать его серверу и там верифицировать с помощью Firebase Admin SDK.
 */
export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  // getIdToken() по умолчанию возвращает свежий токен, при необходимости можно
  // принудительно обновить: user.getIdToken(true)
  return user.getIdToken();
}
