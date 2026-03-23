import { H3Event } from 'h3'
import { db } from '~/server/db'
import { visitors } from '~/server/db/schema'
import { nanoid } from 'nanoid'

export function getVisitorId(event: H3Event): string | null {
  return getCookie(event, 'visitor_id') || null
}

export async function getOrCreateVisitor(event: H3Event) {
  let visitorId = getVisitorId(event)

  if (!visitorId) {
    visitorId = nanoid()
    const now = new Date()
    await db.insert(visitors).values({
      id: visitorId,
      createdAt: now,
    })
    setCookie(event, 'visitor_id', visitorId, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      sameSite: 'lax',
    })
  }

  return visitorId
}
