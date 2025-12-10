import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

// GET coach settings
export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header or cookies
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '') || 
                  request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }

    // Get coach data
    const coach = await db.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        dateOfBirth: true,
        phoneNumber: true,
        address: true,
        emergencyContact: true,
        medicalConditions: true,
        sportsInterests: true,
        skillLevel: true,
        preferredPosition: true,
        experience: true,
        achievements: true,
        profileImage: true,
        profileCompleted: true,
        team: {
          select: {
            id: true,
            name: true,
            sport: true
          }
        }
      }
    })

    if (!coach) {
      return NextResponse.json(
        { error: 'Coach not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(coach)
  } catch (error) {
    console.error('Error fetching coach settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update coach settings
export async function PUT(request: NextRequest) {
  try {
    // Get token from Authorization header or cookies
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '') || 
                  request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }

    const {
      name,
      email,
      dateOfBirth,
      phoneNumber,
      address,
      emergencyContact,
      medicalConditions,
      sportsInterests,
      skillLevel,
      preferredPosition,
      experience,
      achievements,
      profileImage
    } = await request.json()

    // Update coach data
    const updatedCoach = await db.user.update({
      where: { id: decoded.userId },
      data: {
        name,
        email,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        phoneNumber,
        address,
        emergencyContact,
        medicalConditions,
        sportsInterests,
        skillLevel,
        preferredPosition,
        experience,
        achievements,
        profileImage,
        profileCompleted: true
      }
    })

    return NextResponse.json(updatedCoach)
  } catch (error) {
    console.error('Error updating coach settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}