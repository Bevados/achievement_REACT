import { Link } from 'react-router-dom';
import type { CollectionView } from '../../../contracts/collection.contracts';
import { collectionCategoryLabels } from '../../config/collections.config';

interface CollectionCardProps {
  collection: CollectionView;
  to?: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function CollectionCardContent({ collection }: Pick<CollectionCardProps, 'collection'>) {
  const categoryLabel = collectionCategoryLabels[collection.category];

  return (
    <article>
      {collection.coverImageUrl ? (
        <img
          src={collection.coverImageUrl}
          alt={`Обложка коллекции ${collection.title}`}
          className="h-40 w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div
          className="h-40 w-full bg-linear-to-br from-sky-100 via-cyan-50 to-blue-100"
          aria-hidden="true"
        />
      )}

      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">
            {categoryLabel}
          </span>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
            {collection.entriesCount} карточек
          </span>
          {collection.isPublic ? (
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              Публичная
            </span>
          ) : null}
        </div>

        <h3 className="text-lg font-semibold text-primary transition group-hover:text-sky-700">
          {collection.title}
        </h3>

        {collection.description ? (
          <p className="text-sm leading-relaxed text-gray-700">{collection.description}</p>
        ) : (
          <p className="text-sm leading-relaxed text-gray-500">Описание пока не добавлено.</p>
        )}

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-gray-500">Обновлено: {formatDate(collection.updatedAt)}</p>
          <span className="text-xs font-medium text-sky-700 transition group-hover:text-sky-800">
            Подробнее
          </span>
        </div>
      </div>
    </article>
  );
}

export default function CollectionCard({ collection, to }: CollectionCardProps) {
  if (!to) {
    return (
      <div className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <CollectionCardContent collection={collection} />
      </div>
    );
  }

  return (
    <Link
      to={to}
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
      aria-label={`Открыть коллекцию ${collection.title}`}
    >
      <CollectionCardContent collection={collection} />
    </Link>
  );
}
