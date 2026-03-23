import { db } from '~/server/db'
import { photos } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Photo ID is required' })
  }

  const photo = await db.select().from(photos).where(eq(photos.id, id)).get()

  if (!photo) {
    throw createError({ statusCode: 404, message: 'Photo not found' })
  }

  return photo
})
