import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { ArrowLeft, Play, Pause, Volume2, Plus, Check } from 'lucide-react'
import { useState } from 'react'

export default function ArticleDetail() {
  const { id } = useParams()
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0)
  const [showTranslation, setShowTranslation] = useState({})
  const [selectedWord, setSelectedWord] = useState(null)
  const [addedWords, setAddedWords] = useState(new Set())
  const [quizAnswers, setQuizAnswers] = useState({})
  const [showQuizResults, setShowQuizResults] = useState(false)

  // Mock data - in real app, this would come from API
  const article = {
    id: 1,
    title: 'My Weekend Plans',
    level: 'Beginner',
    summary: {
      zh: '这篇文章介绍了周末的计划和活动。',
      en: 'This article introduces weekend plans and activities.'
    },
    paragraphs: [
      {
        id: 1,
        zh: '这个周末，我打算去爬山。天气预报说会是晴天，非常适合户外活动。',
        en: 'This weekend, I plan to go hiking. The weather forecast says it will be sunny, perfect for outdoor activities.'
      },
      {
        id: 2,
        zh: '星期六早上，我会和朋友们一起出发。我们准备带一些水果和饮料。',
        en: 'Saturday morning, I will set off with my friends. We plan to bring some fruits and drinks.'
      },
      {
        id: 3,
        zh: '爬山以后，我们打算在山顶吃午饭，欣赏美丽的风景。',
        en: 'After hiking, we plan to have lunch at the mountain top and enjoy the beautiful scenery.'
      }
    ],
    newWords: [
      { id: 1, word: '周末', pinyin: 'zhōumò', meaning: 'weekend', hsk: 2 },
      { id: 2, word: '打算', pinyin: 'dǎsuàn', meaning: 'to plan', hsk: 3 },
      { id: 3, word: '爬山', pinyin: 'páshān', meaning: 'to hike', hsk: 3 },
      { id: 4, word: '天气预报', pinyin: 'tiānqì yùbào', meaning: 'weather forecast', hsk: 4 },
      { id: 5, word: '户外', pinyin: 'hùwài', meaning: 'outdoor', hsk: 4 },
      { id: 6, word: '水果', pinyin: 'shuǐguǒ', meaning: 'fruit', hsk: 2 },
      { id: 7, word: '饮料', pinyin: 'yǐnliào', meaning: 'beverage', hsk: 3 },
      { id: 8, word: '风景', pinyin: 'fēngjǐng', meaning: 'scenery', hsk: 3 },
    ],
    quiz: [
      {
        id: 1,
        question: 'What does the author plan to do this weekend?',
        options: ['Go shopping', 'Go hiking', 'Stay at home', 'Visit friends'],
        correct: 1
      },
      {
        id: 2,
        question: 'What will they bring for the trip?',
        options: ['Books', 'Games', 'Fruits and drinks', 'Cameras'],
        correct: 2
      }
    ]
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
    // In real app, this would control audio playback
  }

  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 0.75]
    const currentIndex = speeds.indexOf(playbackSpeed)
    const nextIndex = (currentIndex + 1) % speeds.length
    setPlaybackSpeed(speeds[nextIndex])
  }

  const toggleTranslation = (paragraphId) => {
    setShowTranslation(prev => ({
      ...prev,
      [paragraphId]: !prev[paragraphId]
    }))
  }

  const handleWordClick = (word) => {
    setSelectedWord(word)
  }

  const addWordToBank = (wordId) => {
    setAddedWords(prev => new Set([...prev, wordId]))
    // In real app, this would call API to add word to user's bank
  }

  const addAllWords = () => {
    const allWordIds = article.newWords.map(w => w.id)
    setAddedWords(new Set(allWordIds))
    // In real app, this would call API to add all words
  }

  const handleQuizAnswer = (questionId, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const submitQuiz = () => {
    setShowQuizResults(true)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link to="/daily-article" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Articles
      </Link>

      {/* Audio Player */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={togglePlayback}
              size="icon"
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            <div className="flex-1 h-2 bg-gray-200 rounded-full">
              <div className="h-full w-1/3 bg-purple-600 rounded-full"></div>
            </div>
            <Button
              onClick={cycleSpeed}
              variant="outline"
              size="sm"
            >
              {playbackSpeed}x
            </Button>
            <Volume2 className="w-5 h-5 text-gray-600" />
          </div>
        </CardContent>
      </Card>

      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
            {article.level}
          </span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-700 mb-2">{article.summary.zh}</p>
          <p className="text-gray-600 italic">{article.summary.en}</p>
        </div>
      </div>

      {/* Article Content */}
      <div className="space-y-6 mb-12">
        {article.paragraphs.map((para) => (
          <Card key={para.id} className="border-l-4 border-l-purple-400">
            <CardContent className="pt-6">
              <p className="text-xl text-gray-900 mb-4 leading-relaxed">
                {para.zh}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleTranslation(para.id)}
                className="text-purple-600 hover:text-purple-700"
              >
                {showTranslation[para.id] ? '▲ Hide' : '▼ Show'} English Translation
              </Button>
              {showTranslation[para.id] && (
                <p className="mt-3 text-gray-600 italic pl-4 border-l-2 border-gray-300">
                  {para.en}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Words Section */}
      <Card className="mb-12">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Article's New Words</CardTitle>
            <Button
              onClick={addAllWords}
              variant="outline"
              className="text-purple-600 border-purple-600 hover:bg-purple-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add All to Word Bank
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {article.newWords.map((word) => (
              <div
                key={word.id}
                onClick={() => handleWordClick(word)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedWord?.id === word.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">{word.word}</span>
                      <span className="text-sm text-gray-500">HSK {word.hsk}</span>
                    </div>
                    <div className="text-gray-600 mt-1">{word.pinyin}</div>
                    <div className="text-gray-700 mt-1">{word.meaning}</div>
                  </div>
                  <Button
                    size="icon"
                    variant={addedWords.has(word.id) ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation()
                      addWordToBank(word.id)
                    }}
                    className={addedWords.has(word.id) ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {addedWords.has(word.id) ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reading Quiz */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reading Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {article.quiz.map((question, qIndex) => (
              <div key={question.id} className="space-y-3">
                <p className="font-semibold text-lg">
                  {qIndex + 1}. {question.question}
                </p>
                <div className="space-y-2">
                  {question.options.map((option, oIndex) => {
                    const isSelected = quizAnswers[question.id] === oIndex
                    const isCorrect = oIndex === question.correct
                    const showResult = showQuizResults
                    
                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleQuizAnswer(question.id, oIndex)}
                        disabled={showQuizResults}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          showResult && isCorrect
                            ? 'border-green-500 bg-green-50'
                            : showResult && isSelected && !isCorrect
                            ? 'border-red-500 bg-red-50'
                            : isSelected
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
            
            {!showQuizResults && (
              <Button
                onClick={submitQuiz}
                className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
                disabled={Object.keys(quizAnswers).length !== article.quiz.length}
              >
                Submit Answers
              </Button>
            )}
            
            {showQuizResults && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-semibold text-blue-900">
                  You got {article.quiz.filter(q => quizAnswers[q.id] === q.correct).length} out of {article.quiz.length} correct!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

