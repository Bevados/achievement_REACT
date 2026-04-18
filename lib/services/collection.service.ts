import { type ClientSession, ObjectId } from 'mongodb';
import { connectToDatabase } from '../../api/_mongodb';
import * as repository from '../repositories/collection.repository';
import type {
  CollectionDocument,
  CollectionListQueryDto,
  CollectionView,
  CreateCollectionDto,
  CreateEntryDto,
  EntryDocument,
  EntryListQueryDto,
  EntryView,
  PaginatedResult,
  UpdateCollectionDto,
  UpdateEntryDto,
} from '../types/collection.types';

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class TransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransactionError';
  }
}

function mapPaginated<TInput, TOutput>(
  result: PaginatedResult<TInput>,
  mapper: (item: TInput) => TOutput,
): PaginatedResult<TOutput> {
  return {
    items: result.items.map(mapper),
    meta: result.meta,
  };
}

function centsToDollars(value?: number): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  return Number((value / 100).toFixed(2));
}

function dollarsToCents(value?: number): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  return Math.round(value * 100);
}

function normalizeTags(tags?: string[]): string[] | undefined {
  if (tags === undefined) {
    return undefined;
  }

  const normalized = Array.from(
    new Set(
      tags
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0),
    ),
  );

  return normalized;
}

function parseOptionalDate(date?: string): Date | undefined {
  if (!date) {
    return undefined;
  }

  return new Date(date);
}

