# 照片展示站 · 设计文档

**项目名称**：zj-baby 照片展示站  
**版本**：v1.0  
**日期**：2026-03-23  
**状态**：草稿

---

## 1. 项目概述

### 1.1 项目背景

个人照片展示网站，兼具作品集和家庭相册功能。照片存储使用 GitHub 仓库，通过 Cloudflare Pages CDN 全球分发。前期纯前端展示，后期逐步扩展管理后台和移动端支持。

### 1.2 核心功能

- 多风格展示页面（5种视觉形式）
- 相册 + 时间 + 标签混合组织
- 独立管理后台（完整 CRUD）
- 统一认证 + 角色权限系统
- 游客浏览 + 登录访问部分页面

### 1.3 技术选型

| 层级 | 技术 |
|------|------|
| 框架 | Nuxt 3 (SSR) |
| 样式 | UnoCSS (原子化 CSS) |
| 3D 效果 | Three.js |
| 存储 | GitHub 仓库 |
| CDN | Cloudflare Pages |
| 整页滚动 | fullPage.js |
| 数据库 | SQLite (本地轻量) |
| ORM | Drizzle ORM |
| 认证 | Nuxt Auth (JWT) |

---

## 2. 系统架构

### 2.1 整体架构

```
┌─────────────────────────────────────────┐
│            Nuxt 3 SSR App              │
│  ┌─────────────────────────────────┐    │
│  │      Frontend Pages            │    │
│  │  / (首页)  /gallery  /timeline │    │
│  │  /photo/:id  /album/:id       │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │      Admin Panel               │    │
│  │  /admin (独立后台)             │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │      Server API                │    │
│  │  /api/albums  /api/photos      │    │
│  │  /api/auth  /api/users         │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          GitHub Repository             │
│   photos/  albums.json  metadata.json   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Cloudflare Pages CDN           │
│   照片全球加速，URL 独立于服务器          │
└─────────────────────────────────────────┘
```

### 2.2 照片访问流程

1. 管理员上传照片 → 写入 GitHub 仓库 `/photos/` 目录
2. Cloudflare Pages 自动部署
3. 前端展示时请求 Cloudflare CDN URL，不占用服务器带宽

### 2.3 目录结构

```
/
├── assets/          # 静态资源
├── components/      # Vue 组件
│   ├── album/       # 相册相关
│   ├── gallery/     # 瀑布流相关
│   ├── home/        # 首页 3D 效果
│   ├── timeline/    # 时间线相关
│   ├── photo/      # 照片浏览相关
│   └── ui/         # 通用 UI 组件
├── layouts/        # 布局
├── pages/          # 页面
│   ├── index.vue   # 首页（整页滚动 3D）
│   ├── gallery.vue # 瀑布流
│   ├── timeline.vue # 时间线
│   ├── photo/[id].vue # 照片浏览
│   ├── album/[id].vue # 相册页
│   └── admin/      # 管理后台
├── server/
│   ├── api/        # API 路由
│   ├── db/         # 数据库
│   └── utils/      # 服务端工具
├── public/
│   └── photos/    # Cloudflare 同步的照片目录
└── docs/          # 文档
```

---

## 3. 页面设计

### 3.1 首页（/）

**结构**：整页滚动（fullPage.js），每次滚动切换一屏。

| 屏 | 效果 | 说明 |
|----|------|------|
| 第 1 屏 | 3D 星轨 | 照片绕中心公转，支持拖拽/滚轮缩放 |
| 第 2 屏 | 3D 轮播 | 中间大图，前后有景深模糊的半透明照片 |

