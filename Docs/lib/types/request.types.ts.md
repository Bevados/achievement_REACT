# lib/types/request.types.ts

## Что делает файл

Файл описывает расширенный тип HTTP-запроса для авторизованных API-операций.
Он добавляет поле `userId` к стандартному `VercelRequest`.

## Импорты и зависимости

1. `@vercel/node` (`VercelRequest`) - базовый тип запроса для Vercel serverless.

## Экспорты и контракты

1. Экспортируется интерфейс `AuthenticatedRequest extends VercelRequest`.
2. Добавленное поле:
3. `userId: string`.
4. Инварианты:
5. `userId` должен быть установлен middleware `verifyAuth` до выполнения контроллера.
6. Использование `AuthenticatedRequest` без auth-проверки может привести к runtime-ошибке из-за отсутствующего `userId`.

## Нетривиальная логика

1. Это типовой «контракт между middleware и контроллером»: middleware пишет `req.userId`, контроллер читает.
2. Файл не содержит runtime-кода, но критичен для корректной типизации авторизованных endpoint-ов.

## Где используется

1. `lib/middleware/auth.ts` - функция `verifyAuth` заполняет `req.userId`.
2. `lib/controllers/item.controller.ts` - handlers принимают `AuthenticatedRequest` и используют `req.userId`.
3. `api/items/index.ts` - handler типизирован как `AuthenticatedRequest`.
