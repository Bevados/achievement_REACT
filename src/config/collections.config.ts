import type {
  CollectionCategory,
  CollectionSortField,
  CollectionView,
  SortOrder,
} from '../../contracts/collection.contracts';

export const collectionCategoryLabels: Record<CollectionCategory, string> = {
  career: 'Карьера',
  creativity: 'Творчество',
  family: 'Семья',
  health_body: 'Здоровье и тело',
  hobby: 'Хобби',
  home: 'Дом',
  learning: 'Обучение',
  other: 'Другое',
  self_development: 'Саморазвитие',
  shopping: 'Покупки',
  sport: 'Спорт',
  travel: 'Путешествия',
};

export const orderedCollectionCategoryOptions: CollectionCategory[] = [
  'career',
  'creativity',
  'family',
  'health_body',
  'hobby',
  'home',
  'learning',
  'self_development',
  'shopping',
  'sport',
  'travel',
];

export const collectionSortByOptions: Array<{ value: CollectionSortField; label: string }> = [
  { value: 'updatedAt', label: 'Сначала недавно обновленные' },
  { value: 'createdAt', label: 'Сначала недавно созданные' },
  { value: 'title', label: 'По названию' },
  { value: 'entriesCount', label: 'По количеству карточек' },
];

export const collectionSortOrderOptions: Array<{ value: SortOrder; label: string }> = [
  { value: 'desc', label: 'По убыванию' },
  { value: 'asc', label: 'По возрастанию' },
];

export function getCollectionCategoryLabel(
  collection: Pick<CollectionView, 'category' | 'customCategory'>,
): string {
  if (collection.category === 'other' && collection.customCategory) {
    return collection.customCategory;
  }

  return collectionCategoryLabels[collection.category];
}
