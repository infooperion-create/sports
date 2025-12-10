import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, studentID, department, role } = await request.json()

    if (!name || !email || !password || !department || !role) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    // Validate role-specific fields
    if (role === 'STUDENT' && !studentID) {
      return NextResponse.json(
        { error: 'Student ID is required for students' },
        { status: 400 }
      )
    }

    if (role !== 'STUDENT' && role !== 'COACH') {
      return NextResponse.json(
        { error: 'Invalid role. Must be STUDENT or COACH' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Check if student ID already exists (only for students)
    if (role === 'STUDENT' && studentID) {
      const existingStudentID = await db.user.findUnique({
        where: { studentID }
      })

      if (existingStudentID) {
        return NextResponse.json(
          { error: 'Student ID already exists' },
          { status: 409 }
        )
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user with specified role
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role, // Use the role from request
        studentID: role === 'STUDENT' ? studentID : null,
        department: department
      }
    })

    // Generate token
    const token = generateToken(user.id, user.email, user.role)

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'User created successfully',
      token,
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}