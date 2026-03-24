import { db } from '~/server/db'
import { favorites } from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'

export async function mergeVisitorFavorites(userId: string, visitorId: string | null): Promise<number> {
  if (!visitorId) return 0

  // Find all pending favorites for this visitor
  const pendingFavorites = await db.select().from(favorites)
    .where(and(
      eq(favorites.visitorId, visitorId),
      eq(favorites.status, 'pending')
    ))

  if (pendingFavorites.length === 0) return 0

  let mergedCount = 0

  for (const fav of pendingFavorites) {
    // Check if user already has this photo favorited
    const existing = await db.select().from(favorites)
      .where(and(
        eq(favorites.photoId, fav.photoId),
        eq(favorites.userId, userId)
      ))
      .get()

    if (existing) {
      // Delete the duplicate pending one
      await db.delete(favorites).where(eq(favorites.id, fav.id))
    } else {
      // Merge: update visitorId -> userId, status -> merged
      await db.update(favorites)
        .set({
          userId: userId,
          visitorId: null,
          status: 'merged',
          mergedAt: new Date(),
        })
        .where(eq(favorites.id, fav.id))
      mergedCount++
    }
  }

  return mergedCount
}
