import autocannon from 'autocannon';

const baseUrl = process.env.API_URL || 'http://localhost:3000';

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (response.status === 204) {
    return null;
  }

  const body = await response.json();

  if (!response.ok) {
    throw new Error(`${response.status} ${body.error || response.statusText}`);
  }

  return body;
}

async function runScenario() {
  const login = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'ostap@example.com',
      password: 'password123'
    })
  });

  const project = await request('/projects', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${login.token}`
    },
    body: JSON.stringify({
      ownerId: login.user.id,
      title: 'Performance Scenario Project',
      description: 'Created before the benchmark and cleaned up after it.',
      status: 'active'
    })
  });

  const task = await request('/tasks', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${login.token}`
    },
    body: JSON.stringify({
      projectId: project.id,
      title: 'Performance Scenario Task',
      status: 'todo',
      priority: 'high',
      dueDate: '2026-05-10'
    })
  });

  return { login, project, task };
}

async function cleanup(projectId) {
  await fetch(`${baseUrl}/projects/${projectId}`, {
    method: 'DELETE'
  });
}

async function benchmark(projectId) {
  return autocannon({
    url: `${baseUrl}/projects/${projectId}/tasks`,
    connections: 10,
    duration: 5,
    method: 'GET'
  });
}

const scenario = await runScenario();
const result = await benchmark(scenario.project.id);

await cleanup(scenario.project.id);

console.log('Performance scenario');
console.log(`Base URL: ${baseUrl}`);
console.log(`Created project id: ${scenario.project.id}`);
console.log(`Created task id: ${scenario.task.id}`);
console.log(`Endpoint under load: GET /projects/${scenario.project.id}/tasks`);
console.log(`Requests/sec average: ${result.requests.average}`);
console.log(`Latency average: ${result.latency.average} ms`);
console.log(`2xx responses: ${result['2xx']}`);
