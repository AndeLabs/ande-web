import { render, screen, fireEvent, act } from '@testing-library/react';
import { FaucetCard } from './faucet-card';

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useAccount: () => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
  }),
}));

const mockToast = jest.fn();
// Mock useToast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Droplet: () => <div />,
  CheckCircle2: () => <div />,
  AlertCircle: () => <div />,
  Loader2: () => <div />,
  Info: () => <div />,
}));

describe('FaucetCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component', () => {
    render(<FaucetCard />);
    expect(screen.getByText('AndeChain Testnet Faucet')).toBeInTheDocument();
  });

  it('allows a user to request tokens', async () => {
    // Mock the fetch API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: () => Promise.resolve({ success: true, txHash: '0x' }),
      })
    ) as jest.Mock;

    render(<FaucetCard />);

    // Click the request button
    await act(async () => {
      fireEvent.click(screen.getByText('Request 10 ANDE'));
    });

    // Check that the toast was called with a success message
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Success!',
      })
    );
  });

  it('handles failed requests', async () => {
    // Mock the fetch API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: () => Promise.resolve({ success: false, error: 'Test error' }),
      })
    ) as jest.Mock;

    render(<FaucetCard />);

    // Click the request button
    await act(async () => {
      fireEvent.click(screen.getByText('Request 10 ANDE'));
    });

    // Check that the toast was called with an error message
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Request Failed',
        description: 'Test error',
        variant: 'destructive',
      })
    );
  });
});
