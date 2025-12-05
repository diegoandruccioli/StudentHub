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

<<<<<<< HEAD
// Placeholder per pagine che potrebbero non essere ancora create (opzionale)
const ObjectivesPage = NotFound // Sostituisci con import reale se esiste


const AdminPage = () => import('../pages/AdminPage.vue')
=======
const AdminPage = NotFound      // Sostituisci con import reale se esiste
>>>>>>> 86579ea67eba14caa7f78cd5d952a4cda2307228

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
  const userRole = authStore.user?.ruolo; // Legge il ruolo (Stringa '0', '1', '2')

  // CASO A: La rotta richiede login, ma l'utente NON è autenticato
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login') 
  } 
  
  // CASO B: La rotta è per ospiti (Login/Register), ma l'utente È loggato
  else if (to.meta.guest && isAuthenticated) {
    return next('/home') 
  }

  // CASO C: Controllo Ruolo (Solo se l'utente è loggato e la rotta lo richiede)
  // Il ruolo '0' (Studente) non può accedere alle pagine Admin
  if (to.meta.requiresAdmin && isAuthenticated) {
    // Se il ruolo è Studente ('0') e non Admin/SuperAdmin ('1' o '2'), blocca.
    if (userRole === '0') { 
        // Puoi reindirizzare a una pagina 403 o semplicemente alla Home
        return next('/home') 
    }
  }
  
  // CASO D: Tutto ok, procedi
  next()
})

export default router