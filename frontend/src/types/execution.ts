export interface ExecuteRequest {
  language: string
  code: string
}

export interface ExecuteWithTestsRequest extends ExecuteRequest {
  challengeId: string
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
  error?: string
}

export interface ExecuteResponse {
  success: boolean
  output: string
  error: string
  exitCode: number
}
