import { db } from '~/server/db'
import { photos, albums } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Photo ID is required' })
  }

  const photo = await db.select().from(photos).where(eq(photos.id, id)).get()

  if (!photo) {
    throw createError({ statusCode: 404, message: 'Photo not found' })
  }

  // Check album ownership
  const album = await db.select().from(albums).where(eq(albums.id, photo.albumId)).get()

  if (!album || album.ownerId !== user.id) {
    throw createError({ statusCode: 403, message: 'Not authorized to delete this photo' })
  }

  await db.delete(photos).where(eq(photos.id, id))

  return { success: true }
})
