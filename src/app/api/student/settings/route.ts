import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

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
      profileCompleted
    } = await request.json()

    // Update student profile
    const updatedStudent = await db.user.update({
      where: { id: decoded.userId },
      data: {
        name,
        email,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        phoneNumber,
        address,
        emergencyContact,
        medicalConditions,
        sportsInterests,
        skillLevel,
        preferredPosition,
        experience,
        achievements,
        profileCompleted: profileCompleted || false
      }
    })

    // Return updated student data without password
    const { password: _, ...studentWithoutPassword } = updatedStudent

    return NextResponse.json({
      message: 'Profile updated successfully',
      student: studentWithoutPassword
    })

  } catch (error) {
    console.error('Student settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}