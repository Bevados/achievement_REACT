import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  createCollection as createCollectionService,
  createEntry as createEntryService,
  deleteCollection as deleteCollectionService,
  deleteEntry as deleteEntryService,
  getCollectionById,
  getCollectionEntries,
  getOwnerCollections,
  getPublicCollections as getPublicCollectionsService,
  updateCollection as updateCollectionService,
  updateEntry as updateEntryService,
} from '../services/collection.service';
import type { AuthenticatedRequest } from '../types/request.types';
import {
  collectionAndEntryIdsParamSchema,
  collectionIdParamSchema,
  collectionListQuerySchema,
  createCollectionSchema,
  createEntrySchema,
  entryListQuerySchema,
  updateCollectionSchema,
  updateEntrySchema,
} from '../validation/collection.schema';
import { handleControllerError } from './controller-error';
import { getSingleQueryValue, normalizeQueryObject, sendSuccess } from '../http/api-response';

function parseCollectionId(req: VercelRequest): string {
  const parsed = collectionIdParamSchema.parse({
    collectionId: getSingleQueryValue(req.query.collectionId),
  });

  return parsed.collectionId;
}

function parseCollectionAndEntryIds(req: VercelRequest) {
  return collectionAndEntryIdsParamSchema.parse({
    collectionId: getSingleQueryValue(req.query.collectionId),
    entryId: getSingleQueryValue(req.query.entryId),
  });
}

export async function getCollections(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const query = collectionListQuerySchema.parse(normalizeQueryObject(req.query));
    const result = await getOwnerCollections(req.userId, query);
    return sendSuccess(res, 200, result);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function createCollection(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const body = createCollectionSchema.parse(req.body);
    const result = await createCollectionService(req.userId, body);
    return sendSuccess(res, 201, result);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function getCollection(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const collectionId = parseCollectionId(req);
    const result = await getCollectionById(req.userId, collectionId);
    return sendSuccess(res, 200, result);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function updateCollection(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const collectionId = parseCollectionId(req);
    const body = updateCollectionSchema.parse(req.body);
    const result = await updateCollectionService(req.userId, collectionId, body);
    return sendSuccess(res, 200, result);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function deleteCollection(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const collectionId = parseCollectionId(req);
    await deleteCollectionService(req.userId, collectionId);
    return sendSuccess(res, 200, null);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function getEntries(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const collectionId = parseCollectionId(req);
    const normalizedQuery = normalizeQueryObject(req.query);
    delete normalizedQuery.collectionId;
    const query = entryListQuerySchema.parse(normalizedQuery);
    const result = await getCollectionEntries(req.userId, collectionId, query);
    return sendSuccess(res, 200, result);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function createEntry(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const collectionId = parseCollectionId(req);
    const body = createEntrySchema.parse(req.body);
    const result = await createEntryService(req.userId, collectionId, body);
    return sendSuccess(res, 201, result);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function updateEntry(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const { collectionId, entryId } = parseCollectionAndEntryIds(req);
    const body = updateEntrySchema.parse(req.body);
    const result = await updateEntryService(req.userId, collectionId, entryId, body);
    return sendSuccess(res, 200, result);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function deleteEntry(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const { collectionId, entryId } = parseCollectionAndEntryIds(req);
    await deleteEntryService(req.userId, collectionId, entryId);
    return sendSuccess(res, 200, null);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function getPublicCollections(req: VercelRequest, res: VercelResponse) {
  try {
    const query = collectionListQuerySchema.parse(normalizeQueryObject(req.query));
    const result = await getPublicCollectionsService(query);
    return sendSuccess(res, 200, result);
  } catch (error) {
    return handleControllerError(res, error);
  }
}
