import { db } from '~/server/db'
import { albums } from '~/server/db/schema'
import { nanoid } from 'nanoid'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const body = await readBody(event)

  const { name, description, visibility } = body || {}

  if (!name) {
    throw createError({ statusCode: 400, message: 'Album name is required' })
  }

  const now = new Date()
  const albumId = nanoid()

  await db.insert(albums).values({
    id: albumId,
    name,
    description: description || null,
    visibility: visibility || 'public',
    ownerId: user.id,
    createdAt: now,
    updatedAt: now,
  })

  return {
    id: albumId,
    name,
    description: description || null,
    visibility: visibility || 'public',
    ownerId: user.id,
  }
})
