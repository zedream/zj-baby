import { db } from '~/server/db'
import { favorites, photos } from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const body = await readBody(event)

  const { photoId } = body || {}

  if (!photoId) {
    throw createError({ statusCode: 400, message: 'photoId is required' })
  }

  // Check if photo exists
  const photo = await db.select().from(photos).where(eq(photos.id, photoId)).get()

  if (!photo) {
    throw createError({ statusCode: 404, message: 'Photo not found' })
  }

  // Check if already favorited
  const existing = await db.select().from(favorites)
    .where(and(eq(favorites.photoId, photoId), eq(favorites.userId, user.id)))
    .get()

  if (existing) {
    return { success: true, message: 'Already favorited' }
  }

  const favId = nanoid()
  const now = new Date()

  await db.insert(favorites).values({
    id: favId,
    photoId,
    userId: user.id,
    status: 'pending',
    createdAt: now,
  })

  return {
    id: favId,
    photoId,
    status: 'pending',
  }
})
