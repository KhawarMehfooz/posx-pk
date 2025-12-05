import AppLayout from '@/layout/AppLayout.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: "/",
          component: import("@/views/HomeView.vue"),
        },
        {
          path: "/login",
          component: import("@/views/pages/Login.vue"),
        }
      ]
    },
  ],
})

export default router
