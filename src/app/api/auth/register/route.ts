import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sqlite, generateId } from '../../../../../lib/sqlite'
import { signToken } from '../../../../../lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Initialize database
    await sqlite.init()

    // Check if user already exists
    const existingUser = await sqlite.get(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = generateId()

    // Create user
    await sqlite.run(
      'INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)',
      [userId, email, hashedPassword, name]
    )

    const user = {
      id: userId,
      email,
      name
    }

    // Generate token
    const token = signToken({ userId: user.id, email: user.email })

    return NextResponse.json({
      token,
      user
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}