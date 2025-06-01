import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from './Dashboard';
import { AccountProvider } from '../contexts/AccountContext';
import { ParticleProvider } from '../contexts/ParticleContext';

jest.mock('../contexts/AccountContext', () => ({
  useAccount: () => ({
    account: '0x123...',
    balance: '10',
    logout: jest.fn(),
    isLoading: false,
    error: null,
  }),
}));

jest.mock('../contexts/ParticleContext', () => ({
  useParticle: () => ({
    particle: {
      sendTransaction: jest.fn(),
    },
  }),
}));

describe('Dashboard Component', () => {
  it('renders dashboard with account information', () => {
    render(
      <ParticleProvider>
        <AccountProvider>
          <Dashboard />
        </AccountProvider>
      </ParticleProvider>
    );

    expect(screen.getByText('Smart Account Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Account Address: 0x123...')).toBeInTheDocument();
    expect(screen.getByText('Balance: 10 ZETA')).toBeInTheDocument();
  });

  it('allows sending transactions', async () => {
    const mockSendTransaction = jest.fn().mockResolvedValue('0xtransactionHash');
    jest.mocked(useParticle).mockReturnValue({
      particle: {
        sendTransaction: mockSendTransaction,
      },
    });

    render(
      <ParticleProvider>
        <AccountProvider>
          <Dashboard />
        </AccountProvider>
      </ParticleProvider>
    );

    const recipientInput = screen.getByLabelText('Recipient Address');
    const amountInput = screen.getByLabelText('Amount (ZETA)');
    const sendButton = screen.getByText('Send Transaction');

    await userEvent.type(recipientInput, '0xrecipientAddress');
    await userEvent.type(amountInput, '1');
    await userEvent.click(sendButton);

    expect(mockSendTransaction).toHaveBeenCalledWith({
      to: '0xrecipientAddress',
      value: '1000000000000000000',
      data: '0x',
    });
  });

  it('shows loading state during transaction', async () => {
    const mockSendTransaction = jest.fn().mockResolvedValue('0xtransactionHash');
    jest.mocked(useParticle).mockReturnValue({
      particle: {
        sendTransaction: mockSendTransaction,
      },
    });

    render(
      <ParticleProvider>
        <AccountProvider>
          <Dashboard />
        </AccountProvider>
      </ParticleProvider>
    );

    const sendButton = screen.getByText('Send Transaction');
    fireEvent.click(sendButton);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error message when transaction fails', async () => {
    const mockSendTransaction = jest.fn().mockRejectedValue(new Error('Transaction failed'));
    jest.mocked(useParticle).mockReturnValue({
      particle: {
        sendTransaction: mockSendTransaction,
      },
    });

    render(
      <ParticleProvider>
        <AccountProvider>
          <Dashboard />
        </AccountProvider>
      </ParticleProvider>
    );

    const sendButton = screen.getByText('Send Transaction');
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Transaction failed')).toBeInTheDocument();
    });
  });

  it('logs out successfully', async () => {
    const mockLogout = jest.fn();
    jest.mocked(useAccount).mockReturnValue({
      account: '0x123...',
      balance: '10',
      logout: mockLogout,
      isLoading: false,
      error: null,
    });

    render(
      <ParticleProvider>
        <AccountProvider>
          <Dashboard />
        </AccountProvider>
      </ParticleProvider>
    );

    const logoutButton = screen.getByText('Logout');
    await userEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });
});
