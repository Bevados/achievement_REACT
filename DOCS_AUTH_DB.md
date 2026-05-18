# Auth And DB Notes

Актуальные заметки по аутентификации и доступу к базе в проекте `achievement_collections_REACT`.

## Auth flow

1. Клиент использует Firebase client SDK из `src/firebase.ts`.
2. Для private API клиент получает ID token и отправляет его как `Authorization: Bearer <token>`.
3. `lib/middleware/auth.ts` проверяет токен через Firebase Admin (`api/_firebaseAdmin.ts`).
4. После успешной проверки backend использует `req.userId` для owner-based access control.

## Private API

- `/api/collections`
- `/api/collections/:collectionId`
- `/api/collections/:collectionId/entries`
- `/api/collections/:collectionId/entries/:entryId`

Все private endpoints требуют Bearer token.

## Public API

- `/api/examples/collections`
- `/api/examples/collections/:collectionId`
- `/api/examples/collections/:collectionId/entries`

Public examples работают в read-only режиме и не требуют auth.

## MongoDB

Backend работает с двумя актуальными коллекциями:

- `collections`
- `entries`

`lib/repositories/collection.repository.ts` отвечает за фильтрацию, пагинацию, сортировку и owner/public ограничения.

## Важные инварианты

1. Private owner никогда не должен видеть чужие private коллекции или entries.
2. Public flow не должен давать private actions.
3. `category='other'` требует непустой `customCategory`.
4. Для `entry.status='completed'` обязательны `rating` и `dateStart`.
