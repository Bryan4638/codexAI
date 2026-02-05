import api from "@/services/api";

export const exerciseApi = {
  async getAll(params: Record<string, any> = {}): Promise<any> {
    return api.get("/exercises", { params });
  },

  async getById(id: string): Promise<any> {
    return api.get(`/exercises/${id}`);
  },

  async validate(exerciseId: string, answer: any): Promise<any> {
    return api.post("/exercises/validate", { exerciseId, answer });
  },
};
