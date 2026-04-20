import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createApiClient } from '../api/client.js';
import { useAuth } from './AuthContext.jsx';

const ApiContext = createContext(null);

export function ApiProvider({ children }) {
  const { token, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const api = useMemo(() => createApiClient(token), [token]);

  async function runRequest(action) {
    try {
      setError('');
      return await action();
    } catch (requestError) {
      const message = requestError.statusCode
        ? `${requestError.statusCode}: ${requestError.message}`
        : requestError.message;

      if (requestError.statusCode === 401) {
        logout();
      }

      setError(message);
      throw requestError;
    }
  }

  async function refreshData() {
    setIsLoading(true);

    try {
      await runRequest(async () => {
        const [usersResponse, projectsResponse, tasksResponse] = await Promise.all([
          api.getUsers('?limit=100&sortBy=name&order=asc'),
          api.getProjects('?limit=100&sortBy=createdAt&order=desc'),
          api.getTasks('?limit=100&sortBy=createdAt&order=desc')
        ]);

        setUsers(usersResponse.data);
        setProjects(projectsResponse.data);
        setTasks(tasksResponse.data);
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refreshData();
  }, [api]);

  async function createProject(payload) {
    await runRequest(() => api.createProject(payload));
    await refreshData();
  }

  async function deleteProject(id) {
    await runRequest(() => api.deleteProject(id));
    await refreshData();
  }

  async function createTask(payload) {
    await runRequest(() => api.createTask(payload));
    await refreshData();
  }

  async function updateTask(id, payload) {
    await runRequest(() => api.updateTask(id, payload));
    await refreshData();
  }

  async function deleteTask(id) {
    await runRequest(() => api.deleteTask(id));
    await refreshData();
  }

  const value = useMemo(
    () => ({
      users,
      projects,
      tasks,
      selectedProjectId,
      setSelectedProjectId,
      isLoading,
      error,
      refreshData,
      createProject,
      deleteProject,
      createTask,
      updateTask,
      deleteTask
    }),
    [users, projects, tasks, selectedProjectId, isLoading, error]
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApiData() {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error('useApiData must be used inside ApiProvider');
  }

  return context;
}
