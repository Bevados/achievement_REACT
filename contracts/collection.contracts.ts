export const COLLECTION_CATEGORIES = [
  'travel',
  'sport',
  'shopping',
  'learning',
  'health_body',
  'creativity',
  'hobby',
  'career',
  'family',
  'home',
  'self_development',
  'other',
] as const;

export type CollectionCategory = (typeof COLLECTION_CATEGORIES)[number];

export const ENTRY_STATUSES = ['planned', 'in_progress', 'completed'] as const;
export type EntryStatus = (typeof ENTRY_STATUSES)[number];

export const SYSTEM_EXAMPLES_OWNER_ID = 'system_examples';

export const SORT_ORDERS = ['asc', 'desc'] as const;
export type SortOrder = (typeof SORT_ORDERS)[number];

export const COLLECTION_SORT_FIELDS = ['createdAt', 'updatedAt', 'title', 'entriesCount'] as const;
export type CollectionSortField = (typeof COLLECTION_SORT_FIELDS)[number];

export const ENTRY_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'title',
  'status',
  'dateStart',
  'rating',
  'price',
] as const;
export type EntrySortField = (typeof ENTRY_SORT_FIELDS)[number];

export interface CollectionView {
  id: string;
  ownerId: string;
  title: string;
  category: CollectionCategory;
  customCategory?: string;
  description?: string;
  coverImageUrl?: string;
  isPublic: boolean;
  entriesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EntryView {
  id: string;
  collectionId: string;
  ownerId: string;
  title: string;
  status: EntryStatus;
  description?: string;
  imageUrl?: string;
  price?: number;
  tags?: string[];
  rating?: number;
  dateStart?: string;
  dateEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionDto {
  title: string;
  category: CollectionCategory;
  customCategory?: string;
  description?: string;
  coverImageUrl?: string;
}

export interface UpdateCollectionDto {
  title?: string;
  category?: CollectionCategory;
  customCategory?: string;
  description?: string;
  coverImageUrl?: string;
}

export interface CreateEntryDto {
  title: string;
  status: EntryStatus;
  description?: string;
  imageUrl?: string;
  price?: number;
  tags?: string[];
  rating?: number;
  dateStart?: string;
  dateEnd?: string;
}

export interface UpdateEntryDto {
  title?: string;
  status?: EntryStatus;
  description?: string;
  imageUrl?: string;
  price?: number;
  tags?: string[];
  rating?: number;
  dateStart?: string;
  dateEnd?: string;
}

export interface BaseListQueryDto {
  page?: number;
  limit?: number;
  sortOrder?: SortOrder;
}

export interface CollectionListQueryDto extends BaseListQueryDto {
  sortBy?: CollectionSortField;
  category?: CollectionCategory;
  search?: string;
}

export interface EntryListQueryDto extends BaseListQueryDto {
  sortBy?: EntrySortField;
  status?: EntryStatus;
  tag?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  dateStartFrom?: string;
  dateStartTo?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  maxRating?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiSuccessResponse<T> {
  ok: true;
  data: T;
}

export interface ApiErrorResponse {
  ok: false;
  error: ApiErrorPayload;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
