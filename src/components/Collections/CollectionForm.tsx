import { useState } from 'react';
import type { CollectionCategory } from '../../../contracts/collection.contracts';
import { COLLECTION_CATEGORIES } from '../../../contracts/collection.contracts';
import { collectionCategoryLabels } from '../../config/collections.config';

interface CollectionFormValues {
  title: string;
  category: CollectionCategory;
  description: string;
  coverImageUrl: string;
}

interface CollectionFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<CollectionFormValues>;
  onCancel: () => void;
  onSubmit?: (values: CollectionFormValues) => void;
}

function getInitialValues(initialValues?: Partial<CollectionFormValues>): CollectionFormValues {
  return {
    title: initialValues?.title ?? '',
    category: initialValues?.category ?? 'other',
    description: initialValues?.description ?? '',
    coverImageUrl: initialValues?.coverImageUrl ?? '',
  };
}

export default function CollectionForm({
  mode,
  initialValues,
  onCancel,
  onSubmit,
}: CollectionFormProps) {
  const [values, setValues] = useState(() => getInitialValues(initialValues));

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(values);
      }}
    >
      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Название коллекции
        <input
          type="text"
          value={values.title}
          onChange={(event) => {
            setValues((current) => ({ ...current, title: event.target.value }));
          }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          placeholder="Например, Поездки 2026"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Категория
        <select
          value={values.category}
          onChange={(event) => {
            setValues((current) => ({
              ...current,
              category: event.target.value as CollectionCategory,
            }));
          }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          {COLLECTION_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {collectionCategoryLabels[category]}
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
          placeholder="Коротко опишите, что хранится в этой коллекции"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Обложка (URL)
        <input
          type="url"
          value={values.coverImageUrl}
          onChange={(event) => {
            setValues((current) => ({ ...current, coverImageUrl: event.target.value }));
          }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          placeholder="https://example.com/cover.jpg"
        />
      </label>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        Сохранение коллекции будет подключено на следующем подпункте. Сейчас форма нужна для
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
          {mode === 'create' ? 'Сохранить коллекцию' : 'Сохранить изменения'}
        </button>
      </div>
    </form>
  );
}
