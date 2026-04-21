import type { VercelResponse } from '@vercel/node';
import type { ZodError } from 'zod';

export interface ValidationIssuePayload {
  path: string;
  message: string;
}

export function sendSuccess<T>(res: VercelResponse, status: number, data: T) {
  return res.status(status).json({
    ok: true,
    data,
  });
}

export function sendError(
  res: VercelResponse,
  status: number,
  code: string,
  message: string,
  details?: unknown,
) {
  return res.status(status).json({
    ok: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  });
}

export function getSingleQueryValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function normalizeQueryObject(
  query: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const normalized: Record<string, string> = {};

  for (const [key, value] of Object.entries(query)) {
    const normalizedValue = getSingleQueryValue(value);

    if (normalizedValue !== undefined) {
      normalized[key] = normalizedValue;
    }
  }

  return normalized;
}

export function mapValidationIssues(error: ZodError): ValidationIssuePayload[] {
  return error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
}
