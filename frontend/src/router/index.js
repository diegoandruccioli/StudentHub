import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const LandingPage = () => import('../pages/LandingPage.vue')
const LoginPage = () => import('../pages/LoginPage.vue')
const RegisterPage = () => import('../pages/RegisterPage.vue')
const HomePage = () => import('../pages/HomePage.vue')
const CareerPage = () => import('../pages/CareerPage.vue')
const InsertExamPage = () => import('../pages/InsertExamPage.vue')
const StatsPage = () => import('../pages/StatsPage.vue')
const ObjectivesPage = () => import('../pages/ObjectivesPage.vue')
const AdminPage = () => import('../pages/AdminPage.vue')
const NotFound = () => import('../pages/NotFound.vue')
const AboutPage = () => import('../pages/AboutPage.vue')


const routes = [
  { path: '/', name: 'Landing', component: LandingPage, meta: { public: true } },
  { path: '/login', name: 'Login', component: LoginPage, meta: { public: true } },
  { path: '/register', name: 'Register', component: RegisterPage, meta: { public: true } },
  { path: '/about', name: 'About', component: AboutPage, meta: { public: true } },
  
  { path: '/home', name: 'Home', component: HomePage },
  { path: '/career', name: 'Career', component: CareerPage },
  { path: '/career/insert', name: 'InsertExam', component: InsertExamPage },
  { path: '/stats', name: 'Stats', component: StatsPage },
  { path: '/objectives', name: 'Objectives', component: ObjectivesPage },
  { path: '/admin', name: 'Admin', component: AdminPage },
  { path: '/settings', name: 'Settings', component: SettingsPage },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/login', '/register', '/about']; 
  const authRequired = !publicPages.includes(to.path);
  // ... logica auth esistente ...
  next();
})

export default router