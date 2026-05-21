# package.json

## Назначение

Хранит npm scripts, список зависимостей и служебные метаданные проекта.

## Импорты и зависимости

1. Файл не импортируется рантаймом как модуль, но определяет доступные dev/runtime зависимости для frontend, API и tooling.

## Экспорты и контракты

1. `scripts` задают основные команды разработки, тестирования, сборки и release-check.
2. `engines.node` фиксирует целевой Node runtime для Vercel deploy.
3. Текущее целевое значение `engines.node`: `24.x`.

## Нетривиальная логика

1. `release:check` последовательно запускает:
1.1. `npm run test:smoke`
1.2. `npm run test`
1.3. `tsc -b`
1.4. `npm run build`
1.5. `npm run lint`
1.6. `npm run docs:check`
2. Скрипт завершается на первом failing шаге и используется как локальный pre-release gate.

## Где используется

1. Локальная разработка через `npm.cmd run ...`
2. Vercel deploy использует `engines.node` для выбора production Node runtime.
