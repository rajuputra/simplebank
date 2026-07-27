import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '../components/AuthLayout.vue'
import DashboardLayout from '../components/DashboardLayout.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/Profile.vue'
import VerifyEmail from '../components/VerifyEmail.vue'
import store from '../store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/LandingPage.vue'),
      meta: { public: true }
    },
    {
      path: '/check-email',
      name: 'checkEmail',
      component: () => import('../views/CheckEmailView.vue'),
      meta: { public: true }
    },
    // Public Auth routes — AuthLayout (centered card, dark background)
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: '/login',
          name: 'login',
          component: LoginView
        },
        {
          path: '/register',
          name: 'register',
          component: RegisterView
        }
      ]
    },
    // Public standalone — Email Verification (no auth, no sidebar)
    {
      path: '/verify_email',
      name: 'verifyEmail',
      component: VerifyEmail,
      meta: { public: true }
    },
    {
      path: '/v1/verify_email',
      name: 'v1VerifyEmail',
      component: VerifyEmail,
      meta: { public: true }
    },
    // Protected Dashboard routes — DashboardLayout (sidebar + header)
    {
      path: '/',
      component: DashboardLayout,
      children: [
        {
          path: '',
          redirect: '/dashboard'
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/Dashboard.vue')
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView
        },
        {
          path: 'transfer',
          name: 'transfer',
          component: () => import('../views/Transfer.vue')
        }
      ]
    },
    // Catch-all fallback
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
  ]
})

// Navigation Guard
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
  const isAuthenticated = Boolean(token || store.state.user)

  // Public routes bypass the guard entirely
  if (to.meta?.public) {
    next()
    return
  }

  const isAuthRoute = to.path === '/login' || to.path === '/register' || to.path === '/'

  if (isAuthRoute && isAuthenticated) {
    next('/dashboard')
  } else if (!isAuthRoute && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
