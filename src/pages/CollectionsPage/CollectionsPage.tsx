import { useState } from 'react';
import type { CollectionView } from '../../../contracts/collection.contracts';
import CollectionForm from '../../components/Collections/CollectionForm';
import CollectionsFilters from '../../components/Collections/CollectionsFilters';
import CollectionsGrid from '../../components/Collections/CollectionsGrid';
import CollectionsPagination from '../../components/Collections/CollectionsPagination';
import BaseModal from '../../components/Modal/BaseModal';
import { useCollectionsListState } from '../../hooks/useCollectionsListController';
import {
  useCollectionsQuery,
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
  useUpdateCollectionMutation,
} from '../../hooks/usePrivateCollectionsQueries';
import { getPrivateCollectionHref } from '../../utils/routing.utils';

function getEditInitialValues(collection: CollectionView) {
  return {
    title: collection.title,
    category: collection.category,
    customCategory: collection.customCategory ?? '',
    description: collection.description ?? '',
    coverImageUrl: collection.coverImageUrl ?? '',
  };
}

export default function CollectionsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CollectionView | null>(null);
  const [createSubmitError, setCreateSubmitError] = useState<string | null>(null);
  const [editSubmitError, setEditSubmitError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    page,
    sortBy,
    sortOrder,
    category,
    searchInput,
    search,
    setSortBy,
    setSortOrder,
    setCategory,
    setSearchInput,
    applySearch,
    resetFilters,
    goToPreviousPage,
    goToNextPage,
  } = useCollectionsListState();

  const collectionsQuery = useCollectionsQuery({
    page,
    limit: 12,
    sortBy,
    sortOrder,
    category: category || undefined,
    search: search || undefined,
  });
  const createCollectionMutation = useCreateCollectionMutation();
  const updateCollectionMutation = useUpdateCollectionMutation();
  const deleteCollectionMutation = useDeleteCollectionMutation();

  const collections = collectionsQuery.data?.items ?? [];
  const meta = collectionsQuery.data?.meta ?? null;
  const isLoading = collectionsQuery.isLoading;
  const errorMessage = collectionsQuery.error?.message ?? null;

  async function handleDeleteCollection(collection: CollectionView) {
    const shouldDelete = window.confirm(
      `Удалить коллекцию "${collection.title}"? Это действие нельзя отменить.`,
    );

    if (!shouldDelete) {
      return;
    }

    setDeleteError(null);

    try {
      await deleteCollectionMutation.mutateAsync({ collectionId: collection.id });
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : 'Не удалось удалить коллекцию. Попробуйте еще раз.',
      );
    }
  }

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">Мои коллекции</h1>
        </div>

        <button
          type="button"
          onClick={() => {
            setCreateSubmitError(null);
            setIsCreateModalOpen(true);
          }}
          className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Создать коллекцию
        </button>
      </div>

      <CollectionsFilters
        sortBy={sortBy}
        sortOrder={sortOrder}
        category={category}
        searchInput={searchInput}
        onSortByChange={setSortBy}
        onSortOrderChange={setSortOrder}
        onCategoryChange={setCategory}
        onSearchInputChange={setSearchInput}
        onApplySearch={applySearch}
        onReset={resetFilters}
      />

      {deleteError ? (
        <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4" role="alert">
          <p className="text-sm text-rose-700">{deleteError}</p>
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-56 animate-pulse rounded-2xl border border-gray-200 bg-linear-to-r from-gray-100 via-gray-50 to-gray-100"
            />
          ))}
        </div>
      ) : errorMessage ? (
        <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4" role="alert">
          <p className="text-sm text-rose-700">{errorMessage}</p>
          <button
            type="button"
            onClick={() => {
              void collectionsQuery.refetch();
            }}
            className="mt-3 inline-flex rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Повторить загрузку
          </button>
        </div>
      ) : (
        <>
          <CollectionsGrid
            collections={collections}
            emptyMessage="У вас пока нет коллекций. Создайте первую, и она появится здесь."
            getCollectionHref={getPrivateCollectionHref}
            onEditCollection={(collection) => {
              setDeleteError(null);
              setEditSubmitError(null);
              setEditingCollection(collection);
            }}
            onDeleteCollection={(collection) => {
              void handleDeleteCollection(collection);
            }}
          />

          <CollectionsPagination
            meta={meta}
            page={page}
            isLoading={isLoading}
            onPreviousPage={goToPreviousPage}
            onNextPage={goToNextPage}
          />
        </>
      )}

      <BaseModal
        isOpen={isCreateModalOpen}
        title="Новая коллекция"
        onClose={() => {
          setCreateSubmitError(null);
          setIsCreateModalOpen(false);
        }}
      >
        <CollectionForm
          key="collection-create"
          mode="create"
          submitError={createSubmitError}
          onCancel={() => {
            setCreateSubmitError(null);
            setIsCreateModalOpen(false);
          }}
          onSubmit={async (values) => {
            setCreateSubmitError(null);

            try {
              await createCollectionMutation.mutateAsync(values);
              setIsCreateModalOpen(false);
            } catch (error) {
              setCreateSubmitError(
                error instanceof Error
                  ? error.message
                  : 'Не удалось создать коллекцию. Попробуйте еще раз.',
              );
            }
          }}
        />
      </BaseModal>

      <BaseModal
        isOpen={Boolean(editingCollection)}
        title="Редактирование коллекции"
        onClose={() => {
          setEditSubmitError(null);
          setEditingCollection(null);
        }}
      >
        {editingCollection ? (
          <CollectionForm
            key={editingCollection.id}
            mode="edit"
            submitError={editSubmitError}
            initialValues={getEditInitialValues(editingCollection)}
            onCancel={() => {
              setEditSubmitError(null);
              setEditingCollection(null);
            }}
            onSubmit={async (values) => {
              setEditSubmitError(null);

              try {
                await updateCollectionMutation.mutateAsync({
                  collectionId: editingCollection.id,
                  payload: values,
                });
                setEditingCollection(null);
              } catch (error) {
                setEditSubmitError(
                  error instanceof Error
                    ? error.message
                    : 'Не удалось сохранить изменения коллекции. Попробуйте еще раз.',
                );
              }
            }}
          />
        ) : null}
      </BaseModal>
    </section>
  );
}
