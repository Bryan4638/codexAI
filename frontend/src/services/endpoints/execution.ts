import api from '../api'

export interface ExecuteRequest {
  language: string
  code: string
}

export interface ExecuteWithTestsRequest extends ExecuteRequest {
  challengeId: string
  userId: string
}

export interface TestCaseResult {
  id: string
  passed: boolean
  actual: string
}

export interface ExecuteWithTestsResponse {
  allPassed: boolean
  testResults: TestCaseResult[]
  executionTimeMs: number
}

export interface ExecuteResponse {
  success: boolean
  output: string
  error: string
  exitCode: number
}

export const executionApi = {
  async execute(data: ExecuteRequest): Promise<ExecuteResponse> {
    const res = await api.post('/execute', data)
    return res as unknown as ExecuteResponse
  },

  async executeWithTests(
    data: ExecuteWithTestsRequest
  ): Promise<ExecuteWithTestsResponse> {
    const res = await api.post('/execute/with-tests', data)
    return res as unknown as ExecuteWithTestsResponse
  },
}
