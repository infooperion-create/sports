'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, User } from 'lucide-react'
import Link from 'next/link'

interface ProfileCompletionAlertProps {
  user: {
    profileCompleted: boolean
  }
}

export default function ProfileCompletionAlert({ user }: ProfileCompletionAlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  // Don't show if profile is completed or alert is dismissed
  if (user.profileCompleted || !isVisible) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-blue-50 border-b border-blue-200 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-blue-900">
                Complete your profile to unlock all features!
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Add your information to get personalized recommendations
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              asChild
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Link href="/student/settings">Complete Profile</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}