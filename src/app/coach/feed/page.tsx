'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Heart, 
  MessageCircle,
  Share,
  MoreHorizontal,
  Calendar,
  Users,
  Megaphone,
  FileText
} from 'lucide-react'
import Link from 'next/link'

interface Post {
  id: string
  content: string
  imageURL?: string
  postType: 'POST' | 'ANNOUNCEMENT'
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

export default function StudentFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [coachData, setCoachData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    fetchCoachData()
    fetchPosts()
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
      }
    } catch (error) {
      console.error('Error fetching student data:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/coach/feed', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = document.createElement('div')
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`
    toast.textContent = message
    document.body.appendChild(toast)
    
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 3000)
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

  return (
    <DashboardLayout
      userType="coach"
      userName={coachData?.name}
      studentId={coachData?.studentID}
      teamName={coachData?.team?.name}
      onLogout={handleLogout}
      userData={coachData}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sports Feed</h1>
            <p className="text-gray-600 mt-1">Posts and announcements from the sports community</p>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className={`hover:shadow-lg transition-all duration-200 overflow-hidden ${
              post.postType === 'ANNOUNCEMENT' ? 'border-l-4 border-l-orange-500 bg-orange-50/30' : ''
            }`}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className={`font-semibold ${
                        post.postType === 'ANNOUNCEMENT' 
                          ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white' 
                          : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
                      }`}>
                        {post.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900">
                          {post.user.name}
                        </p>
                        <Badge variant={post.user.role === 'ADMIN' ? 'destructive' : 'secondary'} className="text-xs">
                          {post.user.role}
                        </Badge>
                        <Badge variant={post.postType === 'ANNOUNCEMENT' ? 'default' : 'outline'} className="text-xs">
                          {post.postType === 'ANNOUNCEMENT' ? (
                            <>
                              <Megaphone className="w-3 h-3 mr-1" />
                              Announcement
                            </>
                          ) : (
                            <>
                              <FileText className="w-3 h-3 mr-1" />
                              Post
                            </>
                          )}
                        </Badge>
                        {post.user.team && (
                          <Badge variant="outline" className="text-xs">
                            {post.user.team.name}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-pink-50 hover:text-pink-600"
                      onClick={() => showToast('Like feature coming soon!', 'success')}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => showToast('Comment feature coming soon!', 'success')}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-green-50 hover:text-green-600"
                      onClick={() => showToast('Share feature coming soon!', 'success')}
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  
                  {/* Image Section - Only show if image is actually attached */}
                  {post.imageURL && (
                    <div className="relative group">
                      <img 
                        src={post.imageURL} 
                        alt="Post image"
                        className="w-full rounded-lg object-cover max-h-96 transition-transform duration-200 group-hover:scale-[1.02]"
                        onError={(e) => {
                          console.error('Image failed to load:', post.imageURL);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Posts Yet</h3>
            <p className="text-gray-500">Check back later for posts and announcements from the sports community</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}