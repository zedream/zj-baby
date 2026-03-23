import { db } from '~/server/db'
import { photos, albums } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

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
    throw createError({ statusCode: 403, message: 'Not authorized to update this photo' })
  }

  const { filename, cdnUrl, thumbnailUrl, width, height, takenAt, order } = body || {}

  await db.update(photos)
    .set({
      filename: filename ?? photo.filename,
      cdnUrl: cdnUrl ?? photo.cdnUrl,
      thumbnailUrl: thumbnailUrl ?? photo.thumbnailUrl,
      width: width ?? photo.width,
      height: height ?? photo.height,
      takenAt: takenAt ? new Date(takenAt) : photo.takenAt,
      order: order ?? photo.order,
    })
    .where(eq(photos.id, id))

  return { success: true }
})
