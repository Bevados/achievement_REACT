/*
  Схемы валидации для операций с items, реализованы через Zod.

  - `createItemSchema` проверяет тело POST-запроса при создании нового item.
  - `updateItemSchema` используется для PATCH-запросов — все поля опциональны.

  Валидация выполняется в контроллерах до вызова сервисного слоя.
*/
import { z } from 'zod';

export const createItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

export const updateItemSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});
