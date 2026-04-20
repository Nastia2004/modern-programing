export const users = [
  {
    id: 1,
    name: 'Ostap Mamchur',
    email: 'ostap@example.com',
    role: 'student',
    createdAt: '2026-04-01T09:00:00.000Z'
  },
  {
    id: 2,
    name: 'Iryna Kovalenko',
    email: 'iryna@example.com',
    role: 'mentor',
    createdAt: '2026-04-02T10:30:00.000Z'
  },
  {
    id: 3,
    name: 'Andrii Shevchenko',
    email: 'andrii@example.com',
    role: 'student',
    createdAt: '2026-04-03T13:15:00.000Z'
  }
];

export const projects = [
  {
    id: 1,
    ownerId: 1,
    title: 'REST API Lab',
    description: 'Backend for university laboratory work.',
    status: 'active',
    createdAt: '2026-04-04T11:00:00.000Z'
  },
  {
    id: 2,
    ownerId: 1,
    title: 'Course Planner',
    description: 'Small service for planning university courses.',
    status: 'draft',
    createdAt: '2026-04-05T12:00:00.000Z'
  },
  {
    id: 3,
    ownerId: 2,
    title: 'Mentor Dashboard',
    description: 'Dashboard mock for mentors.',
    status: 'completed',
    createdAt: '2026-04-06T16:45:00.000Z'
  }
];

export const tasks = [
  {
    id: 1,
    projectId: 1,
    title: 'Create Fastify server',
    status: 'done',
    priority: 'high',
    dueDate: '2026-04-10',
    createdAt: '2026-04-04T12:00:00.000Z'
  },
  {
    id: 2,
    projectId: 1,
    title: 'Add CRUD routes',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-04-12',
    createdAt: '2026-04-04T12:30:00.000Z'
  },
  {
    id: 3,
    projectId: 2,
    title: 'Prepare mock data',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-04-15',
    createdAt: '2026-04-05T14:20:00.000Z'
  },
  {
    id: 4,
    projectId: 3,
    title: 'Review student submissions',
    status: 'done',
    priority: 'low',
    dueDate: '2026-04-18',
    createdAt: '2026-04-06T17:15:00.000Z'
  }
];

export const counters = {
  users: 4,
  projects: 4,
  tasks: 5
};
