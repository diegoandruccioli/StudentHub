import { defineStore } from "pinia";
import api from "../api/axios";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    // Il token è nei cookie HttpOnly, qui teniamo solo i dati utente
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    // LOGIN
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        // Chiamata al backend reale
        const response = await api.post("/auth/login", { email, password });

        // Se successo, salva l'utente nello stato
        this.user = response.data.user;
        localStorage.setItem("user", JSON.stringify(this.user));
        return true; // Login riuscito
      } catch (err) {
        this.error = err.response?.data?.message || "Login fallito";
        return false;
      } finally {
        this.loading = false;
      }
    },

    // REGISTER
    async register(userData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post("/auth/register", userData);

        // Auto-login dopo la registrazione
        this.user = response.data.user;
        localStorage.setItem("user", JSON.stringify(this.user));
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || "Registrazione fallita";
        return false;
      } finally {
        this.loading = false;
      }
    },

    // LOGOUT
    async logout() {
      try {
        await api.post("/auth/logout");
      } catch (err) {
        console.error("Logout error", err);
      } finally {
        this.user = null;
        localStorage.removeItem("user");
        // Non forziamo il redirect qui con window.location,
        // lasciamo che sia il componente a fare router.push('/')
      }
    },
  },
});
