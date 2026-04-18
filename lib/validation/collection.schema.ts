import { z } from 'zod';
import {
  COLLECTION_CATEGORIES,
  COLLECTION_SORT_FIELDS,
  ENTRY_SORT_FIELDS,
  ENTRY_STATUSES,
  SORT_ORDERS,
  type CreateCollectionDto,
  type CreateEntryDto,
  type UpdateCollectionDto,
  type UpdateEntryDto,
} from '../types/collection.types';

const objectIdPattern = /^[a-f0-9]{24}$/i;

const priceSchema = z
  .number()
  .min(0, 'Price must be greater than or equal to 0')
  .refine((value) => Number(value.toFixed(2)) === value, 'Price must have up to 2 decimals');

const tagSchema = z.string().trim().min(1).max(20);

const dateIsoSchema = z.iso.datetime({ offset: true });

const urlSchema = z.preprocess(
  (value) => (typeof value === 'string' ? value.trim() : value),
  z.url().max(2048),
);

export const objectIdSchema = z.string().regex(objectIdPattern, 'Invalid ObjectId format');

export const collectionIdParamSchema = z.object({
  collectionId: objectIdSchema,
});

export const collectionAndEntryIdsParamSchema = z.object({
  collectionId: objectIdSchema,
  entryId: objectIdSchema,
});

export const createCollectionSchema: z.ZodType<CreateCollectionDto> = z
  .object({
    title: z.string().trim().min(1).max(120),
    category: z.enum(COLLECTION_CATEGORIES),
    description: z.string().trim().min(1).max(1000).optional(),
    coverImageUrl: urlSchema.optional(),
  })
  .strict();

export const updateCollectionSchema: z.ZodType<UpdateCollectionDto> = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    category: z.enum(COLLECTION_CATEGORIES).optional(),
    description: z.string().trim().min(1).max(1000).optional(),
    coverImageUrl: urlSchema.optional(),
  })
  .strict()
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const createEntrySchema: z.ZodType<CreateEntryDto> = z
  .object({
    title: z.string().trim().min(1).max(160),
    status: z.enum(ENTRY_STATUSES),
    description: z.string().trim().min(1).max(1000).optional(),
    imageUrl: urlSchema.optional(),
    price: priceSchema.optional(),
    tags: z
      .array(tagSchema)
      .max(10, 'No more than 10 tags are allowed')
      .transform((tags) => Array.from(new Set(tags)))
      .optional(),
    rating: z.number().int().min(1).max(10).optional(),
    date: dateIsoSchema.optional(),
  })
  .strict();

export const updateEntrySchema: z.ZodType<UpdateEntryDto> = z
  .object({
    title: z.string().trim().min(1).max(160).optional(),
    status: z.enum(ENTRY_STATUSES).optional(),
    description: z.string().trim().min(1).max(1000).optional(),
    imageUrl: urlSchema.optional(),
    price: priceSchema.optional(),
    tags: z
      .array(tagSchema)
      .max(10, 'No more than 10 tags are allowed')
      .transform((tags) => Array.from(new Set(tags)))
      .optional(),
    rating: z.number().int().min(1).max(10).optional(),
    date: dateIsoSchema.optional(),
  })
  .strict()
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const baseListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sortOrder: z.enum(SORT_ORDERS).default('desc'),
  })
  .strict();

export const collectionListQuerySchema = baseListQuerySchema
  .extend({
    sortBy: z.enum(COLLECTION_SORT_FIELDS).optional(),
    category: z.enum(COLLECTION_CATEGORIES).optional(),
    search: z.string().trim().min(1).max(120).optional(),
  })
  .strict();

export const entryListQuerySchema = baseListQuerySchema
  .extend({
    sortBy: z.enum(ENTRY_SORT_FIELDS).optional(),
    status: z.enum(ENTRY_STATUSES).optional(),
    tag: tagSchema.optional(),
    minRating: z.coerce.number().int().min(1).max(10).optional(),
    maxRating: z.coerce.number().int().min(1).max(10).optional(),
  })
  .strict()
  .refine(
    (query) =>
      query.minRating === undefined ||
      query.maxRating === undefined ||
      query.minRating <= query.maxRating,
    {
      message: 'minRating must be less than or equal to maxRating',
      path: ['minRating'],
    },
  );
