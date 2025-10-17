import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Volume2, X, ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LearnCenter() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showExample, setShowExample] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [results, setResults] = useState({ mastered: 0, needReview: 0 })

  // Mock data - in real app, this would come from API
  const words = [
    {
      id: 1,
      word: '热情',
      pinyin: 'rè qíng',
      meaning: 'enthusiasm; passion',
      example: {
        zh: '他对工作充满了热情。',
        en: 'He is full of enthusiasm for his work.'
      },
      hsk: 4
    },
    {
      id: 2,
      word: '周末',
      pinyin: 'zhōu mò',
      meaning: 'weekend',
      example: {
        zh: '这个周末你有什么计划？',
        en: 'What are your plans for this weekend?'
      },
      hsk: 2
    },
    {
      id: 3,
      word: '打算',
      pinyin: 'dǎ suàn',
      meaning: 'to plan; to intend',
      example: {
        zh: '我打算明天去图书馆。',
        en: 'I plan to go to the library tomorrow.'
      },
      hsk: 3
    },
    {
      id: 4,
      word: '爬山',
      pinyin: 'pá shān',
      meaning: 'to hike; to climb a mountain',
      example: {
        zh: '他们经常去爬山。',
        en: 'They often go hiking.'
      },
      hsk: 3
    },
    {
      id: 5,
      word: '风景',
      pinyin: 'fēng jǐng',
      meaning: 'scenery; landscape',
      example: {
        zh: '这里的风景真美！',
        en: 'The scenery here is so beautiful!'
      },
      hsk: 3
    },
  ]

  const currentWord = words[currentIndex]

  const handleMastered = () => {
    setResults(prev => ({ ...prev, mastered: prev.mastered + 1 }))
    nextWord()
  }

  const handleNeedReview = () => {
    setResults(prev => ({ ...prev, needReview: prev.needReview + 1 }))
    nextWord()
  }

  const nextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowExample(false)
    } else {
      setSessionComplete(true)
    }
  }

  const previousWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowExample(false)
    }
  }

  const restartSession = () => {
    setCurrentIndex(0)
    setSessionComplete(false)
    setResults({ mastered: 0, needReview: 0 })
    setShowExample(false)
  }

  if (sessionComplete) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Session Complete!
              </h2>
              <p className="text-gray-600 mb-8">
                Great job! Here's your progress:
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Words Mastered</span>
                  <span className="text-2xl font-bold text-green-600">{results.mastered}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Need More Review</span>
                  <span className="text-2xl font-bold text-orange-600">{results.needReview}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Total Words</span>
                  <span className="text-2xl font-bold text-blue-600">{words.length}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={restartSession}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Review Again
                </Button>
                <Link to="/" className="block">
                  <Button variant="outline" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold text-gray-700">
              {currentIndex + 1} / {words.length}
            </span>
            <div className="flex-1 h-2 w-48 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <Link to="/">
            <Button variant="ghost" size="icon">
              <X className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Flashcard */}
        <Card className="shadow-2xl border-2 border-purple-200 mb-8">
          <CardContent className="p-12">
            <div className="text-center space-y-6">
              {/* Word */}
              <div>
                <div className="flex items-center justify-center gap-4 mb-3">
                  <h1 className="text-7xl font-bold text-gray-900">
                    {currentWord.word}
                  </h1>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    <Volume2 className="w-8 h-8" />
                  </Button>
                </div>
                <p className="text-3xl text-gray-600 mb-2">{currentWord.pinyin}</p>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  HSK {currentWord.hsk}
                </span>
              </div>

              {/* Meaning */}
              <div className="py-6 border-y border-gray-200">
                <p className="text-2xl text-gray-800 font-medium">
                  {currentWord.meaning}
                </p>
              </div>

              {/* Example */}
              <div>
                <Button
                  variant="ghost"
                  onClick={() => setShowExample(!showExample)}
                  className="text-purple-600 hover:text-purple-700 mb-4"
                >
                  {showExample ? '▲ Hide' : '▼ Show'} Example
                </Button>
                
                {showExample && (
                  <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200 space-y-3">
                    <p className="text-xl text-gray-900">{currentWord.example.zh}</p>
                    <p className="text-lg text-gray-600 italic">{currentWord.example.en}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            onClick={handleNeedReview}
            size="lg"
            variant="outline"
            className="h-20 text-lg font-semibold border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400"
          >
            <AlertCircle className="w-6 h-6 mr-2" />
            Need Review
          </Button>
          <Button
            onClick={handleMastered}
            size="lg"
            className="h-20 text-lg font-semibold bg-green-600 hover:bg-green-700"
          >
            <Check className="w-6 h-6 mr-2" />
            Mastered
          </Button>
        </div>

        {/* Navigation Hint */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-3">
            Or use keyboard shortcuts
          </p>
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <kbd className="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm text-sm">
                ←
              </kbd>
              <span className="text-sm text-gray-600">Previous</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm text-sm">
                →
              </kbd>
              <span className="text-sm text-gray-600">Next</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Buttons */}
        <div className="hidden md:flex items-center justify-between mt-8">
          <Button
            onClick={previousWord}
            disabled={currentIndex === 0}
            variant="ghost"
            size="lg"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </Button>
          <Button
            onClick={nextWord}
            disabled={currentIndex === words.length - 1}
            variant="ghost"
            size="lg"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}

