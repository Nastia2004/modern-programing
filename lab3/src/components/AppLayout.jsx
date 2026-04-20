import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';
import { useApiData } from '../state/ApiContext.jsx';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { error, refreshData, isLoading } = useApiData();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Lab 3</p>
          <h1>API Client</h1>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/users">Users</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/tasks">Tasks</NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <span>{user?.name}</span>
            <small>{user?.email}</small>
          </div>
          <button className="button secondary" type="button" onClick={refreshData} disabled={isLoading}>
            Refresh
          </button>
          <button className="button danger" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-panel">
        {error ? <div className="error-banner">{error}</div> : null}
        <Outlet />
      </main>
    </div>
  );
}
