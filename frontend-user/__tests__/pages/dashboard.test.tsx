import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardPage from '@/app/dashboard/page';
import { learnApi, userApi } from '@/lib/api';

// Mock the APIs
jest.mock('@/lib/api', () => ({
  learnApi: {
    getStats: jest.fn(),
  },
  userApi: {
    getUserWords: jest.fn(),
  },
}));

// Mock zustand store
jest.mock('@/lib/store', () => ({
  useAuthStore: () => ({
    user: {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      role: 'USER',
    },
    isAuthenticated: true,
  }),
}));

describe('DashboardPage', () => {
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

  const renderDashboard = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>
    );
  };

  const mockStatsData = {
    totalWords: 150,
    masteredWords: 45,
    learningWords: 75,
    newWords: 30,
    todayReviews: 12,
    nextReviewCount: 8,
    streak: 5,
    studyTime: 3600,
  };

  const mockWordsData = {
    words: [
      {
        id: '1',
        wordId: '1',
        word: { simplified: '你好', pinyin: 'nǐ hǎo', meaning: 'hello' },
        status: 'LEARNING',
        repetitions: 3,
      },
    ],
    total: 1,
    page: 1,
    totalPages: 1,
  };

  it('should render dashboard with greeting', () => {
    (learnApi.getStats as jest.Mock).mockResolvedValue({ data: mockStatsData });
    (userApi.getUserWords as jest.Mock).mockResolvedValue({ data: mockWordsData });

    renderDashboard();
    
    expect(screen.getByText(/Good/)).toBeInTheDocument();
    expect(screen.getByText(/testuser/)).toBeInTheDocument();
  });

  it('should display learning statistics', async () => {
    (learnApi.getStats as jest.Mock).mockResolvedValue({ data: mockStatsData });
    (userApi.getUserWords as jest.Mock).mockResolvedValue({ data: mockWordsData });

    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument(); // Total words
    });
  });

  it('should show quick action cards', () => {
    (learnApi.getStats as jest.Mock).mockResolvedValue({ data: mockStatsData });
    (userApi.getUserWords as jest.Mock).mockResolvedValue({ data: mockWordsData });

    renderDashboard();
    
    expect(screen.getByText('Review Words')).toBeInTheDocument();
    expect(screen.getByText('Daily Article')).toBeInTheDocument();
    expect(screen.getByText('HSK Library')).toBeInTheDocument();
  });

  it('should display next review count', async () => {
    (learnApi.getStats as jest.Mock).mockResolvedValue({ data: mockStatsData });
    (userApi.getUserWords as jest.Mock).mockResolvedValue({ data: mockWordsData });

    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText(/8 words ready for review/)).toBeInTheDocument();
    });
  });

  it('should fetch user learning stats on mount', async () => {
    (learnApi.getStats as jest.Mock).mockResolvedValue({ data: mockStatsData });
    (userApi.getUserWords as jest.Mock).mockResolvedValue({ data: mockWordsData });

    renderDashboard();
    
    await waitFor(() => {
      expect(learnApi.getStats).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle loading state', () => {
    (learnApi.getStats as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ data: mockStatsData }), 100))
    );
    (userApi.getUserWords as jest.Mock).mockResolvedValue({ data: mockWordsData });

    renderDashboard();
    
    // Should render without crashing during loading
    expect(screen.getByText(/testuser/)).toBeInTheDocument();
  });

  it('should handle API error gracefully', async () => {
    (learnApi.getStats as jest.Mock).mockRejectedValue(new Error('API Error'));
    (userApi.getUserWords as jest.Mock).mockRejectedValue(new Error('API Error'));

    renderDashboard();
    
    // Should still render the basic structure
    await waitFor(() => {
      expect(screen.getByText(/testuser/)).toBeInTheDocument();
    });
  });
});

