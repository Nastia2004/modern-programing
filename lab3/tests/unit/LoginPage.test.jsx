import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginPage from '../../src/pages/LoginPage.jsx';

const loginMock = vi.fn();

vi.mock('../../src/state/AuthContext.jsx', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    login: loginMock,
    error: ''
  })
}));

describe('LoginPage', () => {
  beforeEach(() => {
    loginMock.mockReset();
  });

  it('submits demo credentials', async () => {
    loginMock.mockResolvedValue({ id: 1 });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(loginMock).toHaveBeenCalledWith({
      email: 'anastasiia@example.com',
      password: 'password123'
    });
  });

  it('shows login error message', async () => {
    loginMock.mockRejectedValue(new Error('Invalid email or password'));

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument();
  });
});
