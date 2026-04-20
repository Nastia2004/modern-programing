import MetricCard from '../components/MetricCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useApiData } from '../state/ApiContext.jsx';

export default function DashboardPage() {
  const { users, projects, tasks, selectedProjectId, setSelectedProjectId, isLoading } = useApiData();
  const visibleTasks = selectedProjectId === 'all'
    ? tasks
    : tasks.filter((task) => task.projectId === Number(selectedProjectId));
  const doneTasks = tasks.filter((task) => task.status === 'done').length;
  const activeProjects = projects.filter((project) => project.status === 'active').length;

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Workspace dashboard</h2>
        </div>
        <select value={selectedProjectId} onChange={(event) => setSelectedProjectId(event.target.value)}>
          <option value="all">All projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>{project.title}</option>
          ))}
        </select>
      </header>

      {isLoading ? <div className="empty-state">Loading data...</div> : null}

      <div className="metrics-grid">
        <MetricCard label="Users" value={users.length} detail="Loaded from /users" />
        <MetricCard label="Projects" value={projects.length} detail={`${activeProjects} active`} />
        <MetricCard label="Tasks" value={tasks.length} detail={`${doneTasks} completed`} />
      </div>

      <div className="content-grid">
        <section className="panel">
          <div className="panel-header">
            <h3>Recent tasks</h3>
            <span>{visibleTasks.length} shown</span>
          </div>

          <div className="item-list">
            {visibleTasks.slice(0, 6).map((task) => (
              <article className="list-item" key={task.id}>
                <div>
                  <strong>{task.title}</strong>
                  <small>{task.project?.title || `Project #${task.projectId}`}</small>
                </div>
                <StatusBadge value={task.status} />
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>Projects</h3>
            <span>Nested data</span>
          </div>

          <div className="item-list">
            {projects.slice(0, 5).map((project) => (
              <article className="list-item" key={project.id}>
                <div>
                  <strong>{project.title}</strong>
                  <small>{project.owner?.name || 'No owner'} · {project.tasks.length} tasks</small>
                </div>
                <StatusBadge value={project.status} />
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
