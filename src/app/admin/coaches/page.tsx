'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import ProfileView from '@/components/layout/ProfileView'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, Plus, Edit, Trash2, Search, Filter, Mail, Phone, Eye } from 'lucide-react'

interface Coach {
  id: string
  name: string
  email: string
  role: string
  department?: string
  profileCompleted: boolean
  team?: {
    id: string
    name: string
    sport: string
  }
  createdAt: string
}

export default function AdminCoaches() {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: ''
  })
  const router = useRouter()

  useEffect(() => {
    fetchCoaches()
    // Get user name from localStorage
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setUserName(userData.name)
    }
  }, [])

  const fetchCoaches = async () => {
    try {
      let token = localStorage.getItem('token')
      
      if (!token) {
        const cookies = document.cookie.split(';')
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='))
        if (tokenCookie) {
          token = tokenCookie.trim().split('=')[1]
          // Sync back to localStorage
          localStorage.setItem('token', token)
        }
      }
      
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCoaches(data.filter((user: any) => user.role === 'COACH'))
      } else if (response.status === 401) {
        // Token is invalid, clear and redirect
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
        router.push('/login')
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching coaches:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCoach = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.department) {
      alert('Please fill in all required fields')
      return
    }

    try {
      let token = localStorage.getItem('token')
      
      if (!token) {
        const cookies = document.cookie.split(';')
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='))
        if (tokenCookie) {
          token = tokenCookie.trim().split('=')[1]
        }
      }

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          role: 'COACH'
        })
      })

      if (response.ok) {
        await fetchCoaches()
        setIsCreateDialogOpen(false)
        setFormData({
          name: '',
          email: '',
          password: '',
          department: ''
        })
        alert('Coach created successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create coach')
      }
    } catch (error) {
      console.error('Error creating coach:', error)
      alert('Error creating coach')
    }
  }

  const handleDeleteCoach = async (coachId: string) => {
    if (!confirm('Are you sure you want to delete this coach?')) {
      return
    }

    try {
      let token = localStorage.getItem('token')
      
      if (!token) {
        const cookies = document.cookie.split(';')
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='))
        if (tokenCookie) {
          token = tokenCookie.trim().split('=')[1]
        }
      }

      const response = await fetch(`/api/admin/users/${coachId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        await fetchCoaches()
        alert('Coach deleted successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete coach')
      }
    } catch (error) {
      console.error('Error deleting coach:', error)
      alert('Error deleting coach')
    }
  }

  const handleLogout = () => {
    router.push('/')
  }

  const handleViewProfile = async (coach: Coach) => {
    try {
      let token = localStorage.getItem('token')
      
      if (!token) {
        const cookies = document.cookie.split(';')
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='))
        if (tokenCookie) {
          token = tokenCookie.trim().split('=')[1]
        }
      }

      const response = await fetch(`/api/admin/users/${coach.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const coachData = await response.json()
        setSelectedCoach(coachData)
        setIsProfileDialogOpen(true)
      } else {
        alert('Failed to fetch coach profile')
      }
    } catch (error) {
      console.error('Error fetching coach profile:', error)
      alert('Error fetching coach profile')
    }
  }

  const filteredCoaches = coaches.filter(coach =>
    coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <DashboardLayout
      userType="admin"
      userName={userName}
      onLogout={handleLogout}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Coaches</h1>
            <p className="text-gray-600 mt-1">View and manage all coach accounts</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Coach
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Coach</DialogTitle>
                <DialogDescription>
                  Create a new coach account in the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter coach's full name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BS Computer Science">BS Computer Science</SelectItem>
                      <SelectItem value="BS English">BS English</SelectItem>
                      <SelectItem value="BS Physics">BS Physics</SelectItem>
                      <SelectItem value="BS Chemistry">BS Chemistry</SelectItem>
                      <SelectItem value="BS Mathematics">BS Mathematics</SelectItem>
                      <SelectItem value="BS Business Administration">BS Business Administration</SelectItem>
                      <SelectItem value="BS Economics">BS Economics</SelectItem>
                      <SelectItem value="BS Psychology">BS Psychology</SelectItem>
                      <SelectItem value="BS Sociology">BS Sociology</SelectItem>
                      <SelectItem value="BS Mass Communication">BS Mass Communication</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCoach}>
                  Add Coach
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search coaches by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Coaches List */}
        <Card>
          <CardHeader>
            <CardTitle>Coaches ({filteredCoaches.length})</CardTitle>
            <CardDescription>All registered coaches in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-gray-900">Coach</th>
                    <th className="text-left p-3 font-medium text-gray-900">Email</th>
                    <th className="text-left p-3 font-medium text-gray-900">Department</th>
                    <th className="text-left p-3 font-medium text-gray-900">Team</th>
                    <th className="text-left p-3 font-medium text-gray-900">Profile</th>
                    <th className="text-left p-3 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoaches.map((coach) => (
                    <tr key={coach.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {coach.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{coach.name}</p>
                            <Badge variant="secondary" className="text-xs">
                              {coach.role}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{coach.email}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-gray-600">{coach.department || 'N/A'}</span>
                      </td>
                      <td className="p-3">
                        {coach.team ? (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            {coach.team.name}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">No team</span>
                        )}
                      </td>
                      <td className="p-3">
                        <Badge className={coach.profileCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {coach.profileCompleted ? 'Complete' : 'Incomplete'}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewProfile(coach)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteCoach(coach.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Coach Profile Dialog */}
        <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Coach Profile</DialogTitle>
              <DialogDescription>
                View detailed coach information
              </DialogDescription>
            </DialogHeader>
            {selectedCoach && (
              <div className="mt-4">
                <ProfileView 
                  user={selectedCoach}
                  showEditButton={false}
                  title="Coach Profile"
                />
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsProfileDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}