import type { VercelResponse } from '@vercel/node';
import * as controller from '@lib/controllers/collection.controller';
import { sendError } from '@lib/http/api-response';
import { verifyAuth } from '@lib/middleware/auth';
import type { AuthenticatedRequest } from '@lib/types/request.types';

export default async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    await verifyAuth(req, res);

    switch (req.method) {
      case 'GET':
        return controller.getCollections(req, res);
      case 'POST':
        return controller.createCollection(req, res);
      default:
        return sendError(res, 405, 'METHOD_NOT_ALLOWED', 'Method not allowed');
    }
  } catch {
    if (!res.headersSent) {
      return sendError(res, 500, 'INTERNAL_ERROR', 'Internal server error');
    }

    return;
  }
}
