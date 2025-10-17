import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { BookOpen, TrendingUp, Award } from 'lucide-react'

export default function HSKLibrary() {
  const hskLevels = [
    {
      level: 1,
      words: 150,
      description: 'Basic everyday expressions and simple phrases',
      color: 'from-green-400 to-green-600',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-50'
    },
    {
      level: 2,
      words: 300,
      description: 'Simple conversations about familiar topics',
      color: 'from-blue-400 to-blue-600',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      level: 3,
      words: 600,
      description: 'Communicate in most daily situations',
      color: 'from-purple-400 to-purple-600',
      borderColor: 'border-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      level: 4,
      words: 1200,
      description: 'Discuss a wide range of topics fluently',
      color: 'from-orange-400 to-orange-600',
      borderColor: 'border-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      level: 5,
      words: 2500,
      description: 'Read newspapers and magazines in Chinese',
      color: 'from-red-400 to-red-600',
      borderColor: 'border-red-500',
      bgColor: 'bg-red-50'
    },
    {
      level: 6,
      words: 5000,
      description: 'Comprehend and express yourself effectively',
      color: 'from-pink-400 to-pink-600',
      borderColor: 'border-pink-500',
      bgColor: 'bg-pink-50'
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">HSK Vocabulary Library</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Master Chinese systematically with the official HSK (Hanyu Shuiping Kaoshi) vocabulary standards. 
          From beginner to advanced, build your foundation step by step.
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">10,000+</p>
                <p className="text-gray-600">Total Words</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">6 Levels</p>
                <p className="text-gray-600">Progressive Learning</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">Official</p>
                <p className="text-gray-600">HSK Standard</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* HSK Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hskLevels.map((hsk) => (
          <Card 
            key={hsk.level} 
            className={`border-2 ${hsk.borderColor} hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
          >
            <CardHeader className={hsk.bgColor}>
              <div className="flex items-center justify-between mb-4">
                <div className={`text-6xl font-bold bg-gradient-to-r ${hsk.color} bg-clip-text text-transparent`}>
                  HSK {hsk.level}
                </div>
                <div className={`px-4 py-2 bg-white rounded-full shadow-md border-2 ${hsk.borderColor}`}>
                  <p className="text-2xl font-bold text-gray-900">{hsk.words}</p>
                  <p className="text-xs text-gray-600">words</p>
                </div>
              </div>
              <CardTitle className="text-xl">{hsk.description}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Link to={`/hsk/level/${hsk.level}`}>
                <Button 
                  className={`w-full bg-gradient-to-r ${hsk.color} hover:opacity-90 text-white font-semibold py-6 text-lg shadow-lg`}
                >
                  Browse HSK {hsk.level} Words
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Learning Path Section */}
      <Card className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-2xl">Recommended Learning Path</CardTitle>
          <CardDescription className="text-base">
            Follow the HSK levels in order for the best learning experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between flex-wrap gap-4">
            {hskLevels.map((hsk, index) => (
              <div key={hsk.level} className="flex items-center">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${hsk.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                  {hsk.level}
                </div>
                {index < hskLevels.length - 1 && (
                  <div className="w-8 h-1 bg-gray-300 mx-2"></div>
                )}
              </div>
            ))}
          </div>
          <p className="mt-6 text-gray-600">
            Start with HSK 1 if you're a beginner, or jump to your current level. 
            Each level builds upon the previous one, ensuring a solid foundation in Chinese vocabulary.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

