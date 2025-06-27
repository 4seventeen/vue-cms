import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";
import Dashboard from "../views/Dashboard.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/signup", component: Signup },
  { path: "/signin", component: Signin },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    next("/signin");
  } else {
    next();
  }
});

export default router;
