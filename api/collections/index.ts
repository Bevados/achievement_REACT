import type { VercelResponse } from '@vercel/node';
import * as controller from '../../lib/controllers/collection.controller.js';
import { sendError } from '../../lib/http/api-response.js';
import { verifyAuth } from '../../lib/middleware/auth.js';
import type { AuthenticatedRequest } from '../../lib/types/request.types.js';

export default async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    await verifyAuth(req, res);

    switch (req.method) {
      case 'GET':
        return controller.getCollections(req, res);
      case 'POST':
        return controller.createCollection(req, res);
      default:
        return sendError(res, 405, 'METHOD_NOT_ALLOWED', 'Метод не поддерживается');
    }
  } catch {
    if (!res.headersSent) {
      return sendError(res, 500, 'INTERNAL_ERROR', 'Внутренняя ошибка сервера');
    }

    return;
  }
}
