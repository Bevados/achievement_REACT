import type {
  CollectionCategory,
  CollectionSortField,
  EntrySortField,
  EntryStatus,
  SortOrder,
} from '../../contracts/collection.contracts';

export interface CollectionsQuery {
  page: number;
  limit: number;
  sortBy: CollectionSortField;
  sortOrder: SortOrder;
  category?: CollectionCategory;
  search?: string;
}

export interface EntriesQuery {
  page: number;
  limit: number;
  sortBy: EntrySortField;
  sortOrder: SortOrder;
  status?: EntryStatus;
  createdAtFrom?: string;
  createdAtTo?: string;
  dateStartFrom?: string;
  dateStartTo?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  maxRating?: number;
}
