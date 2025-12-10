import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

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

    // Check if user is coach
    if (decoded.role !== 'COACH') {
      return NextResponse.json(
        { error: 'Forbidden - Coach access required' },
        { status: 403 }
      )
    }

    // Get coach data
    const coach = await db.user.findUnique({
      where: { id: decoded.userId },
      include: {
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

    // Get recent posts
    const posts = await db.post.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
            team: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    // Get upcoming events
    const events = await db.event.findMany({
      where: {
        date: {
          gte: new Date()
        }
      },
      take: 5,
      orderBy: { date: 'asc' },
      include: {
        creator: {
          select: {
            name: true
          }
        }
      }
    })

    // Get team members if coach has a team
    let teamMembers: Array<{name: string, email: string, studentID: string | null}> = []
    if (coach.team) {
      teamMembers = await db.user.findMany({
        where: {
          teamID: coach.team.id,
          role: 'STUDENT'
        },
        select: {
          name: true,
          email: true,
          studentID: true
        }
      })
    }

    const dashboardData = {
      coach: {
        id: coach.id,
        name: coach.name,
        email: coach.email,
        role: coach.role,
        team: coach.team
      },
      posts,
      events,
      teamMembers
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Error fetching coach dashboard data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}