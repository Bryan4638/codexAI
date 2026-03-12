import AuthInitializer from '@/components/auth/AuthInitializer'
import AppRouter from '@/routes/AppRouter'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sileo'

function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthInitializer>
          <Toaster
            position="bottom-right"
            theme="light"
            options={{ styles: { title: 'text-sm!' } }}
          />
          <AppRouter />
        </AuthInitializer>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
