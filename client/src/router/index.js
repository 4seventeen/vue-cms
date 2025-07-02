import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/Signup.vue')
  },
  {
    path: '/signin',
    name: 'Signin',
    component: () => import('../views/Signin.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/file-complaint',
    name: 'FileComplaint',
    component: () => import('../views/FileComplaint.vue')
  },
  {
    path: '/case/:id',
    name: 'CaseDetail',
    component: () => import('../views/CaseDetail.vue')
  },
  {
    path: '/case/:id/edit',
    name: 'EditCase',
    component: () => import('../views/EditCase.vue')
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('../views/Calendar.vue')
  },
  {
    path: '/complete-profile',
    name: 'CompleteProfile',
    component: () => import('../views/CompleteProfile.vue')
  },
  {
    path: '/edit-profile',
    name: 'EditProfile',
    component: () => import('../views/CompleteProfile.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/about', '/signup', '/signin', '/case/:id', '/case/:id/edit'];
  const authRequiredRoutes = ['/dashboard', '/file-complaint', '/profile', '/calendar'];
  const token = localStorage.getItem('token');

  // Check if the route requires authentication
  if (authRequiredRoutes.includes(to.path)) {
    if (!token) {
      return next('/signin');
    }
  }

  // Inside beforeEach function we need to check profileCompleted flag
  const profileCompleted = localStorage.getItem('profileCompleted') === 'true'
  if (token && !profileCompleted && to.path !== '/complete-profile') {
    return next('/complete-profile')
  }
  if (token && profileCompleted && to.path === '/complete-profile') {
    return next('/dashboard')
  }

  next();
});

export default router 