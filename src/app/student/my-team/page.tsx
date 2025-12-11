'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Users, Calendar, Trophy, Plus, Crown, LogOut, Mail, MessageCircle, Eye } from 'lucide-react'
import Link from 'next/link'

interface StudentData {
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

interface AvailableTeam {
  id: string
  name: string
  sport: string
  department: string
  _count: {
    members: number
  }
}

export default function MyTeam() {
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAvailableTeams, setShowAvailableTeams] = useState(false)
  const [availableTeams, setAvailableTeams] = useState<AvailableTeam[]>([])
  const [joiningTeam, setJoiningTeam] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchStudentData()
  }, [])

  const fetchAvailableTeams = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('/api/student/teams', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAvailableTeams(data)
        setShowAvailableTeams(true)
      }
    } catch (error) {
      console.error('Error fetching available teams:', error)
    }
  }

  const handleJoinTeam = async (teamId: string) => {
    setJoiningTeam(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('/api/student/teams', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ teamId })
      })

      if (response.ok) {
        // Refresh student data to show the new team
        await fetchStudentData()
        setShowAvailableTeams(false)
        alert('Successfully joined the team!')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Error joining team')
      }
    } catch (error) {
      console.error('Error joining team:', error)
      alert('Error joining team')
    } finally {
      setJoiningTeam(false)
    }
  }

  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/student/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStudentData(data.student)
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
    router.push('/')
  }

  const handleEmailAdmin = () => {
    const adminEmail = 'touqeer@numl.edu.pk'
    const subject = encodeURIComponent('Request to Join Sports Team')
    const body = encodeURIComponent(`Dear Mr. Touqeer,

I am ${studentData?.name} (Student ID: ${studentData?.studentID}) from ${studentData?.department}.

I would like to request joining a sports team. I am interested in participating in sports activities and would appreciate your guidance on available options.

Thank you,
${studentData?.name}
${studentData?.email}`)
    
    window.open(`mailto:${adminEmail}?subject=${subject}&body=${body}`)
  }

  const handleWhatsAppAdmin = () => {
    const adminPhone = '+923000000000' // You can update this with actual admin number
    const message = encodeURIComponent(`Dear Mr. Touqeer,

I am ${studentData?.name} (Student ID: ${studentData?.studentID}) from ${studentData?.department}.

I would like to request joining a sports team. I am interested in participating in sports activities and would appreciate your guidance on available options.

Thank you,
${studentData?.name}`)
    
    window.open(`https://wa.me/${adminPhone}?text=${message}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!studentData) {
    return null
  }

  return (
    <DashboardLayout
      userType="student"
      userName={studentData?.name}
      studentId={studentData?.studentID}
      teamName={studentData?.team?.name}
      onLogout={handleLogout}
    >
      <div className="max-w-6xl mx-auto">
        {studentData.team ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Team Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  {studentData.team.name}
                </CardTitle>
                <CardDescription>{studentData.team.sport}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">Team Captain</p>
                    <p className="text-sm text-gray-600">You (Team Creator)</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">Sport</p>
                    <Badge variant="secondary">{studentData.team.sport}</Badge>
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
                You haven't been assigned to any team yet. Contact your sports administrator to get assigned to a team and start participating in sports activities.
              </p>
              <div className="space-y-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">How to Join a Team</h3>
                    <ul className="text-sm text-blue-800 space-y-2 text-left">
                      <li>• Contact your sports department administrator</li>
                      <li>• Browse available teams and request to join</li>
                      <li>• Request team assignment based on your sport preference</li>
                      <li>• Complete any required registration forms</li>
                      <li>• Attend team meetings and practice sessions</li>
                    </ul>
                  </CardContent>
                </Card>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={handleEmailAdmin} variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Admin
                  </Button>
                  <Button onClick={handleWhatsAppAdmin} variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
                <Button onClick={fetchAvailableTeams} variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Browse Available Teams
                </Button>
                <Link href="/student/events">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
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
              <Link href="/student/events">
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Events
                </Button>
              </Link>
              <Link href="/student/feed">
                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Community Feed
                </Button>
              </Link>
              <Link href="/student/dashboard">
                <Button variant="outline" className="w-full">
                  <Trophy className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Available Teams Modal/Section */}
        {showAvailableTeams && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Available Teams</h2>
              <Button onClick={() => setShowAvailableTeams(false)} variant="outline">
                Close
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableTeams.map((team) => (
                <Card key={team.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {team.name}
                      <Badge variant="secondary">{team.sport}</Badge>
                    </CardTitle>
                    <CardDescription>
                      {team.department} • {team._count.members} member{team._count.members !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">Team Members</p>
                        <span className="text-sm text-gray-500">{team._count.members}/{10} max</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleJoinTeam(team.id)}
                        disabled={joiningTeam || team._count.members >= 10}
                        className="w-full"
                      >
                        {joiningTeam ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                            Joining...
                          </>
                        ) : team._count.members >= 10 ? (
                          'Team Full'
                        ) : (
                          'Join Team'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {availableTeams.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Available Teams</h3>
                <p className="text-gray-500">There are currently no teams available to join. Contact admin to create new teams.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}