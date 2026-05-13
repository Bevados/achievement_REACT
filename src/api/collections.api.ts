import type {
  ApiResponse,
  CollectionListQueryDto,
  CollectionView,
  CreateCollectionDto,
  CreateEntryDto,
  EntryListQueryDto,
  EntryView,
  PaginatedResult,
  UpdateCollectionDto,
  UpdateEntryDto,
} from '../../contracts/collection.contracts';
import { getIdToken } from '../firebase';

type CollectionsQuery = Pick<
  CollectionListQueryDto,
  'page' | 'limit' | 'sortBy' | 'sortOrder' | 'category' | 'search'
>;

type EntriesQuery = Pick<
  EntryListQueryDto,
  | 'page'
  | 'limit'
  | 'sortBy'
  | 'sortOrder'
  | 'status'
  | 'tag'
  | 'createdAtFrom'
  | 'createdAtTo'
  | 'dateStartFrom'
  | 'dateStartTo'
  | 'minPrice'
  | 'maxPrice'
  | 'minRating'
  | 'maxRating'
>;

const FALLBACK_FETCH_ERROR = 'Не удалось загрузить публичные коллекции. Попробуйте еще раз.';
const FALLBACK_PRIVATE_FETCH_ERROR = 'Не удалось загрузить ваши коллекции. Попробуйте еще раз.';
const FALLBACK_COLLECTION_CREATE_ERROR = 'Не удалось создать коллекцию. Попробуйте еще раз.';
const FALLBACK_COLLECTION_DETAIL_ERROR = 'Не удалось загрузить коллекцию. Попробуйте еще раз.';
const FALLBACK_COLLECTION_UPDATE_ERROR =
  'Не удалось сохранить изменения коллекции. Попробуйте еще раз.';
const FALLBACK_COLLECTION_DELETE_ERROR = 'Не удалось удалить коллекцию. Попробуйте еще раз.';
const FALLBACK_PUBLIC_COLLECTION_DETAIL_ERROR =
  'Не удалось загрузить публичную коллекцию. Попробуйте еще раз.';
const FALLBACK_COLLECTION_ENTRIES_ERROR =
  'Не удалось загрузить карточки коллекции. Попробуйте еще раз.';
const FALLBACK_ENTRY_CREATE_ERROR = 'Не удалось создать карточку. Попробуйте еще раз.';
const FALLBACK_ENTRY_UPDATE_ERROR =
  'Не удалось сохранить изменения карточки. Попробуйте еще раз.';
const FALLBACK_ENTRY_DELETE_ERROR = 'Не удалось удалить карточку. Попробуйте еще раз.';
const FALLBACK_PUBLIC_COLLECTION_ENTRIES_ERROR =
  'Не удалось загрузить карточки публичной коллекции. Попробуйте еще раз.';
const LOCAL_BACKEND_UNAVAILABLE_ERROR =
  'Локальный API недоступен. Запустите backend-команду `npm run dev:api` и обновите страницу.';

function toQueryString(query: Record<string, string | number | undefined>): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  }

  return params.toString();
}

function getMessageFromErrorPayload(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const maybeEnvelope = payload as { ok?: unknown; error?: { message?: unknown } };

  if (maybeEnvelope.ok === false && typeof maybeEnvelope.error?.message === 'string') {
    return maybeEnvelope.error.message;
  }

  return null;
}

function getSingleDataFromSuccessPayload<T>(
  payload: unknown,
): {
  hasData: boolean;
  data: T | null;
} {
  if (!payload || typeof payload !== 'object') {
    return {
      hasData: false,
      data: null,
    };
  }

  const maybeEnvelope = payload as ApiResponse<T> & { data?: T | null };
  if (maybeEnvelope.ok !== true) {
    return {
      hasData: false,
      data: null,
    };
  }

  return {
    hasData: Object.prototype.hasOwnProperty.call(maybeEnvelope, 'data'),
    data: maybeEnvelope.data ?? null,
  };
}

async function requestApi<T>(
  url: string,
  {
    method = 'GET',
    body,
    fallbackError,
    requireAuth,
  }: {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: unknown;
    fallbackError: string;
    requireAuth: boolean;
  },
): Promise<T> {
  const headers: Record<string, string> = {};

  if (requireAuth) {
    const token = await getIdToken();
    if (!token) {
      throw new Error('Пользователь не авторизован: токен отсутствует.');
    }

    headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: Object.keys(headers).length ? headers : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(LOCAL_BACKEND_UNAVAILABLE_ERROR);
  }

  const contentType = response.headers.get('content-type') ?? '';
  const rawBody = await response.text();

  let payload: unknown = null;
  if (rawBody) {
    try {
      payload = JSON.parse(rawBody);
    } catch {
      payload = null;
    }
  }

  if (contentType.includes('text/html')) {
    throw new Error(LOCAL_BACKEND_UNAVAILABLE_ERROR);
  }

  if (!response.ok) {
    throw new Error(getMessageFromErrorPayload(payload) ?? fallbackError);
  }

  const { hasData, data } = getSingleDataFromSuccessPayload<T>(payload);
  if (!hasData && payload !== null) {
    throw new Error('Сервер вернул неожиданный формат ответа.');
  }

  return data as T;
}

