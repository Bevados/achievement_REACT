import type { PaginationMeta } from '../../../contracts/collection.contracts';

interface CollectionsPaginationProps {
  meta: PaginationMeta | null;
  page: number;
  isLoading: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export default function CollectionsPagination({
  meta,
  page,
  isLoading,
  onPreviousPage,
  onNextPage,
}: CollectionsPaginationProps) {
  return (
    <div className="mt-6 flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-700">
        Страница {meta?.page ?? page} из {meta?.totalPages ?? 1}
        {meta ? ` • Всего коллекций: ${meta.total}` : ''}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPreviousPage}
          disabled={isLoading || page <= 1}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition enabled:hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Назад
        </button>

        <button
          type="button"
          onClick={onNextPage}
          disabled={isLoading || !meta || page >= meta.totalPages}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition enabled:hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Вперед
        </button>
      </div>
    </div>
  );
}
