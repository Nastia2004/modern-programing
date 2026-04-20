import { useMemo, useState } from 'react';
import { useApiData } from '../state/ApiContext.jsx';

export default function UsersPage() {
  const { users } = useApiData();
  const [role, setRole] = useState('all');

  const filteredUsers = useMemo(() => {
    if (role === 'all') {
      return users;
    }

    return users.filter((user) => user.role === role);
  }, [users, role]);

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">People</p>
          <h2>Users</h2>
        </div>
        <select value={role} onChange={(event) => setRole(event.target.value)}>
          <option value="all">All roles</option>
          <option value="student">Students</option>
          <option value="mentor">Mentors</option>
          <option value="admin">Admins</option>
        </select>
      </header>

      <div className="card-grid">
        {filteredUsers.map((user) => (
          <article className="entity-card" key={user.id}>
            <div className="avatar">{user.name.slice(0, 1)}</div>
            <div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <small>{user.role} · {user.projects.length} projects</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
