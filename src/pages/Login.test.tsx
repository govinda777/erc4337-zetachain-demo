import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import { AccountProvider } from '../contexts/AccountContext';
import { ParticleProvider } from '../contexts/ParticleContext';

jest.mock('../contexts/AccountContext', () => ({
  useAccount: () => ({
    login: jest.fn(),
    isLoading: false,
    error: null,
  }),
}));

describe('Login Component', () => {
  it('renders login page with all social login options', () => {
    render(
      <ParticleProvider>
        <AccountProvider>
          <Login />
        </AccountProvider>
      </ParticleProvider>
    );

    expect(screen.getByText('ERC-4337 Smart Account Demo')).toBeInTheDocument();
    expect(screen.getByText('Login with Google')).toBeInTheDocument();
    expect(screen.getByText('Login with Twitter')).toBeInTheDocument();
    expect(screen.getByText('Login with GitHub')).toBeInTheDocument();
    expect(screen.getByText('Login with Email')).toBeInTheDocument();
  });

  it('calls login function when clicking social buttons', async () => {
    const mockLogin = jest.fn();
    jest.mocked(useAccount).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
    });

    render(
      <ParticleProvider>
        <AccountProvider>
          <Login />
        </AccountProvider>
      </ParticleProvider>
    );

    const googleButton = screen.getByText('Login with Google');
    await userEvent.click(googleButton);

    expect(mockLogin).toHaveBeenCalledWith('google');
  });

  it('shows error message when login fails', async () => {
    const mockLogin = jest.fn().mockRejectedValue(new Error('Login failed'));
    jest.mocked(useAccount).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: 'Login failed',
    });

    render(
      <ParticleProvider>
        <AccountProvider>
          <Login />
        </AccountProvider>
      </ParticleProvider>
    );

    expect(screen.getByText('Login failed')).toBeInTheDocument();
  });

  it('disables buttons while loading', async () => {
    const mockLogin = jest.fn();
    jest.mocked(useAccount).mockReturnValue({
      login: mockLogin,
      isLoading: true,
      error: null,
    });

    render(
      <ParticleProvider>
        <AccountProvider>
          <Login />
        </AccountProvider>
      </ParticleProvider>
    );

    const googleButton = screen.getByText('Login with Google');
    expect(googleButton).toBeDisabled();
  });
});
