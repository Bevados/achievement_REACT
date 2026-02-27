/*
  Контроллеры для `items` — слой, который обрабатывает HTTP-запросы.

  Здесь принимаются Express-подобные объекты `req` и `res`, вызываются
  валидационные схемы (Zod), и затем сервисный слой для выполнения операций.
  Все функции возвращают JSON-ответ и соответствующий HTTP-статус.
*/
import type { VercelResponse } from '@vercel/node';
import * as service from '../services/item.service';
import { createItemSchema, updateItemSchema } from '../validation/item.schema';

export async function getItems(req: any, res: VercelResponse) {
  const items = await service.getItems(req.userId);
  res.status(200).json(items);
}

export async function createItem(req: any, res: VercelResponse) {
  const parsed = createItemSchema.parse(req.body);
  const result = await service.createNewItem(req.userId, parsed);
  res.status(201).json(result);
}

export async function updateItem(req: any, res: VercelResponse) {
  const parsed = updateItemSchema.parse(req.body);
  const { id } = req.query;

  const result = await service.updateExistingItem(id, req.userId, parsed);
  res.status(200).json(result);
}

export async function deleteItem(req: any, res: VercelResponse) {
  const { id } = req.query;
  const result = await service.removeItem(id, req.userId);
  res.status(200).json(result);
}
