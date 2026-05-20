import { type ClientSession, ObjectId } from 'mongodb';
import { connectToDatabase } from '../../api/_mongodb.js';
import * as repository from '../repositories/collection.repository.js';
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
} from '../types/collection.types.js';

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

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
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

function normalizeOptionalString(value?: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function parseOptionalDate(value?: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  return new Date(value);
}

function assertCustomCategory(category: CollectionDocument['category'], customCategory?: string): string | undefined {
  const normalized = normalizeOptionalString(customCategory);

  if (category === 'other' && !normalized) {
    throw new ValidationError('Для категории «Свой вариант» нужно указать своё название');
  }

  return normalized;
}

function assertEntryBusinessRules({
  status,
  rating,
  dateStart,
  dateEnd,
}: {
  status: EntryDocument['status'];
  rating?: number;
  dateStart?: Date;
  dateEnd?: Date;
}) {
  if (status === 'completed') {
    if (rating === undefined) {
      throw new ValidationError('Для статуса «Завершено» нужно указать рейтинг');
    }

    if (!dateStart) {
      throw new ValidationError('Для статуса «Завершено» нужно указать дату');
    }
  }

  if (dateStart && dateEnd && dateEnd.getTime() < dateStart.getTime()) {
    throw new ValidationError('Дата окончания не может быть раньше даты начала');
  }
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
    customCategory: doc.customCategory,
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
    dateStart: doc.dateStart?.toISOString(),
    dateEnd: doc.dateEnd?.toISOString(),
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

export async function getPublicCollectionById(collectionId: string): Promise<CollectionView> {
  const collection = await repository.findPublicCollectionById(collectionId);

  if (!collection) {
    throw new NotFoundError('Public collection not found');
  }

  return toCollectionView(collection);
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
    customCategory:
      data.category === 'other' ? assertCustomCategory(data.category, data.customCategory) : undefined,
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
  const existingCollection = await assertCollectionAccess(ownerId, collectionId);

  const updateData: Partial<CollectionDocument> & { isPublic: false; updatedAt: Date } = {
    isPublic: false,
    updatedAt: new Date(),
  };
  const nextCategory = data.category ?? existingCollection.category;

  if (data.title !== undefined) {
    updateData.title = data.title;
  }

  if (data.category !== undefined) {
    updateData.category = data.category;
  }

  if (nextCategory === 'other') {
    if (data.customCategory !== undefined) {
      updateData.customCategory = normalizeOptionalString(data.customCategory);
    }

    updateData.customCategory = assertCustomCategory(
      nextCategory,
      data.customCategory !== undefined ? updateData.customCategory : existingCollection.customCategory,
    );
  } else {
    updateData.customCategory = undefined;
  }

  if (data.description !== undefined) {
    updateData.description = data.description;
  }

  if (data.coverImageUrl !== undefined) {
    updateData.coverImageUrl = data.coverImageUrl;
  }

  await repository.updateCollectionById(ownerId, collectionId, updateData);

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

export async function getPublicCollectionEntries(
  collectionId: string,
  query: EntryListQueryDto,
): Promise<PaginatedResult<EntryView>> {
  const collection = await repository.findPublicCollectionById(collectionId);

  if (!collection) {
    throw new NotFoundError('Public collection not found');
  }

  const result = await repository.findPublicCollectionEntries(collectionId, query);
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
    dateStart: parseOptionalDate(data.dateStart),
    dateEnd: parseOptionalDate(data.dateEnd),
    createdAt: now,
    updatedAt: now,
  };

  assertEntryBusinessRules(document);

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
  const existingEntry = await assertEntryAccess(ownerId, collectionId, entryId);

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

  if (data.dateStart !== undefined) {
    updateData.dateStart = parseOptionalDate(data.dateStart);
  }

  if (data.dateEnd !== undefined) {
    updateData.dateEnd = parseOptionalDate(data.dateEnd);
  }

  assertEntryBusinessRules({
    status: updateData.status ?? existingEntry.status,
    rating: updateData.rating ?? existingEntry.rating,
    dateStart: updateData.dateStart ?? existingEntry.dateStart,
    dateEnd: updateData.dateEnd ?? existingEntry.dateEnd,
  });

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
