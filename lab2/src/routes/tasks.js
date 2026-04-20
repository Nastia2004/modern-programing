import { counters, projects, tasks } from '../data/store.js';
import { taskSchemas } from '../schemas/swagger.js';
import { attachTaskRelations } from '../utils/relations.js';
import { createError, findById, findIndexById, paginate, sortItems } from '../utils/http.js';

export async function taskRoutes(fastify) {
  fastify.get('/tasks', { schema: taskSchemas.list }, async (request) => {
    const { projectId, status, priority, search, sortBy = 'id', order = 'asc' } = request.query;

    let result = tasks;

    if (projectId) {
      result = result.filter((task) => task.projectId === Number(projectId));
    }

    if (status) {
      result = result.filter((task) => task.status === status);
    }

    if (priority) {
      result = result.filter((task) => task.priority === priority);
    }

    if (search) {
      const normalizedSearch = search.toLowerCase();
      result = result.filter((task) => task.title.toLowerCase().includes(normalizedSearch));
    }

    result = sortItems(result, sortBy, order).map(attachTaskRelations);

    return paginate(result, request.query);
  });

  fastify.get('/tasks/:id', { schema: taskSchemas.getById }, async (request, reply) => {
    const task = findById(tasks, request.params.id);

    if (!task) {
      return createError(reply, 404, 'Task not found');
    }

    return attachTaskRelations(task);
  });

  fastify.get('/projects/:projectId/tasks', { schema: taskSchemas.listByProject }, async (request, reply) => {
    const project = findById(projects, request.params.projectId);

    if (!project) {
      return createError(reply, 404, 'Project not found');
    }

    const { status, priority, search, sortBy = 'id', order = 'asc' } = request.query;
    let result = tasks.filter((task) => task.projectId === project.id);

    if (status) {
      result = result.filter((task) => task.status === status);
    }

    if (priority) {
      result = result.filter((task) => task.priority === priority);
    }

    if (search) {
      const normalizedSearch = search.toLowerCase();
      result = result.filter((task) => task.title.toLowerCase().includes(normalizedSearch));
    }

    result = sortItems(result, sortBy, order).map(attachTaskRelations);

    return paginate(result, request.query);
  });

  fastify.post('/tasks', { schema: taskSchemas.create }, async (request, reply) => {
    const { projectId, title, status = 'todo', priority = 'medium', dueDate = null } = request.body;

    if (!projectId || !title) {
      return createError(reply, 400, 'Fields "projectId" and "title" are required');
    }

    const project = findById(projects, projectId);

    if (!project) {
      return createError(reply, 404, 'Project not found');
    }

    const task = {
      id: counters.tasks++,
      projectId: Number(projectId),
      title,
      status,
      priority,
      dueDate,
      createdAt: new Date().toISOString()
    };

    tasks.push(task);

    return reply.code(201).send(attachTaskRelations(task));
  });

  fastify.post('/projects/:projectId/tasks', { schema: taskSchemas.createByProject }, async (request, reply) => {
    const project = findById(projects, request.params.projectId);

    if (!project) {
      return createError(reply, 404, 'Project not found');
    }

    const { title, status = 'todo', priority = 'medium', dueDate = null } = request.body;

    if (!title) {
      return createError(reply, 400, 'Field "title" is required');
    }

    const task = {
      id: counters.tasks++,
      projectId: project.id,
      title,
      status,
      priority,
      dueDate,
      createdAt: new Date().toISOString()
    };

    tasks.push(task);

    return reply.code(201).send(attachTaskRelations(task));
  });

  fastify.put('/tasks/:id', { schema: taskSchemas.update }, async (request, reply) => {
    const index = findIndexById(tasks, request.params.id);

    if (index === -1) {
      return createError(reply, 404, 'Task not found');
    }

    const { projectId, title, status, priority, dueDate } = request.body;

    if (!projectId || !title || !status || !priority) {
      return createError(reply, 400, 'Fields "projectId", "title", "status" and "priority" are required');
    }

    const project = findById(projects, projectId);

    if (!project) {
      return createError(reply, 404, 'Project not found');
    }

    tasks[index] = {
      ...tasks[index],
      projectId: Number(projectId),
      title,
      status,
      priority,
      dueDate: dueDate ?? null
    };

    return attachTaskRelations(tasks[index]);
  });

  fastify.delete('/tasks/:id', { schema: taskSchemas.delete }, async (request, reply) => {
    const index = findIndexById(tasks, request.params.id);

    if (index === -1) {
      return createError(reply, 404, 'Task not found');
    }

    tasks.splice(index, 1);

    return reply.code(204).send();
  });
}
