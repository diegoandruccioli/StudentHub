import { defineStore } from "pinia";
import api from "../api/axios";
import type { GamificationStatus, Badge, MyBadge } from "../types";

interface GamificationState {
  status: GamificationStatus | null;
  badges: Badge[];
  myBadgeIds: Set<number>;
  loading: boolean;
  error: string | null;
}

export const useGamificationStore = defineStore("gamification", {
  state: (): GamificationState => ({
    status: null,
    badges: [],
    myBadgeIds: new Set(),
    loading: false,
    error: null,
  }),

  getters: {
    badgesWithUnlockStatus: (state): Badge[] =>
      state.badges.map((badge) => ({
        ...badge,
        sbloccato: state.myBadgeIds.has(Number(badge.id)),
      })),
  },

  actions: {

    async fetchStatus(): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get<GamificationStatus>("/gamification/status");
        this.status = response.data;
      } catch {
        this.error = "Impossibile caricare lo stato gamification";
      } finally {
        this.loading = false;
      }
    },

    async fetchBadges(): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const [allBadgesRes, myBadgesRes] = await Promise.all([
          api.get<Badge[]>("/gamification/badges"),
          api.get<MyBadge[]>("/gamification/my-badges"),
        ]);

        this.badges = allBadgesRes.data;
        this.myBadgeIds = new Set(myBadgesRes.data.map((b) => b.id_obiettivo));
      } catch {
        this.error = "Impossibile caricare gli obiettivi";
      } finally {
        this.loading = false;
      }
    },
  },
});
