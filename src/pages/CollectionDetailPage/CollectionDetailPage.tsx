import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { CollectionView, EntryView } from '../../../contracts/collection.contracts';
import { getCollectionById, getCollectionEntries } from '../../api/collections.api';
import CollectionForm from '../../components/Collections/CollectionForm';
import BaseModal from '../../components/Modal/BaseModal';
import EntryForm from '../../components/Entries/EntryForm';
import EntriesFilters from '../../components/Entries/EntriesFilters';
import EntriesGrid from '../../components/Entries/EntriesGrid';
import EntriesPagination from '../../components/Entries/EntriesPagination';
import { getCollectionCategoryLabel } from '../../config/collections.config';
import { useEntriesListController } from '../../hooks/useEntriesListController';

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function CollectionDetailPage() {
  const { collectionId } = useParams<{ collectionId: string }>();

  const [collection, setCollection] = useState<CollectionView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);
  const [entryFormState, setEntryFormState] = useState<
    | { isOpen: false; entry: null; mode: 'create' | 'edit' }
    | { isOpen: true; entry: EntryView | null; mode: 'create' | 'edit' }
  >({ isOpen: false, entry: null, mode: 'create' });

  const {
    entries,
    meta: entriesMeta,
    page,
    sortBy,
    sortOrder,
    status,
    createdAtFromInput,
    createdAtToInput,
    dateStartFromInput,
    dateStartToInput,
    minPriceInput,
    maxPriceInput,
    minRatingInput,
    maxRatingInput,
    isLoading: isEntriesLoading,
    errorMessage: entriesErrorMessage,
    setSortBy,
    setSortOrder,
    setStatus,
    setCreatedAtFromInput,
    setCreatedAtToInput,
    setDateStartFromInput,
    setDateStartToInput,
    setMinPriceInput,
    setMaxPriceInput,
    setMinRatingInput,
    setMaxRatingInput,
    applyFilters,
    resetFilters,
    goToPreviousPage,
    goToNextPage,
    reloadEntries,
  } = useEntriesListController({
    collectionId: collectionId ?? '',
    fetchEntries: getCollectionEntries,
    fallbackErrorMessage: 'Не удалось загрузить карточки коллекции. Попробуйте еще раз.',
  });

  const reloadPage = useCallback(async () => {
    if (!collectionId) {
      setCollection(null);
      setErrorMessage('Не удалось определить идентификатор коллекции.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const collectionResult = await getCollectionById(collectionId);

      setCollection(collectionResult);
    } catch (error) {
      setCollection(null);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Не удалось загрузить коллекцию и карточки. Попробуйте еще раз.',
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
        <Link to="/collections" className="text-sm font-medium text-sky-700 hover:underline">
          ← К списку коллекций
        </Link>

        <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4" role="alert">
          <p className="text-sm text-rose-700">
            {errorMessage ?? 'Коллекция не найдена или недоступна.'}
          </p>
          <button
            type="button"
            onClick={() => {
              void reloadPage();
              void reloadEntries();
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
      <Link to="/collections" className="text-sm font-medium text-sky-700 hover:underline">
        ← К списку коллекций
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
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">
                  {getCollectionCategoryLabel(collection)}
                </span>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                  {collection.entriesCount} карточек
                </span>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-primary">{collection.title}</h1>
                <p className="mt-2 text-sm text-gray-500">
                  Обновлено: {formatDate(collection.updatedAt)}
                </p>
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

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setEntryFormState({ isOpen: true, entry: null, mode: 'create' });
                }}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Добавить карточку
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCollectionFormOpen(true);
                }}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Редактировать коллекцию
              </button>
              <button
                type="button"
                disabled
                className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-300 disabled:cursor-not-allowed"
              >
                Удалить коллекцию
              </button>
            </div>
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

        <EntriesFilters
          sortBy={sortBy}
          sortOrder={sortOrder}
          status={status}
          createdAtFrom={createdAtFromInput}
          createdAtTo={createdAtToInput}
          dateStartFrom={dateStartFromInput}
          dateStartTo={dateStartToInput}
          minPrice={minPriceInput}
          maxPrice={maxPriceInput}
          minRating={minRatingInput}
          maxRating={maxRatingInput}
          onSortByChange={setSortBy}
          onSortOrderChange={setSortOrder}
          onStatusChange={setStatus}
          onCreatedAtFromChange={setCreatedAtFromInput}
          onCreatedAtToChange={setCreatedAtToInput}
          onDateStartFromChange={setDateStartFromInput}
          onDateStartToChange={setDateStartToInput}
          onMinPriceChange={setMinPriceInput}
          onMaxPriceChange={setMaxPriceInput}
          onMinRatingChange={setMinRatingInput}
          onMaxRatingChange={setMaxRatingInput}
          onApply={applyFilters}
          onReset={resetFilters}
        />

        {isEntriesLoading ? (
          <div className="grid gap-4 lg:grid-cols-2" aria-live="polite">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="h-72 animate-pulse rounded-2xl border border-gray-200 bg-gray-50" />
            ))}
          </div>
        ) : entriesErrorMessage ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4" role="alert">
            <p className="text-sm text-rose-700">{entriesErrorMessage}</p>
          </div>
        ) : (
          <>
            <EntriesGrid
              entries={entries}
              emptyMessage="По выбранным фильтрам карточки не найдены."
              onEditEntry={(entry) => {
                setEntryFormState({ isOpen: true, entry, mode: 'edit' });
              }}
            />

            {entriesMeta && entriesMeta.totalPages > 1 ? (
              <EntriesPagination
                meta={entriesMeta}
                page={page}
                isLoading={isEntriesLoading}
                onPreviousPage={goToPreviousPage}
                onNextPage={goToNextPage}
              />
            ) : null}
          </>
        )}
      </div>

      <BaseModal
        isOpen={isCollectionFormOpen}
        title="Редактирование коллекции"
        onClose={() => {
          setIsCollectionFormOpen(false);
        }}
      >
        <CollectionForm
          key={collection.id}
          mode="edit"
          initialValues={{
            title: collection.title,
            category: collection.category,
            customCategory: collection.customCategory ?? '',
            description: collection.description ?? '',
            coverImageUrl: collection.coverImageUrl ?? '',
          }}
          onCancel={() => {
            setIsCollectionFormOpen(false);
          }}
        />
      </BaseModal>

      <BaseModal
        isOpen={entryFormState.isOpen}
        title={entryFormState.mode === 'create' ? 'Новая карточка' : 'Редактирование карточки'}
        onClose={() => {
          setEntryFormState({ isOpen: false, entry: null, mode: 'create' });
        }}
      >
        <EntryForm
          key={entryFormState.entry?.id ?? entryFormState.mode}
          mode={entryFormState.mode}
          initialValues={
            entryFormState.entry
              ? {
                  title: entryFormState.entry.title,
                  status: entryFormState.entry.status,
                  description: entryFormState.entry.description ?? '',
                  imageUrl: entryFormState.entry.imageUrl ?? '',
                  price:
                    entryFormState.entry.price !== undefined ? String(entryFormState.entry.price) : '',
                  tags: entryFormState.entry.tags?.join(', ') ?? '',
                  rating:
                    entryFormState.entry.rating !== undefined
                      ? String(entryFormState.entry.rating)
                      : '',
                  dateStart: entryFormState.entry.dateStart
                    ? entryFormState.entry.dateStart.slice(0, 10)
                    : '',
                  dateEnd: entryFormState.entry.dateEnd
                    ? entryFormState.entry.dateEnd.slice(0, 10)
                    : '',
                }
              : undefined
          }
          onCancel={() => {
            setEntryFormState({ isOpen: false, entry: null, mode: 'create' });
          }}
        />
      </BaseModal>
    </section>
  );
}
