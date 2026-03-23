import { db } from '~/server/db'
import { albums, photos } from '~/server/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const query = getQuery(event)

  let where = eq(albums.visibility, 'public')

  // If logged in, also show user's own private albums
  if (user) {
    where = eq(albums.ownerId, user.id)
  }

  const albumList = await db.select().from(albums)
    .where(where)
    .orderBy(desc(albums.createdAt))

  return albumList
})
