import type {
  ApiResponse,
  CollectionListQueryDto,
  CollectionView,
  PaginatedResult,
} from '../../contracts/collection.contracts';
import { getIdToken } from '../firebase';

type CollectionsQuery = Pick<
  CollectionListQueryDto,
  'page' | 'limit' | 'sortBy' | 'sortOrder' | 'category' | 'search'
>;

const FALLBACK_FETCH_ERROR = 'Не удалось загрузить публичные коллекции. Попробуйте еще раз.';
const FALLBACK_PRIVATE_FETCH_ERROR = 'Не удалось загрузить ваши коллекции. Попробуйте еще раз.';

function toQueryString(query: CollectionsQuery): string {
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

function getDataFromSuccessPayload(
  payload: unknown,
): PaginatedResult<CollectionView> | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const maybeEnvelope = payload as ApiResponse<PaginatedResult<CollectionView>>;
  if (maybeEnvelope.ok !== true) {
    return null;
  }

  return maybeEnvelope.data;
}

async function requestCollections(
  endpoint: '/api/examples/collections' | '/api/collections',
  query: CollectionsQuery,
  fallbackError: string,
  requireAuth: boolean,
): Promise<PaginatedResult<CollectionView>> {
  const queryString = toQueryString(query);
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;

  const headers: Record<string, string> = {};

  if (requireAuth) {
    const token = await getIdToken();
    if (!token) {
      throw new Error('Пользователь не авторизован: токен отсутствует.');
    }

    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: Object.keys(headers).length ? headers : undefined,
  });

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
    throw new Error(
      'Локальный API недоступен. Запустите backend-команду `vercel dev --listen 3000` и обновите страницу.',
    );
  }

  if (!response.ok) {
    throw new Error(getMessageFromErrorPayload(payload) ?? fallbackError);
  }

  const data = getDataFromSuccessPayload(payload);
  if (!data) {
    throw new Error('Сервер вернул неожиданный формат ответа.');
  }

  return data;
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