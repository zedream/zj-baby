import { db } from '~/server/db'
import { albums } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Album ID is required' })
  }

  const album = await db.select().from(albums).where(eq(albums.id, id)).get()

  if (!album) {
    throw createError({ statusCode: 404, message: 'Album not found' })
  }

  if (album.ownerId !== user.id) {
    throw createError({ statusCode: 403, message: 'Not authorized to delete this album' })
  }

  await db.delete(albums).where(eq(albums.id, id))

  return { success: true }
})
