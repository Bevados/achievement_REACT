// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

const serviceMocks = vi.hoisted(() => ({
  getOwnerCollections: vi.fn(),
  createCollection: vi.fn(),
  getCollectionById: vi.fn(),
  updateCollection: vi.fn(),
  deleteCollection: vi.fn(),
  getCollectionEntries: vi.fn(),
  createEntry: vi.fn(),
  updateEntry: vi.fn(),
  deleteEntry: vi.fn(),
  getPublicCollections: vi.fn(),
}));

const verifyAuthMock = vi.hoisted(() =>
  vi.fn(async (req: any, res: any) => {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        ok: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Отсутствует или некорректен заголовок Authorization',
        },
      });
      throw new Error('Unauthorized');
    }

    const token = authHeader.slice('Bearer '.length);

    if (token === 'invalid-token') {
      res.status(401).json({
        ok: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Недействительный или просроченный токен',
        },
      });
      throw new Error('Unauthorized');
    }

    req.userId = token;
  }),
);

vi.mock('@lib/middleware/auth', () => ({
  verifyAuth: verifyAuthMock,
}));

vi.mock('@lib/services/collection.service', () => serviceMocks);

import collectionsHandler from '../api/collections/index';
import collectionByIdHandler from '../api/collections/[collectionId]/index';
import entriesHandler from '../api/collections/[collectionId]/entries/index';
import entryByIdHandler from '../api/collections/[collectionId]/entries/[entryId]/index';
import publicCollectionsHandler from '../api/examples/collections/index';

type MockRequest = {
  method: string;
  headers: Record<string, string>;
  query: Record<string, string>;
  body: unknown;
  userId?: string;
};

type MockResponse = {
  statusCode: number;
  body: unknown;
  headersSent: boolean;
  status: (code: number) => MockResponse;
  json: (payload: unknown) => MockResponse;
};

function createRequest(params: {
  method: string;
  token?: string;
  query?: Record<string, string>;
  body?: unknown;
}): MockRequest {
  return {
    method: params.method,
    headers: params.token ? { authorization: `Bearer ${params.token}` } : {},
    query: params.query ?? {},
    body: params.body,
  };
}

function createResponse(): MockResponse {
  const response: MockResponse = {
    statusCode: 200,
    body: undefined,
    headersSent: false,
    status(code: number) {
      response.statusCode = code;
      return response;
    },
    json(payload: unknown) {
      response.body = payload;
      response.headersSent = true;
      return response;
    },
  };

  return response;
}

const collectionView = {
  id: 'col-1',
  ownerId: 'user-1',
  title: 'Travel plans',
  category: 'travel',
  isPublic: false,
  entriesCount: 0,
  createdAt: '2026-04-21T10:00:00.000Z',
  updatedAt: '2026-04-21T10:00:00.000Z',
};

const entryView = {
  id: 'entry-1',
  collectionId: 'col-1',
  ownerId: 'user-1',
  title: 'Visit Kyoto',
  status: 'planned',
  createdAt: '2026-04-21T10:00:00.000Z',
  updatedAt: '2026-04-21T10:00:00.000Z',
};

