import { defineStore } from "pinia";
import api from "../api/axios";

interface Preferences {
  tema_voti: string;
  rgb_soglia_bassa: number;
  rgb_soglia_alta: number;
}

interface SettingsState {
  preferences: Preferences;
  loaded: boolean;
  error: string | null;
}

export const useSettingsStore = defineStore("settings", {
  state: (): SettingsState => ({
    preferences: {
      tema_voti: "DEFAULT",
      rgb_soglia_bassa: 18,
      rgb_soglia_alta: 27,
    },
    loaded: false,
    error: null,
  }),

  actions: {

    async fetchSettings(): Promise<void> {
      if (this.loaded) return;
      this.error = null;
      try {
        const response = await api.get<Preferences>("/settings");
        this.preferences = response.data;
        this.loaded = true;
      } catch {
        this.error = "Impossibile caricare le impostazioni";
      }
    },

    async updateSettings(newSettings: Partial<Preferences>): Promise<boolean> {
      this.error = null;
      try {
        await api.put("/settings", newSettings);
        this.preferences = { ...this.preferences, ...newSettings };
        return true;
      } catch {
        this.error = "Impossibile salvare le impostazioni";
        return false;
      }
    },
  },
});
