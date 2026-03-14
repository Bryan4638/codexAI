import api from '@/services/api'
import type {
  ExecuteRequest,
  ExecuteResponse,
  ExecuteWithTestsRequest,
  ExecuteWithTestsResponse,
} from '@/types/execution'

export const executionApi = {
  async execute(data: ExecuteRequest): Promise<ExecuteResponse> {
    return (await api.post('/execute', data)) as ExecuteResponse
  },

  async executeWithTests(
    data: ExecuteWithTestsRequest
  ): Promise<ExecuteWithTestsResponse> {
    return (await api.post(
      '/execute/with-tests',
      data
    )) as ExecuteWithTestsResponse
  },
}
