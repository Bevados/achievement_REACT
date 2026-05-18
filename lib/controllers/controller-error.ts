import type { VercelResponse } from '@vercel/node';
import { ZodError } from 'zod';
import { mapValidationIssues, sendError } from '../http/api-response';

function isErrorWithName(error: unknown, name: string): error is Error {
  return error instanceof Error && error.name === name;
}

export function handleControllerError(res: VercelResponse, error: unknown) {
  if (error instanceof ZodError) {
    return sendError(res, 422, 'VALIDATION_ERROR', 'Проверьте введённые данные', mapValidationIssues(error));
  }

  if (isErrorWithName(error, 'ForbiddenError')) {
    return sendError(res, 403, 'FORBIDDEN', error.message || 'Доступ запрещён');
  }

  if (isErrorWithName(error, 'NotFoundError')) {
    return sendError(res, 404, 'NOT_FOUND', error.message || 'Ресурс не найден');
  }

  if (isErrorWithName(error, 'TransactionError')) {
    return sendError(res, 500, 'TRANSACTION_ERROR', error.message || 'Не удалось завершить операцию');
  }

  if (isErrorWithName(error, 'ValidationError')) {
    return sendError(res, 422, 'VALIDATION_ERROR', error.message || 'Проверьте введённые данные');
  }

  return sendError(res, 500, 'INTERNAL_ERROR', 'Внутренняя ошибка сервера');
}
