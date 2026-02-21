import AuthInitializer from '@/components/auth/AuthInitializer'
import AppRouter from '@/routes/AppRouter'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <AppRouter />
      </AuthInitializer>
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  )
}

export default App
