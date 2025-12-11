import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

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

    const { subject, message, studentName, studentEmail, studentID } = await request.json()

    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 })
    }

    // Get admin user
    const admin = await db.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Here you would typically:
    // 1. Send an email to the admin
    // 2. Store the message in a database table
    // 3. Create a notification for the admin
    
    // For now, we'll just log it and return success
    console.log('📧 Student Contact Request:')
    console.log('From:', studentName, `(${studentEmail})`)
    console.log('Student ID:', studentID)
    console.log('Subject:', subject)
    console.log('Message:', message)
    console.log('Admin:', admin.name, `(${admin.email})`)
    
    // Create a post/announcement with the contact request (temporary solution)
    await db.post.create({
      data: {
        userID: admin.id,
        content: `📧 Contact Request from ${studentName} (${studentID}): ${subject}. Message: ${message}. Email: ${studentEmail}`,
      },
    })

    return NextResponse.json({ 
      message: 'Your message has been sent to the admin successfully. They will contact you soon.' 
    })

  } catch (error) {
    console.error('Error sending contact message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}