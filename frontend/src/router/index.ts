import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useAuthStore } from "../stores/auth";

import LandingPage from "../pages/LandingPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import HomePage from "../pages/HomePage.vue";
import CareerPage from "../pages/CareerPage.vue";
import InsertExamPage from "../pages/InsertExamPage.vue";
import StatsPage from "../pages/StatsPage.vue";
import SettingsPage from "../pages/SettingsPage.vue";
import NotFound from "../pages/NotFound.vue";
import ObjectivesPage from "../pages/ObjectivesPage.vue";
import AboutPage from "../pages/AboutPage.vue";
import ContactPage from "../pages/ContactPage.vue";
import PrivacyPage from "../pages/PrivacyPage.vue";
import TermsPage from "../pages/TermsPage.vue";

const AdminPage = () => import("../pages/AdminPage.vue");

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Landing",
    component: LandingPage,
    meta: { guest: true },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: { guest: true },
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
    meta: { guest: true },
  },

  {
    path: "/home",
    name: "Home",
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/career",
    name: "Career",
    component: CareerPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/career/insert",
    name: "InsertExam",
    component: InsertExamPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/stats",
    name: "Stats",
    component: StatsPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/settings",
    name: "Settings",
    component: SettingsPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/objectives",
    name: "Objectives",
    component: ObjectivesPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    name: "Admin",
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  { path: "/about", name: "About", component: AboutPage },
  { path: "/contact", name: "Contact", component: ContactPage },
  { path: "/privacy", name: "Privacy", component: PrivacyPage },
  { path: "/terms", name: "Terms", component: TermsPage },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// --- NAVIGATION GUARD ---

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.user?.ruolo;

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next("/login");
  }

  if (to.meta.guest && isAuthenticated) {
    if (userRole === "1" || userRole === "2") {
      return next("/admin");
    }
    return next("/home");
  }

  if (to.meta.requiresAdmin && isAuthenticated && userRole === "0") {
    return next({ name: "NotFound" });
  }

  if (isAuthenticated && (userRole === "1" || userRole === "2")) {
    const studentRoutes = [
      "Home",
      "Career",
      "InsertExam",
      "Stats",
      "Objectives",
      "Settings",
    ];
    if (to.name && studentRoutes.includes(to.name as string)) {
      return next("/admin");
    }
  }

  next();
});

export default router;
