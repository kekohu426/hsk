import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from '@/app/(auth)/login/page';
import { authApi } from '@/lib/api';

// Mock the API
jest.mock('@/lib/api', () => ({
  authApi: {
    login: jest.fn(),
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock zustand store
jest.mock('@/lib/store', () => ({
  useAuthStore: () => ({
    setAuth: jest.fn(),
  }),
}));

describe('LoginPage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  const renderLoginPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <LoginPage />
      </QueryClientProvider>
    );
  };

  it('should render login form', () => {
    renderLoginPage();
    
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should have test account pre-filled', () => {
    renderLoginPage();
    
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('test123');
  });

  it('should display test mode indicator', () => {
    renderLoginPage();
    
    expect(screen.getByText('🧪 测试模式')).toBeInTheDocument();
    expect(screen.getByText(/已自动填充测试账号/)).toBeInTheDocument();
  });

  it('should allow form submission with pre-filled data', async () => {
    const mockLoginResponse = {
      data: {
        user: { id: '1', email: 'test@example.com', username: 'testuser' },
        token: 'mock-token',
      },
    };
    
    (authApi.login as jest.Mock).mockResolvedValue(mockLoginResponse);
    
    renderLoginPage();
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalled();
    });
  });

  it('should call login API on form submission', async () => {
    const mockLoginResponse = {
      data: {
        user: { id: '1', email: 'test@example.com', username: 'testuser' },
        token: 'mock-token',
      },
    };
    
    (authApi.login as jest.Mock).mockResolvedValue(mockLoginResponse);
    
    renderLoginPage();
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'test123',
      });
    });
  });

  it('should display error message on login failure', async () => {
    (authApi.login as jest.Mock).mockRejectedValue({
      response: {
        data: {
          error: 'Invalid credentials',
        },
      },
    });
    
    renderLoginPage();
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});

