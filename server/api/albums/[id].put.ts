import { db } from '~/server/db'
import { albums } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, message: 'Album ID is required' })
  }

  const album = await db.select().from(albums).where(eq(albums.id, id)).get()

  if (!album) {
    throw createError({ statusCode: 404, message: 'Album not found' })
  }

  if (album.ownerId !== user.id) {
    throw createError({ statusCode: 403, message: 'Not authorized to update this album' })
  }

  const { name, description, visibility, coverPhotoId } = body || {}

  await db.update(albums)
    .set({
      name: name ?? album.name,
      description: description ?? album.description,
      visibility: visibility ?? album.visibility,
      coverPhotoId: coverPhotoId ?? album.coverPhotoId,
      updatedAt: new Date(),
    })
    .where(eq(albums.id, id))

  return { success: true }
})
