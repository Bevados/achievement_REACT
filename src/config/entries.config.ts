import type { EntrySortField, EntryStatus, SortOrder } from '../../contracts/collection.contracts';

export const entrySortByOptions: Array<{ value: EntrySortField; label: string }> = [
  { value: 'updatedAt', label: 'Сначала недавно обновленные' },
  { value: 'createdAt', label: 'Сначала недавно созданные' },
  { value: 'title', label: 'По названию' },
  { value: 'status', label: 'По статусу' },
  { value: 'dateStart', label: 'По запланированной дате' },
  { value: 'price', label: 'По цене' },
  { value: 'rating', label: 'По рейтингу' },
];

export const entrySortOrderOptions: Array<{ value: SortOrder; label: string }> = [
  { value: 'desc', label: 'По убыванию' },
  { value: 'asc', label: 'По возрастанию' },
];

export const entryStatusLabels: Record<EntryStatus, string> = {
  planned: 'Запланировано',
  in_progress: 'В процессе',
  completed: 'Завершено',
};
