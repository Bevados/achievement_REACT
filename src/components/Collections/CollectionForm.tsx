import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { CreateCollectionDto } from '../../../contracts/collection.contracts';
import {
  collectionCategoryLabels,
  orderedCollectionCategoryOptions,
} from '../../config/collections.config';
import {
  collectionFormResolver,
  normalizeCollectionFormValues,
  type CollectionFormValues,
} from '../../utils/crud-form.utils';

interface CollectionFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<CollectionFormValues>;
  onCancel: () => void;
  onSubmit?: (values: CreateCollectionDto) => void | Promise<void>;
  submitError?: string | null;
}

function getInitialValues(initialValues?: Partial<CollectionFormValues>): CollectionFormValues {
  return {
    title: initialValues?.title ?? '',
    category: initialValues?.category ?? '',
    customCategory: initialValues?.customCategory ?? '',
    description: initialValues?.description ?? '',
    coverImageUrl: initialValues?.coverImageUrl ?? '',
  };
}

export default function CollectionForm({
  mode,
  initialValues,
  onCancel,
  onSubmit,
  submitError = null,
}: CollectionFormProps) {
  const {
    control,
    register,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CollectionFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: collectionFormResolver,
    defaultValues: getInitialValues(initialValues),
  });

  const category = useWatch({
    control,
    name: 'category',
  });

  useEffect(() => {
    if (category !== 'other') {
      setValue('customCategory', '');
      clearErrors('customCategory');
    }
  }, [category, clearErrors, setValue]);

  return (
    <form
      noValidate
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit?.(normalizeCollectionFormValues(values));
      })}
    >
      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Название коллекции
        <input
          type="text"
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          placeholder="Например, Поездки 2026"
          {...register('title')}
        />
        {errors.title ? <p className="text-sm text-danger">{errors.title.message}</p> : null}
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Категория
        <select
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          {...register('category')}
        >
          <option value="" disabled>
            Например, Путешествия
          </option>
          <optgroup label="Свой вариант">
            <option value="other">Своя категория</option>
          </optgroup>
          <optgroup label="Основные категории">
            {orderedCollectionCategoryOptions.map((entryCategory) => (
              <option key={entryCategory} value={entryCategory}>
                {collectionCategoryLabels[entryCategory]}
              </option>
            ))}
          </optgroup>
        </select>
        {errors.category ? <p className="text-sm text-danger">{errors.category.message}</p> : null}
      </label>

      {category === 'other' ? (
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Своя категория
          <input
            type="text"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            placeholder="Например, Гастротуры"
            {...register('customCategory')}
          />
          {errors.customCategory ? (
            <p className="text-sm text-danger">{errors.customCategory.message}</p>
          ) : null}
        </label>
      ) : null}

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Описание
        <textarea
          className="min-h-28 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          placeholder="Коротко опишите, что хранится в этой коллекции"
          {...register('description')}
        />
        {errors.description ? (
          <p className="text-sm text-danger">{errors.description.message}</p>
        ) : null}
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Обложка (URL)
        <input
          type="url"
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          placeholder="https://example.com/cover.jpg"
          {...register('coverImageUrl')}
        />
        {errors.coverImageUrl ? (
          <p className="text-sm text-danger">{errors.coverImageUrl.message}</p>
        ) : null}
      </label>

      {submitError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {submitError}
        </div>
      ) : null}

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
          {mode === 'create' ? 'Сохранить коллекцию' : 'Сохранить изменения'}
        </button>
      </div>
    </form>
  );
}
