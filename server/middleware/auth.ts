import { getUserFromEvent } from '~/server/utils/auth'
import { getVisitorId } from '~/server/utils/visitor'

export default defineEventHandler(async (event) => {
  // Skip for non-API routes
  if (!event.path.startsWith('/api/')) return

  // Try to get authenticated user
  const user = await getUserFromEvent(event)
  if (user) {
    event.context.user = user
  }

  // Set visitor ID if available
  const visitorId = getVisitorId(event)
  if (visitorId) {
    event.context.visitorId = visitorId
  }
})
