import Database from 'sqlite3'
import { promisify } from 'util'

const dbPath = './data.db'

class SQLiteDB {
  private db: Database.Database | null = null

  async connect() {
    if (this.db) return this.db

    return new Promise<Database.Database>((resolve, reject) => {
      this.db = new Database.Database(dbPath, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(this.db!)
        }
      })
    })
  }

  async run(sql: string, params: any[] = []): Promise<any> {
    const db = await this.connect()
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err)
        else resolve({ id: this.lastID, changes: this.changes })
      })
    })
  }

  async get(sql: string, params: any[] = []): Promise<any> {
    const db = await this.connect()
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })
  }

  async all(sql: string, params: any[] = []): Promise<any[]> {
    const db = await this.connect()
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })
  }

  async init() {
    await this.connect()
    
    // Create users table
    await this.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create books table
    await this.run(`
      CREATE TABLE IF NOT EXISTS books (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        isbn TEXT,
        description TEXT,
        genre TEXT,
        status TEXT DEFAULT 'unread',
        rating INTEGER DEFAULT 0,
        notes TEXT,
        userId TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Create feedback table
    await this.run(`
      CREATE TABLE IF NOT EXISTS feedback (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }
}

export const sqlite = new SQLiteDB()

// Helper function to generate unique IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}