import { projects, tasks, users } from '../data/store.js';

export function attachUserRelations(user) {
  const userProjects = projects
    .filter((project) => project.ownerId === user.id)
    .map(attachProjectRelations);

  return {
    ...user,
    projects: userProjects
  };
}

export function attachProjectRelations(project) {
  const owner = users.find((user) => user.id === project.ownerId);
  const projectTasks = tasks.filter((task) => task.projectId === project.id);

  return {
    ...project,
    owner: owner
      ? {
          id: owner.id,
          name: owner.name,
          email: owner.email
        }
      : null,
    tasks: projectTasks
  };
}

export function attachTaskRelations(task) {
  const project = projects.find((item) => item.id === task.projectId);
  const owner = project ? users.find((user) => user.id === project.ownerId) : null;

  return {
    ...task,
    project: project
      ? {
          id: project.id,
          title: project.title,
          status: project.status
        }
      : null,
    owner: owner
      ? {
          id: owner.id,
          name: owner.name
        }
      : null
  };
}
