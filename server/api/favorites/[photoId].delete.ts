import { db } from '~/server/db'
import { favorites } from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const photoId = getRouterParam(event, 'photoId')

  if (!photoId) {
    throw createError({ statusCode: 400, message: 'Photo ID is required' })
  }

  await db.delete(favorites)
    .where(and(eq(favorites.photoId, photoId), eq(favorites.userId, user.id)))

  return { success: true }
})
