import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import collectionsHandler from '../api/collections/index.ts';
import collectionHandler from '../api/collections/[collectionId]/index.ts';
import entriesHandler from '../api/collections/[collectionId]/entries/index.ts';
import entryHandler from '../api/collections/[collectionId]/entries/[entryId]/index.ts';
import publicCollectionsHandler from '../api/examples/collections/index.ts';
import publicCollectionHandler from '../api/examples/collections/[collectionId]/index.ts';
import publicEntriesHandler from '../api/examples/collections/[collectionId]/entries/index.ts';
import itemsHandler from '../api/items/index.ts';

type RouteHandler = (req: VercelRequest, res: VercelResponse) => Promise<unknown> | unknown;

interface RouteDefinition {
  pattern: string[];
  handler: RouteHandler;
}

type QueryValue = string | string[] | undefined;
type QueryRecord = Record<string, QueryValue>;

interface LocalRequest extends IncomingMessage {
  body?: unknown;
  cookies: Record<string, string>;
  query: QueryRecord;
  userId?: string;
}

interface LocalResponse extends ServerResponse {
  json: (body: unknown) => LocalResponse;
  status: (code: number) => LocalResponse;
}

const DEFAULT_PORT = 3000;
const HOST = '127.0.0.1';

function wrapHandler(handler: (req: never, res: VercelResponse) => Promise<unknown> | unknown) {
  return ((req: VercelRequest, res: VercelResponse) => handler(req as never, res)) satisfies RouteHandler;
}

const routes: RouteDefinition[] = [
  {
    pattern: ['api', 'examples', 'collections'],
    handler: wrapHandler(publicCollectionsHandler),
  },
  {
    pattern: ['api', 'examples', 'collections', ':collectionId', 'entries'],
    handler: wrapHandler(publicEntriesHandler),
  },
  {
    pattern: ['api', 'examples', 'collections', ':collectionId'],
    handler: wrapHandler(publicCollectionHandler),
  },
  {
    pattern: ['api', 'collections', ':collectionId', 'entries', ':entryId'],
    handler: wrapHandler(entryHandler),
  },
  {
    pattern: ['api', 'collections', ':collectionId', 'entries'],
    handler: wrapHandler(entriesHandler),
  },
  {
    pattern: ['api', 'collections', ':collectionId'],
    handler: wrapHandler(collectionHandler),
  },
  {
    pattern: ['api', 'collections'],
    handler: wrapHandler(collectionsHandler),
  },
  {
    pattern: ['api', 'items'],
    handler: wrapHandler(itemsHandler),
  },
];

function parsePort(rawPort: string | undefined): number {
  const parsed = Number(rawPort);

  if (Number.isInteger(parsed) && parsed > 0) {
    return parsed;
  }

  return DEFAULT_PORT;
}

function parseQuery(searchParams: URLSearchParams): QueryRecord {
  const query: QueryRecord = {};

  for (const [key, value] of searchParams.entries()) {
    const existing = query[key];

    if (existing === undefined) {
      query[key] = value;
      continue;
    }

    if (Array.isArray(existing)) {
      existing.push(value);
      continue;
    }

    query[key] = [existing, value];
  }

  return query;
}

function matchRoute(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);

  for (const route of routes) {
    if (route.pattern.length !== segments.length) {
      continue;
    }

    const params: Record<string, string> = {};
    let isMatch = true;

    for (const [index, patternSegment] of route.pattern.entries()) {
      const currentSegment = segments[index];

      if (patternSegment.startsWith(':')) {
        params[patternSegment.slice(1)] = currentSegment;
        continue;
      }

      if (patternSegment !== currentSegment) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      return {
        handler: route.handler,
        params,
      };
    }
  }

  return null;
}

function attachResponseHelpers(res: ServerResponse): LocalResponse {
  const localRes = res as LocalResponse;

  localRes.status = (code: number) => {
    localRes.statusCode = code;
    return localRes;
  };

  localRes.json = (body: unknown) => {
    if (!localRes.headersSent) {
      localRes.setHeader('Content-Type', 'application/json; charset=utf-8');
    }

    localRes.end(JSON.stringify(body));
    return localRes;
  };

  return localRes;
}

function sendJson(res: ServerResponse, statusCode: number, body: unknown) {
  attachResponseHelpers(res).status(statusCode).json(body);
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'DELETE') {
    return undefined;
  }

  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (!chunks.length) {
    return undefined;
  }

  const rawBody = Buffer.concat(chunks).toString('utf8').trim();
  if (!rawBody) {
    return undefined;
  }

  const contentType = req.headers['content-type'] ?? '';
  if (contentType.includes('application/json')) {
    return JSON.parse(rawBody);
  }

  return rawBody;
}

async function requestListener(nodeReq: IncomingMessage, nodeRes: ServerResponse) {
  const url = new URL(nodeReq.url ?? '/', `http://${nodeReq.headers.host ?? HOST}`);
  const matchedRoute = matchRoute(url.pathname);

  if (!matchedRoute) {
    sendJson(nodeRes, 404, {
      ok: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found',
      },
    });
    return;
  }

  if (nodeReq.method === 'OPTIONS') {
    nodeRes.statusCode = 204;
    nodeRes.end();
    return;
  }

  let body: unknown;
  try {
    body = await readBody(nodeReq);
  } catch {
    sendJson(nodeRes, 400, {
      ok: false,
      error: {
        code: 'INVALID_JSON',
        message: 'Request body contains invalid JSON',
      },
    });
    return;
  }

  const req = nodeReq as LocalRequest as VercelRequest;
  const res = attachResponseHelpers(nodeRes) as VercelResponse;

  Object.assign(req, {
    body,
    cookies: {},
    query: {
      ...parseQuery(url.searchParams),
      ...matchedRoute.params,
    },
  } satisfies Pick<LocalRequest, 'body' | 'cookies' | 'query'>);

  try {
    await matchedRoute.handler(req, res);

    if (!nodeRes.writableEnded) {
      nodeRes.end();
    }
  } catch (error) {
    if (!nodeRes.headersSent) {
      sendJson(nodeRes, 500, {
        ok: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Internal server error',
        },
      });
    }
  }
}

const port = parsePort(process.env.LOCAL_API_PORT);

const server = createServer((req, res) => {
  void requestListener(req, res);
});

server.listen(port, HOST, () => {
  const address = server.address() as AddressInfo | null;
  const resolvedPort = address?.port ?? port;

  console.log(`[dev:api] Local backend server is running at http://${HOST}:${resolvedPort}`);
  console.log('[dev:api] Frontend dev server can proxy /api requests to this runtime.');
});

function shutdown(signal: string) {
  console.log(`[dev:api] Received ${signal}, shutting down local backend server...`);
  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
