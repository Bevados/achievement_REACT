import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { CreateEntryDto } from '../../../contracts/collection.contracts';
import { ENTRY_STATUSES } from '../../../contracts/collection.contracts';
import { entryStatusLabels } from '../../config/entries.config';
import {
  createEntryFormResolver,
  normalizeEntryFormValues,
  type EntryDateMode,
  type EntryFormValues,
} from '../../utils/crud-form.utils';

interface EntryFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<EntryFormValues>;
  onCancel: () => void;
  onSubmit?: (values: CreateEntryDto) => void | Promise<void>;
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
  const [dateMode, setDateMode] = useState<EntryDateMode>(() =>
    initialValues?.dateEnd ? 'range' : 'single',
  );
  const resolver = useMemo(() => createEntryFormResolver(dateMode), [dateMode]);
  const {
    control,
    register,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EntryFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver,
    defaultValues: getInitialValues(initialValues),
  });

  const currentStatus = useWatch({
    control,
    name: 'status',
  });

  return (
    <form
      noValidate
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit?.(normalizeEntryFormValues(values, dateMode));
      })}
    >
      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Название карточки
        <input
          type="text"
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          placeholder="Например, Поездка в Токио"
          {...register('title')}
        />
        {errors.title ? <p className="text-sm text-danger">{errors.title.message}</p> : null}
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Статус
        <select
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          {...register('status')}
        >
          {ENTRY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {entryStatusLabels[status]}
            </option>
          ))}
        </select>
        {errors.status ? <p className="text-sm text-danger">{errors.status.message}</p> : null}
      </label>

      {currentStatus === 'completed' ? (
        <p className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700">
          Для статуса «Завершено» нужно указать рейтинг и дату события.
        </p>
      ) : null}

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Описание
        <textarea
          className="min-h-28 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          placeholder="Что это за карточка и почему она важна"
          {...register('description')}
        />
        {errors.description ? (
          <p className="text-sm text-danger">{errors.description.message}</p>
        ) : null}
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Изображение (URL)
        <input
          type="url"
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          placeholder="https://example.com/photo.jpg"
          {...register('imageUrl')}
        />
        {errors.imageUrl ? <p className="text-sm text-danger">{errors.imageUrl.message}</p> : null}
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Цена
          <input
            type="number"
            min="0"
            step="0.01"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            placeholder="0.00"
            {...register('price')}
          />
          {errors.price ? <p className="text-sm text-danger">{errors.price.message}</p> : null}
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Рейтинг
          <input
            type="number"
            min="1"
            max="10"
            step="1"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            placeholder="1-10"
            {...register('rating')}
          />
          {errors.rating ? <p className="text-sm text-danger">{errors.rating.message}</p> : null}
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Теги
        <input
          type="text"
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          placeholder="travel, japan, spring"
          {...register('tags')}
        />
        {errors.tags ? <p className="text-sm text-danger">{errors.tags.message}</p> : null}
      </label>

      <fieldset className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <legend className="px-1 text-sm font-semibold text-gray-800">Дата карточки</legend>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setDateMode('single');
              setValue('dateEnd', '');
              clearErrors('dateEnd');
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
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              {...register('dateStart')}
            />
            {errors.dateStart ? (
              <p className="text-sm text-danger">{errors.dateStart.message}</p>
            ) : null}
          </label>

          {dateMode === 'range' ? (
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Дата окончания
              <input
                type="date"
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                {...register('dateEnd')}
              />
              {errors.dateEnd ? (
                <p className="text-sm text-danger">{errors.dateEnd.message}</p>
              ) : null}
            </label>
          ) : null}
        </div>
      </fieldset>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        Сохранение карточки в API будет подключено на следующем подпункте. Сейчас форма уже
        валидирует данные и подготавливает корректный payload для будущего CRUD.
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
          disabled={isSubmitting}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mode === 'create' ? 'Сохранить карточку' : 'Сохранить изменения'}
        </button>
      </div>
    </form>
  );
}
