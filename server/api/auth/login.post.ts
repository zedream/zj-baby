import { db } from '~/server/db'
import { users } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { signJWT } from '~/server/utils/auth'
import { mergeVisitorFavorites } from '~/server/utils/favorites'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { email, password } = body || {}

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email and password are required' })
  }

  const user = await db.select().from(users)
    .where(eq(users.email, email))
    .get()

  if (!user) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)

  if (!valid) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  // Merge visitor favorites on login
  const visitorId = getCookie(event, 'visitor_id')
  const mergedCount = await mergeVisitorFavorites(user.id, visitorId || null)

  const token = await signJWT({ userId: user.id, role: user.role })

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    mergedFavorites: mergedCount,
  }
})