function toCollectionView(doc: CollectionDocument): CollectionView {
  if (!doc._id) {
    throw new Error('Collection document has no _id');
  }

  return {
    id: doc._id.toHexString(),
    ownerId: doc.ownerId,
    title: doc.title,
    category: doc.category,
    description: doc.description,
    coverImageUrl: doc.coverImageUrl,
    isPublic: doc.isPublic,
    entriesCount: doc.entriesCount,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

function toEntryView(doc: EntryDocument): EntryView {
  if (!doc._id) {
    throw new Error('Entry document has no _id');
  }

  return {
    id: doc._id.toHexString(),
    collectionId: doc.collectionId.toHexString(),
    ownerId: doc.ownerId,
    title: doc.title,
    status: doc.status,
    description: doc.description,
    imageUrl: doc.imageUrl,
    price: centsToDollars(doc.priceCents),
    tags: doc.tags,
    rating: doc.rating,
    date: doc.date?.toISOString(),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

async function assertCollectionAccess(ownerId: string, collectionId: string): Promise<CollectionDocument> {
  const ownedCollection = await repository.findCollectionById(ownerId, collectionId);

  if (ownedCollection) {
    return ownedCollection;
  }

  const existingCollection = await repository.findCollectionByIdRaw(collectionId);
  if (existingCollection) {
    throw new ForbiddenError('Access to collection is forbidden');
  }

  throw new NotFoundError('Collection not found');
}

async function assertEntryAccess(
  ownerId: string,
  collectionId: string,
  entryId: string,
): Promise<EntryDocument> {
  await assertCollectionAccess(ownerId, collectionId);

  const ownedEntry = await repository.findEntryById(ownerId, collectionId, entryId);
  if (ownedEntry) {
    return ownedEntry;
  }

  const existingEntry = await repository.findEntryByIdRaw(entryId);
  if (existingEntry && existingEntry.collectionId.toHexString() === collectionId) {
    throw new ForbiddenError('Access to entry is forbidden');
  }

  throw new NotFoundError('Entry not found');
}

async function runInTransaction<T>(work: (session: ClientSession) => Promise<T>): Promise<T> {
  const { client } = await connectToDatabase();
  const session = client.startSession();

  try {
    session.startTransaction();
    const result = await work(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    await session.endSession();
  }
}

export async function getOwnerCollections(
  ownerId: string,
  query: CollectionListQueryDto,
): Promise<PaginatedResult<CollectionView>> {
  const result = await repository.findOwnerCollections(ownerId, query);
  return mapPaginated(result, toCollectionView);
}

export async function getPublicCollections(
  query: CollectionListQueryDto,
): Promise<PaginatedResult<CollectionView>> {
  const result = await repository.findPublicCollections(query);
  return mapPaginated(result, toCollectionView);
}

export async function getCollectionById(ownerId: string, collectionId: string): Promise<CollectionView> {
  const collection = await assertCollectionAccess(ownerId, collectionId);
  return toCollectionView(collection);
}

export async function createCollection(
  ownerId: string,
  data: CreateCollectionDto,
): Promise<CollectionView> {
  const now = new Date();

  const document: CollectionDocument = {
    ownerId,
    title: data.title,
    category: data.category,
    description: data.description,
    coverImageUrl: data.coverImageUrl,
    isPublic: false,
    entriesCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const insertResult = await repository.createCollection(document);
  const createdCollection = await repository.findCollectionById(ownerId, insertResult.insertedId.toHexString());

  if (!createdCollection) {
    throw new NotFoundError('Collection not found after creation');
  }

  return toCollectionView(createdCollection);
}

export async function updateCollection(
  ownerId: string,
  collectionId: string,
  data: UpdateCollectionDto,
): Promise<CollectionView> {
  await assertCollectionAccess(ownerId, collectionId);

  await repository.updateCollectionById(ownerId, collectionId, {
    ...data,
    isPublic: false,
    updatedAt: new Date(),
  });

  const updatedCollection = await repository.findCollectionById(ownerId, collectionId);
  if (!updatedCollection) {
    throw new NotFoundError('Collection not found after update');
  }

  return toCollectionView(updatedCollection);
}

export async function deleteCollection(ownerId: string, collectionId: string): Promise<void> {
  await assertCollectionAccess(ownerId, collectionId);

  await runInTransaction(async (session) => {
    await repository.deleteEntriesByCollectionId(ownerId, collectionId, session);
    const deleteCollectionResult = await repository.deleteCollectionById(ownerId, collectionId, session);

    if (deleteCollectionResult.deletedCount === 0) {
      throw new TransactionError('Collection delete transaction failed');
    }
  });
}

export async function getCollectionEntries(
  ownerId: string,
  collectionId: string,
  query: EntryListQueryDto,
): Promise<PaginatedResult<EntryView>> {
  await assertCollectionAccess(ownerId, collectionId);

  const result = await repository.findCollectionEntries(ownerId, collectionId, query);
  return mapPaginated(result, toEntryView);
}

export async function getEntryById(
  ownerId: string,
  collectionId: string,
  entryId: string,
): Promise<EntryView> {
  const entry = await assertEntryAccess(ownerId, collectionId, entryId);
  return toEntryView(entry);
}

export async function createEntry(
  ownerId: string,
  collectionId: string,
  data: CreateEntryDto,
): Promise<EntryView> {
  await assertCollectionAccess(ownerId, collectionId);

  const now = new Date();

  const document: EntryDocument = {
    ownerId,
    collectionId: new ObjectId(collectionId),
    title: data.title,
    status: data.status,
    description: data.description,
    imageUrl: data.imageUrl,
    priceCents: dollarsToCents(data.price),
    tags: normalizeTags(data.tags),
    rating: data.rating,
    date: parseOptionalDate(data.date),
    createdAt: now,
    updatedAt: now,
  };

  const insertResult = await runInTransaction(async (session) => {
    const created = await repository.createEntry(document, session);
    const countResult = await repository.changeCollectionEntriesCount(ownerId, collectionId, 1, session);

    if (countResult.matchedCount === 0) {
      throw new TransactionError('Entry create transaction failed on count update');
    }

    return created;
  });

  const createdEntry = await repository.findEntryById(ownerId, collectionId, insertResult.insertedId.toHexString());
  if (!createdEntry) {
    throw new NotFoundError('Entry not found after creation');
  }

  return toEntryView(createdEntry);
}

export async function updateEntry(
  ownerId: string,
  collectionId: string,
  entryId: string,
  data: UpdateEntryDto,
): Promise<EntryView> {
  await assertEntryAccess(ownerId, collectionId, entryId);

  const updateData: Partial<EntryDocument> = {
    updatedAt: new Date(),
  };

  if (data.title !== undefined) {
    updateData.title = data.title;
  }

  if (data.status !== undefined) {
    updateData.status = data.status;
  }

  if (data.description !== undefined) {
    updateData.description = data.description;
  }

  if (data.imageUrl !== undefined) {
    updateData.imageUrl = data.imageUrl;
  }

  if (data.price !== undefined) {
    updateData.priceCents = dollarsToCents(data.price);
  }

  if (data.tags !== undefined) {
    updateData.tags = normalizeTags(data.tags);
  }

  if (data.rating !== undefined) {
    updateData.rating = data.rating;
  }

  if (data.date !== undefined) {
    updateData.date = parseOptionalDate(data.date);
  }

  await repository.updateEntryById(ownerId, collectionId, entryId, updateData);

  const updatedEntry = await repository.findEntryById(ownerId, collectionId, entryId);
  if (!updatedEntry) {
    throw new NotFoundError('Entry not found after update');
  }

  return toEntryView(updatedEntry);
}

export async function deleteEntry(ownerId: string, collectionId: string, entryId: string): Promise<void> {
  await assertEntryAccess(ownerId, collectionId, entryId);

  await runInTransaction(async (session) => {
    const deleteResult = await repository.deleteEntryById(ownerId, collectionId, entryId, session);
    if (deleteResult.deletedCount === 0) {
      throw new NotFoundError('Entry not found for delete');
    }

    const countResult = await repository.changeCollectionEntriesCount(ownerId, collectionId, -1, session);
    if (countResult.matchedCount === 0) {
      throw new TransactionError('Entry delete transaction failed on count update');
    }
  });
}
