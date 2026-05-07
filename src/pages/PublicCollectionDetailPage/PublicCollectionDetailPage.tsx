import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { CollectionView, EntryView, PaginationMeta } from '../../../contracts/collection.contracts';
import { getPublicCollectionById, getPublicCollectionEntries } from '../../api/collections.api';
import EntriesGrid from '../../components/Entries/EntriesGrid';
import { collectionCategoryLabels } from '../../config/collections.config';

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function PublicCollectionDetailPage() {
  const { collectionId } = useParams<{ collectionId: string }>();

  const [collection, setCollection] = useState<CollectionView | null>(null);
  const [entries, setEntries] = useState<EntryView[]>([]);
  const [entriesMeta, setEntriesMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reloadPage = useCallback(async () => {
    if (!collectionId) {
      setCollection(null);
      setEntries([]);
      setEntriesMeta(null);
      setErrorMessage('Не удалось определить идентификатор публичной коллекции.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [collectionResult, entriesResult] = await Promise.all([
        getPublicCollectionById(collectionId),
        getPublicCollectionEntries(collectionId),
      ]);

      setCollection(collectionResult);
      setEntries(entriesResult.items);
      setEntriesMeta(entriesResult.meta);
    } catch (error) {
      setCollection(null);
      setEntries([]);
      setEntriesMeta(null);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Не удалось загрузить публичную коллекцию и ее карточки. Попробуйте еще раз.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [collectionId]);

  useEffect(() => {
    void reloadPage();
  }, [reloadPage]);

  if (isLoading) {
    return (
      <section className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="h-4 w-36 animate-pulse rounded-full bg-gray-100" />
        <div className="h-10 w-72 animate-pulse rounded-2xl bg-gray-100" />
        <div className="grid gap-4 lg:grid-cols-2" aria-live="polite">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-2xl border border-gray-200 bg-gray-50" />
          ))}
        </div>
      </section>
    );
  }

  if (errorMessage || !collection) {
    return (
      <section className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
        <Link to="/examples" className="text-sm font-medium text-sky-700 hover:underline">
          ← К списку примеров
        </Link>

        <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4" role="alert">
          <p className="text-sm text-rose-700">
            {errorMessage ?? 'Публичная коллекция не найдена или недоступна.'}
          </p>
          <button
            type="button"
            onClick={() => {
              void reloadPage();
            }}
            className="mt-3 inline-flex rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Повторить загрузку
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
      <Link to="/examples" className="text-sm font-medium text-sky-700 hover:underline">
        ← К списку примеров
      </Link>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-50">
        {collection.coverImageUrl ? (
          <img
            src={collection.coverImageUrl}
            alt={`Обложка коллекции ${collection.title}`}
            className="h-64 w-full object-cover"
          />
        ) : (
          <div className="h-48 w-full bg-linear-to-br from-sky-100 via-cyan-50 to-blue-100" aria-hidden="true" />
        )}

        <div className="space-y-5 p-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">
                {collectionCategoryLabels[collection.category]}
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                {collection.entriesCount} карточек
              </span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                Публичная
              </span>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-primary">{collection.title}</h1>
              <p className="mt-2 text-sm text-gray-500">Обновлено: {formatDate(collection.updatedAt)}</p>
            </div>

            {collection.description ? (
              <p className="max-w-3xl text-sm leading-relaxed text-gray-700 sm:text-base">
                {collection.description}
              </p>
            ) : (
              <p className="max-w-3xl text-sm leading-relaxed text-gray-500 sm:text-base">
                Описание для этой коллекции пока не добавлено.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-primary">Карточки коллекции</h2>
            <p className="mt-1 text-sm text-gray-600">
              {entriesMeta
                ? `Показано ${entries.length} из ${entriesMeta.total} карточек`
                : `Показано ${entries.length} карточек`}
            </p>
          </div>
        </div>

        <EntriesGrid
          entries={entries}
          emptyMessage="В этой публичной коллекции пока нет карточек."
          showActions={false}
        />
      </div>
    </section>
  );
}
