import api from "@/services/api";

export const badgeApi = {
  async getAll(): Promise<any> {
    return api.get("/badges");
  },

  async getUserBadges(): Promise<any> {
    return api.get("/badges/user");
  },

  async getProgress(): Promise<any> {
    return api.get("/badges/progress");
  },
};
