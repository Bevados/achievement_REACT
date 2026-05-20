# lib/controllers/controller-error.ts

## Что делает файл

Нормализует ошибки controller/service слоя и превращает их в единый HTTP envelope для Vercel API routes.

## Импорты и зависимости

1. `@vercel/node` — тип `VercelResponse`.
2. `zod` — распознавание `ZodError`.
3. `../http/api-response.js` — mapping validation issues и отправка ошибок.

## Экспорты и контракты

1. Экспортирует `handleControllerError(res, error)`.
2. Функция принимает уже пойманную ошибку и сама выбирает корректный статус/сообщение ответа.

## Нетривиальная логика

1. Zod-ошибки отдельно маппятся в список понятных validation issues.
2. Runtime-ошибки service layer приводятся к пользовательским русским сообщениям.
3. Relative import на `api-response.js` зафиксирован с явным расширением для Vercel ESM build.
4. Для полностью неожиданных ошибок helper пишет `console.error`, чтобы production и preview логи на Vercel сохраняли первопричину `500`.

## Где используется

1. `lib/controllers/collection.controller.ts`.
2. Косвенно все `api/*` handlers, которые делегируют ошибки в controller layer.
