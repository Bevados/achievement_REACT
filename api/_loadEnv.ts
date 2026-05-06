import { config as loadEnv } from 'dotenv';

let isEnvLoaded = false;

export function ensureServerEnvLoaded() {
  if (isEnvLoaded) {
    return;
  }

  loadEnv({ path: '.env.local' });
  loadEnv();
  isEnvLoaded = true;
}
