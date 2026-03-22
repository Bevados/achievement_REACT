/*
  Контроллеры для `items` — слой, который обрабатывает HTTP-запросы.

  Здесь принимаются Express-подобные объекты `req` и `res`, вызываются
  валидационные схемы (Zod), и затем сервисный слой для выполнения операций.
  Все функции возвращают JSON-ответ и соответствующий HTTP-статус.
*/
import type { VercelResponse } from '@vercel/node';
import { ZodError } from 'zod';
import * as service from '../services/item.service';
import type { AuthenticatedRequest } from '../types/request.types';
import { createItemSchema, itemIdSchema, updateItemSchema } from '../validation/item.schema';

function getIdFromQuery(rawId: string | string[] | undefined): string {
  const normalizedId = Array.isArray(rawId) ? rawId[0] : rawId;
  const parsed = itemIdSchema.parse({ id: normalizedId });
  return parsed.id;
}

function handleControllerError(res: VercelResponse, error: unknown) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  return res.status(500).json({ error: 'Internal server error' });
}

export async function getItems(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const items = await service.getItems(req.userId);
    return res.status(200).json(items);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function createItem(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const parsed = createItemSchema.parse(req.body);
    const result = await service.createNewItem(req.userId, parsed);
    return res.status(201).json(result);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function updateItem(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const parsed = updateItemSchema.parse(req.body);
    const id = getIdFromQuery(req.query.id);

    const result = await service.updateExistingItem(id, req.userId, parsed);
    return res.status(200).json(result);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function deleteItem(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const id = getIdFromQuery(req.query.id);
    const result = await service.removeItem(id, req.userId);
    return res.status(200).json(result);
  } catch (error) {
    return handleControllerError(res, error);
  }
}
