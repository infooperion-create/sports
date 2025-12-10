'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Calendar, 
  Phone, 
  Home, 
  AlertTriangle, 
  Trophy, 
  Target, 
  Award, 
  Star,
  Mail,
  IdCard,
  Users,
  Activity,
  Shield,
  MapPin
} from 'lucide-react'

interface ProfileViewProps {
  user: {
    id: string
    name: string
    email: string
    studentID: string
    department?: string
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
    profileCompleted: boolean
    team?: {
      id: string
      name: string
      sport: string
    }
  }
  showEditButton?: boolean
  onEdit?: () => void
  title?: string
}

export default function ProfileView({ 
  user, 
  showEditButton = true, 
  onEdit,
  title = "Profile Overview"
}: ProfileViewProps) {
  const [showMedicalInfo, setShowMedicalInfo] = useState(false)

  // Parse sports interests if it's a JSON string
  let sportsInterestsArray: string[] = []
  if (user.sportsInterests) {
    try {
      const parsed = JSON.parse(user.sportsInterests)
      sportsInterestsArray = Array.isArray(parsed) ? parsed : [user.sportsInterests]
    } catch {
      sportsInterestsArray = user.sportsInterests.split(',').map(s => s.trim()).filter(s => s)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getSkillLevelColor = (level?: string) => {
    switch (level) {
      case 'EXPERT': return 'bg-purple-100 text-purple-800'
      case 'ADVANCED': return 'bg-blue-100 text-blue-800'
      case 'INTERMEDIATE': return 'bg-green-100 text-green-800'
      case 'BEGINNER': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSkillLevelLabel = (level?: string) => {
    switch (level) {
      case 'EXPERT': return 'Expert'
      case 'ADVANCED': return 'Advanced'
      case 'INTERMEDIATE': return 'Intermediate'
      case 'BEGINNER': return 'Beginner'
      default: return 'Not specified'
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-1">
            {user.profileCompleted ? 'Complete profile information' : 'Profile completion in progress'}
          </p>
        </div>
        {showEditButton && onEdit && (
          <Button onClick={onEdit} className="bg-blue-600 hover:bg-blue-700">
            <Award className="w-4 h-4 mr-2" />
            Update Profile
          </Button>
        )}
      </div>

      {/* Profile Completion Status */}
      <Card className={`${
        user.profileCompleted 
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
          : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
      }`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              user.profileCompleted 
                ? 'bg-green-500' 
                : 'bg-blue-500'
            }`}>
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={user.profileCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                  {user.profileCompleted ? (
                    <>
                      <Star className="w-3 h-3 mr-1" />
                      Profile Complete
                    </>
                  ) : (
                    <>
                      <Activity className="w-3 h-3 mr-1" />
                      In Progress
                    </>
                  )}
                </Badge>
                {user.team && (
                  <Badge variant="outline">
                    <Users className="w-3 h-3 mr-1" />
                    {user.team.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <IdCard className="w-4 h-4" />
                  <span>Student ID</span>
                </div>
                <p className="font-medium">{user.studentID}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </div>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Date of Birth</span>
              </div>
              <p className="font-medium">{formatDate(user.dateOfBirth)}</p>
            </div>

            {user.department && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>Department</span>
                  </div>
                  <p className="font-medium">{user.department}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>Phone Number</span>
              </div>
              <p className="font-medium">{user.phoneNumber || 'Not specified'}</p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <AlertTriangle className="w-4 h-4" />
                <span>Emergency Contact</span>
              </div>
              <p className="font-medium">{user.emergencyContact || 'Not specified'}</p>
            </div>

            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Address</span>
              </div>
              <p className="font-medium">{user.address || 'Not specified'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Sports Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Sports Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Target className="w-4 h-4" />
                <span>Sports Interests</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sportsInterestsArray.length > 0 ? (
                  sportsInterestsArray.map((sport, index) => (
                    <Badge key={index} variant="outline">
                      {sport}
                    </Badge>
                  ))
                ) : (
                  <p className="font-medium">Not specified</p>
                )}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Award className="w-4 h-4" />
                  <span>Skill Level</span>
                </div>
                <Badge className={getSkillLevelColor(user.skillLevel)}>
                  {getSkillLevelLabel(user.skillLevel)}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>Preferred Position</span>
                </div>
                <p className="font-medium">{user.preferredPosition || 'Not specified'}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Activity className="w-4 h-4" />
                <span>Experience</span>
              </div>
              <p className="font-medium">{user.experience || 'Not specified'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Team Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Team Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.team ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Team Name</span>
                    </div>
                    <p className="font-medium">{user.team.name}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Trophy className="w-4 h-4" />
                      <span>Sport</span>
                    </div>
                    <Badge variant="outline">{user.team.sport}</Badge>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-green-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">Active Team Member</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No Team Assigned</p>
                <p className="text-sm text-gray-500">Contact sports administrator to join a team</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      {user.achievements && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Achievements & Awards</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-gray-800 whitespace-pre-wrap">{user.achievements}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medical Information */}
      {user.medicalConditions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Medical Information</span>
            </CardTitle>
            <CardDescription>
              Confidential information for safety purposes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!showMedicalInfo ? (
                <div className="text-center py-6">
                  <Shield className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Protected Information</p>
                  <p className="text-sm text-gray-500 mb-4">Medical details are hidden for privacy</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowMedicalInfo(true)}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Show Medical Information
                  </Button>
                </div>
              ) : (
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 text-red-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">Medical Conditions</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowMedicalInfo(false)}
                      className="text-red-600 hover:bg-red-100"
                    >
                      Hide
                    </Button>
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap">{user.medicalConditions}</p>
                  <p className="text-xs text-red-600 mt-3">
                    This information is confidential and should only be used for emergency situations.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}