describe('step 2.2.8 api smoke (fallback harness для handler/controller)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('C1: private endpoint возвращает 401 без auth header', async () => {
    const req = createRequest({ method: 'GET' });
    const res = createResponse();

    await collectionsHandler(req as any, res as any);

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      ok: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Отсутствует или некорректен заголовок Authorization',
      },
    });
  });

  it('C1: private endpoint возвращает 401 при невалидном токене', async () => {
    const req = createRequest({ method: 'GET', token: 'invalid-token' });
    const res = createResponse();

    await collectionsHandler(req as any, res as any);

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      ok: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Недействительный или просроченный токен',
      },
    });
  });

  it('C2: возвращает 422 для невалидного payload коллекции', async () => {
    const req = createRequest({
      method: 'POST',
      token: 'user-1',
      body: { category: 'travel' },
    });
    const res = createResponse();

    await collectionsHandler(req as any, res as any);

    expect(res.statusCode).toBe(422);
    expect((res.body as any).ok).toBe(false);
    expect((res.body as any).error.code).toBe('VALIDATION_ERROR');
  });

  it('C2: возвращает 422 для невалидного payload карточки', async () => {
    const req = createRequest({
      method: 'POST',
      token: 'user-1',
      query: { collectionId: '507f1f77bcf86cd799439011' },
      body: { title: 'Entry', status: 'planned', rating: 11 },
    });
    const res = createResponse();

    await entriesHandler(req as any, res as any);

    expect(res.statusCode).toBe(422);
    expect((res.body as any).ok).toBe(false);
    expect((res.body as any).error.code).toBe('VALIDATION_ERROR');
  });

  it('C3: возвращает единый success envelope для private list endpoint', async () => {
    serviceMocks.getOwnerCollections.mockResolvedValue({
      items: [collectionView],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });

    const req = createRequest({ method: 'GET', token: 'user-1' });
    const res = createResponse();

    await collectionsHandler(req as any, res as any);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      ok: true,
      data: {
        items: [collectionView],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
      },
    });
  });

  it('C4: маппит ForbiddenError в 403 при доступе к коллекции', async () => {
    const forbidden = new Error('Access is forbidden');
    forbidden.name = 'ForbiddenError';
    serviceMocks.getCollectionById.mockRejectedValue(forbidden);

    const req = createRequest({
      method: 'GET',
      token: 'user-1',
      query: { collectionId: '507f1f77bcf86cd799439011' },
    });
    const res = createResponse();

    await collectionByIdHandler(req as any, res as any);

    expect(res.statusCode).toBe(403);
    expect((res.body as any).ok).toBe(false);
    expect((res.body as any).error.code).toBe('FORBIDDEN');
  });

  it('C4: маппит NotFoundError в 404 при доступе к коллекции', async () => {
    const notFound = new Error('Collection not found');
    notFound.name = 'NotFoundError';
    serviceMocks.getCollectionById.mockRejectedValue(notFound);

    const req = createRequest({
      method: 'GET',
      token: 'user-1',
      query: { collectionId: '507f1f77bcf86cd799439011' },
    });
    const res = createResponse();

    await collectionByIdHandler(req as any, res as any);

    expect(res.statusCode).toBe(404);
    expect((res.body as any).ok).toBe(false);
    expect((res.body as any).error.code).toBe('NOT_FOUND');
  });

  it('C5: collection CRUD handlers возвращают ожидаемые статусы и envelopes', async () => {
    serviceMocks.createCollection.mockResolvedValue(collectionView);
    serviceMocks.getCollectionById.mockResolvedValue(collectionView);
    serviceMocks.updateCollection.mockResolvedValue({ ...collectionView, title: 'Updated title' });
    serviceMocks.deleteCollection.mockResolvedValue(undefined);

    const createReq = createRequest({
      method: 'POST',
      token: 'user-1',
      body: { title: 'Travel plans', category: 'travel' },
    });
    const createRes = createResponse();
    await collectionsHandler(createReq as any, createRes as any);
    expect(createRes.statusCode).toBe(201);
    expect((createRes.body as any).ok).toBe(true);

    const getReq = createRequest({
      method: 'GET',
      token: 'user-1',
      query: { collectionId: '507f1f77bcf86cd799439011' },
    });
    const getRes = createResponse();
    await collectionByIdHandler(getReq as any, getRes as any);
    expect(getRes.statusCode).toBe(200);
    expect((getRes.body as any).ok).toBe(true);

    const patchReq = createRequest({
      method: 'PATCH',
      token: 'user-1',
      query: { collectionId: '507f1f77bcf86cd799439011' },
      body: { title: 'Updated title' },
    });
    const patchRes = createResponse();
    await collectionByIdHandler(patchReq as any, patchRes as any);
    expect(patchRes.statusCode).toBe(200);
    expect((patchRes.body as any).ok).toBe(true);

    const deleteReq = createRequest({
      method: 'DELETE',
      token: 'user-1',
      query: { collectionId: '507f1f77bcf86cd799439011' },
    });
    const deleteRes = createResponse();
    await collectionByIdHandler(deleteReq as any, deleteRes as any);
    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body).toEqual({ ok: true, data: null });
  });

  it('C6: entry CRUD handlers возвращают ожидаемые статусы и envelopes', async () => {
    serviceMocks.createEntry.mockResolvedValue(entryView);
    serviceMocks.getCollectionEntries.mockResolvedValue({
      items: [entryView],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });
    serviceMocks.updateEntry.mockResolvedValue({
      ...entryView,
      status: 'completed',
      rating: 9,
      dateStart: '2026-04-25T10:00:00.000Z',
    });
    serviceMocks.deleteEntry.mockResolvedValue(undefined);

    const createReq = createRequest({
      method: 'POST',
      token: 'user-1',
      query: { collectionId: '507f1f77bcf86cd799439011' },
      body: { title: 'Visit Kyoto', status: 'planned' },
    });
    const createRes = createResponse();
    await entriesHandler(createReq as any, createRes as any);
    expect(createRes.statusCode).toBe(201);
    expect((createRes.body as any).ok).toBe(true);

    const listReq = createRequest({
      method: 'GET',
      token: 'user-1',
      query: { collectionId: '507f1f77bcf86cd799439011' },
    });
    const listRes = createResponse();
    await entriesHandler(listReq as any, listRes as any);
    expect(listRes.statusCode).toBe(200);
    expect((listRes.body as any).ok).toBe(true);

    const patchReq = createRequest({
      method: 'PATCH',
      token: 'user-1',
      query: {
        collectionId: '507f1f77bcf86cd799439011',
        entryId: '507f1f77bcf86cd799439012',
      },
      body: {
        status: 'completed',
        rating: 9,
        dateStart: '2026-04-25T10:00:00.000Z',
      },
    });
    const patchRes = createResponse();
    await entryByIdHandler(patchReq as any, patchRes as any);
    expect(patchRes.statusCode).toBe(200);
    expect((patchRes.body as any).ok).toBe(true);

    const deleteReq = createRequest({
      method: 'DELETE',
      token: 'user-1',
      query: {
        collectionId: '507f1f77bcf86cd799439011',
        entryId: '507f1f77bcf86cd799439012',
      },
    });
    const deleteRes = createResponse();
    await entryByIdHandler(deleteReq as any, deleteRes as any);
    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body).toEqual({ ok: true, data: null });
  });

  it('C7: public endpoint работает без токена и возвращает 200', async () => {
    serviceMocks.getPublicCollections.mockResolvedValue({
      items: [
        {
          ...collectionView,
          ownerId: 'system_examples',
          isPublic: true,
        },
      ],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });

    const req = createRequest({ method: 'GET' });
    const res = createResponse();

    await publicCollectionsHandler(req as any, res as any);

    expect(res.statusCode).toBe(200);
    expect((res.body as any).ok).toBe(true);
    expect((res.body as any).data.items[0].ownerId).toBe('system_examples');
  });
});
