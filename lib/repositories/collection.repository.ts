import {
  ObjectId,
  type DeleteResult,
  type Filter,
  type InsertOneResult,
  type SortDirection,
  type UpdateResult,
} from 'mongodb';
import { getCollection } from '../../api/_mongodb';
import type {
  CollectionDocument,
  CollectionListQueryDto,
  CollectionSortField,
  EntryDocument,
  EntryListQueryDto,
  EntrySortField,
  PaginatedResult,
} from '../types/collection.types';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const collectionSortFieldMap: Record<CollectionSortField, keyof CollectionDocument> = {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  title: 'title',
  entriesCount: 'entriesCount',
};

const entrySortFieldMap: Record<EntrySortField, keyof EntryDocument> = {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  title: 'title',
  status: 'status',
  date: 'date',
  rating: 'rating',
  price: 'priceCents',
};

function toSortDirection(order?: 'asc' | 'desc'): SortDirection {
  return order === 'asc' ? 1 : -1;
}

function resolvePagination(query: { page?: number; limit?: number }) {
  const page = query.page ?? DEFAULT_PAGE;
  const limit = query.limit ?? DEFAULT_LIMIT;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

function buildCollectionSort(query: CollectionListQueryDto): Record<string, SortDirection> {
  const sortBy = query.sortBy ?? 'updatedAt';
  const sortField = collectionSortFieldMap[sortBy];

  return {
    [sortField]: toSortDirection(query.sortOrder),
  };
}

function buildEntrySort(query: EntryListQueryDto): Record<string, SortDirection> {
  const sortBy = query.sortBy ?? 'updatedAt';
  const sortField = entrySortFieldMap[sortBy];

  return {
    [sortField]: toSortDirection(query.sortOrder),
  };
}

function buildCollectionFilter(
  ownerId: string,
  query: CollectionListQueryDto,
): Filter<CollectionDocument> {
  const filter: Filter<CollectionDocument> = {
    ownerId,
  };

  if (query.category) {
    filter.category = query.category;
  }

  if (typeof query.isPublic === 'boolean') {
    filter.isPublic = query.isPublic;
  }

  if (query.search) {
    filter.title = { $regex: query.search, $options: 'i' };
  }

  return filter;
}

function buildPublicCollectionFilter(query: CollectionListQueryDto): Filter<CollectionDocument> {
  const filter: Filter<CollectionDocument> = {
    isPublic: true,
  };

  if (query.category) {
    filter.category = query.category;
  }

  if (query.search) {
    filter.title = { $regex: query.search, $options: 'i' };
  }

  return filter;
}

function buildEntryFilter(
  ownerId: string,
  collectionObjectId: ObjectId,
  query: EntryListQueryDto,
): Filter<EntryDocument> {
  const filter: Filter<EntryDocument> = {
    ownerId,
    collectionId: collectionObjectId,
  };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.tag) {
    filter.tags = query.tag;
  }

  if (query.minRating !== undefined || query.maxRating !== undefined) {
    const ratingFilter: { $gte?: number; $lte?: number } = {};

    if (query.minRating !== undefined) {
      ratingFilter.$gte = query.minRating;
    }

    if (query.maxRating !== undefined) {
      ratingFilter.$lte = query.maxRating;
    }

    filter.rating = ratingFilter;
  }

  return filter;
}

export async function findOwnerCollections(
  ownerId: string,
  query: CollectionListQueryDto,
): Promise<PaginatedResult<CollectionDocument>> {
  const collection = await getCollection<CollectionDocument>('collections');
  const filter = buildCollectionFilter(ownerId, query);
  const sort = buildCollectionSort(query);
  const { page, limit, skip } = resolvePagination(query);

  const [items, total] = await Promise.all([
    collection.find(filter).sort(sort).skip(skip).limit(limit).toArray(),
    collection.countDocuments(filter),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function findPublicCollections(
  query: CollectionListQueryDto,
): Promise<PaginatedResult<CollectionDocument>> {
  const collection = await getCollection<CollectionDocument>('collections');
  const filter = buildPublicCollectionFilter(query);
  const sort = buildCollectionSort(query);
  const { page, limit, skip } = resolvePagination(query);

  const [items, total] = await Promise.all([
    collection.find(filter).sort(sort).skip(skip).limit(limit).toArray(),
    collection.countDocuments(filter),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function findCollectionById(ownerId: string, collectionId: string) {
  const collection = await getCollection<CollectionDocument>('collections');
  return collection.findOne({ _id: new ObjectId(collectionId), ownerId });
}

export async function createCollection(
  data: CollectionDocument,
): Promise<InsertOneResult<CollectionDocument>> {
  const collection = await getCollection<CollectionDocument>('collections');
  return collection.insertOne(data);
}

export async function updateCollectionById(
  ownerId: string,
  collectionId: string,
  updateData: Partial<CollectionDocument>,
): Promise<UpdateResult<CollectionDocument>> {
  const collection = await getCollection<CollectionDocument>('collections');
  const { _id, ownerId: ignoredOwnerId, ...safeUpdateData } = updateData;

  return collection.updateOne(
    {
      _id: new ObjectId(collectionId),
      ownerId,
    },
    {
      $set: safeUpdateData,
    },
  );
}

export async function deleteCollectionById(
  ownerId: string,
  collectionId: string,
): Promise<DeleteResult> {
  const collection = await getCollection<CollectionDocument>('collections');

  return collection.deleteOne({
    _id: new ObjectId(collectionId),
    ownerId,
  });
}

export async function findCollectionEntries(
  ownerId: string,
  collectionId: string,
  query: EntryListQueryDto,
): Promise<PaginatedResult<EntryDocument>> {
  const collectionObjectId = new ObjectId(collectionId);
  const entries = await getCollection<EntryDocument>('entries');
  const filter = buildEntryFilter(ownerId, collectionObjectId, query);
  const sort = buildEntrySort(query);
  const { page, limit, skip } = resolvePagination(query);

  const [items, total] = await Promise.all([
    entries.find(filter).sort(sort).skip(skip).limit(limit).toArray(),
    entries.countDocuments(filter),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function createEntry(data: EntryDocument): Promise<InsertOneResult<EntryDocument>> {
  const entries = await getCollection<EntryDocument>('entries');
  return entries.insertOne(data);
}

export async function updateEntryById(
  ownerId: string,
  collectionId: string,
  entryId: string,
  updateData: Partial<EntryDocument>,
): Promise<UpdateResult<EntryDocument>> {
  const entries = await getCollection<EntryDocument>('entries');
  const {
    _id,
    ownerId: ignoredOwnerId,
    collectionId: ignoredCollectionId,
    ...safeUpdateData
  } = updateData;

  return entries.updateOne(
    {
      _id: new ObjectId(entryId),
      collectionId: new ObjectId(collectionId),
      ownerId,
    },
    {
      $set: safeUpdateData,
    },
  );
}

export async function deleteEntryById(
  ownerId: string,
  collectionId: string,
  entryId: string,
): Promise<DeleteResult> {
  const entries = await getCollection<EntryDocument>('entries');

  return entries.deleteOne({
    _id: new ObjectId(entryId),
    collectionId: new ObjectId(collectionId),
    ownerId,
  });
}

export async function deleteEntriesByCollectionId(
  ownerId: string,
  collectionId: string,
): Promise<DeleteResult> {
  const entries = await getCollection<EntryDocument>('entries');

  return entries.deleteMany({
    ownerId,
    collectionId: new ObjectId(collectionId),
  });
}
