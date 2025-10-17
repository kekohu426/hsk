import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { BookOpen, Target, TrendingUp } from 'lucide-react'

export default function HomePage() {
  // Mock data - in real app, this would come from API
  const wordsToReview = 12
  const latestArticle = {
    id: 1,
    title: 'My Weekend Plans',
    level: 'Beginner',
    newWords: 8,
    excerpt: 'Learn how to talk about weekend activities in Chinese...'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Hi there, welcome back! 👋
        </h1>
        <p className="text-xl text-gray-600">
          Continue your Chinese learning journey today
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Today's Goal Card */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-600" />
                  TODAY'S GOAL
                </CardTitle>
                <CardDescription className="mt-2 text-base">
                  You have <span className="font-semibold text-blue-600">{wordsToReview} words</span> to review
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link to="/learn">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg">
                START LEARNING
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Words Mastered</span>
                <span className="text-2xl font-bold text-green-600">350</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Study Streak</span>
                <span className="text-2xl font-bold text-orange-600">7 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Study Time</span>
                <span className="text-2xl font-bold text-purple-600">25h 30m</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latest Article Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Article for You</h2>
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    {latestArticle.level}
                  </span>
                  <span className="text-sm text-gray-500">
                    {latestArticle.newWords} new words
                  </span>
                </div>
                <CardTitle className="text-2xl mb-2">{latestArticle.title}</CardTitle>
                <CardDescription className="text-base">
                  {latestArticle.excerpt}
                </CardDescription>
              </div>
              <BookOpen className="w-12 h-12 text-purple-500 ml-4" />
            </div>
          </CardHeader>
          <CardContent>
            <Link to={`/article/${latestArticle.id}`}>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                READ NOW
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/hsk-library" className="group">
          <Card className="hover:shadow-lg transition-all hover:border-blue-300">
            <CardHeader>
              <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                Browse HSK Vocabulary
              </CardTitle>
              <CardDescription>
                Systematic learning from HSK 1-6
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/text-analyzer" className="group">
          <Card className="hover:shadow-lg transition-all hover:border-green-300">
            <CardHeader>
              <CardTitle className="text-lg group-hover:text-green-600 transition-colors">
                Analyze Your Text
              </CardTitle>
              <CardDescription>
                Extract new words from any Chinese text
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/word-bank" className="group">
          <Card className="hover:shadow-lg transition-all hover:border-orange-300">
            <CardHeader>
              <CardTitle className="text-lg group-hover:text-orange-600 transition-colors">
                Manage Your Words
              </CardTitle>
              <CardDescription>
                Review and organize your vocabulary
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}

