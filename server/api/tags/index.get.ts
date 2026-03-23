import { db } from '~/server/db'
import { tags } from '~/server/db/schema'
import { eq, like } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { search } = query || {}

  if (search) {
    const results = await db.select().from(tags)
      .where(like(tags.name, `%${search}%`))
    return results
  }

  const tagList = await db.select().from(tags)
  return tagList
})
