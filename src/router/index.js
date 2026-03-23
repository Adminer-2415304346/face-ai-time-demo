import { createRouter, createWebHistory } from 'vue-router'
import DemoShell from '@/layouts/DemoShell.vue'

const routes = [
  {
    path: '/',
    component: DemoShell,
    redirect: '/recognition',
    children: [
      {
        path: 'recognition',
        name: 'RecognitionDemo',
        component: () => import('@/pages/recognition/RecognitionDemoPage.vue'),
        meta: { title: '智能识别演示' }
      },
      {
        path: 'dataset',
        name: 'DatasetShowcase',
        component: () => import('@/pages/dataset/DatasetShowcasePage.vue'),
        meta: { title: '数据资源展示' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/not-found/NotFoundPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 96
      }
    }

    return {
      top: 0,
      behavior: 'smooth'
    }
  }
})

router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} - 跨时间域生物面部识别系统`
    : '跨时间域生物面部识别系统'
})

export default router
