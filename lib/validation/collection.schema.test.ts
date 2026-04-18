import { describe, expect, it } from 'vitest';
import { createCollectionSchema, updateCollectionSchema } from './collection.schema';

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
});
