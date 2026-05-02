import type { CollectionView } from '../../../contracts/collection.contracts';
import CollectionCard from './CollectionCard';

interface CollectionsGridProps {
  collections: CollectionView[];
  emptyMessage: string;
}

export default function CollectionsGrid({ collections, emptyMessage }: CollectionsGridProps) {
  if (collections.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 text-sm text-gray-600">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
}
