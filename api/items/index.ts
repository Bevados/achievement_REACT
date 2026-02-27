/*
  API Entry Point для коллекции "items".
  Этот файл используется Vercel как serverless функция при обращении к `/api/items`.

  Он выполняет 2 основные задачи:
  1. Проверка аутентификации пользователя (через middleware `verifyAuth`).
  2. Маршрутизация запроса по HTTP-методам в соответствующие контроллеры.

  После рефакторинга прежний монолитный `api/items.ts` был удалён, и логика
  разбита на папку `api/items/` и отдельные слои (middleware, controllers,
  services, repositories). Это облегчает тестирование и поддержку.
*/

import type { VercelResponse } from '@vercel/node';
import type { AuthenticatedRequest } from '@lib/types/request.types';
import { verifyAuth } from '@lib/middleware/auth';
import * as controller from '@lib/controllers/item.controller';

export default async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    await verifyAuth(req, res);

    switch (req.method) {
      case 'GET':
        return controller.getItems(req, res);
      case 'POST':
        return controller.createItem(req, res);
      case 'PATCH':
        return controller.updateItem(req, res);
      case 'DELETE':
        return controller.deleteItem(req, res);
      default:
        return res.status(405).end();
    }
  } catch {
    return;
  }
}
