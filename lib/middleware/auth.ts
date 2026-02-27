/*
  Мидлвар `verifyAuth` для Vercel API-функций.

  Задача: вытянуть ID-токен из заголовка Authorization, проверить его валидность
  через Firebase Admin SDK и записать `req.userId` для дальнейшей обработки.

  Если токен отсутствует или невалиден, устанавливает статус 401 и выбрасывает ошибка.
  Таким образом, API-функции могут просто вызвать `await verifyAuth(req, res)` и
  гарантировать что `req.userId` заполнен.
*/

import type { VercelResponse } from '@vercel/node';
import admin from '../../api/_firebaseAdmin';
import type { AuthenticatedRequest } from '../types/request.types';

export async function verifyAuth(req: AuthenticatedRequest, res: VercelResponse): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    throw new Error('Unauthorized');
  }

  const token = authHeader.substring('Bearer '.length);

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.userId = decoded.uid;
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
    throw new Error('Unauthorized');
  }
}
