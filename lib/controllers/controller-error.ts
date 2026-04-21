import type { VercelResponse } from '@vercel/node';
import { ZodError } from 'zod';
import { mapValidationIssues, sendError } from '../http/api-response';

function isErrorWithName(error: unknown, name: string): error is Error {
  return error instanceof Error && error.name === name;
}

export function handleControllerError(res: VercelResponse, error: unknown) {
  if (error instanceof ZodError) {
    return sendError(res, 422, 'VALIDATION_ERROR', 'Validation failed', mapValidationIssues(error));
  }

  if (isErrorWithName(error, 'ForbiddenError')) {
    return sendError(res, 403, 'FORBIDDEN', error.message || 'Access is forbidden');
  }

  if (isErrorWithName(error, 'NotFoundError')) {
    return sendError(res, 404, 'NOT_FOUND', error.message || 'Resource not found');
  }

  if (isErrorWithName(error, 'TransactionError')) {
    return sendError(res, 500, 'TRANSACTION_ERROR', error.message || 'Transaction failed');
  }

  return sendError(res, 500, 'INTERNAL_ERROR', 'Internal server error');
}
