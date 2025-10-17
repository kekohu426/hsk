import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { ArrowLeft, Search, Plus, Check } from 'lucide-react'
import { useState } from 'react'

export default function HSKLevel() {
  const { level } = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [addedWords, setAddedWords] = useState(new Set())

  // Mock data - in real app, this would come from API
  const mockWords = [
    { id: 1, word: '你好', pinyin: 'nǐhǎo', meaning: 'hello' },
    { id: 2, word: '谢谢', pinyin: 'xièxie', meaning: 'thank you' },
    { id: 3, word: '再见', pinyin: 'zàijiàn', meaning: 'goodbye' },
    { id: 4, word: '对不起', pinyin: 'duìbuqǐ', meaning: 'sorry' },
    { id: 5, word: '没关系', pinyin: 'méiguānxi', meaning: "it doesn't matter" },
    { id: 6, word: '请', pinyin: 'qǐng', meaning: 'please' },
    { id: 7, word: '是', pinyin: 'shì', meaning: 'to be' },
    { id: 8, word: '不', pinyin: 'bù', meaning: 'not' },
    { id: 9, word: '我', pinyin: 'wǒ', meaning: 'I, me' },
    { id: 10, word: '你', pinyin: 'nǐ', meaning: 'you' },
    { id: 11, word: '他', pinyin: 'tā', meaning: 'he, him' },
    { id: 12, word: '她', pinyin: 'tā', meaning: 'she, her' },
    { id: 13, word: '们', pinyin: 'men', meaning: 'plural marker' },
    { id: 14, word: '的', pinyin: 'de', meaning: 'possessive particle' },
    { id: 15, word: '了', pinyin: 'le', meaning: 'completed action particle' },
    { id: 16, word: '吗', pinyin: 'ma', meaning: 'question particle' },
    { id: 17, word: '呢', pinyin: 'ne', meaning: 'question particle' },
    { id: 18, word: '吧', pinyin: 'ba', meaning: 'suggestion particle' },
    { id: 19, word: '在', pinyin: 'zài', meaning: 'at, in, on' },
    { id: 20, word: '有', pinyin: 'yǒu', meaning: 'to have' },
  ]

  const filteredWords = mockWords.filter(word =>
    word.word.includes(searchQuery) ||
    word.pinyin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    word.meaning.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addWordToBank = (wordId) => {
    setAddedWords(prev => new Set([...prev, wordId]))
  }

  const addAllWords = () => {
    const allWordIds = filteredWords.map(w => w.id)
    setAddedWords(new Set(allWordIds))
  }

  const levelColors = {
    '1': { gradient: 'from-green-400 to-green-600', bg: 'bg-green-50', border: 'border-green-500' },
    '2': { gradient: 'from-blue-400 to-blue-600', bg: 'bg-blue-50', border: 'border-blue-500' },
    '3': { gradient: 'from-purple-400 to-purple-600', bg: 'bg-purple-50', border: 'border-purple-500' },
    '4': { gradient: 'from-orange-400 to-orange-600', bg: 'bg-orange-50', border: 'border-orange-500' },
    '5': { gradient: 'from-red-400 to-red-600', bg: 'bg-red-50', border: 'border-red-500' },
    '6': { gradient: 'from-pink-400 to-pink-600', bg: 'bg-pink-50', border: 'border-pink-500' },
  }

  const colors = levelColors[level] || levelColors['1']

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link to="/hsk-library" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to HSK Library
      </Link>

      {/* Header */}
      <div className={`${colors.bg} border-2 ${colors.border} rounded-lg p-8 mb-8`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-6xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mb-4`}>
              HSK Level {level}
            </h1>
            <p className="text-xl text-gray-700">
              {filteredWords.length} words in this level
            </p>
          </div>
          <Button
            onClick={addAllWords}
            size="lg"
            className={`bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white shadow-lg`}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add All to Word Bank
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search words, pinyin, or meaning..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Words Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWords.map((word) => (
          <Card 
            key={word.id}
            className={`hover:shadow-lg transition-all border-2 ${
              addedWords.has(word.id) ? `${colors.border} ${colors.bg}` : 'border-gray-200'
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link to={`/word/${word.id}`}>
                    <CardTitle className="text-3xl mb-2 hover:text-purple-600 transition-colors cursor-pointer">
                      {word.word}
                    </CardTitle>
                  </Link>
                  <p className="text-lg text-gray-600">{word.pinyin}</p>
                  <p className="text-base text-gray-700 mt-2">{word.meaning}</p>
                </div>
                <Button
                  size="icon"
                  variant={addedWords.has(word.id) ? "default" : "outline"}
                  onClick={() => addWordToBank(word.id)}
                  className={addedWords.has(word.id) ? `bg-gradient-to-r ${colors.gradient}` : ""}
                >
                  {addedWords.has(word.id) ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredWords.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="py-12">
            <div className="text-center text-gray-400">
              <Search className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl">No words found</p>
              <p>Try a different search term</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Batch Add Info */}
      {addedWords.size > 0 && (
        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border-2 border-purple-300 p-6 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {addedWords.size} word{addedWords.size > 1 ? 's' : ''} added
              </p>
              <p className="text-sm text-gray-600">
                Check your Word Bank to review
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

