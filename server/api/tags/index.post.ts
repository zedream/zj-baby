import { db } from '~/server/db'
import { tags } from '~/server/db/schema'
import { nanoid } from 'nanoid'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const body = await readBody(event)

  const { name, slug } = body || {}

  if (!name) {
    throw createError({ statusCode: 400, message: 'Tag name is required' })
  }

  const tagSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const existing = await db.select().from(tags).where(eq(tags.slug, tagSlug)).get()

  if (existing) {
    throw createError({ statusCode: 400, message: 'Tag already exists' })
  }

  const tagId = nanoid()

  await db.insert(tags).values({
    id: tagId,
    name,
    slug: tagSlug,
  })

  return {
    id: tagId,
    name,
    slug: tagSlug,
  }
})
