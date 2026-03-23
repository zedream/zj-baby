import { db } from '~/server/db'
import { photos, albums } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const body = await readBody(event)

  const { albumId, filename, cdnUrl, thumbnailUrl, width, height, takenAt, order } = body || {}

  if (!albumId || !filename || !cdnUrl || !thumbnailUrl) {
    throw createError({ statusCode: 400, message: 'albumId, filename, cdnUrl and thumbnailUrl are required' })
  }

  // Verify album ownership
  const album = await db.select().from(albums).where(eq(albums.id, albumId)).get()

  if (!album) {
    throw createError({ statusCode: 404, message: 'Album not found' })
  }

  if (album.ownerId !== user.id) {
    throw createError({ statusCode: 403, message: 'Not authorized to add photos to this album' })
  }

  const photoId = nanoid()
  const now = new Date()

  await db.insert(photos).values({
    id: photoId,
    albumId,
    filename,
    cdnUrl,
    thumbnailUrl,
    width: width || null,
    height: height || null,
    takenAt: takenAt ? new Date(takenAt) : null,
    order: order || 0,
    createdAt: now,
  })

  return {
    id: photoId,
    albumId,
    filename,
    cdnUrl,
    thumbnailUrl,
    width: width || null,
    height: height || null,
    takenAt: takenAt || null,
    order: order || 0,
  }
})
