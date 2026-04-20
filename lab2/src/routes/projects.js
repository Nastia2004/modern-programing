import { counters, projects, tasks, users } from '../data/store.js';
import { projectSchemas } from '../schemas/swagger.js';
import { attachProjectRelations } from '../utils/relations.js';
import { createError, findById, findIndexById, paginate, sortItems } from '../utils/http.js';

export async function projectRoutes(fastify) {
  fastify.get('/projects', { schema: projectSchemas.list }, async (request) => {
    const { ownerId, status, search, sortBy = 'id', order = 'asc' } = request.query;

    let result = projects;

    if (ownerId) {
      result = result.filter((project) => project.ownerId === Number(ownerId));
    }

    if (status) {
      result = result.filter((project) => project.status === status);
    }

    if (search) {
      const normalizedSearch = search.toLowerCase();
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(normalizedSearch) ||
          project.description.toLowerCase().includes(normalizedSearch)
      );
    }

    result = sortItems(result, sortBy, order).map(attachProjectRelations);

    return paginate(result, request.query);
  });

  fastify.get('/projects/:id', { schema: projectSchemas.getById }, async (request, reply) => {
    const project = findById(projects, request.params.id);

    if (!project) {
      return createError(reply, 404, 'Project not found');
    }

    return attachProjectRelations(project);
  });

  fastify.post('/projects', { schema: projectSchemas.create }, async (request, reply) => {
    const { ownerId, title, description = '', status = 'draft' } = request.body;

    if (!ownerId || !title) {
      return createError(reply, 400, 'Fields "ownerId" and "title" are required');
    }

    const owner = findById(users, ownerId);

    if (!owner) {
      return createError(reply, 404, 'Owner user not found');
    }

    const project = {
      id: counters.projects++,
      ownerId: Number(ownerId),
      title,
      description,
      status,
      createdAt: new Date().toISOString()
    };

    projects.push(project);

    return reply.code(201).send(attachProjectRelations(project));
  });

  fastify.put('/projects/:id', { schema: projectSchemas.update }, async (request, reply) => {
    const index = findIndexById(projects, request.params.id);

    if (index === -1) {
      return createError(reply, 404, 'Project not found');
    }

    const { ownerId, title, description, status } = request.body;

    if (!ownerId || !title || !description || !status) {
      return createError(reply, 400, 'Fields "ownerId", "title", "description" and "status" are required');
    }

    const owner = findById(users, ownerId);

    if (!owner) {
      return createError(reply, 404, 'Owner user not found');
    }

    projects[index] = {
      ...projects[index],
      ownerId: Number(ownerId),
      title,
      description,
      status
    };

    return attachProjectRelations(projects[index]);
  });

  fastify.delete('/projects/:id', { schema: projectSchemas.delete }, async (request, reply) => {
    const index = findIndexById(projects, request.params.id);

    if (index === -1) {
      return createError(reply, 404, 'Project not found');
    }

    const [deletedProject] = projects.splice(index, 1);

    for (let i = tasks.length - 1; i >= 0; i -= 1) {
      if (tasks[i].projectId === deletedProject.id) {
        tasks.splice(i, 1);
      }
    }

    return reply.code(204).send();
  });
}
