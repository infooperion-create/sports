import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all teams with member count and members
    const teams = await db.team.findMany({
      include: {
        members: {
          select: {
            id: true,
            name: true,
            studentID: true
          }
        },
        _count: {
          select: {
            members: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format the response
    const formattedTeams = teams.map(team => ({
      id: team.id,
      name: team.name,
      sport: team.sport,
      department: team.department,
      createdAt: team.createdAt.toISOString(),
      members: team.members,
      _count: {
        members: team._count.members
      }
    }))

    return NextResponse.json(formattedTeams)

  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { teamId } = await request.json()

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 })
    }

    // Get the student
    const student = await db.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Get the team with member count
    const team = await db.team.findUnique({
      where: { id: teamId },
      include: {
        _count: {
          select: {
            members: true
          }
        }
      }
    })

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    // Check if team is full (max 10 members)
    if (team._count.members >= 10) {
      return NextResponse.json({ error: 'Team is full' }, { status: 400 })
    }

    // Check if student is already in a team
    if (student.teamID) {
      return NextResponse.json({ error: 'You are already in a team' }, { status: 400 })
    }

    // Join the team
    await db.user.update({
      where: { id: decoded.userId },
      data: { teamID: teamId }
    })

    return NextResponse.json({ message: 'Successfully joined team' })

  } catch (error) {
    console.error('Error joining team:', error)
    return NextResponse.json({ error: 'Failed to join team' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, sport } = await request.json()

    if (!name || !sport) {
      return NextResponse.json({ error: 'Team name and sport are required' }, { status: 400 })
    }

    // Get the student
    const student = await db.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Check if student is already in a team
    if (student.teamID) {
      return NextResponse.json({ error: 'You are already in a team' }, { status: 400 })
    }

    // Create the team
    const team = await db.team.create({
      data: {
        name,
        sport,
        department: student.department || 'General',
        createdBy: decoded.userId
      }
    })

    // Assign student to the team
    await db.user.update({
      where: { id: decoded.userId },
      data: { teamID: team.id }
    })

    return NextResponse.json({ message: 'Team created successfully' })

  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 })
  }
}