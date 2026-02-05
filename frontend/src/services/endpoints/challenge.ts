import api from "@/services/api";

export const challengeApi = {
  async getAll(params: Record<string, any> = {}): Promise<any> {
    return api.get("/challenges", { params });
  },

  async create(challenge: any): Promise<any> {
    return api.post("/challenges", challenge);
  },

  async toggleReaction(id: string): Promise<any> {
    return api.post(`/challenges/${id}/react`);
  },

  async delete(id: string): Promise<any> {
    return api.delete(`/challenges/${id}`);
  },
};
