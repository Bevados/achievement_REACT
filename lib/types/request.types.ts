import type { VercelRequest } from '@vercel/node';

/*
  Расширенный тип запроса для API, который содержит поле `userId`.
  Поле добавляется после успешной аутентификации (см. middleware/auth.ts).
*/
export interface AuthenticatedRequest extends VercelRequest {
  userId: string;
}
