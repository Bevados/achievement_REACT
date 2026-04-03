# Визуальная карта исполнения проекта

Документ отвечает на 3 вопроса:

- Что делает каждый ключевой файл
- Кто кого вызывает
- Как идет исполнение по шагам

## 1) Карта слоев и связей

```mermaid
flowchart TB
  subgraph FE[Frontend]
    main[src/main.tsx]
    app[src/App.tsx]
    header[src/components/Header/Header.tsx]
    authModal[src/components/Auth/AuthModal.tsx]
    loginForm[src/components/Auth/LoginForm.tsx]
    registerForm[src/components/Auth/RegisterForm.tsx]
    themeToggle[src/components/ThemeToggle/ThemeToggle.tsx]

    authStore[src/store/auth.store.ts]
    modalStore[src/store/modal.store.ts]
    themeStore[src/store/theme.store.tsx]
    firebaseClient[src/firebase.ts]
    itemsApi[src/api/items.api.ts]
  end

  subgraph BE[Serverless API]
    itemsHandler[api/items/index.ts]
    authMw[lib/middleware/auth.ts]
    itemController[lib/controllers/item.controller.ts]
    itemService[lib/services/item.service.ts]
    itemRepo[lib/repositories/item.repository.ts]
    mongo[api/_mongodb.ts]
    firebaseAdmin[api/_firebaseAdmin.ts]
  end

  main --> app
  app --> header
  app --> authModal
  app --> authStore
  app --> modalStore
  app --> themeStore

  header --> themeToggle
  themeToggle --> themeStore

  authModal --> loginForm
  authModal --> registerForm
  authModal --> modalStore
  authModal --> authStore

  loginForm --> authStore
  registerForm --> authStore
  authStore --> firebaseClient
  authStore --> itemsApi

  itemsApi --> itemsHandler
  itemsHandler --> authMw
  itemsHandler --> itemController
  authMw --> firebaseAdmin
  itemController --> itemService
  itemService --> itemRepo
  itemRepo --> mongo
```

## 2) Кто вызывает кого

### Точка входа

- src/main.tsx
  - вызывает рендер React и монтирует src/App.tsx

### Корневой компонент

- src/App.tsx
  - рендерит src/components/Header/Header.tsx
  - рендерит src/components/Auth/AuthModal.tsx
  - вызывает useThemeStore().initTheme()
  - вызывает useAuthStore().initAuthListener()
  - передает в Header колбэки onOpenLogin/onOpenRegister, которые вызывают useModalStore().openModal(...)

### Шапка

- src/components/Header/Header.tsx
  - показывает публичное/приватное меню из src/config/site.config.ts
  - при клике Вход/Регистрация вызывает колбэки из App
  - при клике Выход вызывает onLogout (это useAuthStore().logout)
  - использует src/components/ThemeToggle/ThemeToggle.tsx

### Модалка авторизации

- src/components/Auth/AuthModal.tsx
  - берет состояние модалки из src/store/modal.store.ts
  - берет clearError из src/store/auth.store.ts
  - в зависимости от activeModal рендерит LoginForm или RegisterForm

### Формы

- src/components/Auth/LoginForm.tsx
  - вызывает useAuthStore().login
  - затем вызывает useAuthStore().probeProtectedApi
- src/components/Auth/RegisterForm.tsx
  - вызывает useAuthStore().register
  - затем вызывает useAuthStore().probeProtectedApi

### Auth store

- src/store/auth.store.ts
  - initAuthListener использует onAuthStateChange из src/firebase.ts
  - login/register/logout используют функции из src/firebase.ts
  - probeProtectedApi вызывает src/api/items.api.ts

### Frontend API клиент

- src/api/items.api.ts
  - берет токен через getIdToken из src/firebase.ts
  - отправляет GET /api/items с Authorization: Bearer <token>

### Backend цепочка

- api/items/index.ts
  - вызывает verifyAuth из lib/middleware/auth.ts
  - маршрутизирует методы в lib/controllers/item.controller.ts
