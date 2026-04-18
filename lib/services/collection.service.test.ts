import { ObjectId } from 'mongodb';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const repositoryMocks = vi.hoisted(() => ({
  findOwnerCollections: vi.fn(),
  findPublicCollections: vi.fn(),
  findCollectionById: vi.fn(),
  findCollectionByIdRaw: vi.fn(),
  createCollection: vi.fn(),
  updateCollectionById: vi.fn(),
  deleteCollectionById: vi.fn(),
  findCollectionEntries: vi.fn(),
  findEntryById: vi.fn(),
  findEntryByIdRaw: vi.fn(),
  createEntry: vi.fn(),
  updateEntryById: vi.fn(),
  deleteEntryById: vi.fn(),
  deleteEntriesByCollectionId: vi.fn(),
  changeCollectionEntriesCount: vi.fn(),
}));

vi.mock('../repositories/collection.repository', () => repositoryMocks);

import {
  ForbiddenError,
  NotFoundError,
  createCollection,
  createEntry,
  deleteCollection,
  deleteEntry,
  getCollectionById,
  getOwnerCollections,
  updateEntry,
} from './collection.service';

function buildCollectionDoc(ownerId = 'user-1', id = new ObjectId()) {
  return {
    _id: id,
    ownerId,
    title: 'Travel Plans',
    category: 'travel' as const,
    description: 'Trips ideas',
    coverImageUrl: 'https://example.com/cover.jpg',
    isPublic: false,
    entriesCount: 2,
    createdAt: new Date('2026-01-10T10:00:00.000Z'),
    updatedAt: new Date('2026-01-11T10:00:00.000Z'),
  };
}

function buildEntryDoc(ownerId = 'user-1', collectionId = new ObjectId(), id = new ObjectId()) {
  return {
    _id: id,
    ownerId,
    collectionId,
    title: 'Visit Kyoto',
    status: 'planned' as const,
    description: 'Cherry blossom season',
    imageUrl: 'https://example.com/entry.jpg',
    priceCents: 1234,
    tags: ['travel', 'japan'],
    rating: 8,
    date: new Date('2026-03-01T08:00:00.000Z'),
    createdAt: new Date('2026-01-12T10:00:00.000Z'),
    updatedAt: new Date('2026-01-13T10:00:00.000Z'),
  };
}

