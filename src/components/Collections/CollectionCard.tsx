import { Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CollectionView } from '../../../contracts/collection.contracts';
import { getCollectionCategoryLabel } from '../../config/collections.config';

interface CollectionCardProps {
  collection: CollectionView;
  to?: string;
  onEdit?: (collection: CollectionView) => void;
  onDelete?: (collection: CollectionView) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function CollectionCardBody({ collection }: Pick<CollectionCardProps, 'collection'>) {
  const categoryLabel = getCollectionCategoryLabel(collection);

  return (
    <>
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

        <div className="space-y-1 text-xs text-gray-500">
          <p>Создано: {formatDate(collection.createdAt)}</p>
          <p>Обновлено: {formatDate(collection.updatedAt)}</p>
        </div>
      </div>
    </>
  );
}

function CollectionActionButtons({
  collection,
  onEdit,
  onDelete,
}: Pick<CollectionCardProps, 'collection' | 'onEdit' | 'onDelete'>) {
  if (!onEdit && !onDelete) {
    return null;
  }

  return (
    <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
      {onEdit ? (
        <button
          type="button"
          aria-label={`Редактировать коллекцию ${collection.title}`}
          onClick={() => {
            onEdit(collection);
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/90 text-gray-700 shadow-sm transition hover:bg-white"
        >
          <Pencil size={14} />
        </button>
      ) : null}
      {onDelete ? (
        <button
          type="button"
          aria-label={`Удалить коллекцию ${collection.title}`}
          onClick={() => {
            onDelete(collection);
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/90 text-rose-600 shadow-sm transition hover:bg-white"
        >
          <Trash2 size={14} />
        </button>
      ) : null}
    </div>
  );
}

export default function CollectionCard({ collection, to, onEdit, onDelete }: CollectionCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <CollectionActionButtons collection={collection} onEdit={onEdit} onDelete={onDelete} />

      {to ? (
        <Link
          to={to}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          aria-label={`Открыть коллекцию ${collection.title}`}
        >
          <CollectionCardBody collection={collection} />
        </Link>
      ) : (
        <div className="block">
          <CollectionCardBody collection={collection} />
        </div>
      )}
    </div>
  );
}
