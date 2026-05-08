# lib/services/collection.service.test.ts

## Что делает файл

Файл содержит unit-тесты первой волны (tests-first) для бизнес-логики `collection.service.ts`.
Тесты изолируют сервис от MongoDB через моки repository и проверяют инварианты шага 2.2.4.

## Импорты и зависимости

1. vitest (`describe`, `it`, `expect`, `vi`) - тестовый раннер, проверки и моки.
2. mongodb (ObjectId) - генерация реалистичных id для тестовых документов.
3. ./collection.service - тестируемые сервисные функции и error-классы.
4. vi.mock('../repositories/collection.repository') - подмена слоя БД моками.
5. vi.mock('../../api/_mongodb') - подмена подключения MongoDB и сессии для проверки commit/abort в транзакциях.

## Экспорты и контракты

1. Файл не экспортирует runtime API: он определяет набор unit-сценариев.
2. Проверяемые контракты:
   - Корректный маппинг Document -> View.
   - Семантика ошибок Forbidden/NotFound.
   - Конверсия price/dateStart/dateEnd/tags в create/update entry.
   - Оркестрация каскадного удаления коллекции.
   - Поддержка entriesCount через `changeCollectionEntriesCount`.
   - Бизнес-правило completed-entry (`rating` и `dateStart` обязательны).
   - Rollback-сценарии: при сбое второго шага мутации вызывается abortTransaction.

## Нетривиальная логика

1. Repository функции замоканы через `vi.hoisted`, чтобы стабильно подменять модуль до импорта сервиса.
2. Для транзакционных операций мокается session-объект Mongo (`startTransaction`, `commitTransaction`, `abortTransaction`, `endSession`).
3. Для каскадного удаления используется контроль порядка вызовов через массив `sequence`.
4. Тесты проверяют не только результат, но и payload вызовов repository (`expect.objectContaining`) для фиксации write-контрактов сервиса.

## Где используется

1. Запускается через Vitest в рамках backend tests-first процесса шага 2.2.4.
2. Является safety-net перед подключением контроллеров на шаге 2.2.5.
3. Поддерживает регрессионную проверку при изменении service/repository контрактов.
