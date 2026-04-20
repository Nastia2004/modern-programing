import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { authRoutes } from './routes/auth.js';
import { projectRoutes } from './routes/projects.js';
import { taskRoutes } from './routes/tasks.js';
import { userRoutes } from './routes/users.js';

export async function buildApp(options = {}) {
  const fastify = Fastify({
    logger: options.logger ?? true,
    ajv: {
      customOptions: {
        keywords: ['example']
      }
    }
  });

  await fastify.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });

  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Lab 2 Fastify REST API',
        description: 'Interactive OpenAPI documentation for a university REST API lab with in-memory mock data.',
        version: '1.0.0'
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Local development server'
        }
      ],
      tags: [
        { name: 'Auth', description: 'Mock authorization for the frontend lab' },
        { name: 'Users', description: 'User CRUD operations' },
        { name: 'Projects', description: 'Project CRUD operations' },
        { name: 'Tasks', description: 'Task CRUD operations and nested project tasks' }
      ]
    }
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      displayRequestDuration: true
    }
  });

  fastify.get('/', {
    schema: {
      tags: ['Health'],
      summary: 'API info',
      response: {
        200: {
          description: 'API information',
          type: 'object',
          properties: {
            message: { type: 'string' },
            docs: { type: 'string' },
            resources: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        }
      }
    }
  }, async () => ({
    message: 'Lab 2 Fastify REST API',
    docs: '/docs',
    resources: ['/users', '/projects', '/tasks']
  }));

  await fastify.register(authRoutes);
  await fastify.register(userRoutes);
  await fastify.register(projectRoutes);
  await fastify.register(taskRoutes);

  return fastify;
}
