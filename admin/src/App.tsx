import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AdminLayout } from './components/layout/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ArticleGenerator } from './pages/ArticleGenerator';
import { ArticleManagement } from './pages/ArticleManagement';
import { ArticleEdit } from './pages/ArticleEdit';
import { WordManagement } from './pages/WordManagement';
import { WordPreview } from './pages/WordPreview';
import { UserManagement } from './pages/UserManagement';
import { UserLearningStats } from './pages/UserLearningStats';
import { UserLearningDetails } from './pages/UserLearningDetails';
import { AIConfig } from './pages/AIConfig';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="article-generator" element={<ArticleGenerator />} />
          <Route path="articles" element={<ArticleManagement />} />
          <Route path="articles/edit/:id" element={<ArticleEdit />} />
          <Route path="words" element={<WordManagement />} />
          <Route path="words/preview/:id" element={<WordPreview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="user-learning-stats" element={<UserLearningStats />} />
          <Route path="users/:userId/learning-details" element={<UserLearningDetails />} />
          <Route path="ai-config" element={<AIConfig />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
