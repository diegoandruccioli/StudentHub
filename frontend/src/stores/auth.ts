import { defineStore } from "pinia";
import api from "../api/axios";
import type { User, RegisterPayload } from "../types";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.user,
  },

  actions: {

    clearError(): void {
      this.error = null;
    },

    async login(email: string, password: string): Promise<boolean> {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post("/auth/login", { email, password });
        this.user = response.data.user;
        localStorage.setItem("user", JSON.stringify(this.user));
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        this.error = message ?? "Login fallito";
        return false;
      } finally {
        this.loading = false;
      }
    },

    async register(payload: RegisterPayload): Promise<boolean> {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post("/auth/register", payload);
        this.user = response.data.user;
        localStorage.setItem("user", JSON.stringify(this.user));
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        this.error = message ?? "Registrazione fallita";
        return false;
      } finally {
        this.loading = false;
      }
    },

    async logout(): Promise<void> {
      try {
        await api.post("/auth/logout");
      } catch {
        // Il logout locale avviene comunque
      } finally {
        this.user = null;
        localStorage.removeItem("user");
      }
    },
  },
});
