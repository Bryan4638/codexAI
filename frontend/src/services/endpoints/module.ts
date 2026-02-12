import api from '@/services/api'
import { Module } from '@/types/module'

export const moduleApi = {
  async getAll(): Promise<Module[]> {
    return (await api.get('/modules')) as Module[]
  },
}
