# 低级错误记录

## 1. fullpage.js 实例保存错误

**错误**：把 fullpage **模块**赋值给 `fpInstance.value`，而不是调用后返回的**实例**。

```typescript
// ❌ 错误：fpModule 是模块，没有 destroy 方法
fpInstance.value = fpModule
fpModule(containerRef.value, options)

// ✅ 正确：保存调用后返回的实例
const instance = fpModule(containerRef.value, options)
fpInstance.value = instance
```

**教训**：第三方库调用后返回的实例 ≠ 模块本身。

---

## 2. Async 初始化时序问题

**错误**：`initFullpage` 是 async 函数，但组件卸载时初始化还没完成，`fpInstance.value` 仍是 null。

```typescript
// ❌ 错误：fpInstance.value 在 async 完成前就是 null
onMounted(() => { initFullpage() }) // async, doesn't block
onBeforeUnmount(() => { fpInstance.value?.destroy() }) // 可能还是 null

// ✅ 正确：跟踪初始化 Promise，卸载时等待
let initPromise: Promise<void> | null = null
onMounted(() => { initPromise = initFullpage() })
onBeforeUnmount(async () => {
  if (initPromise) await initPromise
  fpInstance.value?.destroy()
})
```

**教训**：async 初始化的资源，在销毁时必须等待初始化完成才能清理。

---

## 3. IntersectionObserver 在 DOM 更新前查询

**错误**：`onMounted` 里直接查询 `.lazy-img`，但 Vue DOM 更新是异步的。

```typescript
// ❌ 错误：Vue 的 v-for 还没渲染完
onMounted(() => {
  timelineData.value = generateTimeline()
  document.querySelectorAll('.lazy-img') // 找不到元素
})

// ✅ 正确：使用 nextTick 等待 Vue 更新完成
onMounted(() => {
  timelineData.value = generateTimeline()
  nextTick(() => {
    document.querySelectorAll('.lazy-img').forEach(...)
  })
})
```

**教训**：Vue 的响应式更新是异步的，DOM 查询需要等 `nextTick`。

---

## 4. Fullpage CSS 全局加载

**错误**：在 `nuxt.config.ts` 的 `css` 数组里全局引入 fullpage.css。

```typescript
// ❌ 错误：影响所有页面，导致非首页无法滚动
css: ['~/assets/css/main.css', 'fullpage.js/dist/fullpage.min.css']

// ✅ 正确：只在需要的页面引入
// pages/index.vue
import 'fullpage.js/dist/fullpage.min.css'
```

**教训**：UI 库样式应该按需引入，避免全局污染。

---

## 5. 动态 import 的 CSS 无法热更新

**错误**：在 `onMounted` 里 `await import('fullpage.js')`，但样式文件在 SSR 构建时不会被处理。

**教训**：第三方库 CSS 应该通过 `nuxt.config.ts` 或页面 `<style>` 的 `@import` 引入，而不是动态 import。
