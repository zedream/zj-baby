import { db } from '~/server/db'
import { tags } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Tag ID is required' })
  }

  const tag = await db.select().from(tags).where(eq(tags.id, id)).get()

  if (!tag) {
    throw createError({ statusCode: 404, message: 'Tag not found' })
  }

  await db.delete(tags).where(eq(tags.id, id))

  return { success: true }
})