- lib/controllers/item.controller.ts
  - валидирует запросы
  - вызывает lib/services/item.service.ts
- lib/services/item.service.ts
  - формирует данные и вызывает lib/repositories/item.repository.ts
- lib/repositories/item.repository.ts
  - делает CRUD в MongoDB через api/\_mongodb.ts

## 3) Сценарий: запуск приложения

```mermaid
sequenceDiagram
  participant Browser as Browser
  participant Main as src/main.tsx
  participant App as src/App.tsx
  participant ThemeStore as src/store/theme.store.tsx
  participant AuthStore as src/store/auth.store.ts
  participant Firebase as src/firebase.ts

  Browser->>Main: Загружает приложение
  Main->>App: Монтирует App
  App->>ThemeStore: initTheme()
  App->>AuthStore: initAuthListener()
  AuthStore->>Firebase: onAuthStateChange(...)
  Firebase-->>AuthStore: User|null
  AuthStore-->>App: Обновляет user/isInitialized
  App-->>Browser: Рендер Header + AuthModal
```

## 4) Сценарий: вход пользователя

```mermaid
sequenceDiagram
  participant User as Пользователь
  participant Header as Header.tsx
  participant ModalStore as modal.store.ts
  participant AuthModal as AuthModal.tsx
  participant Login as LoginForm.tsx
  participant AuthStore as auth.store.ts
  participant Firebase as firebase.ts

  User->>Header: Клик Вход
  Header->>ModalStore: openModal(login)
  ModalStore-->>AuthModal: isOpen=true, activeModal=login
  User->>Login: Submit email/password
  Login->>AuthStore: login(email,password)
  AuthStore->>Firebase: signInEmail(...)
  Firebase-->>AuthStore: user
  AuthStore-->>Login: успех
  Login->>AuthStore: probeProtectedApi()
  AuthStore-->>AuthModal: состояние авторизации обновлено
```

## 5) Сценарий: защищенный запрос к API

```mermaid
sequenceDiagram
  participant Login as LoginForm/RegisterForm
  participant AuthStore as auth.store.ts
  participant ItemsApi as src/api/items.api.ts
  participant FirebaseClient as src/firebase.ts
  participant Handler as api/items/index.ts
  participant AuthMw as lib/middleware/auth.ts
  participant FirebaseAdmin as api/_firebaseAdmin.ts
  participant Controller as lib/controllers/item.controller.ts
  participant Service as lib/services/item.service.ts
  participant Repo as lib/repositories/item.repository.ts
  participant Mongo as api/_mongodb.ts

  Login->>AuthStore: probeProtectedApi()
  AuthStore->>ItemsApi: probeItemsEndpoint()
  ItemsApi->>FirebaseClient: getIdToken()
  FirebaseClient-->>ItemsApi: token
  ItemsApi->>Handler: GET /api/items (Bearer token)
  Handler->>AuthMw: verifyAuth(req,res)
  AuthMw->>FirebaseAdmin: verifyIdToken(token)
  FirebaseAdmin-->>AuthMw: uid
  AuthMw-->>Handler: req.userId=uid
  Handler->>Controller: getItems(req,res)
  Controller->>Service: getItems(userId)
  Service->>Repo: findUserItems(userId)
  Repo->>Mongo: find().toArray()
  Mongo-->>Repo: items
  Repo-->>Service: items
  Service-->>Controller: items
  Controller-->>Handler: 200 JSON
  Handler-->>ItemsApi: response
  ItemsApi-->>AuthStore: { ok, status, data }
```

## 6) Как пользоваться этой картой в обучении

1. Если неясно, где начинается процесс: смотреть сначала диаграмму из раздела 3.
2. Если непонятно, почему не открывается форма входа: смотреть раздел 4 и цепочку Header -> modal.store -> AuthModal.
3. Если непонятно, почему API возвращает 401: смотреть раздел 5 и проверять участок ItemsApi -> verifyAuth -> firebaseAdmin.
4. Если нужно понять ответственность файла: смотреть раздел 2 (кто вызывает кого).
