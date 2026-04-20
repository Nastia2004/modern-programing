import { useMemo, useState } from 'react';
import StatusBadge from '../components/StatusBadge.jsx';
import { useApiData } from '../state/ApiContext.jsx';

export default function TasksPage() {
  const {
    projects,
    tasks,
    selectedProjectId,
    setSelectedProjectId,
    createTask,
    updateTask,
    deleteTask
  } = useApiData();
  const [form, setForm] = useState({
    projectId: '',
    title: '',
    status: 'todo',
    priority: 'medium',
    dueDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const visibleTasks = useMemo(() => {
    if (selectedProjectId === 'all') {
      return tasks;
    }

    return tasks.filter((task) => task.projectId === Number(selectedProjectId));
  }, [tasks, selectedProjectId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await createTask({
        ...form,
        projectId: Number(form.projectId || projects[0]?.id),
        dueDate: form.dueDate || null
      });
      setForm((current) => ({ ...current, title: '', dueDate: '' }));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleStatus(task) {
    const nextStatus = task.status === 'done' ? 'todo' : 'done';

    await updateTask(task.id, {
      projectId: task.projectId,
      title: task.title,
      status: nextStatus,
      priority: task.priority,
      dueDate: task.dueDate
    });
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Execution</p>
          <h2>Tasks</h2>
        </div>
        <select value={selectedProjectId} onChange={(event) => setSelectedProjectId(event.target.value)}>
          <option value="all">All projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>{project.title}</option>
          ))}
        </select>
      </header>

      <section className="panel">
        <div className="panel-header">
          <h3>Create task</h3>
          <span>POST /tasks</span>
        </div>

        <form className="inline-form" onSubmit={handleSubmit}>
          <select
            value={form.projectId || projects[0]?.id || ''}
            onChange={(event) => setForm((current) => ({ ...current, projectId: event.target.value }))}
            required
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.title}</option>
            ))}
          </select>
          <input
            placeholder="Task title"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            required
          />
          <select
            value={form.priority}
            onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            value={form.dueDate}
            onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
          />
          <button className="button primary" type="submit" disabled={isSubmitting || projects.length === 0}>
            Create
          </button>
        </form>
      </section>

      <div className="item-list">
        {visibleTasks.map((task) => (
          <article className="list-item large" key={task.id}>
            <div>
              <strong>{task.title}</strong>
              <p>{task.project?.title || `Project #${task.projectId}`}</p>
              <small>Priority: {task.priority} · Due: {task.dueDate || 'not set'}</small>
            </div>
            <div className="item-actions">
              <StatusBadge value={task.status} />
              <button className="button secondary compact" type="button" onClick={() => toggleStatus(task)}>
                Toggle
              </button>
              <button className="button danger compact" type="button" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
