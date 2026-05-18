# smoke/step-2.2.8.api.smoke.test.ts

## Зачем нужен файл

Это fallback smoke-harness для API-слоя, который напрямую проверяет `api/*` handlers и mapping controller/service-ответов без браузерного UI.

## Что покрывает

1. `401` для private endpoint-ов без Bearer-токена.
2. `401` для private endpoint-ов с невалидным токеном.
3. `422` для невалидных payload коллекций и карточек.
4. Mapping `ForbiddenError -> 403` и `NotFoundError -> 404`.
5. Unified success envelope для collection CRUD, entry CRUD и public examples.

## Актуальные договорённости

1. Тексты мок-ответов синхронизированы с текущей русской backend error-policy.
2. Это fallback/API-level smoke, а основной release-smoke для MVP живёт в `src/**/*.smoke.test.tsx` и запускается через `npm run test:smoke`.
