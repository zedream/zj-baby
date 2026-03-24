import { db } from '~/server/db'
import { users } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import bcrypt from 'bcryptjs'
import { signJWT } from '~/server/utils/auth'
import { mergeVisitorFavorites } from '~/server/utils/favorites'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { username, email, password } = body || {}

  // Validation
  if (!username || !email || !password) {
    throw createError({ statusCode: 400, message: 'Username, email and password are required' })
  }

  if (username.length < 3 || username.length > 30) {
    throw createError({ statusCode: 400, message: 'Username must be 3-30 characters' })
  }

  if (password.length < 6) {
    throw createError({ statusCode: 400, message: 'Password must be at least 6 characters' })
  }

  // Check existing
  const existing = await db.select().from(users)
    .where(eq(users.username, username))
    .get()

  if (existing) {
    throw createError({ statusCode: 400, message: 'Username already taken' })
  }

  const existingEmail = await db.select().from(users)
    .where(eq(users.email, email))
    .get()

  if (existingEmail) {
    throw createError({ statusCode: 400, message: 'Email already registered' })
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10)

  // Create user
  const userId = nanoid()
  const now = new Date()

  await db.insert(users).values({
    id: userId,
    username,
    email,
    passwordHash,
    role: 'user',
    createdAt: now,
  })

  // Merge visitor favorites on registration
  const visitorId = getCookie(event, 'visitor_id')
  const mergedCount = await mergeVisitorFavorites(userId, visitorId || null)

  // Generate token
  const token = await signJWT({ userId, role: 'user' })

  return {
    token,
    user: {
      id: userId,
      username,
      email,
      role: 'user',
    },
    mergedFavorites: mergedCount,
  }
})
