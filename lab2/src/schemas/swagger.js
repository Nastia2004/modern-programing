const idParam = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'integer', minimum: 1, description: 'Resource id' }
  }
};

const projectIdParam = {
  type: 'object',
  required: ['projectId'],
  properties: {
    projectId: { type: 'integer', minimum: 1, description: 'Project id' }
  }
};

const paginationQuery = {
  page: { type: 'integer', minimum: 1, default: 1 },
  limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
  sortBy: { type: 'string', default: 'id' },
  order: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
  search: { type: 'string' }
};

const meta = {
  type: 'object',
  properties: {
    page: { type: 'integer', example: 1 },
    limit: { type: 'integer', example: 10 },
    total: { type: 'integer', example: 3 },
    totalPages: { type: 'integer', example: 1 }
  }
};

const errorResponse = {
  type: 'object',
  properties: {
    error: { type: 'string', example: 'Resource not found' },
    statusCode: { type: 'integer', example: 404 }
  }
};

const unauthorizedResponse = {
  type: 'object',
  properties: {
    error: { type: 'string', example: 'Unauthorized' },
    statusCode: { type: 'integer', example: 401 }
  }
};

const userRole = { type: 'string', enum: ['student', 'mentor', 'admin'] };
const projectStatus = { type: 'string', enum: ['draft', 'active', 'completed'] };
const taskStatus = { type: 'string', enum: ['todo', 'in_progress', 'done'] };
const taskPriority = { type: 'string', enum: ['low', 'medium', 'high'] };

const userBase = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    name: { type: 'string', example: 'Ostap Mamchur' },
    email: { type: 'string', format: 'email', example: 'ostap@example.com' },
    role: userRole,
    createdAt: { type: 'string', format: 'date-time' }
  }
};

const ownerSummary = {
  type: 'object',
  nullable: true,
  properties: {
    id: { type: 'integer', example: 1 },
    name: { type: 'string', example: 'Ostap Mamchur' },
    email: { type: 'string', format: 'email', example: 'ostap@example.com' }
  }
};

const taskBase = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    projectId: { type: 'integer', example: 1 },
    title: { type: 'string', example: 'Create Fastify server' },
    status: taskStatus,
    priority: taskPriority,
    dueDate: { type: 'string', nullable: true, example: '2026-04-25' },
    createdAt: { type: 'string', format: 'date-time' }
  }
};

const projectBase = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    ownerId: { type: 'integer', example: 1 },
    title: { type: 'string', example: 'REST API Lab' },
    description: { type: 'string', example: 'Backend for university laboratory work.' },
    status: projectStatus,
    createdAt: { type: 'string', format: 'date-time' }
  }
};

const projectSummary = {
  type: 'object',
  nullable: true,
  properties: {
    id: { type: 'integer', example: 1 },
    title: { type: 'string', example: 'REST API Lab' },
    status: projectStatus
  }
};

export const taskWithRelations = {
  ...taskBase,
  properties: {
    ...taskBase.properties,
    project: projectSummary,
    owner: {
      type: 'object',
      nullable: true,
      properties: {
        id: { type: 'integer', example: 1 },
        name: { type: 'string', example: 'Ostap Mamchur' }
      }
    }
  }
};

export const projectWithRelations = {
  ...projectBase,
  properties: {
    ...projectBase.properties,
    owner: ownerSummary,
    tasks: {
      type: 'array',
      items: taskBase
    }
  }
};

export const userWithRelations = {
  ...userBase,
  properties: {
    ...userBase.properties,
    projects: {
      type: 'array',
      items: projectWithRelations
    }
  }
};

export const paginatedUsers = {
  type: 'object',
  properties: {
    data: { type: 'array', items: userWithRelations },
    meta
  }
};

export const paginatedProjects = {
  type: 'object',
  properties: {
    data: { type: 'array', items: projectWithRelations },
    meta
  }
};

export const paginatedTasks = {
  type: 'object',
  properties: {
    data: { type: 'array', items: taskWithRelations },
    meta
  }
};

export const commonResponses = {
  400: { description: 'Invalid request body or query', ...errorResponse },
  401: { description: 'Unauthorized', ...unauthorizedResponse },
  404: { description: 'Resource was not found', ...errorResponse },
  409: { description: 'Conflict with current data', ...errorResponse }
};

