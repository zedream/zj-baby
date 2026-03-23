import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  }
})
