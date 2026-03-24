<template>
  <div class="demo-shell" :class="{ 'is-collapsed': isCollapsed }">
    <aside class="demo-shell__sider glass-panel" :class="{ 'is-collapsed': isCollapsed }">
      <div class="brand" :class="{ 'is-collapsed': isCollapsed }">
        <div class="brand__main">
          <div class="brand__logo">BIO</div>
          <div v-show="!isCollapsed" class="brand__content">
            <div class="brand__title">跨时间域生物面部识别系统</div>
            <div class="brand__desc">Frontend Showcase</div>
          </div>
        </div>

        <button
          type="button"
          class="sider-toggle"
          :title="isCollapsed ? '展开导航' : '收起导航'"
          @click="isCollapsed = !isCollapsed"
        >
          <component :is="isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined" />
        </button>
      </div>

      <nav class="nav-list">
        <section v-for="group in menus" :key="group.path" class="nav-group">
          <RouterLink
            :to="group.path"
            class="nav-item nav-item--primary"
            :class="{ 'is-active': isGroupActive(group) }"
            :title="group.label"
          >
            <component :is="group.icon" />
            <span v-show="!isCollapsed">{{ group.label }}</span>
          </RouterLink>

          <div class="nav-sublist">
            <RouterLink
              v-for="child in group.children"
              :key="`${child.path}${child.hash}`"
              :to="{ path: child.path, hash: child.hash }"
              class="nav-item nav-item--secondary"
              :class="{ 'is-active': isChildActive(child) }"
              :title="child.label"
            >
              <component :is="child.icon" />
              <span v-show="!isCollapsed">{{ child.label }}</span>
            </RouterLink>
          </div>
        </section>
      </nav>
    </aside>

    <main class="demo-shell__main">
      <header class="demo-shell__header glass-panel">
        <div>
          <div class="header-title">{{ currentTitle }}</div>
          <div class="header-desc">{{ currentDesc }}</div>
        </div>
      </header>

      <section class="demo-shell__content fade-up">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  AppstoreOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  FilterOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlayCircleOutlined,
  PictureOutlined,
  RadarChartOutlined,
  TeamOutlined
} from '@ant-design/icons-vue'

const route = useRoute()
const isCollapsed = ref(false)

const menus = [
  {
    path: '/recognition',
    label: '智能识别演示',
    icon: RadarChartOutlined,
    children: [
      {
        path: '/recognition',
        hash: '#recognition-image',
        label: '图片识别',
        icon: PictureOutlined
      },
      {
        path: '/recognition/video',
        label: '视频演示',
        icon: PlayCircleOutlined
      }
    ]
  },
  {
    path: '/dataset',
    label: '数据资源展示',
    icon: DatabaseOutlined,
    children: [
      {
        path: '/dataset',
        hash: '#dataset-filter',
        label: '筛选面板',
        icon: FilterOutlined
      },
      {
        path: '/dataset',
        hash: '#dataset-overview',
        label: '统计总览',
        icon: BarChartOutlined
      },
      {
        path: '/dataset',
        hash: '#dataset-cases',
        label: '典型案例',
        icon: AppstoreOutlined
      },
      {
        path: '/dataset',
        hash: '#dataset-individuals',
        label: '个体档案',
        icon: TeamOutlined
      }
    ]
  }
]

const currentTitle = computed(() => {
  if (route.path.startsWith('/recognition')) {
    return '智能识别演示'
  }

  return route.meta?.title || '系统展示'
})

const currentDesc = computed(() => {
  if (route.path === '/dataset') {
    return '展示数据库概览、筛选能力、个体样本卡片和典型跨时间案例。'
  }

  if (route.path.startsWith('/recognition')) {
    return '面向演示答辩场景的多模态展示前端'
  }

  return '系统展示页面'
})

const isGroupActive = (group) => route.path.startsWith(group.path)
const isChildActive = (child) => {
  if (child.hash) {
    return route.path === child.path && route.hash === child.hash
  }

  return route.path === child.path
}
</script>

<style scoped lang="less">
.demo-shell {
  min-height: 100vh;
  padding: 16px;
  display: grid;
  grid-template-columns: 256px 1fr;
  gap: 16px;
  transition: grid-template-columns 0.25s ease;
}

.demo-shell.is-collapsed {
  grid-template-columns: 88px 1fr;
}

.demo-shell__sider {
  position: sticky;
  top: 16px;
  height: calc(100vh - 32px);
  padding: 16px 14px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  transition:
    width 0.25s ease,
    padding 0.25s ease;
}

.demo-shell__sider.is-collapsed {
  align-items: center;
  padding-inline: 12px;
}

.demo-shell__main {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.demo-shell__header {
  min-height: 78px;
  border-radius: 24px;
  padding: 18px 22px;
  display: flex;
  align-items: center;
}

.demo-shell__content {
  min-height: calc(100vh - 126px);
}

.brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.brand.is-collapsed {
  flex-direction: column;
  gap: 10px;
}

.brand__main {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand__content {
  min-width: 0;
}

.brand__logo {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  background: linear-gradient(135deg, #8fb19b, #6f8f7a);
  box-shadow: 0 8px 20px rgba(126, 161, 138, 0.24);
}

.brand__title {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
  color: var(--demo-text-1);
}

.brand__desc {
  margin-top: 3px;
  font-size: 11px;
  color: var(--demo-text-3);
}

.sider-toggle {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border: 0;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.44);
  color: var(--demo-text-2);
  cursor: pointer;
  transition: all 0.25s ease;
}

.sider-toggle:hover {
  background: rgba(255, 255, 255, 0.78);
  color: var(--demo-text-1);
  box-shadow: 0 10px 22px rgba(126, 161, 138, 0.15);
}

.header-title {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--demo-text-1);
}

.header-desc {
  margin-top: 6px;
  font-size: 13px;
  color: var(--demo-text-2);
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-sublist {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 10px;
}

.nav-sublist::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 1px;
  background: linear-gradient(
    180deg,
    rgba(126, 161, 138, 0.08),
    rgba(126, 161, 138, 0.3),
    rgba(126, 161, 138, 0.08)
  );
}

.demo-shell__sider.is-collapsed .nav-sublist {
  padding-left: 0;
}

.demo-shell__sider.is-collapsed .nav-sublist::before {
  display: none;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 0 14px;
  border-radius: 14px;
  color: var(--demo-text-2);
  transition: all 0.25s ease;
}

.nav-item--primary {
  min-height: 44px;
  font-weight: 600;
}

.nav-item--secondary {
  min-height: 36px;
  padding-inline: 12px;
  font-size: 13px;
  color: var(--demo-text-3);
}

.demo-shell__sider.is-collapsed .nav-item {
  justify-content: center;
  padding-inline: 0;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.5);
  color: var(--demo-text-1);
}

.nav-item.is-active {
  background: rgba(255, 255, 255, 0.72);
  color: var(--demo-text-1);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.65);
}

@media (max-width: 1100px) {
  .demo-shell,
  .demo-shell.is-collapsed {
    grid-template-columns: 1fr;
  }

  .demo-shell__sider {
    position: static;
    height: auto;
  }

  .brand.is-collapsed {
    flex-direction: row;
  }
}
</style>