export const authSchemas = {
  login: {
    tags: ['Auth'],
    summary: 'Login',
    description: 'Mock login for lab3 frontend. Demo credentials: ostap@example.com / password123.',
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email', example: 'ostap@example.com' },
        password: { type: 'string', minLength: 1, example: 'password123' }
      }
    },
    response: {
      200: {
        description: 'Login success',
        type: 'object',
        properties: {
          token: { type: 'string', example: 'mock-token-1-1776712000000' },
          user: userBase
        }
      },
      400: commonResponses[400],
      401: commonResponses[401]
    }
  },
  me: {
    tags: ['Auth'],
    summary: 'Get current user',
    description: 'Requires an Authorization header with a Bearer token returned by POST /auth/login.',
    headers: {
      type: 'object',
      properties: {
        authorization: { type: 'string', example: 'Bearer mock-token-1-1776712000000' }
      }
    },
    response: {
      200: {
        description: 'Current user',
        type: 'object',
        properties: {
          user: userBase
        }
      },
      401: commonResponses[401]
    }
  }
};

export const userSchemas = {
  list: {
    tags: ['Users'],
    summary: 'Get users',
    description: 'Returns users with nested projects and tasks. Supports pagination, sorting, search and role filtering.',
    querystring: {
      type: 'object',
      properties: {
        ...paginationQuery,
        role: userRole
      }
    },
    response: {
      200: { description: 'Users list', ...paginatedUsers }
    }
  },
  getById: {
    tags: ['Users'],
    summary: 'Get user by id',
    params: idParam,
    response: {
      200: { description: 'User details', ...userWithRelations },
      404: commonResponses[404]
    }
  },
  create: {
    tags: ['Users'],
    summary: 'Create user',
    body: {
      type: 'object',
      required: ['name', 'email'],
      properties: {
        name: { type: 'string', minLength: 1, example: 'New User' },
        email: { type: 'string', format: 'email', example: 'new@example.com' },
        role: { ...userRole, default: 'student' }
      }
    },
    response: {
      201: { description: 'Created user', ...userWithRelations },
      400: commonResponses[400],
      409: commonResponses[409]
    }
  },
  update: {
    tags: ['Users'],
    summary: 'Update user',
    params: idParam,
    body: {
      type: 'object',
      required: ['name', 'email', 'role'],
      properties: {
        name: { type: 'string', minLength: 1, example: 'Updated User' },
        email: { type: 'string', format: 'email', example: 'updated@example.com' },
        role: userRole
      }
    },
    response: {
      200: { description: 'Updated user', ...userWithRelations },
      ...commonResponses
    }
  },
  delete: {
    tags: ['Users'],
    summary: 'Delete user',
    description: 'Deletes a user and cascades deletion to this user projects and tasks.',
    params: idParam,
    response: {
      204: { description: 'User deleted', type: 'null' },
      404: commonResponses[404]
    }
  }
};

export const projectSchemas = {
  list: {
    tags: ['Projects'],
    summary: 'Get projects',
    description: 'Returns projects with owner and nested tasks. Supports pagination, sorting, search, owner and status filters.',
    querystring: {
      type: 'object',
      properties: {
        ...paginationQuery,
        ownerId: { type: 'integer', minimum: 1 },
        status: projectStatus
      }
    },
    response: {
      200: { description: 'Projects list', ...paginatedProjects }
    }
  },
  getById: {
    tags: ['Projects'],
    summary: 'Get project by id',
    params: idParam,
    response: {
      200: { description: 'Project details', ...projectWithRelations },
      404: commonResponses[404]
    }
  },
  create: {
    tags: ['Projects'],
    summary: 'Create project',
    body: {
      type: 'object',
      required: ['ownerId', 'title'],
      properties: {
        ownerId: { type: 'integer', minimum: 1, example: 1 },
        title: { type: 'string', minLength: 1, example: 'New Project' },
        description: { type: 'string', default: '', example: 'Demo project' },
        status: { ...projectStatus, default: 'draft' }
      }
    },
    response: {
      201: { description: 'Created project', ...projectWithRelations },
      400: commonResponses[400],
      404: commonResponses[404]
    }
  },
  update: {
    tags: ['Projects'],
    summary: 'Update project',
    params: idParam,
    body: {
      type: 'object',
      required: ['ownerId', 'title', 'description', 'status'],
      properties: {
        ownerId: { type: 'integer', minimum: 1, example: 1 },
        title: { type: 'string', minLength: 1, example: 'Updated Project' },
        description: { type: 'string', example: 'Updated description' },
        status: projectStatus
      }
    },
    response: {
      200: { description: 'Updated project', ...projectWithRelations },
      400: commonResponses[400],
      404: commonResponses[404]
    }
  },
  delete: {
    tags: ['Projects'],
    summary: 'Delete project',
    description: 'Deletes a project and cascades deletion to project tasks.',
    params: idParam,
    response: {
      204: { description: 'Project deleted', type: 'null' },
      404: commonResponses[404]
    }
  }
};

