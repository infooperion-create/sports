'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import ProfileView from '@/components/layout/ProfileView'
import { User, Calendar, Phone, Home, AlertTriangle, Trophy, Target, Award, Star, Camera } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface CoachData {
  id: string
  name: string
  email: string
  studentID: string
  department?: string
  team?: {
    id: string
    name: string
    sport: string
  }
  profileCompleted: boolean
  dateOfBirth?: string
  phoneNumber?: string
  address?: string
  emergencyContact?: string
  medicalConditions?: string
  sportsInterests?: string
  skillLevel?: string
  preferredPosition?: string
  experience?: string
  achievements?: string
  profileImage?: string
}

export default function CoachSettings() {
  const [coachData, setCoachData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Settings state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    phoneNumber: '',
    address: '',
    emergencyContact: '',
    medicalConditions: '',
    sportsInterests: '',
    skillLevel: '',
    preferredPosition: '',
    experience: '',
    achievements: ''
  })

  useEffect(() => {
    fetchCoachData()
  }, [])

  const fetchCoachData = async () => {
    try {
      let token = localStorage.getItem('token')
      
      if (!token) {
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
        const data = await response.json()
        setCoachData(data.student)
        
        // Parse sports interests if it's a JSON string
        let sportsInterests = ''
        if (data.coach.sportsInterests) {
          try {
            const parsed = JSON.parse(data.coach.sportsInterests)
            sportsInterests = Array.isArray(parsed) ? parsed.join(', ') : data.coach.sportsInterests
          } catch {
            sportsInterests = data.coach.sportsInterests
          }
        }
        
        setFormData({
          name: data.coach.name,
          email: data.coach.email,
          dateOfBirth: data.coach.dateOfBirth ? new Date(data.coach.dateOfBirth).toISOString().split('T')[0] : '',
          phoneNumber: data.coach.phoneNumber || '',
          address: data.coach.address || '',
          emergencyContact: data.coach.emergencyContact || '',
          medicalConditions: data.coach.medicalConditions || '',
          sportsInterests: sportsInterests,
          skillLevel: data.coach.skillLevel || '',
          preferredPosition: data.coach.preferredPosition || '',
          experience: data.coach.experience || '',
          achievements: data.coach.achievements || ''
        })
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching student data:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    router.push('/login')
  }

  const calculateProfileCompletion = () => {
    const fields = [
      'dateOfBirth',
      'phoneNumber',
      'address',
      'emergencyContact',
      'medicalConditions',
      'sportsInterests',
      'skillLevel',
      'preferredPosition',
      'experience',
      'achievements'
    ]

    const completedFields = fields.filter(field => 
      formData[field as keyof typeof formData] && 
      formData[field as keyof typeof formData] !== ''
    )

    return Math.round((completedFields.length / fields.length) * 100)
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      let token = localStorage.getItem('token')
      if (!token) {
        const cookies = document.cookie.split(';')
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='))
        if (tokenCookie) {
          token = tokenCookie.trim().split('=')[1]
        }
      }

      // Parse sports interests into JSON array
      let sportsInterestsJson = ''
      if (formData.sportsInterests) {
        const sportsArray = formData.sportsInterests.split(',').map(s => s.trim()).filter(s => s)
        sportsInterestsJson = JSON.stringify(sportsArray)
      }

      const profileData = {
        ...formData,
        sportsInterests: sportsInterestsJson,
        profileCompleted: calculateProfileCompletion() >= 80
      }

      const response = await fetch('/api/coach/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      })

      if (response.ok) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        })
        
        // Refresh student data
        await fetchCoachData()
        setIsEditing(false)
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating your profile.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleEditProfile = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    // Reset form data to original values
    if (coachData) {
      let sportsInterests = ''
      if (coachData.sportsInterests) {
        try {
          const parsed = JSON.parse(coachData.sportsInterests)
          sportsInterests = Array.isArray(parsed) ? parsed.join(', ') : coachData.sportsInterests
        } catch {
          sportsInterests = coachData.sportsInterests
        }
      }
      
      setFormData({
        name: coachData.name,
        email: coachData.email,
        dateOfBirth: coachData.dateOfBirth ? new Date(coachData.dateOfBirth).toISOString().split('T')[0] : '',
        phoneNumber: coachData.phoneNumber || '',
        address: coachData.address || '',
        emergencyContact: coachData.emergencyContact || '',
        medicalConditions: coachData.medicalConditions || '',
        sportsInterests: sportsInterests,
        skillLevel: coachData.skillLevel || '',
        preferredPosition: coachData.preferredPosition || '',
        experience: coachData.experience || '',
        achievements: coachData.achievements || ''
      })
    }
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

  // Show profile view if profile is completed and not editing
  if (coachData.profileCompleted && !isEditing) {
    return (
      <DashboardLayout
        userType="coach"
        userName={coachData.name}
        teamName={coachData.team?.name}
        onLogout={handleLogout}
        userData={coachData}
      >
        <ProfileView 
          user={coachData}
          onEdit={handleEditProfile}
          title="My Profile"
        />
      </DashboardLayout>
    )
  }

  // Show edit form for incomplete profiles or when editing
  const completionPercentage = calculateProfileCompletion()

  return (
    <DashboardLayout
      userType="coach"
      userName={coachData.name}
      teamName={coachData.team?.name}
      onLogout={handleLogout}
      userData={coachData}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Profile' : 'Complete Your Profile'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing 
                ? 'Update your profile information' 
                : 'Complete your profile to get personalized recommendations and better team matching'
              }
            </p>
          </div>
          {isEditing && (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancelEdit} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>

        {/* Profile Completion Progress */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-blue-600" />
              <span>Profile Completion</span>
            </CardTitle>
            <CardDescription>
              Complete your profile to get personalized recommendations and better team matching
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Profile Strength</span>
                <span className="text-sm font-bold">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  {completionPercentage < 50 ? 'Just getting started!' : 
                   completionPercentage < 80 ? 'Almost there!' : 
                   'Excellent! Your profile is complete.'}
                </span>
                {completionPercentage >= 80 && (
                  <Badge className="bg-green-100 text-green-800">
                    <Star className="w-3 h-3 mr-1" />
                    Complete
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentID">Student ID</Label>
                <Input value={coachData.studentID} disabled className="mt-1 bg-gray-50" />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Contact Information</span>
            </CardTitle>
            <CardDescription>
              Your contact details for team communication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Your phone number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  placeholder="Emergency contact number"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Your address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sports Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Sports Profile</span>
            </CardTitle>
            <CardDescription>
              Tell us about your sports interests and experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="sportsInterests">Sports Interests</Label>
              <Input
                id="sportsInterests"
                placeholder="e.g., Cricket, Football, Basketball, Tennis"
                value={formData.sportsInterests}
                onChange={(e) => setFormData({ ...formData, sportsInterests: e.target.value })}
                className="mt-1"
              />
              <p className="text-xs text-gray-600 mt-1">Separate multiple sports with commas</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="skillLevel">Skill Level</Label>
                <select
                  id="skillLevel"
                  value={formData.skillLevel}
                  onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
                  className="w-full px-3 py-2 border border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  <option value="">Select your skill level</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
              <div>
                <Label htmlFor="preferredPosition">Preferred Position</Label>
                <Input
                  id="preferredPosition"
                  placeholder="e.g., Captain, Forward, Goalkeeper"
                  value={formData.preferredPosition}
                  onChange={(e) => setFormData({ ...formData, preferredPosition: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                placeholder="e.g., 2 years of competitive cricket"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="achievements">Achievements</Label>
              <textarea
                id="achievements"
                placeholder="Tell us about your sports achievements and awards"
                value={formData.achievements}
                onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Medical Information</span>
            </CardTitle>
            <CardDescription>
              Any medical conditions we should be aware of for your safety
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="medicalConditions">Medical Conditions</Label>
              <textarea
                id="medicalConditions"
                placeholder="Any allergies, medical conditions, or injuries we should know about"
                value={formData.medicalConditions}
                onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <p className="text-xs text-gray-600 mt-1">This information is kept confidential and is only used for safety purposes</p>
            </div>
          </CardContent>
        </Card>

        {/* Team Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Team Information</span>
            </CardTitle>
            <CardDescription>
              Your current team status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Current Team</Label>
                <Input 
                  value={coachData.team?.name || 'No team assigned'} 
                  disabled 
                  className="mt-1 bg-gray-50" 
                />
              </div>
              <div>
                <Label>Sport</Label>
                <Input 
                  value={coachData.team?.sport || 'N/A'} 
                  disabled 
                  className="mt-1 bg-gray-50" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        {!isEditing && (
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => router.push('/coach/dashboard')}>
              Skip for Now
            </Button>
            <Button onClick={handleSaveProfile} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving ? 'Saving...' : 'Complete Profile'}
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}