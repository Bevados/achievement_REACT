# 📚 ПОЛНАЯ ДОКУМЕНТАЦИЯ: FIREBASE AUTH + MONGODB ATLAS

> Руководство по настройке и использованию системы аутентификации и базы данных.

---

## 📋 ОГЛАВЛЕНИЕ

1. [Быстрый старт](#быстрый-старт)
2. [Что где находится](#что-где-находится)
3. [Получение конфигурации Firebase](#получение-конфигурации-firebase)
4. [Получение MongoDB URI](#получение-mongodb-uri)
5. [Настройка переменных окружения](#настройка-переменных-окружения)
6. [Как это работает](#как-это-работает)
7. [Примеры использования](#примеры-использования)
8. [Безопасность](#безопасность)
9. [Решение проблем](#решение-проблем)

---

## 🚀 Быстрый старт

### За 5 минут на локальной машине:

```bash
# 1. Затем скопируйте конфигурацию (см. ниже)

# 2. Создайте файл .env.local в корне проекта:
cat > .env.local << 'EOF'
# Firebase (публичные данные, можно в коде, но сейчас храним в env)
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID

# Firebase Admin (приватные! никогда не коммитить в git)
FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEva...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@YOUR_PROJECT.iam.gserviceaccount.com

# MongoDB (приватная! никогда не коммитить в git)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/your_db?retryWrites=true&w=majority
EOF

# 3. Не коммитьте .env.local в git!
# 4. npm run dev — готово!
```

---

## 🗂️ Что где находится

```
src/
├── firebase.ts                 # ✅ Клиентская инициализация Firebase
├── components/
│   └── AuthForm.tsx           # Пример: форма логина/регистрации (TODO)
│
api/
├── _firebaseAdmin.ts          # ✅ Серверная инициализация Firebase Admin
├── _mongodb.ts                # ✅ Подключение к MongoDB (с кешированием)
├── items/                     # ✅ Пример: защищенный CRUD, разделённый на слои
# (см. api/items/index.ts, controllers/, services/, repositories/)

.env.local                      # 🔒 Приватные переменные (локально)
.env.example                    # 📝 Шаблон (безопасно коммитить)
.gitignore                      # Убедитесь что .env.local там есть
DOCS_AUTH_DB.md                # 📚 Этот файл
```

### Файло-функциональный граф зависимостей:

```
[Клиент браузер]
    ↓ (отправляет email+password)
[src/firebase.ts]
    ├─ signInEmail() — логин
    ├─ signOut() — выход
    ├─ getIdToken() — получить токен для запроса на сервер
    └─ onAuthStateChange() — слушать изменения состояния

[Клиент отправляет: Authorization: Bearer <idToken>]

[Vercel API Function - api/items/index.ts (директория `api/items/`)]
    ↓ (проверка токена)
[api/_firebaseAdmin.ts]
    └─ verifyIdToken() — проверить что токен подлинный и не истек

[Если токен OK, работаем с БД]

[api/_mongodb.ts]
    ├─ connectToDatabase() — подключение с кешированием
    ├─ getDatabase() — получить БД
    └─ getCollection() — получить коллекцию

# Заметка: В рефакторинге `items.ts` превратилась в папку `api/items/`,
# где файл `index.ts` выступает точкой входа, а логика разбита на слои,
# что улучшает тестируемость и структуру кода.
    
[Работа с коллекцией MongoDB]
```

---

## 🔐 Получение конфигурации Firebase

### Шаг 1: Зайти в Firebase Console

1. Перейти https://console.firebase.google.com/
2. Выбрать ваш проект (или создать новый)
3. Нажать "⚙️ Параметры" в левом меню → вкладка "Основные"

### Шаг 2: Скопировать конфиг (публичные данные)

Вы видите что-то вроде:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "my-project.firebaseapp.com",
  projectId: "my-project",
  storageBucket: "my-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

Скопируйте эти значения в соответствующие переменные `.env.local`:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=my-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-project
VITE_FIREBASE_STORAGE_BUCKET=my-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Шаг 3: Включить Email/Password аутентификацию

1. Firebase Console → Authentication (левое меню)
2. Вкладка "Способы входа"
3. Нажать на "Email/Password"
4. Включить "Email/Password" (первый переключатель)
5. Сохранить

Теперь пользователи смогут регистрироваться и логиниться через email/password через `signInEmail()` из `src/firebase.ts`.

### Шаг 4: Получить приватный ключ (для сервера)

**⚠️ КРИТИЧНО: Никогда не коммитьте эти ключи в git!**

1. Firebase Console → Project Settings (⚙️ в левом меню)
2. Вкладка "Сервис-аккаунты"
3. Нажать "Создать новый приватный ключ"
4. Согласиться с предупреждением и скачать JSON файл

Содержимое JSON выглядит примерно так:

```json
{
  "type": "service_account",
  "project_id": "my-project",
  "private_key_id": "1234567890",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@my-project.iam.gserviceaccount.com",
  ...
}
```

Из этого JSON извлеките три значения:

```
FIREBASE_PROJECT_ID=my-project
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@my-project.iam.gserviceaccount.com
```

**ВАЖНО:** Приватный ключ содержит `\n` — это переводы строк. Когда вставляете в `.env.local`, убедитесь что они присутствуют явно (как показано выше с кавычками).

---

## 🗄️ Получение MongoDB URI

### Шаг 1: MongoDB Atlas

1. Перейти https://www.mongodb.com/cloud/atlas
2. Логин или регистрация (бесплатный аккаунт)
3. Создать новый кластер (бесплатный M0)

### Шаг 2: Получить string для подключения

1. Atlas Dashboard → Clusters
2. Нажать "Connect"
3. Выбрать "Drivers"
4. Выбрать язык "Node.js" и версию "latest"
5. Скопировать connection string:

```
mongodb+srv://username:password@cluster-name.mongodb.net/database_name?retryWrites=true&w=majority
```

### Шаг 3: Модифицировать строку

Замените:
- `username` → ваше имя пользователя MongoDB
- `password` → ваш пароль (замените спецсимволы если есть)
- `database_name` → выберите имя, например "achievements"

Итоговая строка:

```
MONGODB_URI=mongodb+srv://alex:myPassword123@cluster0.xxxxx.mongodb.net/achievements?retryWrites=true&w=majority
```

### Шаг 4: IP Whitelist

На Atlas → Network Access → добавьте ваш IP (или 0.0.0.0/0 для разработки).

---

## ⚙️ Настройка переменных окружения

### Локально (.env.local)

Создайте файл `.env.local` в корне проекта:

```env
# ========== FIREBASE (публичные для клиента) ==========
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=my-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-project
VITE_FIREBASE_STORAGE_BUCKET=my-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# ========== FIREBASE ADMIN (приватные для сервера) ==========
FIREBASE_PROJECT_ID=my-project
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@my-project.iam.gserviceaccount.com

# ========== MONGODB (приватная) ==========
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/achievements?retryWrites=true&w=majority
```

**КРИТИЧНО: Добавьте .env.local в .gitignore!**

```bash
echo ".env.local" >> .gitignore
```

### На Vercel

1. Перейти на https://vercel.com → ваш проект
2. Settings → Environment Variables
3. Добавьте ВСЕ переменные из .env.local (все 9 штук)
4. Save

**ПРИМЕЧАНИЕ:** Переменные с `VITE_` также должны быть на Vercel, так как они нужны для сборки.

### Файл .env.example (для документации)

Создайте `.env.example` (БЕЗ реальных значений) для показа другим:

```env
# Publick Firebase config
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID

# Private Firebase Admin Keys
FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@YOUR_PROJECT.iam.gserviceaccount.com

# Private MongoDB connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

---

## 🔄 Как это работает

### Сценарий 1: Пользователь логинится

```
┌─────────────────────────────────────────────────────┐
│ 1. Пользователь вводит email и пароль на фронте    │
│    (компонент с формой логина — TODO)              │
└──────────────┬──────────────────────────────────────┘

┌──────────────▼──────────────────────────────────────┐
│ 2. src/firebase.ts — signInEmail(email, password)  │
│    Firebase Client SDK контактирует с Google        │
│    Google проверяет email/пароль                    │
└──────────────┬──────────────────────────────────────┘

┌──────────────▼──────────────────────────────────────┐
│ 3. Google возвращает ID-токен (JWT) клиенту        │
│    Токен содержит: uid, email, срок действия (1ч)  │
└──────────────┬──────────────────────────────────────┘

┌──────────────▼──────────────────────────────────────┐
│ 4. Клиент сохраняет токен в памяти Firebase        │
│    (auth.currentUser теперь не null)               │
└──────────────┬──────────────────────────────────────┘

✅ Пользователь логинован на фронте
```

### Сценарий 2: Пользователь делает запрос к приватному API

```
┌─────────────────────────────────────────────────────┐
│ 1. Фронт: fetch('/api/items', {                    │
│     headers: {                                      │
│       Authorization: `Bearer ${await getIdToken()}` │
│     }                                               │
│   })                                                │
└──────────────┬──────────────────────────────────────┘

┌──────────────▼──────────────────────────────────────┐
│ 2. src/firebase.ts — getIdToken()                  │
│    Получает текущий ID-токен из auth.currentUser  │
│    (или создает новый если истек — auto refresh)   │
└──────────────┬──────────────────────────────────────┘

┌──────────────▼──────────────────────────────────────┐
│ 3. Отправляем запрос на сервер с токеном:         │
│    Authorization: Bearer eyJhbGciOiJSUzI1NiIs...  │
└──────────────┬──────────────────────────────────────┘

┌──────────────▼──────────────────────────────────────┐
│ 4. api/items/index.ts (middleware `verifyAuth`)     │
│    Обрабатывает Authorization заголовок, извлекает  │
│    токен и вызывает `verifyIdToken()` из Admin SDK  │
│    Результат: req.userId, либо 401 Unauthorized     │
└──────────────┬──────────────────────────────────────┘

┌──────────────▼──────────────────────────────────────┐
│ 5. api/_firebaseAdmin.ts — verifyIdToken(token)   │
│    Admin SDK контактирует с Firebase               │
│    Проверяет подпись токена (криптография)        │
│    Проверяет срок действия                         │
│    Возвращает uid пользователя или ошибку         │
└──────────────┬──────────────────────────────────────┘

┌──────────────▼──────────────────────────────────────┐
│ 6. Если токен валиден → req.userId = uid           │
│    Если не валиден → ответ 401 Unauthorized        │
└──────────────┬──────────────────────────────────────┘

┌──────────────▼──────────────────────────────────────┐
│ 7. Если все OK → маршрутизируем по методу:         │
│    GET    → handleGetItems() → MongoDB.find()      │
│    POST   → handleCreateItem() → MongoDB.insert()  │
│    PATCH  → handleUpdateItem() → MongoDB.update()  │
│    DELETE → handleDeleteItem() → MongoDB.delete()  │
└──────────────┬──────────────────────────────────────┘

┌──────────────▼──────────────────────────────────────┐
│ 8. api/_mongodb.ts:                                │
│    - connectToDatabase() — берет/создает подкл.   │
│    - getCollection('items') — берет коллекцию     │
│    - Выполняет операцию (find/insert/update/del)  │
└──────────────┬──────────────────────────────────────┘

┌──────────────▼──────────────────────────────────────┐
│ 9. Возвращаем результат фронту (JSON)             │
└──────────────────────────────────────────────────────┘

✅ Запрос выполнен, данные получены
```

---

## 💡 Примеры использования

### Пример 1: Логин и получение токена (фронтенд)

```typescript
import { signInEmail, getIdToken } from '@/firebase';

// Логин
try {
  const user = await signInEmail('user@example.com', 'password123');
  console.log('Logged in:', user.uid);
} catch (error) {
  console.error('Login failed:', error);
}

// Получение токена для запроса к API
const token = await getIdToken();
console.log('Token:', token);

// Использование в fetch
const response = await fetch('/api/items', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

### Пример 2: GET запрос (фронтенд)

```typescript
async function fetchMyItems() {
  const token = await getIdToken();
  
  const response = await fetch('/api/items', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const { data } = await response.json();
  console.log('My items:', data);
  return data;
}
```

### Пример 3: POST запрос (создать item)

```typescript
async function createItem(name: string, description: string) {
  const token = await getIdToken();

  const response = await fetch('/api/items', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      description,
      completed: false
    })
  });

  const result = await response.json();
  return result.data;
}

// Использование:
const newItem = await createItem('Learn TypeScript', 'Study advanced types');
```

### Пример 4: PATCH запрос (обновить item)

```typescript
async function updateItem(id: string, updates: Record<string, any>) {
  const token = await getIdToken();

  const response = await fetch(`/api/items?id=${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });

  return response.json();
}

// Использование:
await updateItem('507f1f77bcf86cd799439011', {
  completed: true,
  name: 'Updated name'
});
```

### Пример 5: DELETE запрос

```typescript
async function deleteItem(id: string) {
  const token = await getIdToken();

  const response = await fetch(`/api/items?id=${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return response.json();
}

// Использование:
await deleteItem('507f1f77bcf86cd799439011');
```

### Пример 6: Слушание изменений в аутентификации

```typescript
import { onAuthStateChange } from '@/firebase';
import { useEffect, useState } from 'react';

function MyComponent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Подписываемся на изменения (вход/выход)
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Отписываемся при размонтировании
    return unsubscribe;
  }, []);

  if (loading) return <div>Загрузка...</div>;
  
  if (!user) return <div>Пожалуйста, залогинитесь</div>;
  
  return <div>Привет, {user.email}!</div>;
}
```

---

## 🔒 Безопасность

### ✅ Что мы делаем правильно

1. **Клиент не видит приватные ключи**
   - `src/firebase.ts` использует только публичный API ключ
   - Приватные ключи живут только на сервере (в переменных окружения Vercel)

2. **Сервер верифицирует токены**
   - Admin SDK проверяет подпись токена (криптографическая верификация)
   - Проверяет срок действия
   - Выбрасывает 401 Unauthorized если невалиден

3. **Авторизация (не путайте с аутентификацией)**
   - Пользователь может работать только со своими данными
   - В `api/items/*`: контроллеры/репозиторий проверяют `owner == userId` перед каждой операцией

4. **Переменные окружения**
   - Приватные ключи не коммитятся в git (.gitignore)
   - На Vercel хранятся в зашифрованном виде

### ⚠️ Что добавить в production

```typescript
// 1. RATE LIMITING — ограничить кол-во запросов в минуту
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100 // макс 100 запросов за 15 минут
});

// 2. CORS — настроить правильные домены
res.setHeader('Access-Control-Allow-Origin', 'https://yourdomain.com');

// 3. HELMET — добавить защитные заголовки
import helmet from 'helmet';
app.use(helmet());

// 4. VALIDATION — проверять входные данные
import { z } from 'zod';

const ItemSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  completed: z.boolean()
});

const validated = ItemSchema.parse(req.body);

// 5. LOGGING — логировать попытки доступа
console.log(`[${new Date().toISOString()}] User ${userId} accessed GET /api/items`);
```

---

## 🆘 Решение проблем

### ❌ Ошибка: "Firebase configuration seems incomplete"

**Причина:** Отсутствуют env переменные VITE_FIREBASE_*

**Решение:**
1. Проверьте что `.env.local` существует и содержит все 6 переменных `VITE_FIREBASE_*`
2. Перезагрузите dev сервер: `npm run dev`
3. Проверьте в браузере DevTools → Console

### ❌ Ошибка: "MONGODB_URI environment variable is not set"

**Причина:** На сервере нет переменной `MONGODB_URI`

**Решение:**
- На локальной машине: добавьте в `.env.local`
- На Vercel: Settings → Environment Variables → добавьте `MONGODB_URI`
- На Vercel нужно переподключить и перезагрузить проект

### ❌ Ошибка: "Token verification failed"

**Причина:** Firebase не может верифицировать токен

**Возможные причины:**
- Приватный ключ некорректно установлен (проверьте переводы строк `\n`)
- FIREBASE_PROJECT_ID не совпадает с тем что в токене
- Токен истек (старше 1 часа)

**Решение:**
1. Проверьте что все три переменные (`FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`) корректны
2. На локальной машине выполните: `node -e "console.log(process.env.FIREBASE_PRIVATE_KEY)"`
   - Должны видеть полный ключ с `-----BEGIN PRIVATE KEY-----`

### ❌ Ошибка: "401 Unauthorized"

**Причина:** Токен отсутствует или невалиден в заголовке Authorization

**Решение:**
1. Проверьте что клиент отправляет заголовок: `Authorization: Bearer {token}`
2. Проверьте что токен получен из `getIdToken()`
3. В браузере DevTools → Network → смотрите headers запроса

### ❌ Ошибка: "Item not found or access denied"

**Причина:** Либо item не существует, либо belongs не текущему пользователю

**Решение:**
1. Убедитесь что item создал текущий пользователь (owner == userId)
2. Убедитесь что ID правильный (24-хсимвольный ObjectId)

### ✅ Как отладить локально

```bash
# 1. Смотрите логи dev сервера
npm run dev
# В терминале должны видеть: "⚡ Vite dev server running at ..."

# 2. Откройте DevTools браузера (F12)
# - Console: смотрите Firebase warnings
# - Network: смотрите запросы к /api/items, headers, response

# 3. Добавьте console.log в код для отладки
// src/firebase.ts
const token = await getIdToken();
console.log('Token for API:', token);

// api/items/index.ts (или middleware/auth.ts)
console.log('Authorization header:', req.headers.authorization);
console.log('Decoded token:', decodedToken);
```

---

## 📚 Дополнительные ресурсы

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)

---

**Документация обновлена: 23 февраля 2026**
