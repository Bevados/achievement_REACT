import { describe, expect, it } from 'vitest';
import {
  createCollectionSchema,
  createEntrySchema,
  updateCollectionSchema,
  updateEntrySchema,
} from '../../contracts/collection.contracts.schema';

describe('collection.schema private contract', () => {
  it('rejects isPublic in createCollectionSchema', () => {
    expect(() =>
      createCollectionSchema.parse({
        title: 'My Collection',
        category: 'travel',
        isPublic: true,
      }),
    ).toThrow();
  });

  it('rejects isPublic in updateCollectionSchema', () => {
    expect(() =>
      updateCollectionSchema.parse({
        title: 'Updated',
        isPublic: true,
      }),
    ).toThrow();
  });

  it('requires rating and dateStart for completed entry creation', () => {
    expect(() =>
      createEntrySchema.parse({
        title: 'Done item',
        status: 'completed',
      }),
    ).toThrow();
  });

  it('accepts a single-date completed entry payload', () => {
    expect(() =>
      createEntrySchema.parse({
        title: 'Done item',
        status: 'completed',
        rating: 9,
        dateStart: '2026-05-08T10:00:00.000Z',
      }),
    ).not.toThrow();
  });

  it('rejects dateEnd earlier than dateStart', () => {
    expect(() =>
      createEntrySchema.parse({
        title: 'Trip',
        status: 'planned',
        dateStart: '2026-05-10T10:00:00.000Z',
        dateEnd: '2026-05-08T10:00:00.000Z',
      }),
    ).toThrow();
  });

  it('requires rating and dateStart when patch sets status to completed', () => {
    expect(() =>
      updateEntrySchema.parse({
        status: 'completed',
      }),
    ).toThrow();
  });
});
