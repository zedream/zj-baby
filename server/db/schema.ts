import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// Album
export const albums = sqliteTable('albums', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  coverPhotoId: text('cover_photo_id'),
  visibility: text('visibility').notNull().default('public'),
  ownerId: text('owner_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Photo
export const photos = sqliteTable('photos', {
  id: text('id').primaryKey(),
  albumId: text('album_id').notNull().references(() => albums.id),
  filename: text('filename').notNull(),
  cdnUrl: text('cdn_url').notNull(),
  thumbnailUrl: text('thumbnail_url').notNull(),
  width: integer('width'),
  height: integer('height'),
  takenAt: integer('taken_at', { mode: 'timestamp' }),
  order: integer('order').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

// PhotoTag (join table)
export const photoTags = sqliteTable('photo_tags', {
  photoId: text('photo_id').notNull().references(() => photos.id),
  tagId: text('tag_id').notNull().references(() => tags.id),
})

// Tag
export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
})

// User
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('user'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

// Visitor
export const visitors = sqliteTable('visitors', {
  id: text('id').primaryKey(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

// Favorite
export const favorites = sqliteTable('favorites', {
  id: text('id').primaryKey(),
  photoId: text('photo_id').notNull().references(() => photos.id),
  visitorId: text('visitor_id').references(() => visitors.id),
  userId: text('user_id').references(() => users.id),
  status: text('status').notNull().default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  mergedAt: integer('merged_at', { mode: 'timestamp' }),
})