export const taskSchemas = {
  list: {
    tags: ['Tasks'],
    summary: 'Get tasks',
    description: 'Returns tasks with project and owner summaries. Supports pagination, sorting, search and filters.',
    querystring: {
      type: 'object',
      properties: {
        ...paginationQuery,
        projectId: { type: 'integer', minimum: 1 },
        status: taskStatus,
        priority: taskPriority
      }
    },
    response: {
      200: { description: 'Tasks list', ...paginatedTasks }
    }
  },
  getById: {
    tags: ['Tasks'],
    summary: 'Get task by id',
    params: idParam,
    response: {
      200: { description: 'Task details', ...taskWithRelations },
      404: commonResponses[404]
    }
  },
  listByProject: {
    tags: ['Tasks'],
    summary: 'Get project tasks',
    params: projectIdParam,
    querystring: {
      type: 'object',
      properties: {
        ...paginationQuery,
        status: taskStatus,
        priority: taskPriority
      }
    },
    response: {
      200: { description: 'Project tasks list', ...paginatedTasks },
      404: commonResponses[404]
    }
  },
  create: {
    tags: ['Tasks'],
    summary: 'Create task',
    body: {
      type: 'object',
      required: ['projectId', 'title'],
      properties: {
        projectId: { type: 'integer', minimum: 1, example: 1 },
        title: { type: 'string', minLength: 1, example: 'Write README' },
        status: { ...taskStatus, default: 'todo' },
        priority: { ...taskPriority, default: 'medium' },
        dueDate: { type: 'string', nullable: true, example: '2026-04-25' }
      }
    },
    response: {
      201: { description: 'Created task', ...taskWithRelations },
      400: commonResponses[400],
      404: commonResponses[404]
    }
  },
  createByProject: {
    tags: ['Tasks'],
    summary: 'Create task inside project',
    params: projectIdParam,
    body: {
      type: 'object',
      required: ['title'],
      properties: {
        title: { type: 'string', minLength: 1, example: 'Nested task' },
        status: { ...taskStatus, default: 'todo' },
        priority: { ...taskPriority, default: 'medium' },
        dueDate: { type: 'string', nullable: true, example: '2026-04-30' }
      }
    },
    response: {
      201: { description: 'Created project task', ...taskWithRelations },
      400: commonResponses[400],
      404: commonResponses[404]
    }
  },
  update: {
    tags: ['Tasks'],
    summary: 'Update task',
    params: idParam,
    body: {
      type: 'object',
      required: ['projectId', 'title', 'status', 'priority'],
      properties: {
        projectId: { type: 'integer', minimum: 1, example: 1 },
        title: { type: 'string', minLength: 1, example: 'Updated Task' },
        status: taskStatus,
        priority: taskPriority,
        dueDate: { type: 'string', nullable: true, example: '2026-04-26' }
      }
    },
    response: {
      200: { description: 'Updated task', ...taskWithRelations },
      400: commonResponses[400],
      404: commonResponses[404]
    }
  },
  delete: {
    tags: ['Tasks'],
    summary: 'Delete task',
    params: idParam,
    response: {
      204: { description: 'Task deleted', type: 'null' },
      404: commonResponses[404]
    }
  }
};
