import { useState } from 'react';
import type { EntryStatus } from '../../../contracts/collection.contracts';
import { ENTRY_STATUSES } from '../../../contracts/collection.contracts';
import { entryStatusLabels } from '../../config/entries.config';

interface EntryFormValues {
  title: string;
  status: EntryStatus;
  description: string;
  imageUrl: string;
  price: string;
  tags: string;
  rating: string;
  dateStart: string;
  dateEnd: string;
}

interface EntryFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<EntryFormValues>;
  onCancel: () => void;
  onSubmit?: (values: EntryFormValues) => void;
}

function getInitialValues(initialValues?: Partial<EntryFormValues>): EntryFormValues {
  return {
    title: initialValues?.title ?? '',
    status: initialValues?.status ?? 'planned',
    description: initialValues?.description ?? '',
    imageUrl: initialValues?.imageUrl ?? '',
    price: initialValues?.price ?? '',
    tags: initialValues?.tags ?? '',
    rating: initialValues?.rating ?? '',
    dateStart: initialValues?.dateStart ?? '',
    dateEnd: initialValues?.dateEnd ?? '',
  };
}

export default function EntryForm({ mode, initialValues, onCancel, onSubmit }: EntryFormProps) {
  const [values, setValues] = useState(() => getInitialValues(initialValues));
  const [dateMode, setDateMode] = useState<'single' | 'range'>(() =>
    initialValues?.dateEnd ? 'range' : 'single',
  );

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(values);
      }}
    >
      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Название карточки
        <input
          type="text"
          value={values.title}
          onChange={(event) => {
            setValues((current) => ({ ...current, title: event.target.value }));
          }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          placeholder="Например, Поездка в Токио"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Статус
        <select
          value={values.status}
          onChange={(event) => {
            setValues((current) => ({
              ...current,
              status: event.target.value as EntryStatus,
            }));
          }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          {ENTRY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {entryStatusLabels[status]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Описание
        <textarea
          value={values.description}
          onChange={(event) => {
            setValues((current) => ({ ...current, description: event.target.value }));
          }}
          className="min-h-28 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          placeholder="Что это за карточка и почему она важна"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Изображение (URL)
        <input
          type="url"
          value={values.imageUrl}
          onChange={(event) => {
            setValues((current) => ({ ...current, imageUrl: event.target.value }));
          }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          placeholder="https://example.com/photo.jpg"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Цена
          <input
            type="number"
            min="0"
            step="0.01"
            value={values.price}
            onChange={(event) => {
              setValues((current) => ({ ...current, price: event.target.value }));
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            placeholder="0.00"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Рейтинг
          <input
            type="number"
            min="1"
            max="10"
            step="1"
            value={values.rating}
            onChange={(event) => {
              setValues((current) => ({ ...current, rating: event.target.value }));
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            placeholder="1-10"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Теги
        <input
          type="text"
          value={values.tags}
          onChange={(event) => {
            setValues((current) => ({ ...current, tags: event.target.value }));
          }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          placeholder="travel, japan, spring"
        />
      </label>

      <fieldset className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <legend className="px-1 text-sm font-semibold text-gray-800">Дата карточки</legend>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setDateMode('single');
              setValues((current) => ({ ...current, dateEnd: '' }));
            }}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              dateMode === 'single'
                ? 'bg-primary text-white'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Одна дата
          </button>
          <button
            type="button"
            onClick={() => {
              setDateMode('range');
            }}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              dateMode === 'range'
                ? 'bg-primary text-white'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Период
          </button>
        </div>

        <div className={`grid gap-3 ${dateMode === 'range' ? 'sm:grid-cols-2' : ''}`}>
          <label className="flex flex-col gap-1 text-sm text-gray-700">
            {dateMode === 'range' ? 'Дата начала' : 'Дата'}
            <input
              type="date"
              value={values.dateStart}
              onChange={(event) => {
                setValues((current) => ({ ...current, dateStart: event.target.value }));
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            />
          </label>

          {dateMode === 'range' ? (
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Дата окончания
              <input
                type="date"
                value={values.dateEnd}
                onChange={(event) => {
                  setValues((current) => ({ ...current, dateEnd: event.target.value }));
                }}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              />
            </label>
          ) : null}
        </div>
      </fieldset>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        Сохранение карточки будет подключено на следующем подпункте. Сейчас форма нужна для
        сборки и проверки UI.
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white opacity-60 disabled:cursor-not-allowed"
        >
          {mode === 'create' ? 'Сохранить карточку' : 'Сохранить изменения'}
        </button>
      </div>
    </form>
  );
}
