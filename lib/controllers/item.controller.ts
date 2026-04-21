/*
  Контроллеры для `items` — слой, который обрабатывает HTTP-запросы.

  Здесь принимаются Express-подобные объекты `req` и `res`, вызываются
  валидационные схемы (Zod), и затем сервисный слой для выполнения операций.
  Все функции возвращают JSON-ответ и соответствующий HTTP-статус.
*/
import type { VercelResponse } from '@vercel/node';
import * as service from '../services/item.service';
import type { AuthenticatedRequest } from '../types/request.types';
import { createItemSchema, itemIdSchema, updateItemSchema } from '../validation/item.schema';
import { handleControllerError } from './controller-error';
import { getSingleQueryValue, sendSuccess } from '../http/api-response';

function getIdFromQuery(rawId: string | string[] | undefined): string {
  const normalizedId = getSingleQueryValue(rawId);
  const parsed = itemIdSchema.parse({ id: normalizedId });
  return parsed.id;
}

export async function getItems(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const items = await service.getItems(req.userId);
    return sendSuccess(res, 200, items);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function createItem(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const parsed = createItemSchema.parse(req.body);
    const result = await service.createNewItem(req.userId, parsed);
    return sendSuccess(res, 201, result);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function updateItem(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const parsed = updateItemSchema.parse(req.body);
    const id = getIdFromQuery(req.query.id);

    const result = await service.updateExistingItem(id, req.userId, parsed);
    return sendSuccess(res, 200, result);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function deleteItem(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const id = getIdFromQuery(req.query.id);
    await service.removeItem(id, req.userId);
    return sendSuccess(res, 200, null);
  } catch (error) {
    return handleControllerError(res, error);
  }
}
