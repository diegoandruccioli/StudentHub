import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Import delle pagine
import LandingPage from '../pages/LandingPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import HomePage from '../pages/HomePage.vue'
import CareerPage from '../pages/CareerPage.vue'
import InsertExamPage from '../pages/InsertExamPage.vue'
import StatsPage from '../pages/StatsPage.vue'
import SettingsPage from '../pages/SettingsPage.vue'
import NotFound from '../pages/NotFound.vue'
import ObjectivesPage from '../pages/ObjectivesPage.vue'

// Import delle pagine pubbliche (Nuovi file)
import AboutPage from '../pages/AboutPage.vue'
import ContactPage from '../pages/ContactPage.vue'
import PrivacyPage from '../pages/PrivacyPage.vue'
import TermsPage from '../pages/TermsPage.vue'




const AdminPage = () => import('../pages/AdminPage.vue')

const routes = [
  // 1. ROTTE GUEST (Solo per non loggati -> Redirect a Home se loggato)
  { 
    path: '/', 
    name: 'Landing', 
    component: LandingPage,
    meta: { guest: true } 
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: LoginPage,
    meta: { guest: true }
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: RegisterPage,
    meta: { guest: true }
  },

  // 2. ROTTE PROTETTE (Solo per loggati -> Redirect a Login se non loggato)
  { 
    path: '/home', 
    name: 'Home', 
    component: HomePage,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/career', 
    name: 'Career', 
    component: CareerPage,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/career/insert', 
    name: 'InsertExam', 
    component: InsertExamPage,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/stats', 
    name: 'Stats', 
    component: StatsPage,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/settings', 
    name: 'Settings', 
    component: SettingsPage,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/objectives', 
    name: 'Objectives', 
    component: ObjectivesPage, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/admin', 
    name: 'Admin', 
    component: AdminPage, 
    meta: { requiresAuth: true } 
  },

  // 3. PAGINE PUBBLICHE (Accessibili a TUTTI)
  // Nota: Non mettiamo né 'guest' né 'requiresAuth'. 
  // Il router le lascerà passare sempre (Logica "else" nel guard).
  { path: '/about', name: 'About', component: AboutPage },
  { path: '/contact', name: 'Contact', component: ContactPage },
  { path: '/privacy', name: 'Privacy', component: PrivacyPage },
  { path: '/terms', name: 'Terms', component: TermsPage },

  //ADMIN ROUTE CON CHECK RUOLO
  { 
    path: '/admin', 
    name: 'Admin', 
    component: AdminPage, 
    meta: { requiresAuth: true, requiresAdmin: true } // <-- NUOVO CHECK RUOLO
  },

  // 4. Catch-all (Pagina non trovata)
  { 
    path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: NotFound 
  }
  
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

// --- NAVIGATION GUARD ---
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const userRole = authStore.user?.ruolo; // '0', '1', '2'

  // CASO A: Rotta protetta e utente NON loggato -> Login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login') 
  } 
  
  // CASO B: Rotta Guest (Login/Register) e utente GIÀ loggato -> Redirect intelligente
  else if (to.meta.guest && isAuthenticated) {
    // Se è Admin (1) o SuperAdmin (2), vai alla dashboard admin
    if (userRole === '1' || userRole === '2') {
        return next('/admin')
    }
    // Altrimenti (Studente), vai alla home classica
    return next('/home') 
  }

  // CASO C: Controllo Accesso Admin (Protezione Rotta /admin)
  if (to.meta.requiresAdmin && isAuthenticated) {
    // Se uno studente ('0') prova ad entrare in /admin -> Bloccalo
    if (userRole === '0') { 
        return next('404') // O altra pagina di errore/accesso negato
    }
  }
  
  // CASO D: Procedi
  next()
})

export default router