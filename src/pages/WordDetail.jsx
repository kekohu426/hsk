import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { ArrowLeft, Volume2, Plus, Check, Star, BookOpen } from 'lucide-react'
import { useState } from 'react'

export default function WordDetail() {
  const { id } = useParams()
  const [isAdded, setIsAdded] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Mock data - in real app, this would come from API
  const word = {
    id: 1,
    word: '你好',
    pinyin: 'nǐ hǎo',
    meaning: 'hello',
    hsk: 1,
    examples: [
      {
        zh: '你好，很高兴认识你。',
        en: 'Hello, nice to meet you.',
        pinyin: 'Nǐhǎo, hěn gāoxìng rènshi nǐ.'
      },
      {
        zh: '你好吗？',
        en: 'How are you?',
        pinyin: 'Nǐ hǎo ma?'
      },
      {
        zh: '你好，请问这是什么？',
        en: 'Hello, may I ask what this is?',
        pinyin: 'Nǐhǎo, qǐngwèn zhè shì shénme?'
      }
    ],
    characters: [
      {
        char: '你',
        pinyin: 'nǐ',
        meaning: 'you',
        radical: '亻',
        strokes: 7
      },
      {
        char: '好',
        pinyin: 'hǎo',
        meaning: 'good',
        radical: '女',
        strokes: 6
      }
    ],
    relatedWords: [
      { word: '您好', pinyin: 'nín hǎo', meaning: 'hello (polite)' },
      { word: '大家好', pinyin: 'dàjiā hǎo', meaning: 'hello everyone' },
      { word: '问好', pinyin: 'wèn hǎo', meaning: 'to say hello' },
    ],
    faqs: [
      {
        question: 'When should I use 你好?',
        answer: '你好 is the most common greeting in Chinese. Use it when meeting someone for the first time, or as a general greeting in formal and informal situations.'
      },
      {
        question: 'Is there a difference between 你好 and 您好?',
        answer: 'Yes! 您好 is more polite and formal. Use 您好 when addressing elders, teachers, or in professional settings.'
      }
    ]
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link to="/hsk-library" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to HSK Library
      </Link>

      {/* Main Word Card */}
      <Card className="mb-8 border-2 border-purple-300 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-7xl font-bold text-gray-900">{word.word}</h1>
                <Button size="icon" variant="ghost" className="text-purple-600">
                  <Volume2 className="w-10 h-10" />
                </Button>
              </div>
              <p className="text-3xl text-gray-600 mb-3">{word.pinyin}</p>
              <p className="text-2xl text-gray-800 font-medium mb-4">{word.meaning}</p>
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-full">
                  HSK {word.hsk}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => setIsAdded(!isAdded)}
                className={isAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Added to Bank
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Add to Bank
                  </>
                )}
              </Button>
              <Button
                onClick={() => setIsFavorite(!isFavorite)}
                variant="outline"
                className={isFavorite ? 'border-yellow-400 text-yellow-600' : ''}
              >
                <Star className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Favorited' : 'Favorite'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Example Sentences */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Example Sentences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {word.examples.map((example, index) => (
              <div key={index} className="p-5 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-xl text-gray-900 mb-2">{example.zh}</p>
                    <p className="text-base text-gray-600 mb-2">{example.pinyin}</p>
                    <p className="text-base text-gray-700 italic">{example.en}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="text-purple-600">
                    <Volume2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Character Breakdown */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Character Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {word.characters.map((char, index) => (
              <div key={index} className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                <div className="text-center mb-4">
                  <div className="text-7xl font-bold text-gray-900 mb-3">{char.char}</div>
                  <p className="text-xl text-gray-600">{char.pinyin}</p>
                  <p className="text-lg text-gray-700 mt-2">{char.meaning}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">Radical</p>
                    <p className="text-2xl font-bold text-gray-900">{char.radical}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">Strokes</p>
                    <p className="text-2xl font-bold text-gray-900">{char.strokes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Related Words */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Related Words</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {word.relatedWords.map((related, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer">
                <p className="text-2xl font-bold text-gray-900 mb-1">{related.word}</p>
                <p className="text-sm text-gray-600 mb-1">{related.pinyin}</p>
                <p className="text-sm text-gray-700">{related.meaning}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Common Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {word.faqs.map((faq, index) => (
              <div key={index} className="p-5 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    Q
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</p>
                    <p className="text-base text-gray-700">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Related Articles */}
      <Card className="mt-8 bg-purple-50 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-600" />
            Found in Articles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            This word appears in the following Daily Articles:
          </p>
          <div className="space-y-2">
            <Link to="/article/1" className="block p-3 bg-white rounded-lg hover:bg-purple-100 transition-colors">
              <p className="font-semibold text-purple-600">My Weekend Plans</p>
              <p className="text-sm text-gray-600">Beginner • 5 min read</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

