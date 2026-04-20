import { counters, projects, tasks, users } from '../data/store.js';
import { userSchemas } from '../schemas/swagger.js';
import { attachUserRelations } from '../utils/relations.js';
import { createError, findById, findIndexById, paginate, sortItems } from '../utils/http.js';

export async function userRoutes(fastify) {
  fastify.get('/users', { schema: userSchemas.list }, async (request) => {
    const { role, search, sortBy = 'id', order = 'asc' } = request.query;

    let result = users;

    if (role) {
      result = result.filter((user) => user.role === role);
    }

    if (search) {
      const normalizedSearch = search.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(normalizedSearch) ||
          user.email.toLowerCase().includes(normalizedSearch)
      );
    }

    result = sortItems(result, sortBy, order).map(attachUserRelations);

    return paginate(result, request.query);
  });

  fastify.get('/users/:id', { schema: userSchemas.getById }, async (request, reply) => {
    const user = findById(users, request.params.id);

    if (!user) {
      return createError(reply, 404, 'User not found');
    }

    return attachUserRelations(user);
  });

  fastify.post('/users', { schema: userSchemas.create }, async (request, reply) => {
    const { name, email, role = 'student' } = request.body;

    if (!name || !email) {
      return createError(reply, 400, 'Fields "name" and "email" are required');
    }

    const exists = users.some((user) => user.email === email);

    if (exists) {
      return createError(reply, 409, 'User with this email already exists');
    }

    const user = {
      id: counters.users++,
      name,
      email,
      role,
      createdAt: new Date().toISOString()
    };

    users.push(user);

    return reply.code(201).send(attachUserRelations(user));
  });

  fastify.put('/users/:id', { schema: userSchemas.update }, async (request, reply) => {
    const index = findIndexById(users, request.params.id);

    if (index === -1) {
      return createError(reply, 404, 'User not found');
    }

    const { name, email, role } = request.body;

    if (!name || !email || !role) {
      return createError(reply, 400, 'Fields "name", "email" and "role" are required');
    }

    const emailUsed = users.some((user) => user.email === email && user.id !== Number(request.params.id));

    if (emailUsed) {
      return createError(reply, 409, 'User with this email already exists');
    }

    users[index] = {
      ...users[index],
      name,
      email,
      role
    };

    return attachUserRelations(users[index]);
  });

  fastify.delete('/users/:id', { schema: userSchemas.delete }, async (request, reply) => {
    const index = findIndexById(users, request.params.id);

    if (index === -1) {
      return createError(reply, 404, 'User not found');
    }

    const [deletedUser] = users.splice(index, 1);
    const deletedProjectIds = projects
      .filter((project) => project.ownerId === deletedUser.id)
      .map((project) => project.id);

    for (let i = projects.length - 1; i >= 0; i -= 1) {
      if (projects[i].ownerId === deletedUser.id) {
        projects.splice(i, 1);
      }
    }

    for (let i = tasks.length - 1; i >= 0; i -= 1) {
      if (deletedProjectIds.includes(tasks[i].projectId)) {
        tasks.splice(i, 1);
      }
    }

    return reply.code(204).send();
  });
}
