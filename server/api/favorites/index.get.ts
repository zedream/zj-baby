import { db } from '~/server/db'
import { favorites, photos } from '~/server/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  const favList = await db.select({
    id: favorites.id,
    photoId: favorites.photoId,
    status: favorites.status,
    createdAt: favorites.createdAt,
    photo: photos,
  })
    .from(favorites)
    .leftJoin(photos, eq(favorites.photoId, photos.id))
    .where(eq(favorites.userId, user.id))
    .orderBy(desc(favorites.createdAt))

  return favList
})
