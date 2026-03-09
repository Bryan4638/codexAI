import AuthInitializer from '@/components/auth/AuthInitializer'
import AppRouter from '@/routes/AppRouter'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthInitializer>
          <AppRouter />
        </AuthInitializer>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