describe('collection.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps owner collections list to API view format', async () => {
    const collectionDoc = buildCollectionDoc();

    repositoryMocks.findOwnerCollections.mockResolvedValue({
      items: [collectionDoc],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });

    const result = await getOwnerCollections('user-1', {
      page: 1,
      limit: 10,
      sortBy: 'updatedAt',
      sortOrder: 'desc',
      search: 'travel',
    });

    expect(repositoryMocks.findOwnerCollections).toHaveBeenCalledWith('user-1', {
      page: 1,
      limit: 10,
      sortBy: 'updatedAt',
      sortOrder: 'desc',
      search: 'travel',
    });
    expect(result.meta.total).toBe(1);
    expect(result.items[0].id).toBe(collectionDoc._id.toHexString());
    expect(result.items[0].createdAt).toBe(collectionDoc.createdAt.toISOString());
  });

  it('returns collection view when owner has access', async () => {
    const doc = buildCollectionDoc();

    repositoryMocks.findCollectionById.mockResolvedValue(doc);

    const result = await getCollectionById('user-1', doc._id.toHexString());

    expect(result.id).toBe(doc._id.toHexString());
    expect(repositoryMocks.findCollectionByIdRaw).not.toHaveBeenCalled();
  });

  it('throws ForbiddenError when collection exists but belongs to another owner', async () => {
    const doc = buildCollectionDoc('user-2');

    repositoryMocks.findCollectionById.mockResolvedValue(null);
    repositoryMocks.findCollectionByIdRaw.mockResolvedValue(doc);

    await expect(getCollectionById('user-1', doc._id.toHexString())).rejects.toBeInstanceOf(
      ForbiddenError,
    );
  });

  it('throws NotFoundError when collection does not exist', async () => {
    repositoryMocks.findCollectionById.mockResolvedValue(null);
    repositoryMocks.findCollectionByIdRaw.mockResolvedValue(null);

    await expect(getCollectionById('user-1', new ObjectId().toHexString())).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it('creates a collection with internal privacy invariants', async () => {
    const insertedId = new ObjectId();
    const created = buildCollectionDoc('user-1', insertedId);

    repositoryMocks.createCollection.mockResolvedValue({
      acknowledged: true,
      insertedId,
    });
    repositoryMocks.findCollectionById.mockResolvedValue(created);

    const result = await createCollection('user-1', {
      title: 'My New Collection',
      category: 'travel',
      description: 'Personal notes',
      coverImageUrl: 'https://example.com/new.jpg',
    });

    expect(repositoryMocks.createCollection).toHaveBeenCalledWith(
      expect.objectContaining({
        ownerId: 'user-1',
        isPublic: false,
        entriesCount: 0,
      }),
    );
    expect(result.isPublic).toBe(false);
  });

  it('createEntry converts dto fields and increments entriesCount', async () => {
    const collectionId = new ObjectId().toHexString();
    const entryId = new ObjectId();
    const collectionDoc = buildCollectionDoc();
    const storedEntry = buildEntryDoc('user-1', new ObjectId(collectionId), entryId);

    repositoryMocks.findCollectionById.mockResolvedValue(collectionDoc);
    repositoryMocks.createEntry.mockResolvedValue({ acknowledged: true, insertedId: entryId });
    repositoryMocks.changeCollectionEntriesCount.mockResolvedValue({
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
      upsertedCount: 0,
      upsertedId: null,
    });
    repositoryMocks.findEntryById.mockResolvedValue(storedEntry);

    const result = await createEntry('user-1', collectionId, {
      title: 'Kyoto trip',
      status: 'planned',
      price: 12.34,
      date: '2026-03-01T08:00:00.000Z',
      tags: ['  Travel ', 'travel', ' Japan '],
    });

    expect(repositoryMocks.createEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        ownerId: 'user-1',
        collectionId: expect.any(ObjectId),
        priceCents: 1234,
        tags: ['travel', 'japan'],
        date: expect.any(Date),
      }),
    );
    expect(repositoryMocks.changeCollectionEntriesCount).toHaveBeenCalledWith('user-1', collectionId, 1);
    expect(result.price).toBe(12.34);
    expect(result.tags).toEqual(['travel', 'japan']);
  });

  it('updates entry by converting only provided fields', async () => {
    const collectionId = new ObjectId().toHexString();
    const entryId = new ObjectId().toHexString();
    const collectionDoc = buildCollectionDoc();
    const currentEntry = buildEntryDoc('user-1', new ObjectId(collectionId), new ObjectId(entryId));
    const updatedEntry = {
      ...currentEntry,
      priceCents: 1050,
      tags: ['a', 'b'],
      date: new Date('2026-05-02T10:00:00.000Z'),
      updatedAt: new Date('2026-05-03T10:00:00.000Z'),
    };

    repositoryMocks.findCollectionById.mockResolvedValue(collectionDoc);
    repositoryMocks.findEntryById
      .mockResolvedValueOnce(currentEntry)
      .mockResolvedValueOnce(updatedEntry);
    repositoryMocks.updateEntryById.mockResolvedValue({
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
      upsertedCount: 0,
      upsertedId: null,
    });

    const result = await updateEntry('user-1', collectionId, entryId, {
      price: 10.5,
      tags: [' A ', 'a', 'B '],
      date: '2026-05-02T10:00:00.000Z',
    });

    expect(repositoryMocks.updateEntryById).toHaveBeenCalledWith(
      'user-1',
      collectionId,
      entryId,
      expect.objectContaining({
        priceCents: 1050,
        tags: ['a', 'b'],
        date: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
    expect(result.price).toBe(10.5);
  });

  it('deletes collection in cascade order after access check', async () => {
    const collectionId = new ObjectId().toHexString();
    const sequence: string[] = [];

    repositoryMocks.findCollectionById.mockImplementation(async () => {
      sequence.push('check-access');
      return buildCollectionDoc();
    });
    repositoryMocks.deleteEntriesByCollectionId.mockImplementation(async () => {
      sequence.push('delete-entries');
      return {
        acknowledged: true,
        deletedCount: 2,
      };
    });
    repositoryMocks.deleteCollectionById.mockImplementation(async () => {
      sequence.push('delete-collection');
      return {
        acknowledged: true,
        deletedCount: 1,
      };
    });

    await deleteCollection('user-1', collectionId);

    expect(sequence).toEqual(['check-access', 'delete-entries', 'delete-collection']);
  });

  it('deleteEntry decrements entriesCount after successful delete', async () => {
    const collectionId = new ObjectId().toHexString();
    const entryId = new ObjectId().toHexString();
    const entryDoc = buildEntryDoc('user-1', new ObjectId(collectionId), new ObjectId(entryId));

    repositoryMocks.findCollectionById.mockResolvedValue(buildCollectionDoc());
    repositoryMocks.findEntryById.mockResolvedValue(entryDoc);
    repositoryMocks.deleteEntryById.mockResolvedValue({
      acknowledged: true,
      deletedCount: 1,
    });
    repositoryMocks.changeCollectionEntriesCount.mockResolvedValue({
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
      upsertedCount: 0,
      upsertedId: null,
    });

    await deleteEntry('user-1', collectionId, entryId);

    expect(repositoryMocks.changeCollectionEntriesCount).toHaveBeenCalledWith('user-1', collectionId, -1);
  });
});
