import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Pages (will be created in Iteration 7)
// import LoginPage from './pages/LoginPage'
// import DashboardPage from './pages/DashboardPage'
// import AdminLayout from './components/layout/AdminLayout'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Temporary welcome route */}
            <Route
              path="/"
              element={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-primary">
                      ChineseMaster Admin
                    </h1>
                    <p className="text-muted-foreground">
                      Admin frontend is ready! Pages will be created in Iteration 7.
                    </p>
                    <div className="space-y-2 text-sm">
                      <p>✅ Vite configured</p>
                      <p>✅ TypeScript configured</p>
                      <p>✅ Tailwind CSS configured</p>
                      <p>✅ React Router configured</p>
                      <p>✅ React Query configured</p>
                      <p>⏳ Pages and components coming in Iteration 7</p>
                    </div>
                  </div>
                </div>
              }
            />

            {/* Redirect all other routes to home for now */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
