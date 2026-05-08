import type {
  ApiResponse,
  CollectionListQueryDto,
  CollectionView,
  EntryListQueryDto,
  EntryView,
  PaginatedResult,
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
const FALLBACK_COLLECTION_DETAIL_ERROR = 'Не удалось загрузить коллекцию. Попробуйте еще раз.';
const FALLBACK_PUBLIC_COLLECTION_DETAIL_ERROR =
  'Не удалось загрузить публичную коллекцию. Попробуйте еще раз.';
const FALLBACK_COLLECTION_ENTRIES_ERROR =
  'Не удалось загрузить карточки коллекции. Попробуйте еще раз.';
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

function getSingleDataFromSuccessPayload<T>(payload: unknown): T | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const maybeEnvelope = payload as ApiResponse<T>;
  if (maybeEnvelope.ok !== true) {
    return null;
  }

  return maybeEnvelope.data;
}

async function requestApi<T>(
  url: string,
  fallbackError: string,
  requireAuth: boolean,
): Promise<T> {
  const headers: Record<string, string> = {};

  if (requireAuth) {
    const token = await getIdToken();
    if (!token) {
      throw new Error('Пользователь не авторизован: токен отсутствует.');
    }

    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: Object.keys(headers).length ? headers : undefined,
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

  const data = getSingleDataFromSuccessPayload<T>(payload);
  if (!data) {
    throw new Error('Сервер вернул неожиданный формат ответа.');
  }

  return data;
}

async function requestCollections(
  endpoint: '/api/examples/collections' | '/api/collections',
  query: CollectionsQuery,
  fallbackError: string,
  requireAuth: boolean,
): Promise<PaginatedResult<CollectionView>> {
  const queryString = toQueryString(query);
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;

  return requestApi<PaginatedResult<CollectionView>>(url, fallbackError, requireAuth);
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

export async function getPublicCollectionById(collectionId: string): Promise<CollectionView> {
  return requestApi<CollectionView>(
    `/api/examples/collections/${encodeURIComponent(collectionId)}`,
    FALLBACK_PUBLIC_COLLECTION_DETAIL_ERROR,
    false,
  );
}

export async function getCollectionById(collectionId: string): Promise<CollectionView> {
  return requestApi<CollectionView>(
    `/api/collections/${encodeURIComponent(collectionId)}`,
    FALLBACK_COLLECTION_DETAIL_ERROR,
    true,
  );
}

export async function getPublicCollectionEntries(
  collectionId: string,
  query: EntriesQuery = {},
): Promise<PaginatedResult<EntryView>> {
  const queryString = toQueryString(query);
  const baseUrl = `/api/examples/collections/${encodeURIComponent(collectionId)}/entries`;
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  return requestApi<PaginatedResult<EntryView>>(url, FALLBACK_PUBLIC_COLLECTION_ENTRIES_ERROR, false);
}

export async function getCollectionEntries(
  collectionId: string,
  query: EntriesQuery = {},
): Promise<PaginatedResult<EntryView>> {
  const queryString = toQueryString(query);
  const baseUrl = `/api/collections/${encodeURIComponent(collectionId)}/entries`;
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  return requestApi<PaginatedResult<EntryView>>(url, FALLBACK_COLLECTION_ENTRIES_ERROR, true);
}
