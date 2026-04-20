import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login, error: sessionError } = useAuth();
  const [form, setForm] = useState({
    email: 'anastasiia@example.com',
    password: 'password123'
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await login(form);
      navigate('/');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-screen">
      <section className="login-panel">
        <p className="eyebrow">React + Fastify</p>
        <h1>Lab 3 Client</h1>
        <p className="muted">
          Sign in with the mock account and manage users, projects and tasks from the lab2 API.
        </p>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </label>

          {(error || sessionError) ? <div className="error-banner">{error || sessionError}</div> : null}

          <button className="button primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="demo-note">
          Demo: <strong>anastasiia@example.com</strong> / <strong>password123</strong>
        </div>
      </section>
    </main>
  );
}
