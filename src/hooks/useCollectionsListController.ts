import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type {
  CollectionCategory,
  CollectionListQueryDto,
  CollectionSortField,
  CollectionView,
  PaginationMeta,
  PaginatedResult,
  SortOrder,
} from '../../contracts/collection.contracts';
import {
  COLLECTION_CATEGORIES,
  COLLECTION_SORT_FIELDS,
  SORT_ORDERS,
} from '../../contracts/collection.contracts';

type CollectionsQuery = Pick<
  CollectionListQueryDto,
  'page' | 'limit' | 'sortBy' | 'sortOrder' | 'category' | 'search'
>;

interface UseCollectionsListControllerOptions {
  fetchCollections: (query: CollectionsQuery) => Promise<PaginatedResult<CollectionView>>;
  fallbackErrorMessage: string;
  pageSize?: number;
}

interface UseCollectionsListControllerResult {
  collections: CollectionView[];
  meta: PaginationMeta | null;
  page: number;
  sortBy: CollectionSortField;
  sortOrder: SortOrder;
  category: CollectionCategory | '';
  searchInput: string;
  isLoading: boolean;
  errorMessage: string | null;
  setSortBy: (value: CollectionSortField) => void;
  setSortOrder: (value: SortOrder) => void;
  setCategory: (value: CollectionCategory | '') => void;
  setSearchInput: (value: string) => void;
  applySearch: () => void;
  resetFilters: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  reloadCollections: () => Promise<void>;
}

const DEFAULT_PAGE = 1;
const DEFAULT_SORT_BY: CollectionSortField = 'updatedAt';
const DEFAULT_SORT_ORDER: SortOrder = 'desc';

function parsePage(value: string | null): number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return DEFAULT_PAGE;
  }

  return parsed;
}

function parseSortBy(value: string | null): CollectionSortField {
  if (value && COLLECTION_SORT_FIELDS.includes(value as CollectionSortField)) {
    return value as CollectionSortField;
  }

  return DEFAULT_SORT_BY;
}

function parseSortOrder(value: string | null): SortOrder {
  if (value && SORT_ORDERS.includes(value as SortOrder)) {
    return value as SortOrder;
  }

  return DEFAULT_SORT_ORDER;
}

function parseCategory(value: string | null): CollectionCategory | '' {
  if (value && COLLECTION_CATEGORIES.includes(value as CollectionCategory)) {
    return value as CollectionCategory;
  }

  return '';
}

function parseSearch(value: string | null): string {
  return value?.trim() ?? '';
}

export function useCollectionsListController(
  options: UseCollectionsListControllerOptions,
): UseCollectionsListControllerResult {
  const { fetchCollections, fallbackErrorMessage, pageSize = 12 } = options;

  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage = parsePage(searchParams.get('page'));
  const initialSortBy = parseSortBy(searchParams.get('sortBy'));
  const initialSortOrder = parseSortOrder(searchParams.get('sortOrder'));
  const initialCategory = parseCategory(searchParams.get('category'));
  const initialSearch = parseSearch(searchParams.get('search'));

  const [collections, setCollections] = useState<CollectionView[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [sortBy, setSortByState] = useState<CollectionSortField>(initialSortBy);
  const [sortOrder, setSortOrderState] = useState<SortOrder>(initialSortOrder);
  const [category, setCategoryState] = useState<CollectionCategory | ''>(initialCategory);
  const [searchInput, setSearchInput] = useState<string>(initialSearch);
  const [search, setSearch] = useState<string>(initialSearch);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const nextPage = parsePage(searchParams.get('page'));
    const nextSortBy = parseSortBy(searchParams.get('sortBy'));
    const nextSortOrder = parseSortOrder(searchParams.get('sortOrder'));
    const nextCategory = parseCategory(searchParams.get('category'));
    const nextSearch = parseSearch(searchParams.get('search'));

    setPage((prev) => (prev === nextPage ? prev : nextPage));
    setSortByState((prev) => (prev === nextSortBy ? prev : nextSortBy));
    setSortOrderState((prev) => (prev === nextSortOrder ? prev : nextSortOrder));
    setCategoryState((prev) => (prev === nextCategory ? prev : nextCategory));
    setSearch((prev) => (prev === nextSearch ? prev : nextSearch));
    setSearchInput((prev) => (prev === nextSearch ? prev : nextSearch));
  }, [searchParams]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);

    if (page === DEFAULT_PAGE) {
      nextParams.delete('page');
    } else {
      nextParams.set('page', String(page));
    }

    if (sortBy === DEFAULT_SORT_BY) {
      nextParams.delete('sortBy');
    } else {
      nextParams.set('sortBy', sortBy);
    }

    if (sortOrder === DEFAULT_SORT_ORDER) {
      nextParams.delete('sortOrder');
    } else {
      nextParams.set('sortOrder', sortOrder);
    }

    if (!category) {
      nextParams.delete('category');
    } else {
      nextParams.set('category', category);
    }

    if (!search) {
      nextParams.delete('search');
    } else {
      nextParams.set('search', search);
    }

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [category, page, search, searchParams, setSearchParams, sortBy, sortOrder]);

  const reloadCollections = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await fetchCollections({
        page,
        limit: pageSize,
        sortBy,
        sortOrder,
        category: category || undefined,
        search: search || undefined,
      });

      setCollections(result.items);
      setMeta(result.meta);
    } catch (error) {
      setCollections([]);
      setMeta(null);
      setErrorMessage(error instanceof Error ? error.message : fallbackErrorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [category, fallbackErrorMessage, fetchCollections, page, pageSize, search, sortBy, sortOrder]);

  useEffect(() => {
    void reloadCollections();
  }, [reloadCollections]);

  function setSortBy(value: CollectionSortField): void {
    setSortByState(value);
    setPage(1);
  }

  function setSortOrder(value: SortOrder): void {
    setSortOrderState(value);
    setPage(1);
  }

  function setCategory(value: CollectionCategory | ''): void {
    setCategoryState(value);
    setPage(1);
  }

  function applySearch(): void {
    setPage(1);
    setSearch(searchInput.trim());
  }

  function resetFilters(): void {
    setSearchInput('');
    setSearch('');
    setCategoryState('');
    setPage(1);
  }

  function goToPreviousPage(): void {
    setPage((prev) => Math.max(1, prev - 1));
  }

  function goToNextPage(): void {
    setPage((prev) => prev + 1);
  }

  return {
    collections,
    meta,
    page,
    sortBy,
    sortOrder,
    category,
    searchInput,
    isLoading,
    errorMessage,
    setSortBy,
    setSortOrder,
    setCategory,
    setSearchInput,
    applySearch,
    resetFilters,
    goToPreviousPage,
    goToNextPage,
    reloadCollections,
  };
}
