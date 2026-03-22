/*
  Схемы валидации для операций с items, реализованы через Zod.

  - `createItemSchema` проверяет тело POST-запроса при создании нового item.
  - `updateItemSchema` используется для PATCH-запросов — все поля опциональны.

  Валидация выполняется в контроллерах до вызова сервисного слоя.
*/
import { z } from 'zod';
import type { CreateItemDto, UpdateItemDto } from '../types/item.types';

export const createItemSchema: z.ZodType<CreateItemDto> = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

export const updateItemSchema: z.ZodType<UpdateItemDto> = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

/*
  id в MongoDB должен быть 24-символьной hex-строкой.
  Схема используется в контроллерах для PATCH/DELETE запросов.
*/
export const itemIdSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/i, 'Invalid item id format'),
});
