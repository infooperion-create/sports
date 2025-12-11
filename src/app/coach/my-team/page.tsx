'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Users, Calendar, Trophy, Plus, Crown, LogOut } from 'lucide-react'
import Link from 'next/link'

interface CoachData {
  id: string
  name: string
  email: string
  studentID: string
  team?: {
    id: string
    name: string
    sport: string
  }
}

export default function MyTeam() {
  const [coachData, setCoachData] = useState<CoachData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchCoachData()
  }, [])

  const fetchCoachData = async () => {
    try {
      const token = localStorage.getItem('token')
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
        const data = await response.json()
        setCoachData(data.coach)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching student data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!coachData) {
    return null
  }

  return (
    <DashboardLayout
      userType="coach"
      userName={coachData?.name}
      teamName={coachData?.team?.name}
      onLogout={handleLogout}
    >
      <div className="max-w-6xl mx-auto">
        {coachData.team ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Team Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  {coachData.team.name}
                </CardTitle>
                <CardDescription>{coachData.team.sport}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">Team Captain</p>
                    <p className="text-sm text-gray-600">You (Team Creator)</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">Sport</p>
                    <Badge variant="secondary">{coachData.team.sport}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-sm text-gray-600">
                      {new Date().toLocaleDateString()} (Today)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Team Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Total Members</p>
                    <p className="text-2xl font-bold text-blue-600">8</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Active Members</p>
                    <p className="text-2xl font-bold text-green-600">6</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Practice Schedule</p>
                    <p className="text-sm text-gray-600">Mon, Wed, Fri - 4:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Team practice scheduled</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">New member joined</p>
                      <p className="text-xs text-gray-500">Yesterday</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Upcoming match</p>
                      <p className="text-xs text-gray-500">vs Rivals University - Tomorrow</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* No Team Assigned State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Team Assigned</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                You haven't been assigned to any team yet. As a coach, you can request to lead a team or contact the sports administrator to get assigned to a team and start coaching activities.
              </p>
              <div className="space-y-4">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-green-900 mb-2">How to Get a Team Assignment</h3>
                    <ul className="text-sm text-green-800 space-y-2 text-left">
                      <li>• Contact your sports department administrator</li>
                      <li>• Request team assignment based on your sport expertise</li>
                      <li>• Provide coaching credentials and experience</li>
                      <li>• Complete coach registration and onboarding</li>
                      <li>• Attend coach meetings and training sessions</li>
                    </ul>
                  </CardContent>
                </Card>
                <Link href="/coach/events">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Browse Available Events
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/coach/events">
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Events
                </Button>
              </Link>
              <Link href="/coach/feed">
                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Community Feed
                </Button>
              </Link>
              <Link href="/coach/dashboard">
                <Button variant="outline" className="w-full">
                  <Trophy className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}