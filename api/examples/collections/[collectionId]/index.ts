import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as controller from '../../../../lib/controllers/collection.controller';
import { sendError } from '../../../../lib/http/api-response';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return controller.getPublicCollection(req, res);
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
