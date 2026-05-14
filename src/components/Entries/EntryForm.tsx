import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { CreateEntryDto, UpdateEntryDto } from '../../../contracts/collection.contracts';
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
  onSubmit?: (values: CreateEntryDto | UpdateEntryDto) => void | Promise<void>;
  submitError?: string | null;
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

function RequiredMark() {
  return (
    <span aria-hidden="true" className="ml-1 font-semibold text-rose-500">
      *
    </span>
  );
}

function FieldLabel({
  children,
  required = false,
}: {
  children: string;
  required?: boolean;
}) {
  return (
    <span>
      {children}
      {required ? <RequiredMark /> : null}
    </span>
  );
}

function RatingField({
  required,
  register,
  errorMessage,
}: {
  required: boolean;
  register: ReturnType<typeof useForm<EntryFormValues>>['register'];
  errorMessage?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-gray-700">
      <FieldLabel required={required}>Рейтинг</FieldLabel>
      <input
        type="number"
        aria-label="Рейтинг"
        min="1"
        max="10"
        step="1"
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        placeholder="1-10"
        {...register('rating')}
      />
      {errorMessage ? <p className="text-sm text-danger">{errorMessage}</p> : null}
    </label>
  );
}

export default function EntryForm({
  mode,
  initialValues,
  onCancel,
  onSubmit,
  submitError = null,
}: EntryFormProps) {
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

  const isCompleted = currentStatus === 'completed';

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit?.(normalizeEntryFormValues(values, dateMode));
      })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-gray-700 sm:col-span-2">
          <FieldLabel required>Название карточки</FieldLabel>
          <input
            type="text"
            aria-label="Название карточки"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            placeholder="Например, Поездка в Токио"
            {...register('title')}
          />
          {errors.title ? <p className="text-sm text-danger">{errors.title.message}</p> : null}
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-700">
          <FieldLabel required>Статус</FieldLabel>
          <select
            aria-label="Статус"
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

        {isCompleted ? (
          <div className="motion-safe:animate-[fade-in_180ms_ease-out] transition-all duration-200 ease-out">
            <RatingField
              required
              register={register}
              errorMessage={errors.rating?.message}
            />
          </div>
        ) : null}
      </div>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        <FieldLabel>Описание</FieldLabel>
        <textarea
          aria-label="Описание"
          className="min-h-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          placeholder="Что это за карточка и почему она важна"
          {...register('description')}
        />
        {errors.description ? <p className="text-sm text-danger">{errors.description.message}</p> : null}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          <FieldLabel>Изображение (URL)</FieldLabel>
          <input
            type="url"
            aria-label="Изображение (URL)"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            placeholder="https://example.com/photo.jpg"
            {...register('imageUrl')}
          />
          {errors.imageUrl ? <p className="text-sm text-danger">{errors.imageUrl.message}</p> : null}
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-700">
          <FieldLabel>Теги</FieldLabel>
          <input
            type="text"
            aria-label="Теги"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            placeholder="travel, japan, spring"
            {...register('tags')}
          />
          {errors.tags ? <p className="text-sm text-danger">{errors.tags.message}</p> : null}
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-700">
          <FieldLabel>Цена</FieldLabel>
          <input
            type="number"
            aria-label="Цена"
            min="0"
            step="0.01"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            placeholder="0.00"
            {...register('price')}
          />
          {errors.price ? <p className="text-sm text-danger">{errors.price.message}</p> : null}
        </label>

        {!isCompleted ? (
          <div className="motion-safe:animate-[fade-in_180ms_ease-out] transition-all duration-200 ease-out">
            <RatingField
              required={false}
              register={register}
              errorMessage={errors.rating?.message}
            />
          </div>
        ) : null}
      </div>

      <fieldset className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <legend className="px-1 text-sm font-semibold text-gray-800">
          <FieldLabel required={isCompleted}>Дата</FieldLabel>
        </legend>

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
            Выбрать дату
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
            Выбрать период
          </button>
        </div>

        <div className={`grid gap-3 ${dateMode === 'range' ? 'sm:grid-cols-2' : ''}`}>
          <label className="flex flex-col gap-1 text-sm text-gray-700">
            <FieldLabel required={isCompleted}>
              {dateMode === 'range' ? 'Дата начала' : 'Дата'}
            </FieldLabel>
            <input
              type="date"
              aria-label={dateMode === 'range' ? 'Дата начала' : 'Дата'}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              {...register('dateStart')}
            />
            {errors.dateStart ? <p className="text-sm text-danger">{errors.dateStart.message}</p> : null}
          </label>

          {dateMode === 'range' ? (
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              <FieldLabel>Дата окончания</FieldLabel>
              <input
                type="date"
                aria-label="Дата окончания"
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                {...register('dateEnd')}
              />
              {errors.dateEnd ? <p className="text-sm text-danger">{errors.dateEnd.message}</p> : null}
            </label>
          ) : null}
        </div>
      </fieldset>

      {submitError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {submitError}
        </div>
      ) : null}

      <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-gray-200 bg-white pt-4 sm:flex-row sm:justify-end">
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
