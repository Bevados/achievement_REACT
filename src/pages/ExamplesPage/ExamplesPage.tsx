import { getPublicCollections } from '../../api/collections.api';
import CollectionsGrid from '../../components/Collections/CollectionsGrid';
import CollectionsFilters from '../../components/Collections/CollectionsFilters';
import CollectionsPagination from '../../components/Collections/CollectionsPagination';
import { useCollectionsListController } from '../../hooks/useCollectionsListController';

export default function ExamplesPage() {
  const {
    collections,
    meta,
    page,
    sortBy,
    sortOrder,
    category,
    searchInput,
    isLoading,
    errorMessage,
    setSortBy,
    setSortOrder,
    setCategory,
    setSearchInput,
    applySearch,
    resetFilters,
    goToPreviousPage,
    goToNextPage,
    reloadCollections,
  } = useCollectionsListController({
    fetchCollections: getPublicCollections,
    fallbackErrorMessage: 'Не удалось загрузить публичные коллекции. Попробуйте еще раз.',
    pageSize: 12,
  });

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-primary sm:text-3xl">Примеры коллекций</h1>
      <p className="mt-3 max-w-2xl text-sm text-gray-700 sm:text-base">
        Здесь показываются реальные публичные коллекции из API.
      </p>

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
              void reloadCollections();
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
            emptyMessage="Публичные примеры пока отсутствуют."
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
    </section>
  );
}
