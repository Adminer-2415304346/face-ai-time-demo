<template>
  <a-layout class="shell">
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      class="sider"
      :trigger="null"
      :width="260"
      :collapsed-width="92"
    >
      <div class="logo">
        <div class="logo-mark">B</div>
        <div v-if="!collapsed" class="logo-copy">
          <strong>BioFace Demo</strong>
          <span>Cross-Time Recognition Console</span>
        </div>
      </div>

      <div v-if="!collapsed" class="nav-caption">
        Demo Chapters
      </div>

      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="light"
        mode="inline"
        class="nav-menu"
        @click="menuClick"
      >
        <a-menu-item key="/demo/intro">
          <bulb-outlined />
          <span>问题引入</span>
        </a-menu-item>

        <a-menu-item key="/demo/dataset">
          <picture-outlined />
          <span>数据集介绍</span>
        </a-menu-item>

        <a-menu-item key="/demo/preprocess">
          <deployment-unit-outlined />
          <span>预处理流程</span>
        </a-menu-item>

        <a-menu-item key="/demo/model">
          <apartment-outlined />
          <span>模型方案</span>
        </a-menu-item>

        <a-menu-item key="/demo/system">
          <scan-outlined />
          <span>系统演示</span>
        </a-menu-item>

        <a-menu-item key="/demo/cases">
          <history-outlined />
          <span>跨时间案例</span>
        </a-menu-item>

        <a-menu-item key="/demo/metrics">
          <bar-chart-outlined />
          <span>指标结果</span>
        </a-menu-item>

        <a-menu-item key="/demo/failures">
          <warning-outlined />
          <span>失败案例</span>
        </a-menu-item>

        <a-menu-item key="/demo/summary">
          <flag-outlined />
          <span>总结</span>
        </a-menu-item>
      </a-menu>

      <div v-if="!collapsed" class="sider-footer">
        <div class="footer-card">
          <span class="footer-label">Competition</span>
          <strong>2026 A31 Demo Ready</strong>
        </div>
      </div>
    </a-layout-sider>

    <a-layout class="main-layout">
      <a-layout-header class="header">
        <div class="header-left">
          <button
            type="button"
            class="trigger"
            @click="collapsed = !collapsed"
          >
            <menu-unfold-outlined v-if="collapsed" />
            <menu-fold-outlined v-else />
          </button>

          <div class="title-wrap">
            <div class="title">跨时间域生物面部识别技术</div>
            <div class="subtitle">
              Non-human biometrics as primary task, human face as transfer validation
            </div>
          </div>
        </div>

        <div class="header-right">
          <div class="status-chip">
            <span class="status-dot"></span>
            Demo Ready
          </div>

          <div class="meta-chip">
            <play-circle-outlined />
            2026 服创赛 A31
          </div>

          <div class="user-card">
            <a-avatar class="user-avatar">D</a-avatar>
            <div class="user-meta">
              <strong>Demo Operator</strong>
              <span>Presentation Console</span>
            </div>
          </div>
        </div>
      </a-layout-header>

      <a-layout-content class="content">
        <div class="content-card">
          <!-- TODO(real-data): Real demo pages with actual images/results are rendered here via routed views. -->
          <router-view />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BulbOutlined,
  PictureOutlined,
  DeploymentUnitOutlined,
  ApartmentOutlined,
  ScanOutlined,
  HistoryOutlined,
  BarChartOutlined,
  WarningOutlined,
  FlagOutlined,
  PlayCircleOutlined
} from '@ant-design/icons-vue'

const collapsed = ref(false)
const router = useRouter()
const route = useRoute()

const selectedKeys = ref([route.path])

watch(
  () => route.path,
  (path) => {
    selectedKeys.value = [path]
  },
  { immediate: true }
)

const menuClick = ({ key }) => {
  selectedKeys.value = [key]
  router.push(key)
}
</script>

<style scoped>
.shell {
  min-height: 100vh;
  padding: 20px;
  background:
    radial-gradient(circle at top left, rgba(15, 23, 42, 0.06), transparent 30%),
    linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

.sider {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.92) !important;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
}

:deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px;
  padding: 0 16px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  color: #0f172a;
}

.logo-mark {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #0f172a;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
}

.logo-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-copy strong {
  font-size: 15px;
}

.logo-copy span {
  font-size: 12px;
  color: #64748b;
}

.nav-caption {
  margin: 4px 16px 4px;
  padding: 0 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
}

.nav-menu {
  flex: 1;
  padding: 8px 12px 12px;
  background: transparent;
  border-inline-end: none !important;
}

:deep(.nav-menu.ant-menu-light .ant-menu-item) {
  height: 46px;
  line-height: 46px;
  margin: 6px 0;
  border-radius: 14px;
  color: #334155;
}

:deep(.nav-menu.ant-menu-light .ant-menu-item:hover) {
  background: #f8fafc;
  color: #0f172a;
}

:deep(.nav-menu.ant-menu-light .ant-menu-item-selected) {
  background: #0f172a;
  color: #ffffff;
}

:deep(.nav-menu.ant-menu-light .ant-menu-item-selected .anticon) {
  color: #ffffff;
}

.sider-footer {
  padding: 12px;
}

.footer-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.footer-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
}

.footer-card strong {
  font-size: 14px;
  color: #0f172a;
}

.main-layout {
  margin-left: 20px;
  background: transparent;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: auto;
  margin-bottom: 20px;
  padding: 18px 22px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(14px);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.05);
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
}

.header-left {
  min-width: 0;
  gap: 14px;
}

.header-right {
  gap: 12px;
}

.trigger {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  color: #0f172a;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.trigger:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.title-wrap {
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
}

.title {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.12;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subtitle {
  margin: 0;
  font-size: 12px;
  line-height: 1.2;
  letter-spacing: 0.02em;
  color: #64748b;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 14px;
  border: 1px solid #dcfce7;
  border-radius: 999px;
  background: #f0fdf4;
  color: #166534;
  font-size: 13px;
  font-weight: 600;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.14);
}

.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 14px;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  background: #ffffff;
  color: #334155;
  font-size: 13px;
  font-weight: 600;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  background: #ffffff;
}

.user-avatar {
  background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
  color: #ffffff;
}

.user-meta {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.user-meta strong {
  font-size: 13px;
  color: #0f172a;
}

.user-meta span {
  margin-top: 2px;
  font-size: 12px;
  color: #64748b;
}

.content {
  margin: 0;
  background: transparent;
  min-height: 280px;
}

.content-card {
  min-height: calc(100vh - 132px);
  padding: 24px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
}

@media (max-width: 1200px) {
  .meta-chip {
    display: none;
  }
}

@media (max-width: 960px) {
  .shell {
    padding: 12px;
  }

  .main-layout {
    margin-left: 12px;
  }

  .header {
    padding: 16px;
  }

  .status-chip {
    display: none;
  }

  .subtitle,
  .user-meta span {
    display: none;
  }
}

@media (max-width: 768px) {
  .shell {
    padding: 10px;
  }

  .main-layout {
    margin-left: 10px;
  }

  .header {
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
    justify-content: flex-end;
  }

  .content-card {
    padding: 16px;
    border-radius: 22px;
  }
}
</style>
