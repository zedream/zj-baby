import { db } from '~/server/db'
import { albums, photos } from '~/server/db/schema'
import { eq, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Album ID is required' })
  }

  const album = await db.select().from(albums).where(eq(albums.id, id)).get()

  if (!album) {
    throw createError({ statusCode: 404, message: 'Album not found' })
  }

  // Get photos in this album
  const photoList = await db.select().from(photos)
    .where(eq(photos.albumId, id))
    .orderBy(photos.order)

  return {
    ...album,
    photos: photoList,
  }
})
