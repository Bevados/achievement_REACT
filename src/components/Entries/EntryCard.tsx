import type { EntryStatus, EntryView } from '../../../contracts/collection.contracts';

interface EntryCardProps {
  entry: EntryView;
}

const statusLabels: Record<EntryStatus, string> = {
  planned: 'Запланировано',
  in_progress: 'В процессе',
  completed: 'Завершено',
};

const statusClasses: Record<EntryStatus, string> = {
  planned: 'bg-amber-100 text-amber-800',
  in_progress: 'bg-sky-100 text-sky-800',
  completed: 'bg-emerald-100 text-emerald-800',
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

export default function EntryCard({ entry }: EntryCardProps) {
  const hasMeta = Boolean(entry.date || entry.price !== undefined || entry.rating !== undefined);
  const hasTags = Boolean(entry.tags && entry.tags.length > 0);

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {entry.imageUrl ? (
        <img
          src={entry.imageUrl}
          alt={`Изображение карточки ${entry.title}`}
          className="h-48 w-full object-cover"
          loading="lazy"
        />
      ) : null}

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[entry.status]}`}
            >
              {statusLabels[entry.status]}
            </span>
            <h3 className="text-lg font-semibold text-primary">{entry.title}</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-400 disabled:cursor-not-allowed"
            >
              Редактировать
            </button>
            <button
              type="button"
              disabled
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-300 disabled:cursor-not-allowed"
            >
              Удалить
            </button>
          </div>
        </div>

        {entry.description ? (
          <p className="text-sm leading-relaxed text-gray-700">{entry.description}</p>
        ) : null}

        {hasMeta ? (
          <dl className="grid gap-2 text-sm text-gray-600 sm:grid-cols-3">
            {entry.date ? (
              <div>
                <dt className="font-medium text-gray-500">Дата</dt>
                <dd>{formatDate(entry.date)}</dd>
              </div>
            ) : null}
            {entry.price !== undefined ? (
              <div>
                <dt className="font-medium text-gray-500">Цена</dt>
                <dd>{formatPrice(entry.price)}</dd>
              </div>
            ) : null}
            {entry.rating !== undefined ? (
              <div>
                <dt className="font-medium text-gray-500">Оценка</dt>
                <dd>{entry.rating} / 10</dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        {hasTags ? (
          <div className="flex flex-wrap gap-2">
            {entry.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        <p className="text-xs text-gray-500">Обновлено: {formatDate(entry.updatedAt)}</p>
      </div>
    </article>
  );
}
