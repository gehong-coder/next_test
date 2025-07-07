import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '../../../../../lib/jwt'
import { sqlite } from '../../../../../lib/sqlite'

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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const book = await sqlite.get(
      'SELECT * FROM books WHERE id = ? AND userId = ?',
      [params.id, user.userId]
    )

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ book })
  } catch (error) {
    console.error('Get book error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { title, author, isbn, description, genre, status, rating, notes } = await request.json()

    // Initialize database
    await sqlite.init()

    // Check if book exists and belongs to user
    const existingBook = await sqlite.get(
      'SELECT * FROM books WHERE id = ? AND userId = ?',
      [params.id, user.userId]
    )

    if (!existingBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    await sqlite.run(
      'UPDATE books SET title = ?, author = ?, isbn = ?, description = ?, genre = ?, status = ?, rating = ?, notes = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [title, author, isbn, description, genre, status, rating, notes, params.id]
    )

    const book = await sqlite.get(
      'SELECT * FROM books WHERE id = ?',
      [params.id]
    )

    return NextResponse.json({ book })
  } catch (error) {
    console.error('Update book error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if book exists and belongs to user
    const existingBook = await sqlite.get(
      'SELECT * FROM books WHERE id = ? AND userId = ?',
      [params.id, user.userId]
    )

    if (!existingBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    await sqlite.run(
      'DELETE FROM books WHERE id = ?',
      [params.id]
    )

    return NextResponse.json({ message: 'Book deleted successfully' })
  } catch (error) {
    console.error('Delete book error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}