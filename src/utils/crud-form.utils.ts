import type {
  FieldErrors,
  FieldValues,
  Resolver,
  ResolverResult,
} from 'react-hook-form';
import { z } from 'zod';
import type {
  CollectionCategory,
  CreateCollectionDto,
  CreateEntryDto,
  EntryStatus,
} from '../../contracts/collection.contracts';
import {
  createCollectionSchema,
  createEntrySchema,
} from '../../contracts/collection.contracts.schema';

export interface CollectionFormValues {
  title: string;
  category: CollectionCategory | '';
  customCategory: string;
  description: string;
  coverImageUrl: string;
}

export interface EntryFormValues {
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

export type EntryDateMode = 'single' | 'range';

function toOptionalTrimmedString(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function toIsoDateString(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  return `${trimmed}T00:00:00.000Z`;
}

function toOptionalNumber(value: string): number | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  return Number(trimmed);
}

function toOptionalTags(value: string): string[] | undefined {
  const tags = Array.from(
    new Set(
      value
    .split(',')
    .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  );

  return tags.length > 0 ? tags : undefined;
}

function issuesToFieldErrors<T extends FieldValues>(issues: z.ZodIssue[]): FieldErrors<T> {
  const errors = {} as FieldErrors<T>;

  for (const issue of issues) {
    const fieldName = issue.path[0];

    if (typeof fieldName !== 'string' || Object.prototype.hasOwnProperty.call(errors, fieldName)) {
      continue;
    }

    (errors as Record<string, unknown>)[fieldName] = {
      type: 'zod',
      message: issue.message,
    };
  }

  return errors;
}

function hasErrors<T extends FieldValues>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}

export function normalizeCollectionFormValues(
  values: CollectionFormValues,
): CreateCollectionDto {
  return {
    title: values.title.trim(),
    category: values.category as CollectionCategory,
    customCategory:
      values.category === 'other' ? toOptionalTrimmedString(values.customCategory) : undefined,
    description: toOptionalTrimmedString(values.description),
    coverImageUrl: toOptionalTrimmedString(values.coverImageUrl),
  };
}

export function normalizeEntryFormValues(
  values: EntryFormValues,
  dateMode: EntryDateMode,
): CreateEntryDto {
  return {
    title: values.title.trim(),
    status: values.status,
    description: toOptionalTrimmedString(values.description),
    imageUrl: toOptionalTrimmedString(values.imageUrl),
    price: toOptionalNumber(values.price),
    tags: toOptionalTags(values.tags),
    rating: toOptionalNumber(values.rating),
    dateStart: toIsoDateString(values.dateStart),
    dateEnd: dateMode === 'range' ? toIsoDateString(values.dateEnd) : undefined,
  };
}

export const collectionFormResolver: Resolver<CollectionFormValues> = async (values) => {
  const manualErrors: FieldErrors<CollectionFormValues> = {};

  if (!values.category) {
    manualErrors.category = {
      type: 'manual',
      message: 'Выберите категорию',
    };
  }

  const normalizedValues = normalizeCollectionFormValues({
    ...values,
    category: values.category || 'other',
  });

  if (values.category === 'other' && !normalizedValues.customCategory) {
    manualErrors.customCategory = {
      type: 'manual',
      message: 'Введите свою категорию',
    };
  }

  const parsedValues = createCollectionSchema.safeParse(normalizedValues);

  if (hasErrors(manualErrors) || !parsedValues.success) {
    return {
      values: {} as never,
      errors: {
        ...issuesToFieldErrors<CollectionFormValues>(
          parsedValues.success ? [] : parsedValues.error.issues,
        ),
        ...manualErrors,
      },
    } as ResolverResult<CollectionFormValues>;
  }

  return {
    values,
    errors: {} as FieldErrors<CollectionFormValues>,
  } as ResolverResult<CollectionFormValues>;
};

export function createEntryFormResolver(
  dateMode: EntryDateMode,
): Resolver<EntryFormValues> {
  return async (values) => {
    const normalizedValues = normalizeEntryFormValues(values, dateMode);
    const parsedValues = createEntrySchema.safeParse(normalizedValues);

    if (!parsedValues.success) {
      return {
        values: {} as never,
        errors: issuesToFieldErrors<EntryFormValues>(parsedValues.error.issues),
      } as ResolverResult<EntryFormValues>;
    }

    return {
      values,
      errors: {} as FieldErrors<EntryFormValues>,
    } as ResolverResult<EntryFormValues>;
  };
}
