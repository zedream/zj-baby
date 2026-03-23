import { db } from '~/server/db'
import { favorites } from '~/server/db/schema'
import { eq, and, isNull } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  // Get visitorId from cookie if available
  const visitorId = getCookie(event, 'visitor_id')

  if (!visitorId) {
    return { merged: 0, message: 'No visitor ID found' }
  }

  // Find all pending favorites for this visitor
  const pendingFavorites = await db.select().from(favorites)
    .where(and(
      eq(favorites.visitorId, visitorId),
      eq(favorites.status, 'pending')
    ))

  if (pendingFavorites.length === 0) {
    return { merged: 0, message: 'No pending favorites to merge' }
  }

  // Update each pending favorite to merged status with the userId
  let mergedCount = 0

  for (const fav of pendingFavorites) {
    // Check if user already has this photo favorited
    const existing = await db.select().from(favorites)
      .where(and(
        eq(favorites.photoId, fav.photoId),
        eq(favorites.userId, user.id)
      ))
      .get()

    if (existing) {
      // Delete the duplicate pending one
      await db.delete(favorites).where(eq(favorites.id, fav.id))
    } else {
      // Merge: update visitorId -> userId, status -> merged
      await db.update(favorites)
        .set({
          userId: user.id,
          visitorId: null,
          status: 'merged',
          mergedAt: new Date(),
        })
        .where(eq(favorites.id, fav.id))
      mergedCount++
    }
  }

  return {
    merged: mergedCount,
    message: `Successfully merged ${mergedCount} favorites`,
  }
})
