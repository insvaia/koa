import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/auth",
    name: "layout",
    component: () => import("@/views/Layout.vue"),
    redirect: "/auth/login",
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("@/views/LoginView.vue"),
      },
      {
        path: "register",
        name: "register",
        component: () => import("@/views/RegisterView.vue"),
      },
    ],
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/Home.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
