import { useCallback, useEffect, useReducer, useState } from 'react';
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

export type CollectionsQuery = Pick<
  CollectionListQueryDto,
  'page' | 'limit' | 'sortBy' | 'sortOrder' | 'category' | 'search'
>;

interface UseCollectionsListControllerOptions {
  fetchCollections: (query: CollectionsQuery) => Promise<PaginatedResult<CollectionView>>;
  fallbackErrorMessage: string;
  pageSize?: number;
}

interface UseCollectionsListStateResult {
  page: number;
  sortBy: CollectionSortField;
  sortOrder: SortOrder;
  category: CollectionCategory | '';
  searchInput: string;
  search: string;
  setSortBy: (value: CollectionSortField) => void;
  setSortOrder: (value: SortOrder) => void;
  setCategory: (value: CollectionCategory | '') => void;
  setSearchInput: (value: string) => void;
  applySearch: () => void;
  resetFilters: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

interface CollectionsListState {
  page: number;
  sortBy: CollectionSortField;
  sortOrder: SortOrder;
  category: CollectionCategory | '';
  searchInput: string;
  search: string;
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

function createCollectionsListState(searchParams: URLSearchParams): CollectionsListState {
  const search = parseSearch(searchParams.get('search'));

  return {
    page: parsePage(searchParams.get('page')),
    sortBy: parseSortBy(searchParams.get('sortBy')),
    sortOrder: parseSortOrder(searchParams.get('sortOrder')),
    category: parseCategory(searchParams.get('category')),
    searchInput: search,
    search,
  };
}

type CollectionsListAction =
  | { type: 'sync_from_url'; payload: CollectionsListState }
  | { type: 'set_sort_by'; value: CollectionSortField }
  | { type: 'set_sort_order'; value: SortOrder }
  | { type: 'set_category'; value: CollectionCategory | '' }
  | { type: 'set_search_input'; value: string }
  | { type: 'apply_search' }
  | { type: 'reset_filters' }
  | { type: 'go_to_previous_page' }
  | { type: 'go_to_next_page' };

function collectionsListReducer(
  state: CollectionsListState,
  action: CollectionsListAction,
): CollectionsListState {
  switch (action.type) {
    case 'sync_from_url':
      return action.payload;
    case 'set_sort_by':
      return { ...state, sortBy: action.value, page: 1 };
    case 'set_sort_order':
      return { ...state, sortOrder: action.value, page: 1 };
    case 'set_category':
      return { ...state, category: action.value, page: 1 };
    case 'set_search_input':
      return { ...state, searchInput: action.value };
    case 'apply_search':
      return { ...state, page: 1, search: state.searchInput.trim() };
    case 'reset_filters':
      return {
        ...state,
        page: 1,
        category: '',
        searchInput: '',
        search: '',
      };
    case 'go_to_previous_page':
      return { ...state, page: Math.max(1, state.page - 1) };
    case 'go_to_next_page':
      return { ...state, page: state.page + 1 };
    default:
      return state;
  }
}

export function useCollectionsListState(): UseCollectionsListStateResult {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, dispatch] = useReducer(collectionsListReducer, searchParams, createCollectionsListState);

  useEffect(() => {
    dispatch({ type: 'sync_from_url', payload: createCollectionsListState(searchParams) });
  }, [searchParams]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);

    if (state.page === DEFAULT_PAGE) {
      nextParams.delete('page');
    } else {
      nextParams.set('page', String(state.page));
    }

    if (state.sortBy === DEFAULT_SORT_BY) {
      nextParams.delete('sortBy');
    } else {
      nextParams.set('sortBy', state.sortBy);
    }

    if (state.sortOrder === DEFAULT_SORT_ORDER) {
      nextParams.delete('sortOrder');
    } else {
      nextParams.set('sortOrder', state.sortOrder);
    }

    if (!state.category) {
      nextParams.delete('category');
    } else {
      nextParams.set('category', state.category);
    }

    if (!state.search) {
      nextParams.delete('search');
    } else {
      nextParams.set('search', state.search);
    }

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams);
    }
  }, [searchParams, setSearchParams, state]);

  function setSortBy(value: CollectionSortField): void {
    dispatch({ type: 'set_sort_by', value });
  }

  function setSortOrder(value: SortOrder): void {
    dispatch({ type: 'set_sort_order', value });
  }

  function setCategory(value: CollectionCategory | ''): void {
    dispatch({ type: 'set_category', value });
  }

  function applySearch(): void {
    dispatch({ type: 'apply_search' });
  }

  function resetFilters(): void {
    dispatch({ type: 'reset_filters' });
  }

  function goToPreviousPage(): void {
    dispatch({ type: 'go_to_previous_page' });
  }

  function goToNextPage(): void {
    dispatch({ type: 'go_to_next_page' });
  }

  return {
    page: state.page,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    category: state.category,
    searchInput: state.searchInput,
    search: state.search,
    setSortBy,
    setSortOrder,
    setCategory,
    setSearchInput: (value) => {
      dispatch({ type: 'set_search_input', value });
    },
    applySearch,
    resetFilters,
    goToPreviousPage,
    goToNextPage,
  };
}

export function useCollectionsListController(
  options: UseCollectionsListControllerOptions,
): UseCollectionsListControllerResult {
  const { fetchCollections, fallbackErrorMessage, pageSize = 12 } = options;
  const state = useCollectionsListState();
  const [collections, setCollections] = useState<CollectionView[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reloadCollections = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await fetchCollections({
        page: state.page,
        limit: pageSize,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        category: state.category || undefined,
        search: state.search || undefined,
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
  }, [
    fallbackErrorMessage,
    fetchCollections,
    pageSize,
    state.category,
    state.page,
    state.search,
    state.sortBy,
    state.sortOrder,
  ]);

  useEffect(() => {
    void reloadCollections();
  }, [reloadCollections]);

  return {
    collections,
    meta,
    page: state.page,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    category: state.category,
    searchInput: state.searchInput,
    isLoading,
    errorMessage,
    setSortBy: state.setSortBy,
    setSortOrder: state.setSortOrder,
    setCategory: state.setCategory,
    setSearchInput: state.setSearchInput,
    applySearch: state.applySearch,
    resetFilters: state.resetFilters,
    goToPreviousPage: state.goToPreviousPage,
    goToNextPage: state.goToNextPage,
    reloadCollections,
  };
}
