import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { getUserToken } from '@/services/authService'; 

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('@/views/HomeView.vue'),
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/pages/Login.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

// auth guard
router.beforeEach(async (to, from, next) => {
  // public routes
  const publicPages = ['/login']; 

  const authRequired = !publicPages.includes(to.path);

  let token: string | null = null;
  try {
    token = await getUserToken(); 
  } catch (err) {
    token = null;
  }

  if (authRequired && !token) {
    // trying to access protected page, redirect to login
    return next('/login');
  }

  if (to.path === '/login' && token) {
    // logged-in user trying to go to login, redirect to home
    return next('/');
  }

  next();
});

export default router;
