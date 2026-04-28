import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthIntentStore } from './auth-intent.store';

describe('auth-intent.store', () => {
  beforeEach(() => {
    useAuthIntentStore.setState({ pendingIntent: null });
  });

  it('stores create-collection intent', () => {
    useAuthIntentStore.getState().setIntent('create-collection');

    expect(useAuthIntentStore.getState().pendingIntent).toBe('create-collection');
  });

  it('consumeIntent returns intent and clears state', () => {
    useAuthIntentStore.getState().setIntent('create-collection');

    const intent = useAuthIntentStore.getState().consumeIntent();

    expect(intent).toBe('create-collection');
    expect(useAuthIntentStore.getState().pendingIntent).toBeNull();
  });

  it('clearIntent resets pending intent', () => {
    useAuthIntentStore.getState().setIntent('create-collection');

    useAuthIntentStore.getState().clearIntent();

    expect(useAuthIntentStore.getState().pendingIntent).toBeNull();
  });
});
