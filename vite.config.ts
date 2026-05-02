import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { config as loadEnvFile } from 'dotenv';
import { ZodError } from 'zod';
import { collectionListQuerySchema } from './contracts/collection.contracts.schema';
import { getPublicCollections } from './lib/services/collection.service';

loadEnvFile({ path: '.env.local' });
loadEnvFile();

function localExamplesApiPlugin() {
  return {
    name: 'local-examples-api',
    configureServer(server: { middlewares: { use: (path: string, handler: (req: { url?: string }, res: { statusCode: number; setHeader: (name: string, value: string) => void; end: (body: string) => void }, next: () => void) => void) => void } }) {
      server.middlewares.use('/api/examples/collections', async (req, res, next) => {
        try {
          const url = new URL(req.url ?? '', 'http://localhost');
          const rawQuery = Object.fromEntries(url.searchParams.entries());
          const query = collectionListQuerySchema.parse(rawQuery);
          const result = await getPublicCollections(query);

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(
            JSON.stringify({
              ok: true,
              data: result,
            }),
          );
        } catch (error) {
          if (error instanceof ZodError) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(
              JSON.stringify({
                ok: false,
                error: {
                  code: 'BAD_REQUEST',
                  message: 'Invalid query parameters',
                },
              }),
            );
            return;
          }

          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(
            JSON.stringify({
              ok: false,
              error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : 'Internal server error',
              },
            }),
          );
          next();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localExamplesApiPlugin()],
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, 'lib'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});
