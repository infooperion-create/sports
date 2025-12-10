import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

// POST add member to team
export async function POST(request: NextRequest) {
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

    // Check if user is admin
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const { teamId, userId, role } = await request.json()

    if (!teamId || !userId || !role) {
      return NextResponse.json(
        { error: 'Team ID, User ID, and role are required' },
        { status: 400 }
      )
    }

    // Validate role
    if (!['MEMBER', 'CAPTAIN', 'COACH'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be MEMBER, CAPTAIN, or COACH' },
        { status: 400 }
      )
    }

    // Check if team exists
    const team = await db.team.findUnique({
      where: { id: teamId }
    })

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // If role is COACH, update team's coach
    if (role === 'COACH') {
      await db.team.update({
        where: { id: teamId },
        data: { coachId: userId }
      })
    } else {
      // For MEMBER or CAPTAIN, assign user to team
      await db.user.update({
        where: { id: userId },
        data: { teamID: teamId }
      })
    }

    return NextResponse.json({ 
      message: `User added to team as ${role} successfully`,
      teamId,
      userId,
      role
    })
  } catch (error) {
    console.error('Error adding member to team:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE remove member from team
export async function DELETE(request: NextRequest) {
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

    // Check if user is admin
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get('teamId')
    const userId = searchParams.get('userId')
    const role = searchParams.get('role')

    if (!teamId || !userId || !role) {
      return NextResponse.json(
        { error: 'Team ID, User ID, and role are required' },
        { status: 400 }
      )
    }

    // If role is COACH, remove coach from team
    if (role === 'COACH') {
      await db.team.update({
        where: { id: teamId },
        data: { coachId: null }
      })
    } else {
      // For MEMBER or CAPTAIN, remove user from team
      await db.user.update({
        where: { id: userId },
        data: { teamID: null }
      })
    }

    return NextResponse.json({ 
      message: `User removed from team successfully`,
      teamId,
      userId,
      role
    })
  } catch (error) {
    console.error('Error removing member from team:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}