'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Calendar, Clock, Users, Plus, Trophy, Target, TrendingUp, Activity, Star } from 'lucide-react'
import Link from 'next/link'

interface CoachData {
  id: string
  name: string
  email: string
  role: string
  team?: {
    id: string
    name: string
    sport: string
  }
}

interface Post {
  id: string
  content: string
  imageURL?: string
  createdAt: string
  user: {
    name: string
    email: string
    role: string
    team?: {
      name: string
    }
  }
}

interface Event {
  id: string
  title: string
  description?: string
  date: string
  sport: string
  creator: {
    name: string
  }
}

interface DashboardData {
  coach: CoachData
  posts: Post[]
  events: Event[]
  teamMembers: Array<{
    name: string
    email: string
    studentID: string
  }>
}

export default function CoachDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Try to get token from localStorage first, then from cookie
      let token = localStorage.getItem('token')
      
      if (!token) {
        // Fallback to cookie if localStorage is empty
        const cookies = document.cookie.split(';')
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='))
        if (tokenCookie) {
          token = tokenCookie.trim().split('=')[1]
        }
      }
      
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/coach/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const dashboardData = await response.json()
        setData(dashboardData)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <DashboardLayout
      userType="coach"
      userName={data.coach.name}
      teamName={data.coach.team?.name}
      onLogout={handleLogout}
      userData={data.coach}
    >
      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {data.coach.name}! 👋</h1>
              <p className="text-blue-100 text-lg">Ready to lead your team to victory today?</p>
            </div>
            <div className="hidden lg:block">
              <Trophy className="h-16 w-16 text-yellow-300" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Team Status</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {data.coach.team ? 'Coaching' : 'Unassigned'}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Upcoming Events</p>
                  <p className="text-2xl font-bold text-green-900">{data.events.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Community Posts</p>
                  <p className="text-2xl font-bold text-purple-900">{data.posts.length}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Performance</p>
                  <p className="text-2xl font-bold text-orange-900">Excellent</p>
                </div>
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Events Section */}
          <div className="lg:col-span-2">
            <Card className="h-full shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg p-6">
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5" />
                  <span>Recent Events & Achievements</span>
                </CardTitle>
                <CardDescription className="text-indigo-100">
                  Latest sports activities and accomplishments
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex-1">
                <div className="space-y-4 h-full">
                  {/* Sample recent events since we don't have them in API yet */}
                  <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900 text-lg">Inter-Department Cricket Championship</h4>
                      <p className="text-sm text-green-700 mt-2 leading-relaxed">
                        Computer Science won by 3 wickets in a thrilling finish! An amazing display of teamwork and skill.
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-green-600 font-medium">January 15, 2025</p>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Championship</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <Star className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 text-lg">Basketball Friendly Match Victory</h4>
                      <p className="text-sm text-blue-700 mt-2 leading-relaxed">
                        NUML Basketball Club defeated Punjab University 78-72 in an intense and exciting match.
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-blue-600 font-medium">January 10, 2025</p>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Victory</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-purple-900 text-lg">Annual Sports Day 2024</h4>
                      <p className="text-sm text-purple-700 mt-2 leading-relaxed">
                        Grand celebration with 500+ participants across multiple sports disciplines and events.
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-purple-600 font-medium">December 20, 2024</p>
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Event</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-lg border border-orange-200 hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-orange-900 text-lg">Table Tennis Tournament Success</h4>
                      <p className="text-sm text-orange-700 mt-2 leading-relaxed">
                        NUML secured 2nd position in inter-university tournament with outstanding performance.
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-orange-600 font-medium">November 28, 2024</p>
                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Achievement</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Team Status */}
            <Card className="shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-t-lg p-6">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Team Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {data.coach.team ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-400 to-green-400 rounded-full mb-3 shadow-lg">
                        <span className="text-white font-bold text-2xl">
                          {data.coach.team.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="font-bold text-xl text-gray-900">{data.coach.team.name}</h3>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mt-2">
                        {data.coach.team.sport}
                      </Badge>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-green-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-medium">Team Coach</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Team ID: {data.coach.team.id}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-bold text-xl mb-2 text-gray-900">No Team Assigned</h3>
                    <p className="text-sm text-gray-600 mb-4 px-4">
                      Contact your sports administrator to get assigned to a team and start coaching.
                    </p>
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                      Request Team Assignment
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg p-6">
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Upcoming Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {data.events.length > 0 ? (
                  <div className="space-y-4">
                    {data.events.slice(0, 3).map((event) => (
                      <div key={event.id} className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50 rounded-r-lg">
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                          <Clock className="h-4 w-4 text-orange-500" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 mt-2">
                          {event.sport}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No upcoming events scheduled</p>
                  </div>
                )}
                {data.events.length > 3 && (
                  <div className="text-center pt-4">
                    <Link href="/student/upcoming-events">
                      <Badge variant="outline" className="cursor-pointer hover:bg-orange-100 border-orange-300 text-orange-700">
                        View All Events ({data.events.length})
                      </Badge>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg p-6">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Link href="/student/feed">
                  <Button className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200">
                    <Calendar className="h-4 w-4 mr-3" />
                    View Community Feed
                  </Button>
                </Link>
                {data.coach.team && (
                  <Link href="/coach/my-team">
                    <Button className="w-full justify-start bg-green-50 hover:bg-green-100 text-green-700 border border-green-200">
                      <Users className="h-4 w-4 mr-3" />
                      My Team Details
                    </Button>
                  </Link>
                )}
                <Link href="/coach/events">
                  <Button className="w-full justify-start bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200">
                    <Trophy className="h-4 w-4 mr-3" />
                    Browse Events
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}