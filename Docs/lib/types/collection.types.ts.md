# lib/types/collection.types.ts

## Что делает файл

Файл задает типовую основу для нового домена коллекций и записей (Collection/Entry) на backend.
Он фиксирует enum-значения, доменные типы хранения, DTO для API и типы пагинации/ответов.

## Импорты и зависимости

1. mongodb (ObjectId) - тип \_id для MongoDB-документов в доменных типах.

## Экспорты и контракты

1. Enum-like константы и типы:
   - COLLECTION_CATEGORIES / CollectionCategory.
   - ENTRY_STATUSES / EntryStatus.
   - SYSTEM_EXAMPLES_OWNER_ID.
   - SORT_ORDERS / SortOrder.
   - COLLECTION_SORT_FIELDS / CollectionSortField.
   - ENTRY_SORT_FIELDS / EntrySortField.
2. Доменные типы хранения:
   - CollectionDocument.
   - EntryDocument (collectionId хранится как ObjectId-ссылка, цена в БД хранится как integer cents).
3. Типы представления API:
   - CollectionView.
   - EntryView (цена в API в долларах как number).
4. DTO для входных данных API:
   - CreateCollectionDto / UpdateCollectionDto.
   - CreateEntryDto / UpdateEntryDto.
5. DTO для пагинации и фильтров:
   - BaseListQueryDto.
   - CollectionListQueryDto.
   - EntryListQueryDto.
6. Типы ответа:
   - PaginationMeta.
   - PaginatedResult.
   - ApiErrorPayload.
   - ApiSuccessResponse / ApiErrorResponse / ApiResponse.

## Нетривиальная логика

1. Категории хранятся как стабильные slug-значения (например, health_body), что снижает риски локализационных конфликтов и упрощает фильтрацию.
2. Price разделен по слоям:
   - DTO/API принимает dollars (например, 12.34).
   - Хранение в БД предполагается в cents (например, 1234) для корректной арифметики без float-ошибок.
   - Date в DTO/API зафиксирована как ISO-строка, чтобы граница клиент/сервер была предсказуемой.
3. В EntryDocument поле collectionId хранится как ObjectId, чтобы связь Entry -> Collection была нативной для MongoDB и не требовала лишних преобразований на уровне запросов.
4. Поле isPublic удалено из private Create/Update DTO коллекций: пользователь не может передавать флаг публичности через private API.
5. Для examples используется отдельный системный ownerId (`system_examples`), что разделяет пользовательские и демонстрационные данные без отдельной Mongo-коллекции.

## Где используется

1. Следующий шаг (валидация): lib/validation/\*.schema.ts будет использовать DTO и enum-типы из этого файла.
2. Следующий шаг (service/repository): backend-слои будут использовать CollectionDocument и EntryDocument.
3. Следующий шаг (controllers): API-ответы будут приводиться к CollectionView/EntryView и ApiResponse.
4. На текущем этапе файл добавлен как новый контракт и пока не подключен в runtime-коде.
