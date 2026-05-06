# api/items/index.ts

## Что делает файл

Это serverless entrypoint для маршрута `/api/items` на Vercel.
Файл выполняет две ключевые задачи:

1. Проверяет аутентификацию через middleware `verifyAuth`.
2. Маршрутизирует запрос по HTTP-методу в нужный контроллер (`GET/POST/PATCH/DELETE`).

## Импорты и зависимости

1. `@vercel/node` (`VercelResponse`) - типизация ответа serverless-функции.
2. `../../lib/types/request.types` (`AuthenticatedRequest`) - расширенный request с `userId`, который устанавливает auth middleware.
3. `../../lib/middleware/auth` (`verifyAuth`) - валидирует токен и блокирует неавторизованные запросы.
4. `../../lib/controllers/item.controller` - набор обработчиков бизнес-операций над items.

## Экспорты и контракты

1. Экспортируется default-функция `handler(req, res)`.
2. Контракт входа:
2.1. `req` - объект запроса с потенциальным полем `userId` после `verifyAuth`.
2.2. `res` - объект ответа Vercel.
3. Контракт выхода:
3.1. Делегирует ответ в контроллеры или возвращает структурированный `405 METHOD_NOT_ALLOWED` для неподдерживаемых методов.
4. Инварианты:
4.1. Перед вызовом любого контроллера выполняется `verifyAuth`.
4.2. Если в `catch` уже были отправлены заголовки (`res.headersSent`), повторная отправка ответа не выполняется.

## Нетривиальная логика

1. Ошибки auth/контроллера не всегда переводятся в `500`: часть ответов может быть уже отправлена ниже по стеку.
2. Проверка `res.headersSent` защищает от двойного ответа (типичная ошибка в serverless/express-потоке).
3. `switch` по методу делает entrypoint тонким: вся логика валидации и бизнес-правил вынесена в контроллер/сервис.
4. Fallback-ответы (`405` и `500`) отдаются в едином API envelope: `{ ok: false, error: { code, message } }`.
5. Отказ от alias `@lib/*` в entrypoint помогает local `vercel dev` корректно загрузить serverless-функцию.

## Где используется

1. Автоматически вызывается платформой Vercel как обработчик маршрута `api/items`.
2. На клиенте endpoint используется через `src/api/items.api.ts`.
3. Внутренние зависимости по цепочке: `api/items/index.ts -> lib/controllers/item.controller.ts -> lib/services/item.service.ts -> lib/repositories/item.repository.ts`.
