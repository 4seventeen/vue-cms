import { createRouter, createWebHistory } from "vue-router";
import Home from "./components/Home.vue";
import About from "./components/About.vue";
import Signup from "./components/Signup.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/signup", component: Signup },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
