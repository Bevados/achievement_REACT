import type { EntryStatus, EntryView } from '../../../contracts/collection.contracts';

interface EntryCardProps {
  entry: EntryView;
  showActions?: boolean;
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

function formatDateRange(dateStart?: string, dateEnd?: string): string | null {
  if (!dateStart) {
    return null;
  }

  if (!dateEnd) {
    return formatDate(dateStart);
  }

  return `${formatDate(dateStart)} - ${formatDate(dateEnd)}`;
}

function renderRatingStars(rating: number) {
  return Array.from({ length: 10 }, (_, index) => {
    const isFilled = index < rating;

    return (
      <span
        key={index}
        aria-hidden="true"
        className={isFilled ? 'text-amber-400' : 'text-gray-300'}
      >
        ★
      </span>
    );
  });
}

export default function EntryCard({ entry, showActions = true }: EntryCardProps) {
  const hasImage = Boolean(entry.imageUrl);
  const hasDescription = Boolean(entry.description);
  const hasMeta = Boolean(
    entry.dateStart || entry.dateEnd || entry.price !== undefined || entry.rating !== undefined,
  );
  const hasTags = Boolean(entry.tags && entry.tags.length > 0);
  const hasSupplementaryContent = hasDescription || hasMeta || hasTags;
  const formattedDateRange = formatDateRange(entry.dateStart, entry.dateEnd);

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {hasImage ? (
        <img
          src={entry.imageUrl}
          alt={`Изображение карточки ${entry.title}`}
          className="h-44 w-full object-cover"
          loading="lazy"
        />
      ) : null}

      <div className={`p-5 ${hasSupplementaryContent ? 'space-y-4' : 'space-y-3'}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[entry.status]}`}
            >
              {statusLabels[entry.status]}
            </span>
            <h3 className="text-lg font-semibold leading-snug text-primary">{entry.title}</h3>
          </div>

          {showActions ? (
            <div className="flex flex-wrap items-center gap-2">
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
          ) : null}
        </div>

        {hasDescription ? (
          <p className="text-sm leading-relaxed text-gray-700">{entry.description}</p>
        ) : null}

        {hasMeta ? (
          <dl className="grid gap-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-600 sm:grid-cols-3">
            {formattedDateRange ? (
              <div>
                <dt className="font-medium text-gray-500">
                  {entry.dateEnd ? 'Период' : 'Дата'}
                </dt>
                <dd>{formattedDateRange}</dd>
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
                <dd className="flex flex-wrap items-center gap-2">
                  <span
                    role="img"
                    aria-label={`Рейтинг ${entry.rating} из 10`}
                    className="flex text-sm leading-none"
                  >
                    {renderRatingStars(entry.rating)}
                  </span>
                  <span className="font-medium text-gray-700">{entry.rating} / 10</span>
                </dd>
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

        <p className="text-xs text-gray-500">Создано: {formatDate(entry.createdAt)}</p>

        {hasSupplementaryContent ? (
          <p className="text-xs text-gray-500">Обновлено: {formatDate(entry.updatedAt)}</p>
        ) : null}
      </div>
    </article>
  );
}
