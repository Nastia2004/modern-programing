import { users } from '../data/store.js';
import { authSchemas } from '../schemas/swagger.js';
import { createError } from '../utils/http.js';

const demoCredentials = {
  email: 'anastasiia@example.com',
  password: 'password123'
};

const sessions = new Map();

function createToken(userId) {
  return `mock-token-${userId}-${Date.now()}`;
}

function getTokenFromRequest(request) {
  const authorization = request.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null;
  }

  return authorization.slice('Bearer '.length);
}

export async function authRoutes(fastify) {
  fastify.post('/auth/login', { schema: authSchemas.login }, async (request, reply) => {
    const { email, password } = request.body;

    if (!email || !password) {
      return createError(reply, 400, 'Fields "email" and "password" are required');
    }

    if (email !== demoCredentials.email || password !== demoCredentials.password) {
      return createError(reply, 401, 'Invalid email or password');
    }

    const user = users.find((item) => item.email === email);
    const token = createToken(user.id);

    sessions.set(token, user.id);

    return {
      token,
      user
    };
  });

  fastify.get('/auth/me', { schema: authSchemas.me }, async (request, reply) => {
    const token = getTokenFromRequest(request);
    const userId = token ? sessions.get(token) : null;

    if (!userId) {
      return createError(reply, 401, 'Unauthorized');
    }

    const user = users.find((item) => item.id === userId);

    if (!user) {
      sessions.delete(token);
      return createError(reply, 401, 'Unauthorized');
    }

    return {
      user
    };
  });
}
