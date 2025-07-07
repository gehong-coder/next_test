import { NextRequest, NextResponse } from 'next/server'
import { sqlite, generateId } from '../../../../lib/sqlite'

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Initialize database
    await sqlite.init()

    const feedbackId = generateId()
    
    await sqlite.run(
      'INSERT INTO feedback (id, name, email, message) VALUES (?, ?, ?, ?)',
      [feedbackId, name, email, message]
    )

    return NextResponse.json({ 
      success: true,
      message: 'Feedback submitted successfully' 
    })
  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}