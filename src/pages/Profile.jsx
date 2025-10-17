import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { User, Mail, Calendar, Award, TrendingUp, BookOpen, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: '2024-01-15',
    targetHSK: 4
  })

  const stats = {
    totalWords: 350,
    wordsLearning: 45,
    wordsMastered: 280,
    studyStreak: 7,
    totalStudyTime: '25h 30m',
    articlesRead: 12,
    quizzesTaken: 8
  }

  const recentActivity = [
    { date: '2025-10-17', activity: 'Completed 15 flashcards', type: 'learn' },
    { date: '2025-10-17', activity: 'Read "My Weekend Plans"', type: 'article' },
    { date: '2025-10-16', activity: 'Added 8 new words from text analyzer', type: 'words' },
    { date: '2025-10-16', activity: 'Completed daily quiz', type: 'quiz' },
    { date: '2025-10-15', activity: 'Mastered 5 HSK 3 words', type: 'mastered' },
  ]

  const handleLogout = () => {
    // In real app, this would clear auth tokens
    navigate('/login')
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    // In real app, this would call API to update profile
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">My Profile</h1>
        <p className="text-xl text-gray-600">
          Track your progress and manage your account
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                {isEditing ? (
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="text-center text-xl font-semibold mb-2"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-gray-600 flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900">{profile.email}</p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-600 flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    Member Since
                  </Label>
                  <p className="text-gray-900">{new Date(profile.joinDate).toLocaleDateString()}</p>
                </div>

                <div>
                  <Label className="text-gray-600 flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4" />
                    Target HSK Level
                  </Label>
                  {isEditing ? (
                    <select
                      value={profile.targetHSK}
                      onChange={(e) => setProfile({ ...profile, targetHSK: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {[1, 2, 3, 4, 5, 6].map(level => (
                        <option key={level} value={level}>HSK {level}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-900">HSK {profile.targetHSK}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {isEditing ? (
                  <>
                    <Button onClick={handleSaveProfile} className="w-full bg-green-600 hover:bg-green-700">
                      Save Changes
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="w-full bg-purple-600 hover:bg-purple-700">
                    Edit Profile
                  </Button>
                )}
                <Button onClick={handleLogout} variant="outline" className="w-full text-red-600 border-red-300 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats and Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{stats.totalWords}</p>
                  <p className="text-sm text-gray-700 mt-1">Total Words</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">{stats.wordsLearning}</p>
                  <p className="text-sm text-gray-700 mt-1">Learning</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{stats.wordsMastered}</p>
                  <p className="text-sm text-gray-700 mt-1">Mastered</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">{stats.studyStreak}</p>
                  <p className="text-sm text-gray-700 mt-1">Day Streak</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Words Mastered</span>
                    <span className="font-semibold text-gray-900">{stats.wordsMastered} / {stats.totalWords}</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600"
                      style={{ width: `${(stats.wordsMastered / stats.totalWords) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{stats.totalStudyTime}</p>
                    <p className="text-sm text-gray-600">Study Time</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{stats.articlesRead}</p>
                    <p className="text-sm text-gray-600">Articles Read</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{stats.quizzesTaken}</p>
                    <p className="text-sm text-gray-600">Quizzes Taken</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-purple-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((item, index) => {
                  const icons = {
                    learn: '📚',
                    article: '📖',
                    words: '➕',
                    quiz: '✅',
                    mastered: '🎯'
                  }
                  
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-2xl">{icons[item.type]}</span>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{item.activity}</p>
                        <p className="text-sm text-gray-500">{item.date}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

