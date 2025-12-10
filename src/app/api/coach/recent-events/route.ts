import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

// GET recent events for coach
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

    // Get coach's team events
    const coach = await db.user.findUnique({
      where: { id: decoded.userId },
      include: {
        coachedTeams: {
          include: {
            members: true
          }
        }
      }
    })

    let events: any[] = []
    if (coach && coach.coachedTeams.length > 0) {
      // Get events for coach's teams
      events = await db.event.findMany({
        where: {
          OR: [
            ...coach.coachedTeams.map((team: any) => ({
              teamAID: team.id
            })),
            ...coach.coachedTeams.map((team: any) => ({
              teamBID: team.id
            }))
          ]
        },
        orderBy: { date: 'desc' },
        take: 10,
        include: {
          creator: {
            select: {
              name: true
            }
          }
        }
      })
    }

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching recent events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}