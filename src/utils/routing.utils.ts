import type { CollectionView } from '../../contracts/collection.contracts';

function normalizeSlugPart(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\u0400-\u04ff]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function slugify(value: string): string {
  const slug = normalizeSlugPart(value);
  return slug || 'collection';
}

export function getPrivateCollectionHref(collection: Pick<CollectionView, 'id' | 'title'>): string {
  return `/collections/${collection.id}/${slugify(collection.title)}`;
}

export function getPublicCollectionHref(collection: Pick<CollectionView, 'id' | 'title'>): string {
  return `/examples/${collection.id}/${slugify(collection.title)}`;
}