**视觉**：深色背景 (#0a0a0a)，沉浸感极强。

**交互**：
- 滚动切换整屏
- 鼠标拖拽旋转星轨
- 滚轮缩放

### 3.2 瀑布流相册（/gallery）

**视觉**：深色背景 (#111)，Pinterest 风格瀑布流。

**功能**：
- 无限滚动加载
- 按相册/标签筛选
- 点击照片进入照片浏览页

### 3.3 时间线（/timeline）

**视觉**：中间时间轴，照片在轴两侧交替排列。

**功能**：
- 按年/月/日组织
- 滚动时时间线高亮当前位置
- 点击照片进入照片浏览页

### 3.4 单张照片浏览（/photo/:id）

**视觉**：3D 透视效果，照片有轻微倾斜和阴影。

**交互**：
- 滚轮缩放照片
- 拖拽旋转照片角度
- 左右箭头切换上一张/下一张
- ESC 或点击背景关闭

### 3.5 相册页（/album/:id）

**视觉**：3D 翻转卡片展示相册列表。

**卡片交互**：
- 悬停显示翻转提示
- 点击卡片翻转到背面，显示相册名称/描述/照片数
- 再点击翻回正面

---

## 4. 数据模型

### 4.1 相册 (Album)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | UUID |
| name | string | 相册名称 |
| description | string | 描述 |
| coverPhotoId | string | 封面照片 ID |
| visibility | enum | public（公开）/ private（仅登录）/ private（仅本人） |
| ownerId | string | 所属用户 ID（admin 创建的为系统相册） |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

### 4.2 照片 (Photo)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | UUID |
| albumId | string | 所属相册 ID |
| filename | string | GitHub 中的文件名 |
| cdnUrl | string | Cloudflare CDN URL |
| thumbnailUrl | string | 缩略图 URL |
| width | int | 原图宽度 |
| height | int | 原图高度 |
| takenAt | datetime | 拍摄时间（可选） |
| tags | string[] | 标签数组 |
| order | int | 排序序号 |
| createdAt | datetime | 创建时间 |

### 4.3 用户 (User)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | UUID |
| username | string | 用户名 |
| email | string | 邮箱 |
| passwordHash | string | 密码哈希 |
| role | enum | admin / user |
| createdAt | datetime | 创建时间 |

### 4.4 标签 (Tag)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | UUID |
| name | string | 标签名 |
| slug | string | URL 友好格式 |

### 4.5 收藏 (Favorite)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | UUID |
| photoId | string | 收藏的照片 ID |
| visitorId | string | 游客 ID（pending 时填充） |
| userId | string | 用户 ID（merged 后填充，与 visitorId 二选一） |
| status | enum | pending（游客）/ merged（已合并） |
| createdAt | datetime | 收藏时间 |
| mergedAt | datetime | 合并到用户的时间（可选） |

### 4.6 游客 (Visitor)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | UUID（等同于 visitorId） |
| createdAt | datetime | 创建时间 |

---

## 5. API 设计

### 5.1 认证 API

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/register | 注册 |
| POST | /api/auth/login | 登录 |
| POST | /api/auth/logout | 登出 |
| GET | /api/auth/me | 获取当前用户 |

### 5.2 相册 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/albums | 获取相册列表 |
| GET | /api/albums/:id | 获取单个相册 |
| POST | /api/albums | 创建相册（需登录） |
| PUT | /api/albums/:id | 更新相册（需登录） |
| DELETE | /api/albums/:id | 删除相册（需登录） |

### 5.3 照片 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/photos | 获取照片列表（支持筛选） |
| GET | /api/photos/:id | 获取单张照片 |
| POST | /api/photos | 上传照片（需登录） |
| PUT | /api/photos/:id | 更新照片（需登录） |
| DELETE | /api/photos/:id | 删除照片（需登录） |
| POST | /api/photos/batch | 批量操作（需登录） |

### 5.4 标签 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/tags | 获取标签列表 |
| POST | /api/tags | 创建标签（需登录） |
| DELETE | /api/tags/:id | 删除标签（需登录） |

### 5.5 收藏 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/favorites | 获取当前用户收藏列表（游客返回 pending） |
| POST | /api/favorites | 收藏照片 |
| DELETE | /api/favorites/:photoId | 取消收藏 |
| POST | /api/favorites/merge | 合并游客收藏（登录时调用） |

---

## 6. 管理后台（/admin）

### 6.1 页面结构

```
/admin
├── /admin/dashboard      # 仪表盘
├── /admin/albums         # 相册管理
├── /admin/photos         # 照片管理
├── /admin/tags           # 标签管理
└── /admin/users          # 用户管理（仅 admin）
```

### 6.2 功能清单

| 模块 | 功能 |
|------|------|
| 仪表盘 | 照片/相册/用户统计，最近操作记录 |
| 相册管理 | 创建/编辑/删除相册，设置封面，查看照片列表 |
| 照片管理 | 上传照片（支持批量），删除，编辑标签，设置相册，排序 |
| 标签管理 | 创建/编辑/删除标签 |
| 用户管理 | 查看用户列表，修改角色（仅 admin） |

---

## 7. 游客合并系统

### 7.1 业务流程

```
游客访问 → 生成 visitorId（存 cookie）
    ↓
游客收藏照片 → 写入 Favorite (visitorId + status=pending)
    ↓
游客注册/登录 → 查询该 visitorId 的所有 pending 记录
    ↓
将 pending → merged，去重（同一 photoId 保留最早那条）
    ↓
清除 cookie 中的 visitorId（或标记已合并）
```

### 7.2 多设备合并

- 各浏览器/设备独立生成 visitorId
- 同一账号多次登录，各自合并该设备上 pending 记录
- 不同设备的 visitorId 最终都合并到同一个 userId

### 7.3 去重规则

同一 photoId 被多次收藏（多个 visitorId）：
- 保留 createdAt 最早的那条 merged 记录
- 其余忽略

---

## 8. 权限系统

### 8.1 角色

| 角色 | 权限 |
|------|------|
| guest | 浏览公开页面 |
| user | 浏览需要登录的页面 |
| admin | 访问 /admin 后台，管理所有内容 |

### 8.2 权限控制

- 游客可浏览：首页、瀑布流、时间线、公开相册
- 登录后可浏览：标记为"仅登录"的相册
- admin 可管理：所有相册、照片、标签、用户

---

## 8. GitHub + Cloudflare 同步流程

### 8.1 照片上传流程

1. 管理员在 /admin 上传照片
2. 服务端将照片写入 `/public/photos/` 目录
3. 调用 GitHub API commit 到仓库
4. Cloudflare Pages 检测到更新，自动部署
5. 部署完成后，更新数据库中的 cdnUrl

### 8.2 元数据管理

- 相册/照片元数据存储在 SQLite 数据库
- 数据库记录 CDN URL，前端直接请求 Cloudflare

---

## 10. 技术实现细节

### 9.1 3D 效果依赖

| 效果 | 库 |
|------|------|
| 整页滚动 | fullpage.js |
| 3D 星轨 | Three.js |
| 3D 轮播 | Three.js + GSAP |
| 照片 3D 透视 | CSS 3D transforms / Three.js |
| 3D 翻转卡片 | CSS 3D transforms |

### 9.2 SSR 考量

- 3D 效果组件使用 `<ClientOnly>` 包裹，SSR 时不渲染
- 瀑布流和图片懒加载使用 Vue 指令，SSR 降级处理
- 照片 meta 信息（EXIF 等）SSR 预取

---

## 11. 开发计划（后续展开）

- Phase 1：项目初始化，基础架构搭建
- Phase 2：前端展示页面（5种页面）
- Phase 3：管理后台
- Phase 4：认证和权限
- Phase 5：GitHub + Cloudflare 集成
- Phase 6：优化和部署

---

## 12. 待确认事项

- [ ] 首页整页滚动库具体用 fullpage.js 还是 alternatives
- [ ] 3D 效果的细节交互（鼠标灵敏度、动画速度等）
- [ ] 初始数据（测试用的照片数量和来源）
- [ ] 域名和部署环境准备情况
