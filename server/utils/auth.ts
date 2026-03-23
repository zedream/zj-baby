import { H3Event } from 'h3'
import { SignJWT, jwtVerify } from 'jose'
import { db } from '~/server/db'
import { users } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

const getSecret = () => new TextEncoder().encode(useRuntimeConfig().jwtSecret)

export interface JWTPayload {
  userId: string
  role: string
}

export async function signJWT(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret())
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function getUserFromEvent(event: H3Event) {
  // Check Authorization header for JWT
  const authHeader = getHeader(event, 'authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const payload = await verifyJWT(token)
    if (payload) {
      const user = await db.select().from(users).where(eq(users.id, payload.userId)).get()
      return user
    }
  }
  return null
}

export function requireAuth(event: H3Event) {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  return user
}
