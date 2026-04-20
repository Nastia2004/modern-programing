import { useMemo, useState } from 'react';
import StatusBadge from '../components/StatusBadge.jsx';
import { useApiData } from '../state/ApiContext.jsx';

export default function ProjectsPage() {
  const { users, projects, createProject, deleteProject } = useApiData();
  const [status, setStatus] = useState('all');
  const [form, setForm] = useState({
    ownerId: 1,
    title: '',
    description: '',
    status: 'draft'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProjects = useMemo(() => {
    if (status === 'all') {
      return projects;
    }

    return projects.filter((project) => project.status === status);
  }, [projects, status]);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await createProject({
        ...form,
        ownerId: Number(form.ownerId)
      });
      setForm((current) => ({ ...current, title: '', description: '' }));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Planning</p>
          <h2>Projects</h2>
        </div>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </header>

      <section className="panel">
        <div className="panel-header">
          <h3>Create project</h3>
          <span>POST /projects</span>
        </div>

        <form className="inline-form" onSubmit={handleSubmit}>
          <input
            placeholder="Project title"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            required
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            required
          />
          <select
            value={form.ownerId}
            onChange={(event) => setForm((current) => ({ ...current, ownerId: event.target.value }))}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
          <select
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <button className="button primary" type="submit" disabled={isSubmitting}>
            Create
          </button>
        </form>
      </section>

      <div className="item-list">
        {filteredProjects.map((project) => (
          <article className="list-item large" key={project.id}>
            <div>
              <strong>{project.title}</strong>
              <p>{project.description}</p>
              <small>{project.owner?.name || 'No owner'} · {project.tasks.length} tasks</small>
            </div>
            <div className="item-actions">
              <StatusBadge value={project.status} />
              <button className="button danger compact" type="button" onClick={() => deleteProject(project.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
