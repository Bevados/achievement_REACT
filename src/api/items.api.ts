import { getIdToken } from '../firebase';

export interface ProtectedProbeResult {
  ok: boolean;
  status: number;
  data: unknown;
}

/*
  Пробный защищенный запрос.
  Нужен как "smoke test": проверяем, что токен берется и уходит в API.
*/
export async function probeItemsEndpoint(): Promise<ProtectedProbeResult> {
  const token = await getIdToken();

  if (!token) {
    throw new Error('Пользователь не авторизован: токен отсутствует.');
  }

  const response = await fetch('/api/items', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => null);

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}
