import { config as loadEnv } from 'dotenv';

let isEnvLoaded = false;

export function ensureServerEnvLoaded() {
  if (isEnvLoaded) {
    return;
  }

  const quiet = process.env.VERCEL === '1' || Boolean(process.env.VERCEL_ENV);

  loadEnv({ path: '.env.local', quiet });
  loadEnv({ quiet });
  isEnvLoaded = true;
}
