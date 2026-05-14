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
} from './collection.contracts';

const objectIdPattern = /^[a-f0-9]{24}$/i;

const collectionTitleSchema = z
  .string()
  .trim()
  .min(1, 'Введите название коллекции')
  .max(120, 'Название коллекции не должно превышать 120 символов');

const entryTitleSchema = z
  .string()
  .trim()
  .min(1, 'Введите название карточки')
  .max(160, 'Название карточки не должно превышать 160 символов');

const descriptionSchema = z
  .string()
  .trim()
  .min(1, 'Описание не должно быть пустым')
  .max(1000, 'Описание не должно превышать 1000 символов');

const priceSchema = z
  .number()
  .min(0, 'Цена не может быть меньше 0')
  .refine(
    (value) => Number(value.toFixed(2)) === value,
    'Цена может содержать не более 2 знаков после запятой',
  );

const tagSchema = z
  .string()
  .trim()
  .min(1, 'Тег не должен быть пустым')
  .max(20, 'Тег не должен превышать 20 символов');

const dateIsoSchema = z.iso.datetime({ offset: true });

const urlSchema = z.preprocess(
  (value) => (typeof value === 'string' ? value.trim() : value),
  z
    .string()
    .url('Введите корректный URL')
    .max(2048, 'URL не должен превышать 2048 символов'),
);

const customCategorySchema = z
  .string()
  .trim()
  .min(1, 'Введите свой вариант категории')
  .max(60, 'Название своей категории не должно превышать 60 символов');

export const objectIdSchema = z.string().regex(objectIdPattern, 'Некорректный идентификатор');

export const collectionIdParamSchema = z.object({
  collectionId: objectIdSchema,
});

export const collectionAndEntryIdsParamSchema = z.object({
  collectionId: objectIdSchema,
  entryId: objectIdSchema,
});

export const createCollectionSchema: z.ZodType<CreateCollectionDto> = z
  .object({
    title: collectionTitleSchema,
    category: z.enum(COLLECTION_CATEGORIES),
    customCategory: customCategorySchema.optional(),
    description: descriptionSchema.optional(),
    coverImageUrl: urlSchema.optional(),
  })
  .strict();

export const updateCollectionSchema: z.ZodType<UpdateCollectionDto> = z
  .object({
    title: collectionTitleSchema.optional(),
    category: z.enum(COLLECTION_CATEGORIES).optional(),
    customCategory: customCategorySchema.optional(),
    description: descriptionSchema.optional(),
    coverImageUrl: urlSchema.optional(),
  })
  .strict()
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'Нужно изменить хотя бы одно поле',
  });

function addEntryBusinessRules<
  T extends {
    status?: (typeof ENTRY_STATUSES)[number];
    rating?: number;
    dateStart?: string;
    dateEnd?: string;
  },
>(schema: z.ZodType<T>) {
  return schema.superRefine((payload, ctx) => {
    if (payload.dateStart && payload.dateEnd) {
      const start = new Date(payload.dateStart).getTime();
      const end = new Date(payload.dateEnd).getTime();

      if (end < start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Дата окончания не может быть раньше даты начала',
          path: ['dateEnd'],
        });
      }
    }

    if (payload.status === 'completed') {
      if (payload.rating === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Для статуса «Завершено» укажите рейтинг',
          path: ['rating'],
        });
      }

      if (!payload.dateStart) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Для статуса «Завершено» укажите дату',
          path: ['dateStart'],
        });
      }
    }
  });
}

export const createEntrySchema: z.ZodType<CreateEntryDto> = addEntryBusinessRules(
  z
    .object({
      title: entryTitleSchema,
      status: z.enum(ENTRY_STATUSES),
      description: descriptionSchema.optional(),
      imageUrl: urlSchema.optional(),
      price: priceSchema.optional(),
      tags: z
        .array(tagSchema)
        .max(10, 'Можно указать не более 10 тегов')
        .transform((tags) => Array.from(new Set(tags)))
        .optional(),
      rating: z
        .number()
        .int('Рейтинг должен быть целым числом')
        .min(1, 'Рейтинг должен быть не меньше 1')
        .max(10, 'Рейтинг должен быть не больше 10')
        .optional(),
      dateStart: dateIsoSchema.optional(),
      dateEnd: dateIsoSchema.optional(),
    })
    .strict(),
);

export const updateEntrySchema: z.ZodType<UpdateEntryDto> = addEntryBusinessRules(
  z
    .object({
      title: entryTitleSchema.optional(),
      status: z.enum(ENTRY_STATUSES).optional(),
      description: descriptionSchema.optional(),
      imageUrl: urlSchema.optional(),
      price: priceSchema.optional(),
      tags: z
        .array(tagSchema)
        .max(10, 'Можно указать не более 10 тегов')
        .transform((tags) => Array.from(new Set(tags)))
        .optional(),
      rating: z
        .number()
        .int('Рейтинг должен быть целым числом')
        .min(1, 'Рейтинг должен быть не меньше 1')
        .max(10, 'Рейтинг должен быть не больше 10')
        .optional(),
      dateStart: dateIsoSchema.optional(),
      dateEnd: dateIsoSchema.optional(),
    })
    .strict()
    .refine((payload) => Object.keys(payload).length > 0, {
      message: 'Нужно изменить хотя бы одно поле',
    }),
);

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
    createdAtFrom: dateIsoSchema.optional(),
    createdAtTo: dateIsoSchema.optional(),
    dateStartFrom: dateIsoSchema.optional(),
    dateStartTo: dateIsoSchema.optional(),
    minPrice: priceSchema.optional(),
    maxPrice: priceSchema.optional(),
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
      message: 'Минимальный рейтинг не может быть больше максимального',
      path: ['minRating'],
    },
  )
  .refine(
    (query) =>
      query.minPrice === undefined ||
      query.maxPrice === undefined ||
      query.minPrice <= query.maxPrice,
    {
      message: 'Минимальная цена не может быть больше максимальной',
      path: ['minPrice'],
    },
  )
  .refine(
    (query) =>
      query.createdAtFrom === undefined ||
      query.createdAtTo === undefined ||
      new Date(query.createdAtFrom).getTime() <= new Date(query.createdAtTo).getTime(),
    {
      message: 'Дата создания «от» не может быть позже даты «до»',
      path: ['createdAtFrom'],
    },
  )
  .refine(
    (query) =>
      query.dateStartFrom === undefined ||
      query.dateStartTo === undefined ||
      new Date(query.dateStartFrom).getTime() <= new Date(query.dateStartTo).getTime(),
    {
      message: 'Дата события «от» не может быть позже даты «до»',
      path: ['dateStartFrom'],
    },
  );
