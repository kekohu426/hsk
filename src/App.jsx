import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { BookOpen, FileText, Search, GraduationCap, Library, User } from 'lucide-react'
import './App.css'

// Import pages
import HomePage from './pages/HomePage'
import DailyArticle from './pages/DailyArticle'
import ArticleDetail from './pages/ArticleDetail'
import TextAnalyzer from './pages/TextAnalyzer'
import LearnCenter from './pages/LearnCenter'
import WordBank from './pages/WordBank'
import HSKLibrary from './pages/HSKLibrary'
import HSKLevel from './pages/HSKLevel'
import WordDetail from './pages/WordDetail'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'

function Navigation() {
  const location = useLocation()
  
  const navItems = [
    { path: '/daily-article', icon: BookOpen, label: 'Daily Article' },
    { path: '/learn', icon: GraduationCap, label: 'Learn' },
    { path: '/text-analyzer', icon: Search, label: 'Text Analyzer' },
    { path: '/word-bank', icon: FileText, label: 'Word Bank' },
    { path: '/hsk-library', icon: Library, label: 'HSK Library' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  // Hide navigation on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ChineseMaster
              </span>
            </Link>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path || 
                             (item.path === '/daily-article' && location.pathname.startsWith('/article/')) ||
                             (item.path === '/hsk-library' && location.pathname.startsWith('/hsk/'))
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1.5" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/daily-article" element={<DailyArticle />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/text-analyzer" element={<TextAnalyzer />} />
          <Route path="/learn" element={<LearnCenter />} />
          <Route path="/word-bank" element={<WordBank />} />
          <Route path="/hsk-library" element={<HSKLibrary />} />
          <Route path="/hsk/level/:level" element={<HSKLevel />} />
          <Route path="/word/:id" element={<WordDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