async function requestCollections(
  endpoint: '/api/examples/collections' | '/api/collections',
  query: CollectionsQuery,
  fallbackError: string,
  requireAuth: boolean,
): Promise<PaginatedResult<CollectionView>> {
  const queryString = toQueryString(query);
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;

  return requestApi<PaginatedResult<CollectionView>>(url, {
    fallbackError,
    requireAuth,
  });
}

export async function getPublicCollections(
  query: CollectionsQuery = {},
): Promise<PaginatedResult<CollectionView>> {
  return requestCollections('/api/examples/collections', query, FALLBACK_FETCH_ERROR, false);
}

export async function getOwnerCollections(
  query: CollectionsQuery = {},
): Promise<PaginatedResult<CollectionView>> {
  return requestCollections('/api/collections', query, FALLBACK_PRIVATE_FETCH_ERROR, true);
}

export async function createCollection(payload: CreateCollectionDto): Promise<CollectionView> {
  return requestApi<CollectionView>('/api/collections', {
    method: 'POST',
    body: payload,
    fallbackError: FALLBACK_COLLECTION_CREATE_ERROR,
    requireAuth: true,
  });
}

export async function getPublicCollectionById(collectionId: string): Promise<CollectionView> {
  return requestApi<CollectionView>(
    `/api/examples/collections/${encodeURIComponent(collectionId)}`,
    {
      fallbackError: FALLBACK_PUBLIC_COLLECTION_DETAIL_ERROR,
      requireAuth: false,
    },
  );
}

export async function getCollectionById(collectionId: string): Promise<CollectionView> {
  return requestApi<CollectionView>(`/api/collections/${encodeURIComponent(collectionId)}`, {
    fallbackError: FALLBACK_COLLECTION_DETAIL_ERROR,
    requireAuth: true,
  });
}

export async function updateCollection(
  collectionId: string,
  payload: UpdateCollectionDto,
): Promise<CollectionView> {
  return requestApi<CollectionView>(`/api/collections/${encodeURIComponent(collectionId)}`, {
    method: 'PATCH',
    body: payload,
    fallbackError: FALLBACK_COLLECTION_UPDATE_ERROR,
    requireAuth: true,
  });
}

export async function deleteCollection(collectionId: string): Promise<null> {
  return requestApi<null>(`/api/collections/${encodeURIComponent(collectionId)}`, {
    method: 'DELETE',
    fallbackError: FALLBACK_COLLECTION_DELETE_ERROR,
    requireAuth: true,
  });
}

export async function getPublicCollectionEntries(
  collectionId: string,
  query: EntriesQuery = {},
): Promise<PaginatedResult<EntryView>> {
  const queryString = toQueryString(query);
  const baseUrl = `/api/examples/collections/${encodeURIComponent(collectionId)}/entries`;
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  return requestApi<PaginatedResult<EntryView>>(url, {
    fallbackError: FALLBACK_PUBLIC_COLLECTION_ENTRIES_ERROR,
    requireAuth: false,
  });
}

export async function getCollectionEntries(
  collectionId: string,
  query: EntriesQuery = {},
): Promise<PaginatedResult<EntryView>> {
  const queryString = toQueryString(query);
  const baseUrl = `/api/collections/${encodeURIComponent(collectionId)}/entries`;
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  return requestApi<PaginatedResult<EntryView>>(url, {
    fallbackError: FALLBACK_COLLECTION_ENTRIES_ERROR,
    requireAuth: true,
  });
}

export async function createEntry(
  collectionId: string,
  payload: CreateEntryDto,
): Promise<EntryView> {
  return requestApi<EntryView>(`/api/collections/${encodeURIComponent(collectionId)}/entries`, {
    method: 'POST',
    body: payload,
    fallbackError: FALLBACK_ENTRY_CREATE_ERROR,
    requireAuth: true,
  });
}

export async function updateEntry(
  collectionId: string,
  entryId: string,
  payload: UpdateEntryDto,
): Promise<EntryView> {
  return requestApi<EntryView>(
    `/api/collections/${encodeURIComponent(collectionId)}/entries/${encodeURIComponent(entryId)}`,
    {
      method: 'PATCH',
      body: payload,
      fallbackError: FALLBACK_ENTRY_UPDATE_ERROR,
      requireAuth: true,
    },
  );
}

export async function deleteEntry(collectionId: string, entryId: string): Promise<null> {
  return requestApi<null>(
    `/api/collections/${encodeURIComponent(collectionId)}/entries/${encodeURIComponent(entryId)}`,
    {
      method: 'DELETE',
      fallbackError: FALLBACK_ENTRY_DELETE_ERROR,
      requireAuth: true,
    },
  );
}
