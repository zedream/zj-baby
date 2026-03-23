import { requireAuth } from '~/server/utils/auth'
import { db } from '~/server/db'
import { albums, photos } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { commitToGitHub } from '~/server/utils/github'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const body = await readMultipartFormData(event)

  if (!body || body.length === 0) {
    throw createError({ statusCode: 400, message: 'No files uploaded' })
  }

  const runtimeConfig = useRuntimeConfig()
  const token = runtimeConfig.githubToken

  if (!token) {
    throw createError({ statusCode: 500, message: 'GitHub token not configured' })
  }

  // Get albumId from form data
  const albumIdField = body.find((f) => f.name === 'albumId')
  const albumId = albumIdField?.data?.toString()

  if (!albumId) {
    throw createError({ statusCode: 400, message: 'albumId is required' })
  }

  // Verify album ownership
  const album = await db.select().from(albums).where(eq(albums.id, albumId)).get()

  if (!album) {
    throw createError({ statusCode: 404, message: 'Album not found' })
  }

  if (album.ownerId !== user.id) {
    throw createError({ statusCode: 403, message: 'Not authorized to upload to this album' })
  }

  // Process uploaded files
  const uploadedPhotos = []
  const filesToCommit = []

  for (const file of body) {
    if (!file.filename || file.type?.startsWith('image/') === false) continue

    const photoId = nanoid()
    const ext = file.filename.split('.').pop() || 'jpg'
    const filename = `${photoId}.${ext}`
    const path = `photos/${albumId}/${filename}`
    const content = file.data.toString('base64')

    filesToCommit.push({
      path,
      content,
      message: `Add photo: ${filename}`,
    })

    uploadedPhotos.push({
      id: photoId,
      filename,
      cdnUrl: `https://cdn.zj.baby/${path}`, // Placeholder - will be updated after Cloudflare deploy
      thumbnailUrl: `https://cdn.zj.baby/${path}`, // TODO: generate thumbnail
    })
  }

  // Commit to GitHub
  const result = await commitToGitHub(
    'zedream',
    'zj-baby',
    'main',
    filesToCommit,
    token
  )

  if (!result.success) {
    throw createError({ statusCode: 500, message: `GitHub commit failed: ${result.error}` })
  }

  // Save to database
  const now = new Date()
  const savedPhotos = []

  for (const photo of uploadedPhotos) {
    await db.insert(photos).values({
      id: photo.id,
      albumId,
      filename: photo.filename,
      cdnUrl: photo.cdnUrl,
      thumbnailUrl: photo.thumbnailUrl,
      order: 0,
      createdAt: now,
    })

    savedPhotos.push({
      id: photo.id,
      filename: photo.filename,
      cdnUrl: photo.cdnUrl,
      thumbnailUrl: photo.thumbnailUrl,
    })
  }

  return {
    success: true,
    commitSha: result.commitSha,
    photos: savedPhotos,
  }
})
