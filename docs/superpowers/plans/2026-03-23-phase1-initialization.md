# Phase 1: 项目初始化与基础架构

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** 初始化 Nuxt 3 项目，安装所有依赖，建立目录结构和数据库 Schema，验证前后端基本连通。

**Architecture:** Nuxt 3 + UnoCSS + Drizzle ORM + SQLite。项目结构遵循 Nuxt 3 约定目录，server 层独立处理 API 和数据库。

**Tech Stack:** Nuxt 3 · UnoCSS · Drizzle ORM · SQLite · Three.js · fullPage.js · GSAP

---

## 文件结构

```
zj-baby/
├── assets/
├── components/
│   └── ui/              # 通用 UI 组件
├── layouts/
├── pages/
├── public/
│   └── photos/          # 本地照片缓存（GitHub 同步后）
├── server/
│   ├── api/             # API 路由（暂空，Phase 3+）
│   ├── db/
│   │   ├── index.ts     # Drizzle client singleton
│   │   └── schema.ts     # 所有数据表 Schema
│   └── utils/
├── docs/
├── package.json
├── nuxt.config.ts
├── drizzle.config.ts
└── uno.config.ts
```

---

## Task 1: 初始化 Nuxt 3 项目

**Files:**
- Create: `package.json`
- Create: `nuxt.config.ts`
- Create: `tsconfig.json`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "zj-baby",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "typecheck": "nuxt typecheck"
  },
  "dependencies": {
    "nuxt": "^3.15.0",
    "vue": "^3.5.0",
    "three": "^0.171.0",
    "gsap": "^3.12.0",
    "drizzle-orm": "^0.38.0",
    "better-sqlite3": "^11.0.0",
    "bcryptjs": "^2.4.3",
    "jose": "^5.9.0",
    "nanoid": "^5.0.0"
  },
  "devDependencies": {
    "@unocss/nuxt": "^0.65.0",
    "@types/better-sqlite3": "^7.6.0",
    "@types/bcryptjs": "^2.4.0",
    "@types/three": "^0.171.0",
    "drizzle-kit": "^0.30.0",
    "typescript": "^5.0.0",
    "vue-tsc": "^2.0.0"
  }
}
```

- [ ] **Step 2: 创建 nuxt.config.ts**

```typescript
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ['@unocss/nuxt'],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'zj-baby 照片展示站',
      meta: [
        { name: 'description', content: '个人照片展示站' }
      ]
    }
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    githubToken: process.env.GITHUB_TOKEN || '',
  },

  nitro: {
    experimental: {
      asyncContext: true
    }
  }
})
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "extends": "./.nuxt/tsconfig.json"
}
```

- [ ] **Step 4: 运行初始化**

```bash
cd C:/Projects/zj-baby && npm install
```

---

## Task 2: 安装并配置 UnoCSS

**Files:**
- Create: `uno.config.ts`
- Create: `assets/css/main.css`
- Modify: `nuxt.config.ts` (已在 Task 1)

- [ ] **Step 1: 创建 uno.config.ts**

```typescript
import { defineConfig, presetUno, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/'
    })
  ],
  theme: {
    colors: {
      primary: '#3b82f6',
      dark: '#0f1117',
    }
  },
  shortcuts: {
    'btn': 'px-4 py-2 rounded-lg bg-primary text-white cursor-pointer hover:opacity-90',
  }
})
```

- [ ] **Step 2: 创建 assets/css/main.css**

```css
/* Global styles */
:root {
  --color-dark: #0f1117;
  --color-dark-2: #111;
  --color-primary: #3b82f6;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  background-color: var(--color-dark);
  color: #e2e8f0;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}
```

---

## Task 3: 设置 Drizzle ORM + SQLite 数据库

**Files:**
- Create: `server/db/index.ts`
- Create: `server/db/schema.ts`
- Create: `drizzle.config.ts`

- [ ] **Step 1: 创建 drizzle.config.ts**

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: './data.db'
  }
})
```

- [ ] **Step 2: 创建 server/db/schema.ts**

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// Album
export const albums = sqliteTable('albums', {
  id: text('id').primaryKey(),           // UUID
  name: text('name').notNull(),
  description: text('description'),
  coverPhotoId: text('cover_photo_id'),
  visibility: text('visibility').notNull().default('public'),  // public | private-login | private-owner
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
  role: text('role').notNull().default('user'),  // admin | user
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

// Visitor
export const visitors = sqliteTable('visitors', {
  id: text('id').primaryKey(),  // visitorId (UUID)
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

// Favorite
export const favorites = sqliteTable('favorites', {
  id: text('id').primaryKey(),
  photoId: text('photo_id').notNull().references(() => photos.id),
  visitorId: text('visitor_id').references(() => visitors.id),
  userId: text('user_id').references(() => users.id),
  status: text('status').notNull().default('pending'),  // pending | merged
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  mergedAt: integer('merged_at', { mode: 'timestamp' }),
})
```

- [ ] **Step 3: 创建 server/db/index.ts（单例 DB client）**

```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'

const sqlite = new Database('data.db')
export const db = drizzle(sqlite, { schema })

export type DB = typeof db
```

- [ ] **Step 4: 初始化数据库**

```bash
cd C:/Projects/zj-baby && mkdir -p data.db 2>/dev/null; npm run db:generate
```

---

## Task 4: 创建目录骨架和占位页面

**Files:**
- Create: `layouts/default.vue`
- Create: `pages/index.vue` (首页占位)
- Create: `pages/gallery.vue`
- Create: `pages/timeline.vue`
- Create: `pages/photo/[id].vue`
- Create: `pages/album/[id].vue`
- Create: `app.vue`

- [ ] **Step 1: 创建 app.vue**

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

- [ ] **Step 2: 创建 layouts/default.vue**

```vue
<template>
  <div>
    <slot />
  </div>
</template>
```

- [ ] **Step 3: 创建 pages/index.vue（占位）**

```vue
<script setup lang="ts">
definePageMeta({
  title: '首页'
})
</script>

<template>
  <div class="min-h-screen bg-dark-2">
    <h1 class="text-3xl text-white">首页 - 3D 星轨 + 3D 轮播</h1>
    <p class="text-gray-400 mt-4">Phase 2 实现具体效果</p>
  </div>
</template>
```

- [ ] **Step 4: 创建其他占位页面（gallery, timeline, photo, album）**

每个页面返回对应标题和占位文本。

- [ ] **Step 5: 创建 pages/admin 占位结构**

```
pages/admin/
├── index.vue
├── albums.vue
├── photos.vue
├── tags.vue
└── users.vue
```

每个返回对应模块标题。

---

## Task 5: 验证项目可运行

- [ ] **Step 1: 启动开发服务器验证**

```bash
cd C:/Projects/zj-baby && npm run dev
```

Expected: Nuxt dev server starts on http://localhost:3000

- [ ] **Step 2: 验证页面可访问**

访问以下路径返回 200：
- `http://localhost:3000/` - 首页
- `http://localhost:3000/gallery` - 瀑布流
- `http://localhost:3000/timeline` - 时间线

- [ ] **Step 3: 验证数据库连接**

```bash
cd C:/Projects/zj-baby && npm run db:studio
```

Expected: Drizzle Studio 打开，可看到空的数据表（albums, photos, users 等）

---

## Task 6: Git 初始化并提交

- [ ] **Step 1: 初始化 Git**

```bash
cd C:/Projects/zj-baby && git init && git add .gitignore 2>/dev/null || true
```

- [ ] **Step 2: 创建 .gitignore**

```
node_modules/
.nuxt/
.output/
dist/
data.db
*.db
.env
.env.*
!.env.example
```

- [ ] **Step 3: 提交 Phase 1**

```bash
git add .
git commit -m "Phase 1: Initialize Nuxt 3 project with Drizzle ORM + SQLite

- Nuxt 3 + UnoCSS + TypeScript
- Drizzle ORM schema (albums, photos, users, visitors, favorites, tags, photoTags)
- SQLite database initialization
- Basic page scaffolding (index, gallery, timeline, photo, album, admin)
- Directory structure established"
```
