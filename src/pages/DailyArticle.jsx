import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { BookOpen, Clock, Award } from 'lucide-react'
import { useState } from 'react'

export default function DailyArticle() {
  const [filter, setFilter] = useState('all')

  // Mock data - in real app, this would come from API
  const articles = [
    {
      id: 1,
      title: 'My Weekend Plans',
      level: 'Beginner',
      excerpt: 'Learn how to talk about weekend activities in Chinese. This article covers common phrases for making plans with friends.',
      newWords: 8,
      readTime: '5 min',
      date: '2025-10-17'
    },
    {
      id: 2,
      title: 'Shopping at the Market',
      level: 'Beginner',
      excerpt: 'Discover essential vocabulary for shopping at a Chinese market. Practice bargaining and asking for prices.',
      newWords: 12,
      readTime: '6 min',
      date: '2025-10-16'
    },
    {
      id: 3,
      title: 'Chinese Tea Culture',
      level: 'Intermediate',
      excerpt: 'Explore the rich history and traditions of Chinese tea culture. Learn about different types of tea and their preparation.',
      newWords: 15,
      readTime: '8 min',
      date: '2025-10-15'
    },
    {
      id: 4,
      title: 'Traveling by Train',
      level: 'Intermediate',
      excerpt: 'Master the vocabulary needed for traveling by train in China. From buying tickets to finding your seat.',
      newWords: 14,
      readTime: '7 min',
      date: '2025-10-14'
    },
    {
      id: 5,
      title: 'Ordering Food in a Restaurant',
      level: 'Beginner',
      excerpt: 'Learn how to order food in a Chinese restaurant with confidence. Essential phrases for dining out.',
      newWords: 10,
      readTime: '5 min',
      date: '2025-10-13'
    },
  ]

  const filteredArticles = filter === 'all' 
    ? articles 
    : articles.filter(article => article.level.toLowerCase() === filter)

  const getLevelColor = (level) => {
    return level === 'Beginner' 
      ? 'bg-green-100 text-green-700 border-green-200' 
      : 'bg-blue-100 text-blue-700 border-blue-200'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Daily Articles</h1>
        <p className="text-xl text-gray-600">
          Read engaging Chinese articles and expand your vocabulary
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-8">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-purple-600 hover:bg-purple-700' : ''}
        >
          All Articles
        </Button>
        <Button
          variant={filter === 'beginner' ? 'default' : 'outline'}
          onClick={() => setFilter('beginner')}
          className={filter === 'beginner' ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          Beginner
        </Button>
        <Button
          variant={filter === 'intermediate' ? 'default' : 'outline'}
          onClick={() => setFilter('intermediate')}
          className={filter === 'intermediate' ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          Intermediate
        </Button>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredArticles.map((article) => (
          <Card 
            key={article.id} 
            className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500 hover:border-l-purple-600"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getLevelColor(article.level)}`}>
                      {article.level}
                    </span>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        {article.newWords} new words
                      </span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl mb-3 hover:text-purple-600 transition-colors">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600">
                    {article.excerpt}
                  </CardDescription>
                </div>
                <BookOpen className="w-16 h-16 text-purple-400 ml-6 flex-shrink-0" />
              </div>
            </CardHeader>
            <CardContent>
              <Link to={`/article/${article.id}`}>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                  Read Article
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">No articles found for this level</p>
        </div>
      )}
    </div>
  )
}

