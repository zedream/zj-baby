import { db } from '~/server/db'
import { photos, albums } from '~/server/db/schema'
import { eq, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { albumId } = query || {}

  let photoList

  if (albumId) {
    photoList = await db.select().from(photos)
      .where(eq(photos.albumId, albumId as string))
      .orderBy(photos.order)
  } else {
    photoList = await db.select().from(photos)
      .orderBy(desc(photos.createdAt))
  }

  return photoList
})
