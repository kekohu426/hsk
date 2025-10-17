import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Search, Plus, Check, AlertCircle, Volume2 } from 'lucide-react'
import { useState } from 'react'

export default function TextAnalyzer() {
  const [inputText, setInputText] = useState('')
  const [analyzedText, setAnalyzedText] = useState(null)
  const [selectedWord, setSelectedWord] = useState(null)
  const [addedWords, setAddedWords] = useState(new Set())
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeText = () => {
    if (!inputText.trim()) return
    
    setIsAnalyzing(true)
    
    // Simulate API call
    setTimeout(() => {
      // Mock analysis result
      const mockResult = {
        original: inputText,
        highlightedWords: [
          { word: '周末', start: inputText.indexOf('周末'), end: inputText.indexOf('周末') + 2 },
          { word: '打算', start: inputText.indexOf('打算'), end: inputText.indexOf('打算') + 2 },
        ],
        newWords: [
          { id: 1, word: '周末', pinyin: 'zhōumò', meaning: 'weekend', hsk: 2, example: '这个周末你有什么计划？' },
          { id: 2, word: '打算', pinyin: 'dǎsuàn', meaning: 'to plan', hsk: 3, example: '我打算明天去图书馆。' },
          { id: 3, word: '爬山', pinyin: 'páshān', meaning: 'to hike', hsk: 3, example: '他们经常去爬山。' },
        ]
      }
      
      setAnalyzedText(mockResult)
      setIsAnalyzing(false)
    }, 1000)
  }

  const addWordToBank = (wordId) => {
    setAddedWords(prev => new Set([...prev, wordId]))
  }

  const addAllWords = () => {
    if (!analyzedText) return
    const allWordIds = analyzedText.newWords.map(w => w.id)
    setAddedWords(new Set(allWordIds))
  }

  const renderHighlightedText = () => {
    if (!analyzedText) return null
    
    const text = analyzedText.original
    const words = analyzedText.highlightedWords
    
    if (words.length === 0) {
      return <p className="text-xl leading-relaxed">{text}</p>
    }

    // Simple highlighting - in production, use proper text segmentation
    return (
      <p className="text-xl leading-relaxed">
        {text.split('').map((char, index) => {
          const isHighlighted = words.some(w => index >= w.start && index < w.end)
          return (
            <span
              key={index}
              className={isHighlighted ? 'bg-yellow-200 font-semibold cursor-pointer hover:bg-yellow-300' : ''}
              onClick={() => {
                if (isHighlighted) {
                  const word = words.find(w => index >= w.start && index < w.end)
                  const wordData = analyzedText.newWords.find(w => w.word === word.word)
                  setSelectedWord(wordData)
                }
              }}
            >
              {char}
            </span>
          )
        })}
      </p>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Text Analyzer</h1>
        <p className="text-xl text-gray-600">
          Paste any Chinese text and discover new vocabulary
        </p>
      </div>

      {/* Input Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Input Chinese Text</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="请在此输入或粘贴中文文本... (最大1000字)"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[200px] text-lg"
            maxLength={1000}
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500">
              {inputText.length} / 1000 characters
            </span>
            <Button
              onClick={analyzeText}
              disabled={!inputText.trim() || isAnalyzing}
              className="bg-green-600 hover:bg-green-700"
            >
              <Search className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analyzedText && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Original Text with Highlights */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Original Text</CardTitle>
                <p className="text-sm text-gray-500 mt-2">
                  Click on highlighted words to see details
                </p>
              </CardHeader>
              <CardContent>
                {renderHighlightedText()}
              </CardContent>
            </Card>

            {/* Selected Word Detail */}
            {selectedWord && (
              <Card className="mt-6 border-2 border-purple-300 bg-purple-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Word Details</CardTitle>
                    <Button
                      size="sm"
                      variant={addedWords.has(selectedWord.id) ? "default" : "outline"}
                      onClick={() => addWordToBank(selectedWord.id)}
                      className={addedWords.has(selectedWord.id) ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {addedWords.has(selectedWord.id) ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Added
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" />
                          Add to Bank
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-bold text-gray-900">{selectedWord.word}</span>
                        <Button size="icon" variant="ghost" className="text-purple-600">
                          <Volume2 className="w-5 h-5" />
                        </Button>
                      </div>
                      <p className="text-lg text-gray-600 mt-1">{selectedWord.pinyin}</p>
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">Meaning:</p>
                      <p className="text-lg">{selectedWord.meaning}</p>
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">Example:</p>
                      <p className="text-lg text-gray-800">{selectedWord.example}</p>
                    </div>
                    <div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                        HSK {selectedWord.hsk}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* New Words List */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>New Words ({analyzedText.newWords.length})</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addAllWords}
                    className="text-purple-600 border-purple-600 hover:bg-purple-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyzedText.newWords.map((word) => (
                    <div
                      key={word.id}
                      onClick={() => setSelectedWord(word)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedWord?.id === word.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-bold text-lg text-gray-900">{word.word}</div>
                          <div className="text-sm text-gray-600">{word.pinyin}</div>
                          <div className="text-sm text-gray-700 mt-1">{word.meaning}</div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            addWordToBank(word.id)
                          }}
                          className={addedWords.has(word.id) ? "text-green-600" : "text-gray-400"}
                        >
                          {addedWords.has(word.id) ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!analyzedText && (
        <Card className="border-dashed border-2">
          <CardContent className="py-12">
            <div className="text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500 mb-2">No text analyzed yet</p>
              <p className="text-gray-400">
                Enter Chinese text above and click "Analyze Text" to get started
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback Section */}
      {analyzedText && (
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Help us improve</p>
                <p className="text-sm text-blue-700 mt-1">
                  Found an error? Let us know if we missed a word or incorrectly identified one.
                </p>
                <Button size="sm" variant="link" className="text-blue-600 px-0 mt-1">
                  Submit Feedback
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

