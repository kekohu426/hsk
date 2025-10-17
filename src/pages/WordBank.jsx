import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Search, Volume2, Star, Trash2, MoveRight } from 'lucide-react'
import { useState } from 'react'

export default function WordBank() {
  const [activeTab, setActiveTab] = useState('new')
  const [selectedWord, setSelectedWord] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [hskFilter, setHskFilter] = useState('all')

  // Mock data - in real app, this would come from API
  const words = {
    new: [
      { id: 1, word: '周末', pinyin: 'zhōumò', meaning: 'weekend', hsk: 2, source: 'Daily Article: My Weekend', isFavorite: false },
      { id: 2, word: '打算', pinyin: 'dǎsuàn', meaning: 'to plan', hsk: 3, source: 'Daily Article: My Weekend', isFavorite: true },
      { id: 3, word: '爬山', pinyin: 'páshān', meaning: 'to hike', hsk: 3, source: 'Text Analyzer', isFavorite: false },
      { id: 4, word: '风景', pinyin: 'fēngjǐng', meaning: 'scenery', hsk: 3, source: 'Daily Article: My Weekend', isFavorite: false },
      { id: 5, word: '水果', pinyin: 'shuǐguǒ', meaning: 'fruit', hsk: 2, source: 'Daily Article: Shopping', isFavorite: false },
    ],
    learning: [
      { id: 6, word: '热情', pinyin: 'rèqíng', meaning: 'enthusiasm', hsk: 4, source: 'HSK 4 Library', isFavorite: true },
      { id: 7, word: '努力', pinyin: 'nǔlì', meaning: 'to work hard', hsk: 3, source: 'Daily Article: Study Tips', isFavorite: false },
      { id: 8, word: '环境', pinyin: 'huánjìng', meaning: 'environment', hsk: 4, source: 'HSK 4 Library', isFavorite: false },
    ],
    mastered: [
      { id: 9, word: '你好', pinyin: 'nǐhǎo', meaning: 'hello', hsk: 1, source: 'HSK 1 Library', isFavorite: false },
      { id: 10, word: '谢谢', pinyin: 'xièxie', meaning: 'thank you', hsk: 1, source: 'HSK 1 Library', isFavorite: false },
    ],
    favorites: [
      { id: 2, word: '打算', pinyin: 'dǎsuàn', meaning: 'to plan', hsk: 3, source: 'Daily Article: My Weekend', isFavorite: true },
      { id: 6, word: '热情', pinyin: 'rèqíng', meaning: 'enthusiasm', hsk: 4, source: 'HSK 4 Library', isFavorite: true },
    ],
  }

  const tabs = [
    { id: 'new', label: 'New', count: words.new.length, color: 'bg-blue-500' },
    { id: 'learning', label: 'Learning', count: words.learning.length, color: 'bg-orange-500' },
    { id: 'mastered', label: 'Mastered', count: words.mastered.length, color: 'bg-green-500' },
    { id: 'favorites', label: 'Favorites', count: words.favorites.length, color: 'bg-purple-500' },
  ]

  const currentWords = words[activeTab] || []

  const filteredWords = currentWords.filter(word => {
    const matchesSearch = word.word.includes(searchQuery) || 
                         word.pinyin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         word.meaning.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesHSK = hskFilter === 'all' || word.hsk.toString() === hskFilter
    return matchesSearch && matchesHSK
  })

  const handleWordClick = (word) => {
    setSelectedWord(word)
  }

  const moveToStatus = (wordId, newStatus) => {
    // In real app, this would call API to update word status
    console.log(`Moving word ${wordId} to ${newStatus}`)
  }

  const toggleFavorite = (wordId) => {
    // In real app, this would call API to toggle favorite
    console.log(`Toggling favorite for word ${wordId}`)
  }

  const deleteWord = (wordId) => {
    // In real app, this would call API to delete word
    console.log(`Deleting word ${wordId}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">My Word Bank</h1>
        <p className="text-xl text-gray-600">
          Manage and review your personal vocabulary collection
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === tab.id
                ? `${tab.color} text-white shadow-lg scale-105`
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
            }`}
          >
            {tab.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-sm ${
              activeTab === tab.id ? 'bg-white/30' : 'bg-gray-100'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search words, pinyin, or meaning..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={hskFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setHskFilter('all')}
                size="sm"
              >
                All HSK
              </Button>
              {[1, 2, 3, 4, 5, 6].map((level) => (
                <Button
                  key={level}
                  variant={hskFilter === level.toString() ? 'default' : 'outline'}
                  onClick={() => setHskFilter(level.toString())}
                  size="sm"
                  className={hskFilter === level.toString() ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  HSK {level}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Word List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Words ({filteredWords.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredWords.map((word) => (
                  <div
                    key={word.id}
                    onClick={() => handleWordClick(word)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedWord?.id === word.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-gray-900">{word.word}</span>
                          {word.isFavorite && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{word.pinyin}</div>
                        <div className="text-sm text-gray-700 mt-1">{word.meaning}</div>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          HSK {word.hsk}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredWords.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No words found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Word Details */}
        <div className="lg:col-span-2">
          {selectedWord ? (
            <Card className="border-2 border-purple-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Word Details</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => toggleFavorite(selectedWord.id)}
                      className={selectedWord.isFavorite ? 'text-yellow-500' : 'text-gray-400'}
                    >
                      <Star className={`w-5 h-5 ${selectedWord.isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteWord(selectedWord.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Word Display */}
                  <div className="text-center py-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                    <div className="flex items-center justify-center gap-4 mb-3">
                      <h2 className="text-6xl font-bold text-gray-900">{selectedWord.word}</h2>
                      <Button size="icon" variant="ghost" className="text-purple-600">
                        <Volume2 className="w-8 h-8" />
                      </Button>
                    </div>
                    <p className="text-2xl text-gray-600 mb-3">{selectedWord.pinyin}</p>
                    <p className="text-xl text-gray-800 font-medium">{selectedWord.meaning}</p>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">HSK Level</p>
                      <p className="text-2xl font-bold text-blue-600">HSK {selectedWord.hsk}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Source</p>
                      <p className="text-sm font-medium text-green-700">{selectedWord.source}</p>
                    </div>
                  </div>

                  {/* Example Sentences (Mock) */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Example Sentences</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900 mb-2">这个{selectedWord.word}很重要。</p>
                        <p className="text-gray-600 text-sm italic">This {selectedWord.meaning} is very important.</p>
                      </div>
                    </div>
                  </div>

                  {/* Character Breakdown (Mock) */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Character Breakdown</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedWord.word.split('').map((char, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-3xl font-bold text-gray-900">{char}</span>
                          <p className="text-sm text-gray-600 mt-1">Character {index + 1}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Management */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Manage Status</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {activeTab !== 'learning' && (
                        <Button
                          onClick={() => moveToStatus(selectedWord.id, 'learning')}
                          variant="outline"
                          className="border-orange-300 text-orange-600 hover:bg-orange-50"
                        >
                          <MoveRight className="w-4 h-4 mr-2" />
                          To Learning
                        </Button>
                      )}
                      {activeTab !== 'mastered' && (
                        <Button
                          onClick={() => moveToStatus(selectedWord.id, 'mastered')}
                          variant="outline"
                          className="border-green-300 text-green-600 hover:bg-green-50"
                        >
                          <MoveRight className="w-4 h-4 mr-2" />
                          To Mastered
                        </Button>
                      )}
                      {activeTab !== 'new' && (
                        <Button
                          onClick={() => moveToStatus(selectedWord.id, 'new')}
                          variant="outline"
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          <MoveRight className="w-4 h-4 mr-2" />
                          To New
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-2">
              <CardContent className="py-24">
                <div className="text-center text-gray-400">
                  <p className="text-xl mb-2">No word selected</p>
                  <p>Click on a word from the list to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

