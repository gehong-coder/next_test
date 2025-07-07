import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '../../../../lib/jwt'
import { sqlite, generateId } from '../../../../lib/sqlite'

async function getUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)

  if (!decoded) {
    return null
  }

  return decoded
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Initialize database
    await sqlite.init()

    const books = await sqlite.all(
      'SELECT * FROM books WHERE userId = ? ORDER BY createdAt DESC',
      [user.userId]
    )

    return NextResponse.json({ books })
  } catch (error) {
    console.error('Get books error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { title, author, isbn, description, genre, status, rating, notes } = await request.json()

    if (!title || !author) {
      return NextResponse.json(
        { error: 'Title and author are required' },
        { status: 400 }
      )
    }

    // Initialize database
    await sqlite.init()

    const bookId = generateId()
    
    await sqlite.run(
      'INSERT INTO books (id, title, author, isbn, description, genre, status, rating, notes, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [bookId, title, author, isbn, description, genre, status || 'unread', rating || 0, notes, user.userId]
    )

    const book = await sqlite.get(
      'SELECT * FROM books WHERE id = ?',
      [bookId]
    )

    return NextResponse.json({ book })
  } catch (error) {
    console.error('Create book error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}