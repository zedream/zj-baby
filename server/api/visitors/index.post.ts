import { getOrCreateVisitor } from '~/server/utils/visitor'

export default defineEventHandler(async (event) => {
  const visitorId = await getOrCreateVisitor(event)

  return {
    visitorId,
  }
})
