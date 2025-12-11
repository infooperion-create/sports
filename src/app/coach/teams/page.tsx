'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Users, LogOut } from 'lucide-react'
import Link from 'next/link'

interface Team {
  id: string
  name: string
  sport: string
  createdAt: string
  members: Array<{
    id: string
    name: string
    studentID: string
  }>
  _count: {
    members: number
  }
}

export default function CoachTeams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [coachData, setCoachData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    fetchCoachData()
    fetchTeams()
  }, [])

  const fetchCoachData = async () => {
    try {
      let token = localStorage.getItem('token')
      
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
      }
    } catch (error) {
      console.error('Error fetching coach data:', error)
    }
  }

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/coach/teams', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setTeams(data)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
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

  return (
    <DashboardLayout
      userType="coach"
      userName={coachData?.name}
      teamName={coachData?.team?.name}
      onLogout={handleLogout}
      userData={coachData}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600">Browse and join available teams</p>
        </div>

        {/* Teams Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {team.name}
                  <Badge variant="secondary">{team.sport}</Badge>
                </CardTitle>
                <CardDescription>
                  {team._count.members} member{team._count.members !== 1 ? 's' : ''}
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
                    onClick={() => handleJoin(team.id)}
                    disabled={team._count.members >= 10}
                  >
                    {team._count.members >= 10 ? 'Team Full' : 'Join Team'}
                  </Button>
                </div>
                {team.members.length > 0 ? (
                  <div className="space-y-2">
                    {team.members.slice(0, 3).map((member) => (
                      <div key={member.id} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-gray-500">ID: {member.studentID}</p>
                        </div>
                      </div>
                    ))}
                    {team.members.length > 3 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{team.members.length - 3} more members
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No members yet. Be the first to join!
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {teams.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Teams Available</h3>
            <p className="text-gray-500 mb-4">Browse and join available teams to join!</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}