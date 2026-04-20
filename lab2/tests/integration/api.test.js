import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../../src/app.js';

async function withApp(callback) {
  const app = await buildApp({ logger: false });

  try {
    await app.ready();
    await callback(app);
  } finally {
    await app.close();
  }
}

test('auth login returns token and current user can be loaded with bearer token', async () => {
  await withApp(async (app) => {
    const loginResponse = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'anastasiia@example.com',
        password: 'password123'
      }
    });

    assert.equal(loginResponse.statusCode, 200);

    const loginBody = loginResponse.json();
    assert.match(loginBody.token, /^mock-token-1-/);
    assert.equal(loginBody.user.email, 'anastasiia@example.com');

    const meResponse = await app.inject({
      method: 'GET',
      url: '/auth/me',
      headers: {
        authorization: `Bearer ${loginBody.token}`
      }
    });

    assert.equal(meResponse.statusCode, 200);
    assert.equal(meResponse.json().user.id, 1);
  });
});

test('invalid login returns unauthorized error', async () => {
  await withApp(async (app) => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'anastasiia@example.com',
        password: 'wrong-password'
      }
    });

    assert.equal(response.statusCode, 401);
    assert.equal(response.json().error, 'Invalid email or password');
  });
});

test('users endpoint supports filtering, sorting and pagination', async () => {
  await withApp(async (app) => {
    const response = await app.inject('/users?role=student&page=1&limit=1&sortBy=name&order=asc');

    assert.equal(response.statusCode, 200);

    const body = response.json();
    assert.equal(body.data.length, 1);
    assert.equal(body.data[0].role, 'student');
    assert.equal(body.meta.page, 1);
    assert.equal(body.meta.limit, 1);
    assert.ok(body.meta.total >= 2);
  });
});

test('project and task scenario uses returned ids between calls', async () => {
  await withApp(async (app) => {
    const projectResponse = await app.inject({
      method: 'POST',
      url: '/projects',
      payload: {
        ownerId: 1,
        title: 'Integration Project',
        description: 'Created by integration test',
        status: 'active'
      }
    });

    assert.equal(projectResponse.statusCode, 201);

    const project = projectResponse.json();

    const taskResponse = await app.inject({
      method: 'POST',
      url: `/projects/${project.id}/tasks`,
      payload: {
        title: 'Integration Task',
        status: 'todo',
        priority: 'high',
        dueDate: '2026-05-01'
      }
    });

    assert.equal(taskResponse.statusCode, 201);
    assert.equal(taskResponse.json().projectId, project.id);

    const nestedTasksResponse = await app.inject(`/projects/${project.id}/tasks`);

    assert.equal(nestedTasksResponse.statusCode, 200);
    assert.equal(nestedTasksResponse.json().data.length, 1);

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: `/projects/${project.id}`
    });

    assert.equal(deleteResponse.statusCode, 204);
  });
});

test('swagger json contains auth, project and task paths', async () => {
  await withApp(async (app) => {
    const response = await app.inject('/docs/json');

    assert.equal(response.statusCode, 200);

    const body = response.json();
    assert.ok(body.paths['/auth/login']);
    assert.ok(body.paths['/projects']);
    assert.ok(body.paths['/projects/{projectId}/tasks']);
  });
});
