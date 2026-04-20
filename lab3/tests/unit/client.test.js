import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApiClient } from '../../src/api/client.js';

describe('createApiClient', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('adds JSON content-type for requests with body', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ token: 'abc', user: { id: 1 } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    );

    await createApiClient().login({
      email: 'anastasiia@example.com',
      password: 'password123'
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      })
    );
  });

  it('does not send JSON content-type for DELETE without body', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 204
      })
    );

    await createApiClient().deleteTask(1);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/tasks/1'),
      expect.objectContaining({
        method: 'DELETE',
        headers: {}
      })
    );
  });
});
